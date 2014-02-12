<?php

// If session does not exist, create one
if (session_id() == "") { session_start(); }

// If user was logged in
if (isset($_SESSION["customer"]))
{
    // Echo the ID for response msg
    echo($_SESSION["customer"]);
    // Unset the customer session var
    unset($_SESSION["customer"]);
    // End the script
    die;
}
// Else if manager was logged in
else if (isset($_SESSION["manager"]))
{
    // Echo the ID for response msg
    echo($_SESSION["manager"]);
    // Unset the manager session var
    unset($_SESSION["manager"]);
    // End the script
    die;
}
// Else no one was logged in!
else
{
    // Echo false message
    die("false");
}

?>