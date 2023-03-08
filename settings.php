<?php
if( !defined('PSZAPP_INIT') ) exit;

// each log type must be unique number, each tool should have 10 types
$PSZ_LOG_MEMORABLE_PWD_CREATOR_RANDOMIZE = 530;
$PSZ_LOG_MEMORABLE_PWD_CREATOR_MANUAL = 531;

/********************************
Required Files:
	index.php		: where to process your tool
	settings.php	: global settings of your tool
	logos			: folder to contain various logos of your tool
		16.png			: to display on the browser's title bar
		180.png			: tool logo
	sharing.jpg		: used to sharing on socials

$tool_settings		:	Unchangable variable name
	Version			:	Required
	Name			:	Required
	Description		:	Required
	Keyword			:	optional
	Developer		:	Required
		Name			:	Required
		Contact			:	Required, website or email
		Source			:	optional, links to open source sites
		Donate			:	optional, links to donations
			Paypal			:	link to paypal donation
			BTC				:	link to BTC donation
			Ethereum		:	link to ETH donation
	Date			:	Required, created date; format: Y-MM-d, 2022-11-17

	Changelog		:	optional - used to store changelog
********************************/

$tool_settings = [
	'Version'     => '1.0.0',
	'Name'        => __('Random Memorable Password Creator'),
	'Description' => __('Create instantly random series of highly secure passwords with unique memmorable words to use for your online credentials, scan QR code to send to your phone immediately and share your selected criteria to your friends for better safe.'),
	'Keyword'     => __('best memorable password creator, memorable password creator tool, easy to remember passwords, strong memorable passwords, secure password suggestions, unforgettable password ideas, memorable password tips, password strength and memorability, password creation made easy, creative password ideas, memorable password tricks, unpredictable yet memorable passwords, password strength and memorization, unpredictable but memorable passwords, memorable password patterns, memorable password formulas, password strength and recall, unconventional password ideas, memorable password concepts, secure password tips, memorable password systems, memorable password structures, memorable password principles, fast and efficient password creator, automated password creator tools, unique password creator software, mass password creator tool, online memorable password creator, multiple memorable password creator, batch password creator, simultaneous password maker, password generation in bulk, memmorable words passwords, memorable passwords qrcode'),
	'Developer'   => [
		'Name'    	=> 'PreScriptZ.com',
		'Contact' 	=> 'https://www.prescriptz.com/',
		'Source'	=> [
			'GitHub'    => 'https://github.com/toolywin/tool___' . basename(__DIR__),
		],
		'Donate'  	=> [
			'Paypal'   => 'https://www.paypal.me/PREScriptZ',
			'BTC'      => 'https://blockchain.info/address/1FNvqxG5T6P5UFtLvq5hdGir6LnS1zJQ6m',
			'Ethereum' => 'https://etherscan.io/address/0x85469855fd24498418e58ff9ad0298f0c498b4e8',
			'LTC'      => 'https://live.blockcypher.com/ltc/address/LY6ADMcfUejoeExifh2ngMXpHM5z8CXxuq',
		],
	],
	'Flagcounter'      => 'xwVh', // unique slug of flagcounter.com
	'Date'      => '2023-03-5', // created date
	//'Changelog' => [],
];