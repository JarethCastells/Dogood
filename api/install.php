<?php
// install.php — Script automático para crear e inicializar las tablas en Neubox (teotekco_dogood)
require_once __DIR__ . '/config.php';

header('Content-Type: text/html; charset=utf-8');
echo "<h2>🛠️ Instalador DoGood — Base de Datos Neubox</h2>";

try {
    $db = getDBConnection();
    echo "<p style='color:green;'>✅ Conexión exitosa a la base de datos <strong>" . DB_NAME . "</strong> con el usuario <strong>" . DB_USER . "</strong></p>";

    $sql = file_get_contents(__DIR__ . '/schema.sql');
    
    // Split and execute SQL statements
    $db->exec($sql);

    echo "<p style='color:green;font-weight:bold;'>🎉 Base de datos configurada e inicializada correctamente.</p>";
    echo "<h3>Tablas creadas:</h3><ul>";
    
    $tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $t) {
        echo "<li><strong>$t</strong></li>";
    }
    echo "</ul>";

    echo "<p>Cuentas creadas:</p>";
    echo "<ul>";
    echo "<li><strong>Admin:</strong> dogood@teotek.com.mx (Pass: Sodier21ñ.)</li>";
    echo "<li><strong>Rescatista:</strong> refugio@dogood.mx (Pass: refugio123)</li>";
    echo "<li><strong>Adoptante:</strong> carlos@gmail.com (Pass: carlos123)</li>";
    echo "</ul>";

} catch (Exception $e) {
    echo "<p style='color:red;'>❌ Error al inicializar la base de datos: " . htmlspecialchars($e->getMessage()) . "</p>";
}
