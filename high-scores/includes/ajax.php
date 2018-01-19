<?php
$table = 'your_db_table_name';

try { 
    require_once( 'db.php'); 
} catch (Exception $e) { 
    error_log($e->getMessage());
}
require_once( 'functions.php' );

if (isset($_POST['get_scores'])) {
    get_scores($db, $table);
    clean_db($db, $table);
}

if (isset($_POST['initials'])) {
    set_score($_POST['initials'], $_POST['score'], $db, $table);
}

if (isset($_GET['install'])) {
    set_up_database($db, $table);
}