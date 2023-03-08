<?php
// popular words
include_once("../../includes/words.php");


if( !function_exists('url_friendly') ) {
function url_friendly($str, $short = false)
{
    $str = preg_replace("/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/", 'Y', $str);
    $str = preg_replace("/(ỳ|ý|ỵ|ỷ|ỹ)/", 'y', $str);
	$str = preg_replace("/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/", 'a', $str);
    $str = preg_replace("/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|ë)/", 'e', $str);
    $str = preg_replace("/(ì|í|ị|ỉ|ĩ)/", 'i', $str);
    $str = preg_replace("/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ö)/", 'o', $str);
    $str = preg_replace("/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/", 'u', $str);
    $str = preg_replace("/(đ)/", 'd', $str);
    $str = preg_replace("/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/", 'A', $str);
    $str = preg_replace("/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/", 'E', $str);
    $str = preg_replace("/(Ì|Í|Ị|Ỉ|Ĩ)/", 'I', $str);
    $str = preg_replace("/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ộ|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ?|Ợ|Ở|Ỡ)/", 'O', $str);
    $str = preg_replace("/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/", 'U', $str);
    $str = preg_replace("/(ç)/", 'c', $str);
    $str = preg_replace("/(Đ)/", 'D', $str);
    $str = preg_replace("/(')/", '', $str);
    $str = preg_replace("/(\")/", '', $str);
    $str = preg_replace("/\,/", '', $str);
    $str = preg_replace("/\./", '', $str);
    $str = preg_replace("/\)/", '', $str);
    $str = preg_replace("/\(/", '', $str);
    $str = preg_replace("/\:/", '', $str);
    $str = preg_replace("/\!/", '', $str);
    $str = preg_replace("/\@/", 'at-', $str);
    $str = preg_replace("/( & )/", ' ', $str);
    if( $short )
    	$str = preg_replace('#\b[a-z0-9]{1,2}\b#', '', $str);
    $str = str_replace(" ", "-", str_replace("&*#39;","",$str));
    return $str;
}
}

$all = [
	'actor'    => $words_movie_actor,
	'brand'    => $words_brand,
	'city'     => $words_city,
	'color'    => $words_color,
	'country'  => $words_country,
	'exchange' => $words_exchange,
	'flower'   => $words_flower,
	'game'     => $words_game,
	'movie'    => $words_movie,
	'place'    => $words_place,
];

/*$words = explode(" ", $words_vi_name); // split input by space into an array
$unique_words = array_unique($words); // remove duplicates from the array

$result = array_values($unique_words); // re-index the array keys

header('Content-Type: text/html; charset=utf-8');
print_r( implode(' ', $result)); exit;*/

foreach ($all as $key => $value) {
	$words = explode(' ', str_replace('-', '', strtolower($value)));
	$words = array_unique($words);
	$result = [];

	foreach ($words as $word) {
		$first_letter = $word[0];
		if (!array_key_exists($first_letter, $result)) {
			$result[$first_letter] = [];
		}
		array_push($result[$first_letter], $word);
	}

	foreach ($result as $letter => $wordList) {
	    shuffle($wordList);
	    $result[$letter] = array_slice($wordList, 0, 5);
	}
	$all[$key] = $result;
	/*echo count($result);
	print_r($result);exit;*/
}
	//print_r($all);exit;

$result = [];
foreach ($words_50_popular as $letter => $wordList) {
    shuffle($wordList);
    $result[$letter] = array_slice($wordList, 0, 5);
}
$all['popular'] = $result;
//ksort($result);
//

$all_vi = [
	'vi_word'    => $words_vi_popular,
	'vi_name'    => $words_vi_name,
];
foreach ($all_vi as $key => $value) {
	$words = explode(' ', strtolower($value));
	$words = array_unique($words);
	$result = [];

	foreach ($words as $word) {
		$first_letter = url_friendly($word[0]);
		if (!array_key_exists($first_letter, $result)) {
			$result[$first_letter] = [];
		}
		array_push($result[$first_letter], $word);
	}

	foreach ($result as $letter => $wordList) {
	    shuffle($wordList);
	    $result[$letter] = array_slice($wordList, 0, 5);
	}
	$all[$key] = $result;
	/*echo count($result);
	print_r($result);exit;*/
}

header('Content-type: text/javascript');
echo 'var MEMORABLE_WORD = ';
print_r(json_encode($all));
echo ';';
exit;