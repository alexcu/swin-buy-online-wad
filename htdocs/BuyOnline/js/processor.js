/* * * * * * * * * * * * * * * * * * * * * * * * *
 * Description: HIT3324 Web Application Development
 *              Assignment Two
 *              Processor Script
 *      Author: Alex Cummaudo
 *        Date: 10 Oct 2013
 * * * * * * * * * * * * * * * * * * * * * * * * */
 

/**
 *
 * Form Process
 * ============
 *
 * Processes a form to the server, creating AJAX 
 * requests when needed.
 *
 */
function processForm(formID, requestType)
{        
    //! Validate form first, and if invalid, do not process
    if (checkForm(formID) == false) { return false; }
    
    switch (requestType)
    {
        case 'register-user': 
            registerUser();
            break;
        case 'login-user':
            loginUser();
            break;
        case 'login-mgmt':
            loginManager();
            break;
        case 'add-item':
            addItem();
            break;
        default:
            break;
    }
}

/**
 *
 * Register User
 * =============
 *
 * Function registers a new user by accepting the input from the
 * form and setting up a AJAX request--sendRequest()--as defined
 * in ajax-request.js. When the AJAX request replies, a defined
 * eventHandler() function (passed to the request) will exeute.
 *
 */
function registerUser()
{   
    /**
     * DEFINE RESPONDING EVENT HANDLER FOR AJAX REQUEST
     */
    function eventHandler()
    {
        //! XHR response text defined in ajax-request.js
        if (xhrResponse == true)
        {
            //! Success message
            replaceWith("signup-content", 
                        "<a href='login.html'     class='btn btn-large btn-block btn-success'> Login </a> \
                         <a href='index.html' class='btn btn-large btn-block btn-default'> Back </a>");
            pushAlert(  "signup-content",
                        "<h4>Congratulations!</h4> <br/>                \
                        You are successfully signed up with Buy Online! \
                        Sign in with your email, "+email+", to log in.",
                        "alert-success", false);
        }
        else if (xhrResponse == "email")
        {
            //! Error message
            $("#email").blur();         //!< force a blur to ensure user does not clear message below away
            pushMessage($("#email"),    //!< used jQuery rather than getElementById...
                        "A user has already registered with that email. Try again.",
                        "has-warning");   
        }
        
        //! A new user request will not action to a new page
        return false;
    }
    
    //! Get values of elements
    var firstName = document.getElementById("first-name").value;
    var lastName  = document.getElementById("last-name").value;
    var pass      = document.getElementById("pass").value;
    var email     = document.getElementById("email").value;
    
    //! Generate query string
    var queryString =   "firstName=" + firstName + "&" +
                        "lastName="  + lastName  + "&" +
                        "pass="      + pass      + "&" +
                        "email="     + email;
                            
    //! Send phone only if placeholder is not there
    if ( ! ($("#phone").hasClass('placeholder')) )
    {
        phone = document.getElementById("phone").value;
        queryString += "&phone=" + phone;
    }
    
    //! Send the request
    sendRequest("./php/register-user.php", eventHandler, queryString);
}

/**
 *
 * Login User
 * ==========
 *
 * Function logs in a user in essentially the same process as
 * registerUser()... using an AJAX request etc.
 *
 */
function loginUser()
{
    /**
     * DEFINE RESPONDING EVENT HANDLER FOR AJAX REQUEST
     */
    function eventHandler()
    {
        //! Successful login?
        if      (xhrResponse == "true"    ) 
        {             
            //! Button to next page
            replaceWith("signin-content", 
                        "<a href='buying.html'    class='btn btn-large btn-block btn-success'> Proceed To Catalogue </a>" );
            //! Sign in success message
            pushAlert(  "signin-content",
                        "Successfully signed in!",
                        "alert-success", false);
        }
        else if (xhrResponse == "no-user" ) { pushAlert("last-input", "<strong>Error:</strong> No user has registered with that email address.", "alert-warning", true); }
        else if (xhrResponse == "bad-pass") { pushAlert("last-input", "<strong>Error:</strong> Incorrect Password.", "alert-danger", true);                              }
    }
    
    //! Get values of elements
    var pass      = document.getElementById("pass").value;
    var email     = document.getElementById("email").value;

    //! Generate query string
    var queryString =   "pass="      + pass      + "&" +
                        "email="     + email;

    //! Send the request
    sendRequest("./php/login-user.php", eventHandler, queryString);
}

/**
 *
 * Login Manager
 * =============
 *
 * Function logs in a manager in essentially the same process as
 * registerUser()... using an AJAX request etc.
 *
 */
function loginManager()
{
    /**
     * DEFINE RESPONDING EVENT HANDLER FOR AJAX REQUEST
     */
    function eventHandler()
    {
        //! Successful login?
        if      (xhrResponse == "true"    ) 
        {             
            //! Button to listings page
            replaceWith("signin-content", 
                        "<a href='listing.html' class='btn btn-large btn-block btn-primary'> Enter Listing </a>" );
            //! Button to processing page
            replaceWith("signin-content", 
                        "<a href='processing.html' class='btn btn-large btn-block btn-primary'> Process Purchases </a>" );
            //! Sign in success message
            pushAlert(  "signin-content",
                        "Successfully signed in!",
                        "alert-success", false);
        }
        else if (xhrResponse == "no-user" ) { pushAlert("last-input", "<strong>Error:</strong> A manager does not exist with that username.", "alert-warning", true); }
        else if (xhrResponse == "bad-pass") { pushAlert("last-input", "<strong>Error:</strong> Incorrect Password.", "alert-danger", true);                              }
    }
    
    //! Get values of elements
    var pass      = document.getElementById("pass").value;
    var user     = document.getElementById("user").value;

    //! Generate query string
    var queryString =   "pass="      + pass      + "&" +
                        "user="      + user;

    //! Send the request
    sendRequest("./php/login-manager.php", eventHandler, queryString);

}

/**
 *
 * Add Item
 * ========
 *
 * Function adds an item to the items database in
 * essentially the same way as registerUser()...
 * using an AJAX request etc.
 *
 */
function addItem()
{
    /**
     * DEFINE RESPONDING EVENT HANDLER FOR AJAX REQUEST
     */
    function eventHandler()
    {
        //! Successfull adds only where numbers are reponsded (new id number)
        if (isNaN(xhrResponse))
        { pushAlert("page-header", "<strong>Error:</strong> Could not insert into database.", "alert-warning", "5000"); }
        else
        //! Successful add (response is the new ID)
        {             
            //! Success message
            pushAlert(  "page-header",
                        "The item was successfully added. Its identification number is "+xhrResponse+".",
                        "alert-success", 5000);
            //! Reset the form
            document.getElementById("listing").reset();
        }
    }
    
    //! Get values of elements
    var name     = document.getElementById("item-name").value;
    var desc     = document.getElementById("desc").value;
    var price    = document.getElementById("price").value;
    var qty      = document.getElementById("qty").value;
    var img      = document.getElementById("img").value;
    //! Generate query string
    var queryString =   "name="     + name      + "&" +
                        "desc="     + desc      + "&" +
                        "price="    + price     + "&" +
                        "qty="      + qty       + "&" +
                        "img="      + img;

    //! Send the request
    sendRequest("./php/add-item.php", eventHandler, queryString);
}

/**
 *
 * Logout
 * ======
 *
 * Calls the logout script for logging out
 * a user or manager using AJAX
 *
 */
function logout()
{
    /**
     * DEFINE RESPONDING EVENT HANDLER FOR AJAX REQUEST
     */
    function eventHandler()
    {
        //! Button to listings page
        appendTo(   "page-header", 
                    "<a href='index.html' class='btn btn-large btn-block btn-default'> Home </a>" );
        if (xhrResponse != "false")
        {
            //! Success message
            pushAlert(  "page-header",
                        "<h4>Thank you!</h4> Thank you for using BuyOnline. You have been logged out. <br/><br/> <code>ID: "+xhrResponse+"</code>",
                        "alert-success", false);
        }
        else
        {
            //! Unsuccess message
            pushAlert(  "page-header",
                        "<strong>Info:</strong> No one was logged in; no one needed to be logged out!",
                        "alert-info", false);
        }
    }

    //! Send the request (no query string)
    sendRequest("./php/logout.php", eventHandler, "");
}

/**
 * 
 * Process Items
 * =============
 *
 * Processes the items in the processing.html
 * page, either by just calling a read-only
 * load or a alteration to the hold (set by action)
 *
 */
function processItems(action)
{
    /**
     * DEFINE RESPONDING EVENT HANDLER FOR AJAX REQUEST
     */
    function eventHandler()
    {
        
        //! Only update the list HTML when updating
        if (action == "update-list")
            { document.getElementById("results").innerHTML = xhrResponse; }
        //! Otherwise, processing all items and push xhrResponse'th values sold/hold updated
        //! (therefore call this method again but to update the list only!)
        else 
        { 
            var soldItems = xhrResponse.split(",")[0];
            var soldOutItems = xhrResponse.split(",")[1];

            pushAlert(  "page-header", 
                        "Processed "+soldItems+" items that were sold. <br/>"+
                        soldOutItems+" items have sold out. Sold out items (if any) were removed from the catalogue. <br/>",
                        "alert-success", 5000);
            processItems("update-list"); 
        }
    }
    
    //! Send the request
    sendRequest("./php/processing.php", eventHandler, "action="+action);   
}