// background.js
// The GIF Oracle

// Function to search for a GIF given a search term
function searchOracle(info)
{
 var searchString = info;
 // Replace spaces with plus signs
 var modifiedSearchString = searchString.replace(" ", "+");
 // Set API Key for Gifly (Test Key, not a production key)
 var apiKey = "dc6zaTOxFJmzC";
 // Create search URL
 var URL = "http://api.giphy.com/v1/gifs/random?api_key=" + apiKey + "&tag=" + modifiedSearchString;

 // Holds a result
 var result = "";
 // Make AJAX call
 $.ajax({
	    url : URL,
	    type: "GET",
	    dataType : "json",
	    async: false,
	    success: function(returned, textStatus, jqXHR)
	    {
	       // Attempt to get a result URL
	       try {
	       		result = returned.data.image_url;
	       // If a URLis ot returned, set null
	       } catch (Exception) {
	       		result = null;
	       }
	    },
	    // If an error occurs, set URL to null
	    error: function (jqXHR, textStatus, errorThrown)
        {
            result = null;
        }
	});
   return result;
}

// Function to search for a term and then open the result in a new tab
function newTabSearch(info) {
	// Get the selected text
	var result = searchOracle(info.selectionText);
	// If something was found
	if (result != null) {
		// Open it in a new tab
		chrome.tabs.create({url: result});
	// If nothing was returned
	} else {
		// Show error
		alert("GIF Not Found");
	}
}

// Function to search for a GIF and then copy the result to the clipboard
function copyToClipboard(info) {
	// Get the selected text
	var result = searchOracle(info.selectionText);
	// If something was found
	if (result != null) {
		  // Copy result to clipboard
		  toClipboard(result);
    // If nothing was returned
	} else {
		// Show error
		alert("GIF Not Found");
	}
}

// Function to search for a term and open the result in a Chrome Notification
function openInNotification(info) {
	// Get result of search
	var result = searchOracle(info.selectionText);
	// If a result was returned
	if (result != null) {
		// Create variable to contain notification settings
		var opt = {
		   type: "image",									// Type of notification
		   title: "The GIF Oracle",							// Notification title
		   message: info.selectionText + ": " + result,		// Notification message
		   imageUrl: result,								// URL of the image
		   iconUrl: "icon128.png",							// Icon to go with the notification
		   buttons: [{										// Buttons on the bottom of the notification
	            title: "Copy URL To Clipboard"
	        }, {
	            title: "Open In New Tab"
	        }]
		};
		// Create the notification using the settings set in opt
		var notification = chrome.notifications.create("", opt, function(id) {
			// Add a listener for the buttons
   			chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
   				// If Chrome detects a button clicked on this specific instance
			    if (notifId === id) {
			    	// If the first button is clicked, copy URL to clipboard
			        if (btnIdx === 0) {
			            toClipboard(result);
			        // If the second button is clicked, open URL in new tab
			        } else if (btnIdx === 1) {
			            chrome.tabs.create({url: result});
			        }
			    }
			});
		});
	// Else if a result is not found, show error
	} else {
		alert("GIF Not Found");
	}
}

// Function to search for a term and open the result in a Chrome Notification
function searchOmnibox(info) {
  // Get result of search
  var result = searchOracle(info);
  // If a result was returned
  if (result != null) {
    // Create variable to contain notification settings
    var opt = {
       type: "image",									// Type of notification
       title: "The GIF Oracle",							// Notification title
       message: info + ": " + result,		// Notification message
       imageUrl: result,								// URL of the image
       iconUrl: "icon128.png",							// Icon to go with the notification
       buttons: [{										// Buttons on the bottom of the notification
              title: "Copy URL To Clipboard"
          }, {
              title: "Open In New Tab"
          }]
    };
    // Create the notification using the settings set in opt
    var notification = chrome.notifications.create("", opt, function(id) {
      // Add a listener for the buttons
         chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
           // If Chrome detects a button clicked on this specific instance
          if (notifId === id) {
            // If the first button is clicked, copy URL to clipboard
              if (btnIdx === 0) {
                  toClipboard(result);
              // If the second button is clicked, open URL in new tab
              } else if (btnIdx === 1) {
                  chrome.tabs.create({url: result});
              }
          }
      });
    });
  // Else if a result is not found, show error
  } else {
    alert("GIF Not Found");
  }
}

// Function to take an input and copy it to the clipboard
function toClipboard(theInput) {
	  // Add an input to the body with the input
	  $('body').append("<input type='text' id='oracleUrl' value=" + theInput + "></input>");
	  // Get the input
	  var input = document.getElementById( 'oracleUrl' );
	  // Select the input
	  input.focus();
	  input.select();
	  // Copy selected text
	  document.execCommand('copy', false, null);
	  // Send confirmation
	  alert("GIF Copied To Clipboard");
	  // Remove input from page
	  $('#oracleUrl').remove();
}

// Create listener to recommend searching for a GIF in the search box
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    var suggestions = [];
    suggestions.push({content: "Oracle " + text, description: "Search for a random GIF of " + text});
    // Set first suggestion as the default suggestion
    chrome.omnibox.setDefaultSuggestion({description:suggestions[0].description});
});

// Search for a GIF if the user chooses to do so in the omnibox
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    searchOmnibox(text);
});

// Adds the functions to the context menu (right click)
chrome.contextMenus.create({title: "Find Random GIF", contexts:["selection"], onclick: openInNotification});
chrome.contextMenus.create({title: "Open Random GIF In New Tab", contexts:["selection"], onclick: newTabSearch});
chrome.contextMenus.create({title: "Copy Random GIF URL To Clipboard", contexts:["selection"], onclick: copyToClipboard});
