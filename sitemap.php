<?php
if( !defined('PSZAPP_INIT') ) exit;

//error_reporting( 0 );
//print_r($_SERVER);exit;

function backtrack_memorable_password($arrays, $index, $current, &$result) {
	if ($index == count($arrays)) {
		$para = ['full', 'sort', 'text', 'break'/*, 'length', 'quantity'*/];
		$result[] = implode("&amp;", array_map(function ($k, $v) {return "$k=$v";}, $para, $current)) . "&amp;length=3&amp;quantity=5";
		//$result[] = array_combine(['uppercase', 'lowercase', 'number', 'symbol', 'length', 'quantity'], $current);
		return;
	}

	foreach ($arrays[$index] as $value) {
		$new_current = array_merge($current, [$value]);
		backtrack_memorable_password($arrays, $index + 1, $new_current, $result);
	}
}

function get_sitemap_memorable_password($arrays) {
	$result = [];
	backtrack_memorable_password($arrays, 0, [], $result);
	return $result;
}

$db_tool_config = get_tool($tool_id);
$t_settings             = unserialize($db_tool_config['settings']);
$t_setting_max_length   = isset($t_settings['length']) ? $t_settings['length'] : 64;
$t_setting_max_quantity = isset($t_settings['quantity']) ? $t_settings['quantity'] : 15;

$arrays = [
	[0, 1],
	['az', 'za', '-'],
	['UPPERCASE', 'lowercase', 'Uppercase', 'uPPERCASE'],
	['-', ',', '|', 'random'],
	//range(3, 5),
	//range(1, 5),
];

$combinations = get_sitemap_memorable_password($arrays);

foreach ($combinations as $combination) {
	$pTemplate->assign_block_vars('sitemap', [
		'URL'	=> "$HTTP_PROTOCOL://$APP_SYS_DOMAIN/$r[slug].html?" . $combination
	]);
	$count++;

	// max links reached Google requirements
	if( $count>=$count_max )
	{
		$sitemap_file_name = "sitemap-tools-$count_file.xml";
		$pContent = $pTemplate->pparse_file( "$PSZ_DIR_BIZ_TEMPLATE/sitemap.html" );
		$pContent = is_localhost() ? $pTemplate->pparse($pContent) : $pTemplate->pparse($pContent, true, true, true);
		//die($pContent);
		new_file($sitemap_file_name, $pContent);
		$sitemap_index_url[] = $sitemap_file_name;

		// reset
		$count = 0;
		$count_file++;
		$pContent = '';
		$pTemplate->reset_block('sitemap');
	}
}

//print_r($combinations); exit;
