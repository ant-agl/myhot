<?php
$j=0;
$h =0;
for ($i = 0;$i<10000;$i++){
	$sql ="";
	$type = 'fol';
	$f ="";
	$t = 1;
	$sql ="";
	$start = microtime(true);
	$sql = "and ($type) ";
	$f = "and ($t) ";
	$end2 = microtime (true) - $start;
	$sql ="";
	$f ="";
	$starts = microtime(true);
	$sql = "and ({$type}) ";
	$f = "and ({$t}) ";
	$end3 = microtime (true) - $starts;
	if ($end2 == $end3){
		$j++;
	}
	else{
		$h++;
	}
}
echo $j.' and '.$h;
?>