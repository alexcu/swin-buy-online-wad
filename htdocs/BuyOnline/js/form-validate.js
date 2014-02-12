/* * * * * * * * * * * * * * * * * * * * * * * * *
 * Description: HIT3324 Web Application Development
 *              Assignment Two
 *              Client-Side data validation scripts
 *      Author: Alex Cummaudo
 *        Date: 10 Oct 2013
 * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 *
 * Push Message
 * ============
 *
 * Sends an error message to the given class; if on null
 * removes any original error messages.
 *
 * Uses jQuery to transverse/modify the DOM
 *
 */
function pushMessage(e, msgText, type) {
    var inputGroup = $(e).closest('.input-group',type);
    if (msgText && !(inputGroup.is('.has-success, .has-error, .has-warning'))) {                //!< Message text is not null nor has a has-X class
                                                                                                //!< (i.e. we want to add message)
        inputGroup.addClass(type);                                                              //!< Adds error class to input group
        $('<p class="help-block">'+msgText+'</p>').hide().appendTo(inputGroup).show("fast");    //!< Fade in appended message to e
    } else if (msgText == null) {
        $(e).next('.help-block').hide(0, function() { $(this).remove() });                      //!< Fade out message and then remove it
        inputGroup.removeClass('has-success has-error has-warning');
    }
}

/**
 *
 * Check Input Type
 * ================
 *
 * Validates client-side input as good or bad (e.g. a 
 * bad email address will not sent to the server)
 *
 * No jQuery used here.
 *
 */
function checkInput(inputID, checkType) {
    var inputElement = document.getElementById(inputID);                //!< Define the element to check
    var inputValue = document.getElementById(inputID).value;            //!< Define the value to check

    //! If the string is blank?
    //! (means that user may want to skip for later)
    if (inputValue === "") {    
        return false;
    //! Otherwise, check for suitability
    } else {
        switch (checkType) {

            /**
             * SUITABILITY OF EMAIL KIND
             */
            case 'email':
                var atPos = inputValue.indexOf('@');                    //!< Get the position of the @ character in the input
                var lastDotPos = inputValue.lastIndexOf('.');           //!< Get the position of the last dot in the input
                
                if (atPos != -1 && lastDotPos != -1)                    //!< Given there actually are an '@' and '.' char
                {
                    var localStr  = inputValue.split("@", 1);           //!< Local String is first split @
                    var domainStr = inputValue.split("@")[1];           //!< Return the second half of the input value (after @)
                }
                
                //! RegEx check against local and domain
                var regExLocal  = /[^A-z\d\.\!#\$%&'\*\+-\/\=\?\^_`\{\|\}~\.]/;
                var regExDomain = /[^A-z\d\-\.]/;
                
                if ((regExLocal.test(localStr) || regExDomain.test(domainStr)))
                {
                    pushMessage(    inputElement,
                                    "That is an invalid email address",'has-error');
                    return false;
                }
                
                //! If any of the following cases are true,
                //! it must be valid since:
                if ( ! ((lastDotPos >= atPos + 2) &&                    //!< No room for domain name (e.g. alex@gm.com) OR
                        (lastDotPos <= inputValue.length - 3) &&        //!< No room for gTLDs (e.g. alex@gmail.c) OR
                        (atPos > 0)) )                                  //!< Character is the first letter of the address (@gmail.com)
                {                                
                    pushMessage(    inputElement,
                                    "That is an invalid email address",'has-error');
                    return false;    
                }
                
                //! Otherwise it all must be valid (no returned false!)
                pushMessage(inputElement, null,'has-error');                //!< Clears error messages
                return true;
                
                
                break;

            /**
             * SUITABILITY OF NAME KIND
             */
            case 'name':
                var regEx = /[^A-z\s\-]/; //!< RegEx of alphabetic and hyphens characters and spaces

                if (regEx.test(inputValue)) {                           //!< If any character in the string contains values in the RegEx?
                    pushMessage(    inputElement,
                                    "Alphabetic characters and hyphens only",'has-error');
                    return false;

                //! Otherwise it must be valid
                } else {
                    pushMessage(inputElement, null,'has-error');    //!< Remove any messages
                    return true;
                }
                break;

            /**
             * SUITABILITY OF PHONE KIND
             */	
            case 'phone':
                //! Check inproper length types
                if (!(inputValue.length == 12 || inputValue.length == 10))
                {
                    //! We have an error
                    pushMessage(    inputElement,
                                    "That is not a valid phone number. \
                                    Ensure for area code (e.g. 0410555111)",'has-error');
                    return false; 
                } 
                else 
                {
                    if (inputValue.length == 10)                                //!< Check according to 10-digit requirements
                    {
                        for (var i = 0; i < inputValue.length; i++)             //!< For every char
                        {
                            if (isNaN(inputValue[i]) ||                         //!< If the i'th char is not a number OR
                                inputValue[0] != "0")                           //!< the first char is not a 0
                            {
                                //! We have an error
                                pushMessage(    inputElement,
                                                "That is not a valid phone number. \
                                                Ensure for area code (e.g. 0410555111)",'has-error');
                                return false;
                            }
                        }
                    }
                    if (inputValue.length == 12)                                //!< Check according to 12-digit requirements
                    {
                        for (var i = 0; i < inputValue.length; i++)             //!< For every char
                        {
                            if (isNaN(inputValue[i]))                           //!< If the i'th char is not a number
                            {
                                if (inputValue[0] != "(" ||                     //!< If first char  != ( OR
                                    inputValue[1] != "0" ||                     //!< If second char != 0 OR
                                    inputValue[3] != ")"    )                   //!< If fourth char != )
                                {
                                    //! We have an error
                                    pushMessage(    inputElement,
                                                    "That is not a valid phone number. \
                                                    Ensure for area code (e.g. 0410555111)",'has-error');
                                    return false;   
                                }
                            }
                        }
                    }
                }
                
                //! Otherwise it all must be valid (no returned false!)
                pushMessage(inputElement, null,'has-error');                        //!< Remove any messages
                return true;
                break;

            /**
             * SUITABILITY OF PRICE KIND
             */	
            case 'price':
                if  ( isNaN(inputValue) || !(inputValue > 0))
                {
                        pushMessage(    inputElement,
                                        "That is not a valid positive number.",'has-error');
                        return false;
                
                //! Otherwise it must be valid
                } 
                else 
                {
                    pushMessage(inputElement, null,'has-error');                        //!< Remove any messages
                }
                break;
            
            /**
             * SUITABILITY OF QTY KIND
             */	
            case 'qty':
                if  ( isNaN(inputValue) || !(inputValue > 0) || (inputValue % 1 != 0))  //!< Check for decimal
                {
                        pushMessage(    inputElement,
                                        "That is not a valid, positive, whole number.",'has-error');
                        return false;
                
                //! Otherwise it must be valid
                } 
                else 
                {
                    pushMessage(inputElement, null,'has-error');                        //!< Remove any messages
                }
                break;
                
            
            /**
             * Default
             */
            default:
                break;
        }	
    }
}

/**
 *
 * Is Same Check
 * =============
 *
 * Checks if the two parameters both have the same value
 * Returns true, and removes messages if true.
 * Returns false, and pushes the false message if false.
 *
 * No jQuery used here.
 *
 */
function isSame(firstInputID, secondInputID, msg) {
    firstElement = document.getElementById(firstInputID);
    secondElement = document.getElementById(secondInputID);
    if (firstElement.value == secondElement.value) {
        pushMessage(firstElement, null,'has-error');  //!< Remove any messages if true
        return true;
    } else {
        pushMessage(firstElement, msg,'has-error');   //!< Notifiy of bad validation
        return false;
    }
}


/**
 *
 * Required Input Check
 * ====================
 *
 * Checks that all fields in the given form which are
 * required are filled in with text (given that it is
 * not the same as the placeholder text.)
 *
 * Uses jQuery to transverse through DOM.
 *
 */
function checkForm(id) {
	var valid = new Array(0);
	var inputs = $('form#'+id+' .required');
	$.each(inputs, function() {

        id = $(this).attr('id');
        pushMessage(document.getElementById($(this).attr('id')), null,'has-error'); //!< Clear msg's first
        
        /**
         * CHECK FOR VALID INPUT
         */        
        switch (id) {                                   //!< Now check for appropriate input
			case 'email':
				valid.push(checkInput(id, 'email'));    //!< Valid email?
				break;

			case 'name':
				valid.push(checkInput(id, 'name'));     //!< Valid name?
				break;

			case 'phone':
				valid.push(checkInput(id, 'phone'));    //!< Valid phone?
				break;
				
            case 'pass-validate':
			    valid.push(isSame(  id,
			                        'pass',
			                        "The two passwords do not match")); //!< Valid password validation?                       
			    break;

            case 'price':
                valid.push(checkInput(id, 'price'));    //!< Valid price?
                
            case 'qty':
                valid.push(checkInput(id, 'price'));    //!< Valid qty?
                
			case 'user':
				valid.push(true);                      //!< Always push at least one where username is used
				break; 
            
			default:
				break;
        }
        
        /**
         * CHECK FOR REQUIRED FIELDS
         */
        if (!($.trim($(this).val())) || $(this).val() == "" ||              //!< Doesn't contain whitespace only
            $(this).hasClass('placeholder')) {                              //!< or still has its placeholder?
            pushMessage(this, "This is a required field.",'has-error');     //!< Push message to indicate
            valid.push(false);
        }
    });
    
    /**
     * RUN INVALID TEST
     */   
	for (i = 0; i < valid.length; i++) {    //!< For every index in the valid array
		if (valid[i] == false) {            //!< If the i'th index is invalid
			return false;                   //!< Prevent submission
			break;                          //!< Stop checking, since it's no chance of submitting
		}
	}
    
    return valid;
}