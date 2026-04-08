<?php
include("top.html");

# grab query parameters
$firstname = $_GET["firstname"];
$lastname  = $_GET["lastname"];

# connect to the imdb database
$db = new PDO("mysql:dbname=clb0214db;host=mysql.auburn.edu", "clb0214", "Jaxson26!");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

# Query: Find the best-matching actor ID
$stmt = $db->prepare("
    SELECT id, first_name, last_name
    FROM actors
    WHERE last_name = :lastname
      AND first_name LIKE CONCAT(:firstname, '%')
    ORDER BY film_count DESC, id ASC
    LIMIT 1
");
$stmt->execute(["lastname" => $lastname, "firstname" => $firstname]);
$actor = $stmt->fetch();

if (!$actor) {
    ?>
    <h1>Results for <?= htmlspecialchars("$firstname $lastname") ?></h1>
    <p class="message">Actor <?= htmlspecialchars("$firstname $lastname") ?> not found.</p>
    <?php
} else {
    $actor_id   = $actor["id"];
    $actor_name = htmlspecialchars($actor["first_name"] . " " . $actor["last_name"]);

    ?>
    <h1>Results for <?= $actor_name ?></h1>
    <?php

    # Query: Movies where this actor appeared with Kevin Bacon
    # Join 5 tables: actors (x2), roles (x2), movies (x1)
    $stmt2 = $db->prepare("
        SELECT DISTINCT m.name, m.year
        FROM actors a1
        JOIN roles r1 ON a1.id = r1.actor_id
        JOIN movies m  ON r1.movie_id = m.id
        JOIN roles r2  ON m.id = r2.movie_id
        JOIN actors a2 ON r2.actor_id = a2.id
        WHERE a1.id = :actor_id
          AND a2.first_name = 'Kevin'
          AND a2.last_name  = 'Bacon'
        ORDER BY m.year DESC, m.name ASC
    ");
    $stmt2->execute(["actor_id" => $actor_id]);
    $movies = $stmt2->fetchAll();

    if (count($movies) == 0) {
        ?>
        <p class="message"><?= $actor_name ?> wasn't in any films with Kevin Bacon.</p>
        <?php
    } else {
        ?>
        <table>
            <caption>Films with <?= $actor_name ?> and Kevin Bacon</caption>
            <tr>
                <th>#</th>
                <th>Title</th>
                <th>Year</th>
            </tr>
            <?php
            $count = 1;
            foreach ($movies as $movie) {
                ?>
                <tr>
                    <td><?= $count ?></td>
                    <td><?= htmlspecialchars($movie["name"]) ?></td>
                    <td><?= htmlspecialchars($movie["year"]) ?></td>
                </tr>
                <?php
                $count++;
            }
            ?>
        </table>
        <?php
    }
}

include("bottom.html");
?>