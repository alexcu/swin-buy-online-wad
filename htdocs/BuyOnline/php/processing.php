<?php
// Include database accessibility functions
include "database.php";

// Create goods.xml if not existant
new_db_file("../../../data/Assignment2/goods.xml", "items");

// Setup variables to work with
if (isset($_GET["action"])) { $action = $_GET["action"]; }

// Update list means just load the goods.xml and render
// it using the processing.xml in the table
if ($action == "update-list")
{
    // Echo the result of XLST process
    echo parse_xml_from_file("../../../data/Assignment2/goods.xml", "../style/processing.xsl");
}
// Else if we're processing the list
else if ($action == "process")
{

    // Create a new XML document
    $goodsXml = new DomDocument('1.0');

    // Load in the goods xml
    $goodsXml->load("../../../data/Assignment2/goods.xml");
    
    // Locate every item
    $allItems = $goodsXml->getElementsByTagName("item");
    
    $soldCount = 0;
    $soldOutCount = 0;
    
    // For every item found
    foreach ($allItems as $item)
    {
        // Get the sold/hold value
        $soldValue = intVal($item->getElementsByTagName("sold")->item(0)->nodeValue);
        $holdValue = intVal($item->getElementsByTagName("hold")->item(0)->nodeValue);
        $avalValue = intVal($item->getElementsByTagName("total")->item(0)->nodeValue);
        
        // If the sold value > 0?
        if ($soldValue > 0)
        {
        
            $item->getElementsByTagName("sold")->item(0)->nodeValue = "0";
            $soldCount++;
            
            // If item sold out? (i.e. no more qty left held or total?)
            if ($holdValue == 0 && $avalValue == 0)
            {
                // Ensure total is now 0
                $item->getElementsByTagName("total")->item(0)->nodeValue = "0";
                
                // Remove this item entirely (via parent)
                $item->parentNode->removeChild($item);
                $soldOutCount++;
            }
        }
    }
    
    // Save any changes back
    $goodsXml->save("../../../data/Assignment2/goods.xml");
    
    echo $soldCount.",".$soldOutCount;
}

?>