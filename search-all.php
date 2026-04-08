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

    # Query: All movies for this actor
    $stmt2 = $db->prepare("
        SELECT m.name, m.year
        FROM actors a
        JOIN roles r ON a.id = r.actor_id
        JOIN movies m ON r.movie_id = m.id
        WHERE a.id = :actor_id
        ORDER BY m.year DESC, m.name ASC
    ");
    $stmt2->execute(["actor_id" => $actor_id]);
    $movies = $stmt2->fetchAll();
    ?>

    <table>
        <caption>All Films</caption>
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

include("bottom.html");
?>