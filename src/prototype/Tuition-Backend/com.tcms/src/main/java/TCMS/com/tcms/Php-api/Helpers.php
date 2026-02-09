<?php
function json_input() {
  $raw = file_get_contents("php://input");
  return $raw ? json_decode($raw, true) : [];
}

function json_out($data, $code=200) {
  http_response_code($code);
  header("Content-Type: application/json");
  echo json_encode($data);
  exit;
}
