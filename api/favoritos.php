<?php
// favoritos.php — Manejo de favoritos del usuario
require_once __DIR__ . '/config.php';
setupCORS();

$action     = $_GET['action'] ?? 'list';
$usuario_id = intval($_GET['usuario_id'] ?? $_POST['usuario_id'] ?? 0);
$input      = json_decode(file_get_contents('php://input'), true) ?? [];

if (!empty($input['usuario_id'])) {
    $usuario_id = intval($input['usuario_id']);
}

$db = getDBConnection();

// Crear tabla de favoritos si no existe
$db->exec("CREATE TABLE IF NOT EXISTS `favoritos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `animal_id` INT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_pet` (`usuario_id`, `animal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

if ($action === 'list') {
    if ($usuario_id <= 0) {
        echo json_encode(['ok' => true, 'favorites' => []]);
        exit;
    }

    $stmt = $db->prepare("SELECT animal_id FROM favoritos WHERE usuario_id = ?");
    $stmt->execute([$usuario_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode(['ok' => true, 'favorites' => array_map('intval', $rows)]);
    exit;
}

if ($action === 'toggle' || $action === 'add' || $action === 'remove') {
    $animal_id = intval($input['animal_id'] ?? $_GET['animal_id'] ?? 0);
    if ($usuario_id <= 0 || $animal_id <= 0) {
        echo json_encode(['ok' => false, 'error' => 'Usuario o animal inválido']);
        exit;
    }

    $stmt = $db->prepare("SELECT id FROM favoritos WHERE usuario_id = ? AND animal_id = ?");
    $stmt->execute([$usuario_id, $animal_id]);
    $fav = $stmt->fetch();

    if ($fav) {
        $del = $db->prepare("DELETE FROM favoritos WHERE id = ?");
        $del->execute([$fav['id']]);
        echo json_encode(['ok' => true, 'favorited' => false]);
    } else {
        $ins = $db->prepare("INSERT IGNORE INTO favoritos (usuario_id, animal_id) VALUES (?, ?)");
        $ins->execute([$usuario_id, $animal_id]);
        echo json_encode(['ok' => true, 'favorited' => true]);
    }
    exit;
}

echo json_encode(['ok' => false, 'error' => 'Acción no válida']);
