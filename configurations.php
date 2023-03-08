<?php
if( !defined('PSZAPP_INIT') ) exit;

// submit to save settings
if( is_ajax_request() )
{
	if( file_exists("$PSZ_DIR_PLUGIN/$tool_slug/languages/$PSZ_APP_LANGUAGE_CODE.php") )
		include_once("$PSZ_DIR_PLUGIN/$tool_slug/languages/$PSZ_APP_LANGUAGE_CODE.php");

	$ajax_return_notify = "{\"success\": 1, \"message\": \"PSZ_APP_notify('%s', '%s', '%s')\"}";
	$ajax_return_error = "{\"error\": 1, \"message\": \"PSZ_APP_alert('%s', '%s', 'error')\"}";

	//var_export($_POST['plugin_settings']);exit;
	//print_r($_POST);EXIT;
	$settings = $_POST['tool_settings'];

	// hacked errors
	if( !isset($settings['number']) || !isset($settings['randomize']) || !isset($settings['length']) || !isset($settings['quantity']) )
		die(sprintf($ajax_return_error, __('Invalid'), __('Please try again later!')));

	if( $settings['number']>50 || $settings['number']<1 )
		die(sprintf($ajax_return_error, __('Range: 1-10'), __('Please try again later!')));

	// all good, save settings
	if( isset($_POST['tool_id']) && $db->_update($PSZ_TABLE_TOOL, "settings='" . serialize($settings) . "'", "id=" . $_POST['tool_id']) )
	{
		_log( $PSZ_LOG_TOOL_CONFIGURED, $user_session['id'], $_POST['tool_id']);
		die( sprintf($ajax_return_notify, __('Configured the tool successfully'), '', '') );
	}

	die(sprintf($ajax_return_error, __('Could not save settings'), __('Please try again later!')));
}

$pTemplate->assign_vars([
	'RECENT_NUMBER' => isset($t_settings['number']) ? $t_settings['number'] : 5,
	'MAX_QUANTITY'  => isset($t_settings['quantity']) ? $t_settings['quantity'] : 15,
	'MAX_LENGTH'    => isset($t_settings['length']) ? $t_settings['length'] : 26,
	'MAX_RANDOMIZE' => isset($t_settings['randomize']) ? $t_settings['randomize'] : 5,
]);

$pContent = $pTemplate->include_file( "$PSZ_DIR_TOOL/$tool_slug/configurations.html" );
//echo $pTemplate->pparse($pContent, false, true); // in test, keep VARS, uncompress
echo $pTemplate->pparse($pContent, true, true, true); // remove VARS, return, compress
