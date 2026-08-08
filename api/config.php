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
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Private-Network: true");
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

define('DOGOOD_MILITARY_KEY', 'DoGood_Secret_AES256_Encryption_Key_9876543210_v2#!');

/**
 * Encriptar datos confidenciales con algoritmo AES-256-CBC + HMAC-SHA256 de grado militar
 */
function encryptDataAES256($data) {
    if (empty($data)) return $data;
    if (is_string($data) && strpos($data, 'ENC::') === 0) return $data; // Ya encriptado

    $key = hash('sha256', DOGOOD_MILITARY_KEY, true);
    $ivLength = openssl_cipher_iv_length('aes-256-cbc');
    $iv = openssl_random_pseudo_bytes($ivLength);

    $encrypted = openssl_encrypt($data, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
    $hmac = hash_hmac('sha256', $iv . $encrypted, $key, true);

    return 'ENC::' . base64_encode($iv . $hmac . $encrypted);
}

/**
 * Desencriptar datos con autenticación de integridad HMAC-SHA256
 */
function decryptDataAES256($encryptedData) {
    if (empty($encryptedData)) return $encryptedData;
    if (!is_string($encryptedData) || strpos($encryptedData, 'ENC::') !== 0) return $encryptedData;

    $raw = base64_decode(substr($encryptedData, 5));
    $key = hash('sha256', DOGOOD_MILITARY_KEY, true);
    $ivLength = openssl_cipher_iv_length('aes-256-cbc');
    $hmacLength = 32;

    $iv = substr($raw, 0, $ivLength);
    $hmac = substr($raw, $ivLength, $hmacLength);
    $ciphertext = substr($raw, $ivLength + $hmacLength);

    $calculatedHmac = hash_hmac('sha256', $iv . $ciphertext, $key, true);
    if (!hash_equals($hmac, $calculatedHmac)) {
        return null; // Violación de integridad o intento de alteración
    }

    return openssl_decrypt($ciphertext, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
}
