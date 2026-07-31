<?php
// seguimiento.php — Módulo de Seguimiento Post-Adopción (3, 6, 12 meses)
require_once __DIR__ . '/config.php';
setupCORS();

$action = $_GET['action'] ?? 'list';
$input  = json_decode(file_get_contents('php://input'), true) ?? [];
$db     = getDBConnection();

if ($action === 'list') {
    $animal_id = intval($_GET['animal_id'] ?? $input['animal_id'] ?? 0);
    
    if ($animal_id > 0) {
        $stmt = $db->prepare("SELECT * FROM seguimiento WHERE animal_id = ? ORDER BY meses ASC, id DESC");
        $stmt->execute([$animal_id]);
    } else {
        $stmt = $db->query("SELECT s.*, a.nombre AS animal_nombre, a.emoji AS animal_emoji FROM seguimiento s LEFT JOIN animales a ON s.animal_id = a.id ORDER BY s.id DESC");
    }
    
    $updates = $stmt->fetchAll();
    echo json_encode(['ok' => true, 'updates' => $updates]);
    exit;
}

if ($action === 'create') {
    $animal_id  = intval($input['animal_id'] ?? 0);
    $meses      = intval($input['meses'] ?? 3); // 3, 6, 12
    $comentario = trim($input['comentario'] ?? '');
    $foto_url   = trim($input['foto_url'] ?? '');

    if ($animal_id <= 0 || empty($comentario)) {
        echo json_encode(['ok' => false, 'error' => 'Animal y comentario son obligatorios']);
        exit;
    }

    $sql = "INSERT INTO seguimiento (animal_id, meses, comentario, foto_url, fecha) VALUES (?, ?, ?, ?, NOW())";
    $stmt = $db->prepare($sql);
    $stmt->execute([$animal_id, $meses, $comentario, $foto_url]);

    echo json_encode(['ok' => true, 'id' => $db->lastInsertId()]);
    exit;
}

echo json_encode(['ok' => false, 'error' => 'Acción no válida']);
