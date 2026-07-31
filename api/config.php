<?php
// config.php — Configuración de conexión a la BD en Neubox / cPanel
define('DB_HOST', 'localhost');
define('DB_USER', 'teotekco_dogood');
define('DB_PASS', ')f0WTXpeZQT;=l.N');
define('DB_NAME', 'teotekco_dogood');

function getDBConnection() {
    static $pdo = null;
    static $attempted = false;
    if (!$attempted) {
        $attempted = true;
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (\PDOException $e) {
            $pdo = null;
        }
    }
    return $pdo;
}

function setupCORS() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json; charset=UTF-8");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}
