<?php
$database = 'your_db_table_name';

try { 
    require_once( 'db.php'); 
} catch (Exception $e) { 
    error_log($e->getMessage());
}
require_once( 'functions.php' );

if ($_POST['get_scores']) {
    get_scores($db);
    clean_db($db);
}

if ($_POST['initials']) {
    set_score($_POST['initials'], $_POST['score'], $db);
}

if ($_POST['install']) {
    set_up_database($db);
}