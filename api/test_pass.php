<?php
// test_pass.php — Probador de contraseñas y usuarios MySQL
header('Content-Type: text/plain; charset=utf-8');

$users = ['teotekco_dogood', 'teotekco_Jareth'];
$passwords = [
    'Sodier21ñ.',
    utf8_decode('Sodier21ñ.'),
    utf8_encode('Sodier21ñ.'),
    'Sodier21.',
    'Sodier2026.',
    'Sodier21',
    'Sodier21n.'
];

echo "=== Probando combinaciones de usuario y contrasena ===\n\n";

foreach ($users as $u) {
    foreach ($passwords as $p) {
        try {
            $pdo = new PDO("mysql:host=localhost;dbname=teotekco_dogood;charset=utf8mb4", $u, $p, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
            echo "✅ ¡CONEXIÓN EXITOSA!\n";
            echo "Usuario: $u\n";
            echo "Contrasena correcta: $p\n";
            exit;
        } catch (PDOException $e) {
            echo "❌ Fallo con usuario '$u' y contrasena '$p': " . $e->getMessage() . "\n";
        }
    }
}

echo "\n⚠️ Ninguna combinación funcionó. Por favor cambia la contraseña en cPanel a una sin 'ñ' (ej: Sodier2026.).";
