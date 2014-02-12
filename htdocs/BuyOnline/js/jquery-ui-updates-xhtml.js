/* * * * * * * * * * * * * * * * * * * * * * * * *
 * Description: HIT3324 Web Application Development
 *              Assignment One
 *              Uses jQuery to allow for Bootstrap
 *              HTML5 features to work in an XHTML
 *              document.
 *      Author: Alex Cummaudo
 *        Date: 29 Aug 2013
 * * * * * * * * * * * * * * * * * * * * * * * * */
 
/**
 *
 * jQuery UI Enhancers
 * ===================
 *
 * I wrote these jQuery functions to enhance the UX
 * of the XHTML document with the functionality of 
 * HTML5 features included in Bootstrap
 *
 */
$(document).ready(function () {
    /**
     * 
     * Dropdown Menus
     * ==============
     *
     * jQuery required here due to XHTML incompatibilites
     * with the HTML5 attribute data-toggle = "dropdown"
     *
     */
	//! Onload, hide all .dropdown-menus
	//$(".dropdown-menu").hide();
	//! On .dropdown-toggle click
	$(".dropdown-toggle").on("click", function(e) {
	    //! Toggle the menu visibility of the closest .dropdown-menu.
		$(this).next(".dropdown-menu").toggle("fast");
		//! Highlight the toggler
		$(this).toggleClass("active");
		$(this).toggleClass("btn-default");
	});
	//! On .close click
	$(".close").on("click", function(e) {
	    //! Toggle the menu visibility of the closest .dropdown-menu.
		$(".dropdown-menu").hide("fast");
        //! Dehighlight the toggler
		$(".dropdown-toggle").removeClass("active");
		$(".dropdown-toggle").removeClass("btn-default");
	});
	
	
	/**
     * 
     * Alerts
     * ======
     * 
     * jQuery required here like similiar above but for
     * dismissable alerts
     *
     */
	//! On .alert-dismissable close click
	$(".alert-dismissable").children(".close").on("click", function(e) {
	    //! Fade alert message out
	    $(this).parent().fadeOut("medium" , function(){
	        //! Slide the sibling up in its place
            $(this).css({"visibility":"hidden",display:'block'}).slideUp();
        });
	});
	
	/**
	 * 
	 * Placeholder Text
	 * ================
	 *
	 * jQuery for placeholder inputs since the `placeholder' attribute
	 * is not avaliable in XHTML (unlike HTML5)
	 *
	 */
	//! Onload, add placeholder class to inputs with placeholder values
    $("input.placeholder").addClass("placeholder");
    $("input.placeholder").on("focus", function(e) {
        //! If the current value is the placeholder when we clicked?
        if (this.value == this.defaultValue) {
            //! Kill the placeholder
            $(this).removeClass("placeholder");
            this.value = "";
        }
    });
    $("input.placeholder").on("blur", function(e) {
        //! If there is no input when we input (whitespace or null)
        if (!($.trim($(this).val())) || this.value == "") {
            //! Revive the placeholder
            this.value = this.defaultValue;
            $(this).addClass("placeholder");
        }
    });
});

/**
 *
 * Push Alert
 * ==========
 *
 * Sends a dismissable alert to the given element
 * @alertType = { alert-success, alert-warning, alert-info, alert-danger }
 *
 */
function pushAlert(id, msgText, alertType, dismissable) {
    //! Given the element actually exists?
    if (document.getElementById(id) != null) {
        newAlert = "    <div class='container alert " + alertType +" '>"+
                            msgText +
                   "    </div><!--/dismissable-alert-->";
        if (dismissable == true)
        {
            //! Fade in and delete after 1.5s
            $(newAlert).hide().insertAfter('#'+id).show("fast").delay("1500").hide("fast");
        }
        else if (dismissable == false)
        {
            // Fade in appended message to id and keep
            $(newAlert).hide().insertAfter('#'+id).show("fast");
        }
        else
        {
            //! Fade in and delete after the given time
            $(newAlert).hide().insertAfter('#'+id).show("fast").delay(dismissable).hide("fast");
        }
    }
}

/**
 *
 * Replace With
 * ============
 *
 * Replaces an element with something else
 *
 */
function replaceWith(id, somethingElse) {
    //! Given the element actually exists?
    if (document.getElementById(id) != null) {
        $('#'+id).hide('fast');
        $(somethingElse).hide().insertAfter('#'+id).show("fast");
    }
}

/**
 *
 * Append To
 * =========
 *
 * Appends an element with something else
 *
 */
function appendTo(id, somethingElse) {
    //! Given the element actually exists?
    if (document.getElementById(id) != null) {
        $(somethingElse).hide().insertAfter('#'+id).show("fast");
    }
}