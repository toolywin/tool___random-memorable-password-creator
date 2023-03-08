javascript:
	// detect if user select a number text
	var text = '' + 
	(window.getSelection ? window.getSelection() : 
		(document.getSelection ? document.getSelection() : document.selection.createRange().text));

	// trim spaces
	text = text.trim();

	// if no selected text, ask user to enter the quantity
	var p = !text||text=='' ? prompt('_lang{Please enter the quantity of passwords}') : text;

	// all ok, open tool in new tab
	window.open('https://[=PSZ_APP_SITE_DOMAIN=]/[=TOOL_SLUG=].html?lang=[=CURRENT_LANGUAGE_CODE=]&utm_source=shortcut&quantity=' + p);

	void(0); // this void prevents direction of current page
	exit;