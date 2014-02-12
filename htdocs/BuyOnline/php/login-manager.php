<?php

// If session does not exist, create one
if (session_id() == "") { session_start(); }

// Setup access to database
$databaseDir = "../../../data/Assignment2/manager.txt";

// Setup value input where given (else die)
if (isset($_GET["user"]) && isset($_GET["pass"]))
{
    $user   = $_GET["user"];
    $pass   = $_GET["pass"]."\n"; //< add a \n to inputted password (db has \n's)
}
else die;

/**
 * Load in manager.txt (read-only)
 */
$allUsers = file($databaseDir);

// Check every user against password
for ($i = 0; $i < count($allUsers); $i++)
{
    // Set the current username and password to check against
    $datum  = explode(",",$allUsers[$i]);           //< Explode between the ,
    $dbUser = $datum[0];                            //< Username is the first before the ,
    $dbPass = $datum[1];                            //< Password is the first after  the ,
        
    // Manager with username and password both matching? Then true
    if ($dbPass == $pass && $dbUser == $user) 
    { 
        // Initiate session variable
        $_SESSION["manager"] = "$user";
        die("true");
    }
    // Manager username matches but not the password? Then
    if ($dbPass != $pass && $dbUser == $user) { die("bad-pass"); } 
    
}

// Out of loop? No user found!
die("no-user");

?>