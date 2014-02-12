<?php

/**
 * Appends a new child to a given XML database with the name of
 * the new element, the textual content of that element, and the root
 * element to append to in the database.
 * @param name - name of new element
 * @param value - the textual value of that new element
 * @param rootEl - root element to append to
 * @param database - database to work with
 * @return element - returns the newly created element
 */
function append_new_element($name, $elementValue, $attributes, $rootElement, $database)
{
    // Create a new element, name
    $element = $database->createElement("$name");
    
    // Create element text node if set
    if ($elementValue != NULL) 
    {
        // With textual value, value
        $elementValue = $database->createTextNode("$elementValue");
        $element->appendChild($elementValue);
    }
    
    // Create attributes if set
    if ($attributes != NULL)
    {
        // For each key/value pair contained within item
        foreach ($attributes as $key => $value) 
        {
            
            // Create a new attribute as key
            $attribute = $database->createAttribute("$key");
            // With textual value, value
            $attribute->value = "$value";
            
            // Append attribute to element
            $element ->appendChild($attribute);

        }
    }
    
    // Append value to element and element to root
    $rootElement->appendChild($element);
    
    return $element;
}

/**
 * Creates a new file at $dir given it does not exist
 * @param dir - directory to create at
 * @param rootEl - root element
 */
function new_db_file($dir, $rootElement)
{
    // Required for access
    umask(0007);
    
    // Check if given dir .xml exists; create if not
    if (is_file($dir) == 0)
    {
        /**
         * Create a new XML document
         */
         // New xmlObj
         $xmlObj = new DOMDocument("1.0");
         $xmlObj->preserveWhiteSpace = false;
         $xmlObj->formatOutput = true;
         
         // New root element: $rootElement
         append_new_element("$rootElement", NULL, NULL, $xmlObj, $xmlObj);
         
         // Create new directory where non-existant
         if(!is_dir("../../../data/Assignment2")) { mkdir("../../../data/Assignment2", 02770); }
         
         // Create a new file at that directory
         $newFile = fopen($dir,"w");
         fclose($newFile);
         
         // Save the new document
         $xmlObj->save($dir);
         
    }
}

/**
 * Parses the given XML file with its associative 
 * XSL file, returning a string representation of
 * the HTML
 * @param file - file of XML/XSL
 * @return result - HTML respresentation from XSLT process
 */
function parse_xml_from_file($fileXML, $fileXSL)
{
    // 1. Load the XML file into a new DOM obj
    $xmlObj = new DOMDocument('1.0');
    $xmlObj->formatOutput = true;
    $xmlObj->load("$fileXML");
    
    // 2. Load the XSL file into a new DOM obj
    $xslObj = new DOMDocument('1.0');
    $xslObj->load("$fileXSL");
    
    // 3. Create an XSLT parser
    $xsltParser = new XSLTProcessor;
    
    // 4. Load the XSL DOM object into the processor
    $xsltParser->importStyleSheet($xslObj);
    
    // 5. Transform XML document using the XSLT parser
    //    who parses using the XSL stylesheet
    //    Return the parsed results...
    return $xsltParser->transformToXML($xmlObj);
}

/**
 * Parses the given XML string with its associative 
 * XSL file, returning a string representation of
 * the HTML
 * @param xml - xml string to parse
 * @return result - HTML respresentation from XSLT process
 */
function parse_xml_from_str($xmlStr, $fileXSL)
{   
    // 1. Load the XML file into a new DOM obj
    $xmlObj = new DOMDocument('1.0');
    $xmlObj->formatOutput = true;
    $xmlObj->loadXML("$xmlStr");
    
    // 2. Load the XSL file into a new DOM obj
    $xslObj = new DOMDocument('1.0');
    $xslObj->load("$fileXSL");
    
    // 3. Create an XSLT parser
    $xsltParser = new XSLTProcessor;
    
    // 4. Load the XSL DOM object into the processor
    $xsltParser->importStyleSheet($xslObj);
    
    // 5. Transform XML document using the XSLT parser
    //    who parses using the XSL stylesheet
    //    Return the parsed results...
    return $xsltParser->transformToXML($xmlObj);
}

/**
 * Searches the XML Goods Database for a
 * specific $itemId and returns the value
 * of the tag supplied as $detail
 * @param $itemId - item to search for in db
 * @param $detail - elemental value to retrieve
 * @return string - return the value of the string
 *          false - return false where no item with
 *                  that id is found
 */
function get_existing_item_detail($itemId, $detail)
{
    // Load in the items database
    $dbXmlObj = new DOMDocument('1.0');
    $dbXmlObj->formatOutput = true;
    $dbXmlObj->load("../../../data/Assignment2/goods.xml");
    
    // Seek for the existing item with this id in the good database
    $existingItems = $dbXmlObj->getElementsByTagName("item");

    // Check every item against the given itemId
    foreach ($existingItems as $existingItem)
    {
        // Set the current item id to check against
        $dbItemId = $existingItem->getAttribute("id");
        
        // Item with this id exists
        if ($dbItemId  == $itemId)
        { 
            // Returns the tag name given text content
            return $existingItem->getElementsByTagName("$detail")->item(0)->textContent;
        }
    }
        
    // Out of loop? Return false.
    return false;
}

/**
 * Searches the XML Goods Database for a
 * specific $itemId and modifies the value
 * of the tag supplied as $detail with the
 * given $newValue
 * @param $itemId - item to search for in db
 * @param $detail - elemental value to modify
 * @param $newVal - value to change this element's node to
 */
function modify_existing_item_detail($itemId, $detail, $newValue)
{
    // Load in the items database
    $dbXmlObj = new DOMDocument('1.0');
    $dbXmlObj->formatOutput = true;
    $dbXmlObj->load("../../../data/Assignment2/goods.xml");
    
    // Seek for the existing item with this id in the good database
    $existingItems = $dbXmlObj->getElementsByTagName("item");

    // Check every item against the given itemId
    foreach ($existingItems as $existingItem)
    {
        // Set the current item id to check against
        $dbItemId = $existingItem->getAttribute("id");
        
        // Item with this id exists
        if ($dbItemId  == $itemId)
        { 
            // Modify the tag name with the given text content (use nodeValue here to modify)
            $existingItem->getElementsByTagName("$detail")->item(0)->nodeValue = $newValue;
        }
    }
    
    // Save over the old db with the new updated info.
    $dbXmlObj->save("../../../data/Assignment2/goods.xml");
}

?>