<?php

// Include database accessibility functions
include "database.php";

// Create goods.xml if not existant
new_db_file("../../../data/Assignment2/goods.xml", "items");

// If session does not exist, create one
if (session_id() == "") { session_start(); }

/**
 * Parses through the cart associative array
 * and transforms it into an XML document, returning
 * a textual representation of that XML document
 * @param $cart - assoc. array of the `cart' 
 */
function cart_to_xml($cart)
{

    // Create a new XML document
    $docXML = new DomDocument('1.0');
    
    // Create a new root element for this cart
    $rootEl  =  $docXML->createElement('cart');
                $docXML->appendChild($rootEl);
    
    // For each $item in $itemList
    foreach ($cart as $id => $item) 
    {
        // Create a new element for this item
        $itemXML =  $docXML->createElement('item');
                    $rootEl->appendChild($itemXML);

        // Create a new attribute as id
        $attribute = $docXML->createAttribute("id");
        $attribute->value = $id;
        $itemXML->appendChild($attribute);
        
        // For each key/value pair contained within item
        foreach ($item as $key => $value) 
        {
            
            // Create a new element, key
            $keyXML = $docXML->createElement("$key");
            // With textual value, value
            $valXML = $docXML->createTextNode("$value");
            
            // Append value to key and key to item
            $keyXML ->appendChild($valXML);
            $itemXML->appendChild($keyXML);
         
        }
    }
    // Return string rep. of XML doc
    return $docXML->saveXML();
}

/**
 * Parses through the cart associative array
 * and removes any items whose qty is set to 0
 * @param $cart - the cart assoc. array pass by reference
 */
function sweep_cart(&$cart)
{
    // For every item in the cart
    foreach ($cart as $id => $item)
    {
        // If this item has a qty of 0
        if (intval($cart["$id"]["qty"]) < 1)
        {
            // Unset this item from the cart
            unset($cart["$id"]);
        }
    }
}

/*******************************************************
 * Begin Main Script
 *******************************************************/
// Setup actions and items
// -- Get the action and item id if set
// -- Set up the variables to work with
if (isset($_GET["id"]    )) { $itemId = $_GET["id"];     }
if (isset($_GET["action"])) { $action = $_GET["action"]; }

// Initiate session variables
// -- If cartXML (the XML string) or cart (the assoc. array)
//    are set (i.e. the session vars exist?)
// -- But they not currently blank? (i.e. initialised?)
// -- Then initialise the $cartXml and $cart variables to
//    work with
if (isset($_SESSION["cartXml"]) || isset($_SESSION["cart"]))
{
    if ($_SESSION["cartXml"] != "") { $cartXml = $_SESSION["cartXml"]; }
    if ($_SESSION["cart"] != "")    { $cart    = $_SESSION["cart"]; }
}
// Otherwise..
// -- Set cartXML as a blank string;
// -- Set cart as an empty array
else
{
    $cart = array ();
    $cartXml = "";
}

/**
 * UPDATE CATALOGUE ACTION
 * =======================
 *
 * Parse through the XML Goods DB (goods.xml)
 * and then process it with its XSL file 
 * 
 */
if ($action == "update-catalogue")
{
    // Echo the result of XLST process
    echo parse_xml_from_file("../../../data/Assignment2/goods.xml", "../style/goods.xsl");
}
/**
 * UPDATE CART ACTION
 * ==================
 *
 * Parse through the Shopping Cart assoc. array
 * by converting it to an XML string and then
 * then process it with its XSL file 
 * 
 */
else if ($action == "update-cart")
{
    // Echo the result of XLST process
    echo parse_xml_from_str(cart_to_xml($cart), "../style/shopping-cart.xsl");
}
/**
 * ADD ITEM TO CART ACTION
 * =======================
 *
 * Add the given $itemId to the shopping cart
 * assoc. array, then reparse the SC assoc. array
 * back into its XML equivalent
 * 
 */
else if ($action == "add")
{
    //Only add where qty avaliable > 0
    $oldTotal = floatval(get_existing_item_detail($itemId, "total"));
    
    if ($oldTotal < 1) { die("no-qty"); }
    else
    {
        // Subtract from total qty avalible in DB to
        // add to total hold avaliable in DB
        $oldHold  = floatval(get_existing_item_detail($itemId, "hold" ));
        $newTotal = $oldTotal - 1;
        $newHold  = $oldHold + 1;
        modify_existing_item_detail($itemId, "total", "$newTotal");
        modify_existing_item_detail($itemId, "hold" , "$newHold" );
    
        // Calculate the total value of the price * qty on hold for this item
        $itemToAddPrice = floatval(get_existing_item_detail($itemId, "price")) * floatval(get_existing_item_detail($itemId, "hold"));
        
        // Add the item as a new item array
        $cart["$itemId"]["name"] = get_existing_item_detail($itemId, "name");
        $cart["$itemId"]["qty"]  = get_existing_item_detail($itemId, "hold");
        $cart["$itemId"]["price"]= $itemToAddPrice;
        
        // Update $_SESSION vars of cart to reflect changes
        $_SESSION["cartXml"] = cart_to_xml($cart);
        $_SESSION["cart"] = $cart;
    }
}
/**
 * REMOVE ITEM FROM CART ACTION
 * ============================
 *
 * Decrement the qty of the given $itemId
 * in to the shopping cart assoc. array,
 * and remove if == 0, then reparse the SC
 * assoc. array back into its XML equivalent
 * 
 */
else if ($action == "remove")
{  
    // If given action to remove and qty is <= 1? 
    // Then remove entirely from the SC.
    if (intval($cart["$itemId"]["qty"]) <= 1)  
    {
        // Set the qty to 0
        $cart["$itemId"]["qty"] = "0";
        modify_existing_item_detail($itemId, "hold" , "0" );

        // Increment the total in db back up one
        $oldTotal = floatval(get_existing_item_detail($itemId, "total"));
        $newTotal = $oldTotal + 1;
        modify_existing_item_detail($itemId, "total", "$newTotal");
        
    }
    else
    {
        // Add to total qty avalible in DB and
        // then remove from total hold avaliable in DB
        $oldTotal = floatval(get_existing_item_detail($itemId, "total"));
        $oldHold  = floatval(get_existing_item_detail($itemId, "hold" ));
        $newTotal = $oldTotal + 1;
        $newHold  = $oldHold - 1;
        modify_existing_item_detail($itemId, "total", "$newTotal");
        modify_existing_item_detail($itemId, "hold" , "$newHold" );
        
        // Update modified price
        $updatedPrice = floatval(get_existing_item_detail($itemId, "price")) * $newHold;
        $cart["$itemId"]["price"] = "$updatedPrice";
        
        // Subtract one from this item's qty in the cart assoc. array
        $cart["$itemId"]["qty"] = $newHold;
        
    }
    
    // Sweep through the cart to remove any qty that are 0
    sweep_cart(&$cart);
    
    // Update $_SESSION vars of cart to reflect changes
    $_SESSION["cartXml"] = cart_to_xml($cart);
    $_SESSION["cart"] = $cart;
}
/**
 * CONFIRM SHOPPING CART PURCHASE
 * ==============================
 *
 * For every item in the cart set the value of Goods
 * XML DB on hold for that item to 0 and set its sale qty
 * to the item that qty that was held. Then remove
 * from cart and display success msg.
 * 
 */
else if ($action == "confirm")
{
    foreach ($cart as $id => &$item)
    {        
        // Increment the total value by the value being held
        $oldSold = get_existing_item_detail($id, "sold");
        $newSold = $oldSold + intval($item["qty"]);
        
        // Set the sale item to the qty that was being held
        modify_existing_item_detail($id, "sold", $newSold);
        // Set the holding value of this item to 0
        modify_existing_item_detail($id, "hold", "0");
        
        // Set the qty of this item to 0
        $item["qty"] = "0";
        $item["price"] = "0";
    }
    // Sweep the cart to remove qty 0 items
    sweep_cart(&$cart);
    
    // Update $_SESSION vars of cart to reflect changes
    $_SESSION["cartXml"] = cart_to_xml($cart);
    $_SESSION["cart"] = $cart;
    
    // End of confirmation
    die("success-confirm");
}
/**
 * CANCEL SHOPPING CART PURCHASE
 * =============================
 *
 * For every item in the cart increment the Goods
 * XML DB total qty by the value that was being held
 * and then set the holding value of the item to 0 
 * Then remove from cart and display success msg.
 * 
 */
else if ($action == "cancel")
{
    // Use $item as a pointer
    foreach ($cart as $id => &$item)
    {
        // Increment the total value by the value being held
        $oldTotal = get_existing_item_detail($id, "total");
        $newTotal = $oldTotal + intval($item["qty"]);
        modify_existing_item_detail($id, "total", "$newTotal");
        
        // Set the holding value of this item to 0
        modify_existing_item_detail($id, "hold", "0");
        
        // Set the qty and price of this item to 0
        $item["qty"] = "0";
        $item["price"] = "0";
    }
    
    // Sweep the cart to remove qty 0 items
    sweep_cart(&$cart);
    
    // Update $_SESSION vars of cart to reflect changes
    $_SESSION["cartXml"] = cart_to_xml($cart);
    $_SESSION["cart"] = $cart;
    
    // End of confirmation
    die("success-cancel");
}
?>