<?php

// Include Database Accessibility Functions
include "database.php";

// Setup access to database
$databaseDir = "../../../data/Assignment2/customers.xml";
new_db_file($databaseDir, "customers");

// Setup value input where given (else die)
if (isset($_GET["firstName"]) && isset($_GET["lastName"]) && isset($_GET["pass"]) && isset($_GET["email"]))
{
    $firstName = $_GET["firstName"];
    $lastName  = $_GET["lastName"];
    $pass      = $_GET["pass"];
    $email     = $_GET["email"];
}
else die;
// Pass in if phone is set
if (isset($_GET["phone"])) { $phone = $_GET["phone"]; }
// Else phone is empty
else                       { $phone = ""; }

/**
 * Load in customers.xml
 */
$database = new DOMDocument("1.0");
$database->preserveWhiteSpace = false;
$database->formatOutput = true;
$database->load($databaseDir);

$existingCustomers = $database->getElementsByTagName("customer");
// Check if user with this email already exists
if ($existingCustomers->length != 0)
{
    foreach ($existingCustomers as $existingCustomer)
    {
        // Customer with email already exists?
        if ($existingCustomer->getElementsByTagName("email")->item(0)->textContent == $email)
        {
            // Kill the script; echo "email" since unsuccessful due to prexisting email
            die("email");
        }
    }
}
// CustID is always the total number of <customer> els +1
$custId = $existingCustomers->length;
$custId++;


/**
 * Now process the new customer
 */
// Get the root element
$customers = $database->getElementsByTagName("customers")->item(0);

/**
 * Insert customer into customers.xml by creating each element
 */
$attr = array("id" => "$custId");
$newCust = append_new_element("customer", NULL, $attr, $customers, $database);

// Append each datum
append_new_element("first-name", $firstName, NULL, $newCust, $database);
append_new_element("last-name",  $lastName,  NULL, $newCust, $database);
append_new_element("pass",       $pass,      NULL, $newCust, $database);
append_new_element("email",      $email,     NULL, $newCust, $database);

// Append phone (only if provided)
if ($phone != "") { append_new_element("phone", $phone, NULL, $newCust, $database); }

/**
 * Save the new, updated customers
 */
$database->save($databaseDir);

/**
 * Echo true since were're done!
 */
echo true;

?>