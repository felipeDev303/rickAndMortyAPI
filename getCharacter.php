<?php
    header('Content-Type: application/json');

    $id = $_GET['id'];
    if (!is_numeric($id) || $id < 1) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid character ID']);
        exit;
    }
    $id = intval($id); // Ensure ID is an integer

    $url = "https://rickandmortyapi.com/api/character/$id";
    $response = file_get_contents($url);

    echo $response;

?>