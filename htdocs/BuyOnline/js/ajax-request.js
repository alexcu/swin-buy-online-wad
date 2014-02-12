/* * * * * * * * * * * * * * * * * * * * * * * * *
 * Description: HIT3324 Web Application Development
 *              Assignment Two
 *              AJAX Request/Response Scripts
 *      Author: Alex Cummaudo
 *        Date: 10 Oct 2013
 * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 *
 * Create Request
 * ==============
 *
 * Returns an XML object depending on the browser
 * being used (W3C standards vs. MS standards)
 *
 */
function createRequest() 
{
    if (window.XMLHttpRequest)  { return new XMLHttpRequest; }                      //!< W3C Standard
    else                        { return new ActiveXObject("Microsoft.XMLHTTP"); }  //!< MS  Standard
}

//! Global Variables since accessible everywhere
var xhrObj = createRequest();  //!< Create an XMLHttpRequest using createRequest
var xhrResponse = "";          //!< XHR Response text

/**
 *
 * Send Request
 * ============
 *
 * Sends a GET request to the serverPage parameter
 * with the queryString parameter as the query string on
 * the URL, executing the eventHandler function
 * passed when page response is ready
 *
 */
function sendRequest(serverPage, eventHandler, queryString) 
{
    //! Send request as GET to serverPage?queryString
    xhrObj.open("GET", serverPage + "?" + queryString, true);                       //!< True == Asynch
    xhrObj.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");   //!< IE Compatibility
    xhrObj.onreadystatechange = function() { readyStateRecieved(eventHandler); }    //!< Attach event handler function, passing in
                                                                                    //!< the eventHandler to readyStateRecieved
    xhrObj.send(null);                                                              //!< As it's a GET, no HTTP request body
}

/**
 *
 * Ready State Recieved
 * ====================
 *
 * Executes the eventHandler function passed when the
 * sever has recieved ready state and data was recieved.
 *
 */
function readyStateRecieved(eventHandler)
{
    if (xhrObj.readyState == 4 && xhrObj.status == 200)     //!< XHR has data loaded and server says OK
    {
        xhrResponse = xhrObj.responseText;                  //!< Response text recieved; store as response
        eventHandler();                                     //!< Execute the event handler
    }
}