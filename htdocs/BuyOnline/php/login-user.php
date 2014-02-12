<?php

// If session does not exist, create one
if (session_id() == "") { session_start(); }

// Setup access to database
$databaseDir = "../../../data/Assignment2/customers.xml";

// Setup value input where given (else die)
if (isset($_GET["email"]) && isset($_GET["pass"]))
{
    $email  = $_GET["email"];
    $pass   = $_GET["pass"];
}
else die;
/**
 * Load in customers.xml
 */
$database = new DOMDocument("1.0");
$database->preserveWhiteSpace = false;
$database->formatOutput = true;
$database->load($databaseDir);

$existingCustomers = $database->getElementsByTagName("customer");

// Check every user against password
foreach ($existingCustomers as $existingCustomer)
{
    // Set the current email and password to check against
    $dbEmail = $existingCustomer->getElementsByTagName("email")->item(0)->textContent;
    $dbPass  = $existingCustomer->getElementsByTagName("pass") ->item(0)->textContent;
    
    // Customer with email and password both matching? Then true
    if ($dbPass  == $pass && $dbEmail == $email) 
    { 
        // Initiate session variable
        $_SESSION["customer"] = $existingCustomer->getAttribute("id");
        die("true");
    }
    // Customer email matches but not the password? Then
    if ($dbPass  != $pass && $dbEmail == $email) { die("bad-pass"); } 
    
}

// Out of loop? No user found!
die("no-user");

?>