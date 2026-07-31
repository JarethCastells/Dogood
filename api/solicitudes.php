<?php
// solicitudes.php — Gestión de solicitudes de adopción
require_once __DIR__ . '/config.php';
setupCORS();

$action = $_GET['action'] ?? 'list';
$input  = json_decode(file_get_contents('php://input'), true) ?? [];
$db     = getDBConnection();

if ($action === 'list') {
    $rescatista_id = isset($_GET['rescatista_id']) ? intval($_GET['rescatista_id']) : 0;
    $usuario_id    = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : 0;

    $where  = [];
    $params = [];

    if ($rescatista_id > 0) {
        $where[]  = "(s.rescatista_id = ? OR a.rescatista_id = ?)";
        $params[] = $rescatista_id;
        $params[] = $rescatista_id;
    }
    if ($usuario_id > 0) {
        $where[]  = "s.usuario_id = ?";
        $params[] = $usuario_id;
    }

    $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

    $sql = "SELECT s.*, 
                   a.nombre AS animal_nombre, a.raza AS animal_raza, a.emoji AS animal_emoji, a.color AS animal_color, a.foto_url AS animal_foto,
                   u.nombre AS usuario_nombre, u.email AS usuario_email, u.telefono AS usuario_telefono, u.abierto_a_opciones AS usuario_abierto
            FROM solicitudes s
            LEFT JOIN animales a ON s.animal_id = a.id
            LEFT JOIN usuarios u ON s.usuario_id = u.id
            {$whereClause}
            ORDER BY s.id DESC";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $solicitudes = $stmt->fetchAll();

    echo json_encode(['ok' => true, 'solicitudes' => $solicitudes]);
    exit;
}

if ($action === 'create') {
    $animal_id          = intval($input['animal_id'] ?? 0);
    $rescatista_id      = intval($input['rescatista_id'] ?? 1);
    $usuario_id         = !empty($input['usuario_id']) ? intval($input['usuario_id']) : null;
    $guest_nombre       = trim($input['guest_nombre'] ?? '');
    $guest_email        = trim($input['guest_email'] ?? '');
    $guest_telefono     = trim($input['guest_telefono'] ?? '');
    $vivienda           = trim($input['vivienda'] ?? '');
    $ninos              = trim($input['ninos'] ?? '');
    $mascotas_actuales  = trim($input['mascotas_actuales'] ?? '');
    $experiencia_previa = trim($input['experiencia_previa'] ?? '');
    $tiene_veterinario  = trim($input['tiene_veterinario'] ?? '');
    $motivacion         = trim($input['motivacion'] ?? '');
    $pet_nombre         = trim($input['animal_nombre'] ?? $input['pet_name'] ?? 'Peludito Rescatado');

    // Validar rescatista_id en usuarios
    $checkR = $db->prepare("SELECT id FROM usuarios WHERE id = ?");
    $checkR->execute([$rescatista_id]);
    $rowR = $checkR->fetch();
    if (!$rowR) {
        $firstU = $db->query("SELECT id FROM usuarios WHERE rol IN ('admin', 'rescatista') ORDER BY id ASC LIMIT 1")->fetch();
        $rescatista_id = $firstU ? intval($firstU['id']) : 1;
    }

    // Verificar si el animal existe en la BD
    if ($animal_id > 0) {
        $checkA = $db->prepare("SELECT id, rescatista_id FROM animales WHERE id = ?");
        $checkA->execute([$animal_id]);
        $rowA = $checkA->fetch();
        if ($rowA) {
            if (!empty($rowA['rescatista_id'])) {
                $rescatista_id = intval($rowA['rescatista_id']);
            }
        } else {
            // Auto-crear el registro del animal para cumplir la restricción de Foreign Key
            try {
                $insA = $db->prepare("INSERT INTO animales (id, nombre, especie, rescatista_id, estatus) VALUES (?, ?, 'perro', ?, 'En adopción')");
                $insA->execute([$animal_id, $pet_nombre, $rescatista_id]);
            } catch (\Throwable $ex) {
                $insA2 = $db->prepare("INSERT INTO animales (nombre, especie, rescatista_id, estatus) VALUES (?, 'perro', ?, 'En adopción')");
                $insA2->execute([$pet_nombre, $rescatista_id]);
                $animal_id = intval($db->lastInsertId());
            }
        }
    } else {
        // Si no se proporcionó animal_id válido, crear/usar una mascota activa
        $insA = $db->prepare("INSERT INTO animales (nombre, especie, rescatista_id, estatus) VALUES (?, 'perro', ?, 'En adopción')");
        $insA->execute([$pet_nombre, $rescatista_id]);
        $animal_id = intval($db->lastInsertId());
    }

    // Validar usuario_id en usuarios si fue proporcionado
    if ($usuario_id !== null && $usuario_id > 0) {
        $checkU = $db->prepare("SELECT id FROM usuarios WHERE id = ?");
        $checkU->execute([$usuario_id]);
        if (!$checkU->fetch()) {
            $usuario_id = null;
        }
    }

    try {
        $sql = "INSERT INTO solicitudes (animal_id, rescatista_id, usuario_id, guest_nombre, guest_email, guest_telefono, vivienda, ninos, mascotas_actuales, experiencia_previa, tiene_veterinario, motivacion, estatus) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente')";
        $stmt = $db->prepare($sql);
        $stmt->execute([$animal_id, $rescatista_id, $usuario_id, $guest_nombre, $guest_email, $guest_telefono, $vivienda, $ninos, $mascotas_actuales, $experiencia_previa, $tiene_veterinario, $motivacion]);

        echo json_encode(['ok' => true, 'id' => $db->lastInsertId()]);
    } catch (\Throwable $e) {
        http_response_code(200);
        echo json_encode(['ok' => false, 'error' => 'Error al guardar solicitud: ' . $e->getMessage()]);
    }
    exit;
}

if ($action === 'update' || $action === 'resolver') {
    $id       = intval($input['id'] ?? 0);
    $decision = $input['decision'] ?? $input['estatus'] ?? 'Pendiente';

    if ($id <= 0) {
        echo json_encode(['ok' => false, 'error' => 'ID de solicitud inválido']);
        exit;
    }

    $stmt = $db->prepare("UPDATE solicitudes SET estatus = ? WHERE id = ?");
    $stmt->execute([$decision, $id]);

    // Si la solicitud fue aprobada, actualizar el estatus de la mascota a 'Adoptado'
    if ($decision === 'Aprobada') {
        $stmtS = $db->prepare("SELECT animal_id FROM solicitudes WHERE id = ?");
        $stmtS->execute([$id]);
        $solRow = $stmtS->fetch();
        if ($solRow && !empty($solRow['animal_id'])) {
            $stmtA = $db->prepare("UPDATE animales SET estatus = 'Adoptado' WHERE id = ?");
            $stmtA->execute([$solRow['animal_id']]);
        }
    }

    echo json_encode(['ok' => true]);
    exit;
}

echo json_encode(['ok' => false, 'error' => 'Acción no válida']);
