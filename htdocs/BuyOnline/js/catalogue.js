//! Call update_catalogue every 5s
window.setInterval(updateCatalogue, 5000);

/**
 *
 * Update Catalogue
 * ================
 *
 * Updates the catalogue by sending an AJAX
 * request to parse a XLST process; response is
 * echoed to the xhrResponse
 *
 */
 
function updateCatalogue()
{
    /**
     * DEFINE RESPONDING EVENT HANDLER FOR AJAX REQUEST
     */
    function eventHandler()
    {
        //! Listings is automatically updated to xhrResponse
        document.getElementById("listings").innerHTML = xhrResponse;
    }
    
    sendRequest("./php/catalogue.php", eventHandler, "action=update-catalogue");
}

/**
 *
 * Update Cart
 * ===========
 *
 * Updates the cart by sending an AJAX
 * request to parse a XLST process; response is
 * echoed to the xhrResponse
 *
 */
 
function updateCart()
{
    /**
     * DEFINE RESPONDING EVENT HANDLER FOR AJAX REQUEST
     */
    function eventHandler()
    {
        //! SC is automatically updated to xhrResponse
        document.getElementById("shopping-cart").innerHTML = xhrResponse;
        
        //! Update catalogue to reflect changes in SC
        updateCatalogue();
    }
    sendRequest("./php/catalogue.php", eventHandler, "action=update-cart");
}

/**
 *
 * Shopping Cart Request
 * =====================
 *
 * Adds/removes an item from the shopping cart
 * via an AJAX request to the shopping cart 
 * session varaiable stored on the server; event
 * handler for the request is to update the shoppping
 * cart
 *
 */
function shoppingCartRequest(id, action)
{    
    /**
     * DEFINE RESPONDING EVENT HANDLER FOR AJAX REQUEST
     */
    function eventHandler()
    {    
        var total = document.getElementById("grand-total").textContent;
        
        if (xhrResponse == "success-cancel")
        {
            pushAlert(  "head", 
                        "Your purchase request has been cancelled. You're welcome to shop next time.",
                        "alert-warning cart-alert", 3000);
            $("#shopping-cart").hide("fast").delay(3000).show("fast");

        }
        
        if (xhrResponse == "success-confirm")
        {
            pushAlert(  "head", 
                        "Your purchase has been confirmed! The total amount due to pay is $"+total,
                        "alert-success cart-alert", 3000);
            $("#shopping-cart").hide("fast").delay(3000).show("fast");

        }

        //! Update shopping cart to reflect this request change
        updateCart();
    }

    var queryString = "action="+action+"&id="+id;

    sendRequest("./php/catalogue.php", eventHandler, queryString);
}