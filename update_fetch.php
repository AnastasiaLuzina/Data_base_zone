<?php
// Read the file
$file = file_get_contents('js/personal-cabinet.js');

// Replace fetch calls with fetchWithCredentials
$file = str_replace(
    "fetch('api/",
    "fetchWithCredentials('api/",
    $file
);

// Write the file back
file_put_contents('js/personal-cabinet.js', $file);

echo "All fetch calls updated to use fetchWithCredentials.";
?>