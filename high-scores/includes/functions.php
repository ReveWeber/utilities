<?php
/* DB structure: table name $table
 * inits is a varchar(3) that defaults to XXX
 * score is an integer representing the time on the timer
 * there is also id, an autoincrementing primary key
 */

// installer
function set_up_database(&$db) {
    // create table if not already there
    $sql = "CREATE TABLE IF NOT EXISTS ".$table." (id MEDIUMINT NOT NULL AUTO_INCREMENT, inits VARCHAR(3), score INT, PRIMARY KEY (id) )";
    $stmt = $db->prepare($sql);
    $stmt->execute();

    // you can check what the table setup ended up as with the following:
    // $sql = "DESCRIBE ".$table;
    // $stmt = $db->prepare($sql);
    // $stmt->execute();
    // echo '<pre>';
    // var_dump($stmt->fetchAll(PDO::FETCH_ASSOC));
    // echo '</pre>';
}

// removes all but lowest 20 scores to keep table from getting heavy
function clean_db(&$db) {
    try {
        $sql = "DELETE FROM ".$table."
            WHERE id NOT IN (
                SELECT id 
                FROM (
                    SELECT id
                    FROM ".$table."
                    ORDER BY score, id
                    LIMIT 20
                ) table_alias
            )";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $errorInfo = $stmt->errorInfo();
        if (isset($errorInfo[2])) {
            error_log($errorInfo[2]);
        }
    } catch (Exception $e) {
        error_log($e->getMessage());
    }
    /* Stack Overflow http://stackoverflow.com/a/578926/3708520 :
    DELETE FROM `table`
    WHERE id NOT IN (
      SELECT id
      FROM (
        SELECT id
        FROM `table`
        ORDER BY id DESC
        LIMIT 42 -- keep this many records
      ) foo
    );
    explanation of table_alias / foo: http://www.mysqltutorial.org/mysql-derived-table/
    */
}

// gets the top ten scores for this difficulty level and echos them out as a JSON-encoded two-dimensional array
function get_scores(&$db) {
    $scores = array();
    try {
        $sql = "SELECT score, inits FROM ".$table." WHERE 1 ORDER BY score, id LIMIT 10";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $stmt->bindColumn('score', $score);
        $stmt->bindColumn('inits', $inits);
        $errorInfo = $stmt->errorInfo();
        if (isset($errorInfo[2])) {
            error_log($errorInfo[2]);
        }
    } catch (Exception $e) {
        error_log($e->getMessage());
    }
    while($stmt->fetch(PDO::FETCH_BOUND)) {
        if ($score) {
            $scores[] = [$inits, $score];
        }
    }
    echo json_encode($scores);
}

// adds a score to the database
function set_score($initials, $score, &$db) {
    $score = intval($score);
    $initials = substr($initials, 0, 3);
    try {
        $sql = "INSERT INTO ".$table."
                (inits, score)
                VALUES (:inits, :score)";
        $stmt = $db->prepare($sql);
        $stmt->bindValue(':inits', $initials);
        $stmt->bindValue(':score', $score);
        $stmt->execute();
        $errorInfo = $stmt->errorInfo();
        if (isset($errorInfo[2])) {
            error_log($errorInfo[2]);
        }
    } catch (Exception $e) {
        error_log($e->getMessage());
    }
}