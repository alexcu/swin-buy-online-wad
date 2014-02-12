<?php

// Include database accessibility functions
include "database.php";

// Setup access to database
$databaseDir = "../../../data/Assignment2/goods.xml";
new_db_file($databaseDir, "items");

// Setup value input where given (else die)
if (isset($_GET["name"]) && isset($_GET["desc"]) && isset($_GET["price"]) && isset($_GET["qty"]))
{
    $name  = $_GET["name"];
    $desc  = $_GET["desc"];
    $price = $_GET["price"];
    $qty   = $_GET["qty"];
} 
else die;
// Pass in if img is set
if (isset($_GET["img"])) { $img = $_GET["img"]; }
// Else phone is empty
else                       { $img = ""; }

/**
 * Load in customers.xml
 */
$database = new DOMDocument("1.0");
$database->preserveWhiteSpace = false;
$database->formatOutput = true;
$database->load($databaseDir);

// ItemID is always the total number of <item> els +1
$existingItems = $database->getElementsByTagName("item");
$itemId = $existingItems->length;
$itemId++;

/**
 * Now process the new item
 */
// Get the root element
$items = $database->getElementsByTagName("items")->item(0);

/**
 * Insert customer into customers.xml by creating each element
 */
$attr = array("id" => "$itemId");
$newItem = append_new_element("item", NULL, $attr, $items, $database);

// Append each datum
append_new_element("name",  $name,  NULL, $newItem, $database);
append_new_element("price", $price, NULL, $newItem, $database);
append_new_element("desc",  $desc,  NULL, $newItem, $database);

$qtyElement = append_new_element("qty", NULL, NULL, $newItem, $database);

// Append subqtys
append_new_element("total", $qty, NULL, $qtyElement, $database);
append_new_element("hold", "0",   NULL, $qtyElement, $database);
append_new_element("sold", "0",   NULL, $qtyElement, $database);

// Append img (only if provided)
if ($img != "") { append_new_element("img", $img, NULL, $newItem, $database); }

/**
 * Save the new, updated customers
 */
$database->save($databaseDir);

/**
 * Echo the new id number since were're done!
 */
echo "$itemId";

?>