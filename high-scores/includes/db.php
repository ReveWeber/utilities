<?php
$username = 'your_db_user';
$password = 'your_db_password';
$database = 'your_db_name';

$dsn = 'mysql:host=localhost;dbname='.$database;
$db = new PDO($dsn, $username, $password);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

