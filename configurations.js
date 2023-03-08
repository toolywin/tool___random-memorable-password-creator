jQuery(document).ready(function() {
	APP.init();
	APP_Events.init();

	$('#spinner_recent_number').spinner({min: 1, max: 50});

	// show save button on top bar
	if (typeof toggle_top_save_button === "function")
		toggle_top_save_button(true);

	/*if( typeof APP_Plugin_User_Logs_called == 'undefined' || APP_Plugin_User_Logs_called == false )
		APP_Plugin_User_Logs_called = Tool_Text_HEX.init();*/

	input_change_trigger('#form_tool_settings', '#form_tool_settings button[type="submit"]', true);

	if (typeof toggle_top_save_button === "function") {
		trigger_top_save_button('#form_tool_settings button[type="submit"]', function(){
			$('#form_tool_settings').submit();
		});
	}
});