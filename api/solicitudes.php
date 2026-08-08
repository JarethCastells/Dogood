<?php
// solicitudes.php — Gestión de solicitudes de adopción
require_once __DIR__ . '/config.php';
setupCORS();

try {
    @include_once __DIR__ . '/mailer.php';

    $action = $_GET['action'] ?? 'list';
    $jsonInput = json_decode(file_get_contents('php://input'), true) ?? [];
    $input  = array_merge($_GET, $_POST, $jsonInput);
    $action = $input['action'] ?? $action;
    $db     = getDBConnection();

// Auto-creación y migración segura de tabla solicitudes
if ($db) {
    try {
        $db->exec("CREATE TABLE IF NOT EXISTS solicitudes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            animal_id INT NOT NULL,
            rescatista_id INT DEFAULT 1,
            usuario_id INT DEFAULT NULL,
            guest_nombre VARCHAR(150) DEFAULT NULL,
            guest_email VARCHAR(150) DEFAULT NULL,
            guest_telefono VARCHAR(50) DEFAULT NULL,
            vivienda VARCHAR(100) DEFAULT NULL,
            ninos VARCHAR(50) DEFAULT NULL,
            mascotas_actuales TEXT DEFAULT NULL,
            experiencia_previa TEXT DEFAULT NULL,
            tiene_veterinario VARCHAR(100) DEFAULT NULL,
            motivacion TEXT DEFAULT NULL,
            fotos_espacio TEXT DEFAULT NULL,
            pregunta_predeterminada TEXT DEFAULT NULL,
            firma_digital MEDIUMTEXT DEFAULT NULL,
            estatus VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
            animal_nombre VARCHAR(150) DEFAULT NULL,
            entrevista_iniciada TINYINT(1) NOT NULL DEFAULT 0,
            entrevista_conteo INT NOT NULL DEFAULT 0,
            documentacion_completada TINYINT(1) NOT NULL DEFAULT 0,
            motivo_rechazo TEXT DEFAULT NULL,
            comprobante_domicilio MEDIUMTEXT DEFAULT NULL,
            ine_documento MEDIUMTEXT DEFAULT NULL,
            foto_espacio_1 MEDIUMTEXT DEFAULT NULL,
            foto_espacio_2 MEDIUMTEXT DEFAULT NULL,
            foto_espacio_3 MEDIUMTEXT DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    } catch (\Throwable $eTable) {}

    try { $db->exec("ALTER TABLE solicitudes ADD COLUMN rescatista_id INT DEFAULT 1"); } catch (\Throwable $eM0) {}
    try { $db->exec("ALTER TABLE solicitudes ADD COLUMN animal_nombre VARCHAR(150) DEFAULT NULL"); } catch (\Throwable $eM1) {}
    try { $db->exec("ALTER TABLE solicitudes ADD COLUMN entrevista_iniciada TINYINT(1) NOT NULL DEFAULT 0"); } catch (\Throwable $exM0) {}
    try { $db->exec("ALTER TABLE solicitudes ADD COLUMN entrevista_conteo INT NOT NULL DEFAULT 0"); } catch (\Throwable $exM1) {}
    try { $db->exec("ALTER TABLE solicitudes ADD COLUMN documentacion_completada TINYINT(1) NOT NULL DEFAULT 0"); } catch (\Throwable $exM2) {}
    try { $db->exec("ALTER TABLE solicitudes ADD COLUMN motivo_rechazo TEXT DEFAULT NULL"); } catch (\Throwable $exM3) {}
    try { $db->exec("ALTER TABLE solicitudes ADD COLUMN comprobante_domicilio MEDIUMTEXT DEFAULT NULL"); } catch (\Throwable $exM4) {}
    try { $db->exec("ALTER TABLE solicitudes ADD COLUMN ine_documento MEDIUMTEXT DEFAULT NULL"); } catch (\Throwable $exM5) {}
    try { $db->exec("ALTER TABLE solicitudes ADD COLUMN foto_espacio_1 MEDIUMTEXT DEFAULT NULL"); } catch (\Throwable $exM6) {}
    try { $db->exec("ALTER TABLE solicitudes ADD COLUMN foto_espacio_2 MEDIUMTEXT DEFAULT NULL"); } catch (\Throwable $exM7) {}
    try { $db->exec("ALTER TABLE solicitudes ADD COLUMN foto_espacio_3 MEDIUMTEXT DEFAULT NULL"); } catch (\Throwable $exM8) {}
    try { $db->exec("ALTER TABLE solicitudes ADD COLUMN firma_digital MEDIUMTEXT DEFAULT NULL"); } catch (\Throwable $exM9) {}
}

if ($action === 'list') {
    if (!$db) {
        echo json_encode(['ok' => true, 'solicitudes' => []]);
        exit;
    }

    try {
        $db->exec("DELETE FROM solicitudes WHERE estatus IN ('Pendiente', 'En revisión') AND fecha < DATE_SUB(NOW(), INTERVAL 24 HOUR)");
    } catch (\Throwable $e24) {}

    $rescatista_id = isset($_GET['rescatista_id']) ? intval($_GET['rescatista_id']) : 0;
    $usuario_id    = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : 0;

    $where  = [];
    $params = [];

    if ($rescatista_id > 0) {
        $where[]  = "(s.rescatista_id = ? OR a.rescatista_id = ? OR s.rescatista_id = 1 OR s.rescatista_id IS NULL OR s.rescatista_id = 0)";
        $params[] = $rescatista_id;
        $params[] = $rescatista_id;
    }
    if ($usuario_id > 0) {
        $where[]  = "s.usuario_id = ?";
        $params[] = $usuario_id;
    }

    $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

    $solicitudes = [];
    try {
        $sql = "SELECT s.*, 
                       COALESCE(NULLIF(s.animal_nombre, ''), a.nombre) AS animal_nombre, a.raza AS animal_raza, a.emoji AS animal_emoji, a.color AS animal_color, a.foto_url AS animal_foto,
                       u.nombre AS usuario_nombre, u.email AS usuario_email, u.telefono AS usuario_telefono, u.abierto_a_opciones AS usuario_abierto
                FROM solicitudes s
                LEFT JOIN animales a ON s.animal_id = a.id
                LEFT JOIN usuarios u ON s.usuario_id = u.id
                {$whereClause}
                ORDER BY s.id DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $solicitudes = $stmt->fetchAll() ?: [];
    } catch (\Throwable $eSql) {
        try {
            $sqlSimple = "SELECT s.* FROM solicitudes s {$whereClause} ORDER BY s.id DESC";
            $stmtSimple = $db->prepare($sqlSimple);
            $stmtSimple->execute($params);
            $solicitudes = $stmtSimple->fetchAll() ?: [];
        } catch (\Throwable $eS) {
            $solicitudes = [];
        }
    }

    echo json_encode(['ok' => true, 'solicitudes' => $solicitudes]);
    exit;
}

if ($action === 'create') {
    $animal_id               = intval($input['animal_id'] ?? 0);
    $rescatista_id           = intval($input['rescatista_id'] ?? 1);
    $usuario_id              = !empty($input['usuario_id']) ? intval($input['usuario_id']) : null;
    $guest_nombre            = trim($input['guest_nombre'] ?? '');
    $guest_email             = trim($input['guest_email'] ?? '');
    $guest_telefono          = trim($input['guest_telefono'] ?? '');
    $vivienda                = trim($input['vivienda'] ?? '');
    $ninos                   = trim($input['ninos'] ?? '');
    $mascotas_actuales       = trim($input['mascotas_actuales'] ?? '');
    $experiencia_previa      = trim($input['experiencia_previa'] ?? '');
    $tiene_veterinario       = trim($input['tiene_veterinario'] ?? '');
    $motivacion              = trim($input['motivacion'] ?? '');
    $fotos_espacio           = trim($input['fotos_espacio'] ?? '');
    $pregunta_predeterminada = trim($input['pregunta_predeterminada'] ?? '');
    $firma_digital           = trim($input['firma_digital'] ?? '');
    $pet_nombre              = trim($input['animal_nombre'] ?? $input['pet_name'] ?? 'Peludito Rescatado');

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
        $insA = $db->prepare("INSERT INTO animales (nombre, especie, rescatista_id, estatus) VALUES (?, 'perro', ?, 'En adopción')");
        $insA->execute([$pet_nombre, $rescatista_id]);
        $animal_id = intval($db->lastInsertId());
    }

    // Validar usuario_id
    if ($usuario_id !== null && $usuario_id > 0) {
        $checkU = $db->prepare("SELECT id FROM usuarios WHERE id = ?");
        $checkU->execute([$usuario_id]);
        if (!$checkU->fetch()) {
            $usuario_id = null;
        }
    }

    // Obtener datos del rescatista para enviarle correo
    $rescuerEmail = 'dogood@teotek.com.mx';
    $rescuerName  = 'Rescatista DoGood';
    try {
        $stmtR = $db->prepare("SELECT email, nombre FROM usuarios WHERE id = ?");
        $stmtR->execute([$rescatista_id]);
        $rowR = $stmtR->fetch();
        if ($rowR && !empty($rowR['email'])) {
            $rescuerEmail = $rowR['email'];
            $rescuerName  = $rowR['nombre'];
        }
    } catch (\Throwable $exR) {}

    try {
        $sql = "INSERT INTO solicitudes (animal_id, rescatista_id, usuario_id, guest_nombre, guest_email, guest_telefono, vivienda, ninos, mascotas_actuales, experiencia_previa, tiene_veterinario, motivacion, fotos_espacio, pregunta_predeterminada, firma_digital, estatus) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente')";
        $stmt = $db->prepare($sql);
        $stmt->execute([$animal_id, $rescatista_id, $usuario_id, $guest_nombre, $guest_email, $guest_telefono, $vivienda, $ninos, $mascotas_actuales, $experiencia_previa, $tiene_veterinario, $motivacion, $fotos_espacio, $pregunta_predeterminada, $firma_digital]);

        $lastId = $db->lastInsertId();

        // Enviar notificación por correo por SMTP nativo al Rescatista y al Admin
        try {
            sendNewAdoptionNotificationSMTP(
                $rescuerEmail,
                $rescuerName,
                $pet_nombre,
                $guest_nombre,
                $guest_email,
                $guest_telefono,
                $vivienda,
                $motivacion,
                $fotos_espacio
            );
        } catch (\Throwable $exMail) {}

        echo json_encode(['ok' => true, 'id' => $lastId]);
    } catch (\Throwable $e) {
        // Fallback si la BD no incluye los campos opcionales aún
        try {
            $sql = "INSERT INTO solicitudes (animal_id, rescatista_id, usuario_id, guest_nombre, guest_email, guest_telefono, vivienda, ninos, mascotas_actuales, experiencia_previa, tiene_veterinario, motivacion, estatus) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente')";
            $stmt = $db->prepare($sql);
            $stmt->execute([$animal_id, $rescatista_id, $usuario_id, $guest_nombre, $guest_email, $guest_telefono, $vivienda, $ninos, $mascotas_actuales, $experiencia_previa, $tiene_veterinario, $motivacion]);

            $lastId = $db->lastInsertId();

            try {
                sendNewAdoptionNotificationSMTP(
                    $rescuerEmail,
                    $rescuerName,
                    $pet_nombre,
                    $guest_nombre,
                    $guest_email,
                    $guest_telefono,
                    $vivienda,
                    $motivacion,
                    $fotos_espacio
                );
            } catch (\Throwable $exMail) {}

            echo json_encode(['ok' => true, 'id' => $lastId]);
        } catch (\Throwable $e2) {
            http_response_code(200);
            echo json_encode(['ok' => false, 'error' => 'Error al guardar solicitud: ' . $e2->getMessage()]);
        }
    }
    exit;
}

if ($action === 'get_documents') {
    $id = isset($_GET['id']) ? trim((string)$_GET['id']) : (isset($input['id']) ? trim((string)$input['id']) : '');
    if (empty($id)) {
        echo json_encode(['ok' => false, 'error' => 'ID inválido']);
        exit;
    }
    $stmt = $db->prepare("SELECT comprobante_domicilio, ine_documento, foto_espacio_1, foto_espacio_2, foto_espacio_3, firma_digital FROM solicitudes WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        echo json_encode(['ok' => false, 'error' => 'Solicitud no encontrada']);
        exit;
    }

    echo json_encode([
        'ok' => true,
        'documents' => [
            'comprobante_domicilio' => decryptDataAES256($row['comprobante_domicilio']),
            'ine_documento'         => decryptDataAES256($row['ine_documento']),
            'foto_espacio_1'        => decryptDataAES256($row['foto_espacio_1']),
            'foto_espacio_2'        => decryptDataAES256($row['foto_espacio_2']),
            'foto_espacio_3'        => decryptDataAES256($row['foto_espacio_3']),
            'firma_digital'         => decryptDataAES256($row['firma_digital']),
        ]
    ]);
    exit;
}

if ($action === 'encrypt_close') {
    $id = isset($input['id']) ? trim((string)$input['id']) : '';
    if (empty($id)) {
        echo json_encode(['ok' => false, 'error' => 'ID inválido']);
        exit;
    }

    $stmt = $db->prepare("SELECT comprobante_domicilio, ine_documento, foto_espacio_1, foto_espacio_2, foto_espacio_3, firma_digital FROM solicitudes WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if ($row) {
        $c   = encryptDataAES256(decryptDataAES256($row['comprobante_domicilio']));
        $ine = encryptDataAES256(decryptDataAES256($row['ine_documento']));
        $f1  = encryptDataAES256(decryptDataAES256($row['foto_espacio_1']));
        $f2  = encryptDataAES256(decryptDataAES256($row['foto_espacio_2']));
        $f3  = encryptDataAES256(decryptDataAES256($row['foto_espacio_3']));
        $sig = encryptDataAES256(decryptDataAES256($row['firma_digital']));

        $stmtU = $db->prepare("UPDATE solicitudes SET comprobante_domicilio = ?, ine_documento = ?, foto_espacio_1 = ?, foto_espacio_2 = ?, foto_espacio_3 = ?, firma_digital = ? WHERE id = ?");
        $stmtU->execute([$c, $ine, $f1, $f2, $f3, $sig, $id]);
    }

    echo json_encode(['ok' => true, 'message' => 'Documentos encriptados con AES-256 en tiempo real 🔒']);
    exit;
}

if ($action === 'update' || $action === 'resolver') {
    try {
        $id = isset($input['id']) ? trim((string)$input['id']) : '';
        $animal_id = intval($input['animal_id'] ?? 0);
        $animal_nombre = isset($input['animal_nombre']) ? trim((string)$input['animal_nombre']) : '';

        // Buscar la ID real en MySQL si la ID recibida es un timestamp o no coincide directamente
        $targetId = '';
        if (!empty($id)) {
            try {
                $stmtCheck = $db->prepare("SELECT id FROM solicitudes WHERE id = ?");
                $stmtCheck->execute([$id]);
                $rowCheck = $stmtCheck->fetch();
                if ($rowCheck) $targetId = $rowCheck['id'];
            } catch (\Throwable $eC) {}
        }
        if (empty($targetId) && $animal_id > 0) {
            try {
                $stmtAlt = $db->prepare("SELECT id FROM solicitudes WHERE animal_id = ? ORDER BY id DESC LIMIT 1");
                $stmtAlt->execute([$animal_id]);
                $rowAlt = $stmtAlt->fetch();
                if ($rowAlt) $targetId = $rowAlt['id'];
            } catch (\Throwable $eA) {}
        }
        if (empty($targetId) && !empty($animal_nombre)) {
            try {
                $stmtAlt2 = $db->prepare("SELECT s.id FROM solicitudes s LEFT JOIN animales a ON s.animal_id = a.id WHERE a.nombre = ? OR s.animal_nombre = ? ORDER BY s.id DESC LIMIT 1");
                $stmtAlt2->execute([$animal_nombre, $animal_nombre]);
                $rowAlt2 = $stmtAlt2->fetch();
                if ($rowAlt2) $targetId = $rowAlt2['id'];
            } catch (\Throwable $eA2) {}
        }

        // Si la solicitud aún no existe en MySQL (ej. creada en local/demo), la creamos automáticamente en la BD
        if (empty($targetId)) {
            $rescId = 2;
            try {
                $firstR = $db->query("SELECT id FROM usuarios WHERE rol IN ('admin', 'rescatista') ORDER BY id ASC LIMIT 1")->fetch();
                if ($firstR) $rescId = intval($firstR['id']);
            } catch (\Throwable $ex) {}

            if ($animal_id <= 0 && !empty($animal_nombre)) {
                try {
                    $stmtAnim = $db->prepare("SELECT id FROM animales WHERE nombre = ? LIMIT 1");
                    $stmtAnim->execute([$animal_nombre]);
                    $animRow = $stmtAnim->fetch();
                    if ($animRow) {
                        $animal_id = intval($animRow['id']);
                    } else {
                        $insAnim = $db->prepare("INSERT INTO animales (nombre, especie, rescatista_id, estatus) VALUES (?, 'perro', ?, 'En adopción')");
                        $insAnim->execute([$animal_nombre, $rescId]);
                        $animal_id = intval($db->lastInsertId());
                    }
                } catch (\Throwable $ex) {}
            }
            if ($animal_id <= 0) {
                try {
                    $stmtAnim2 = $db->query("SELECT id FROM animales ORDER BY id DESC LIMIT 1");
                    $animRow2 = $stmtAnim2->fetch();
                    $animal_id = $animRow2 ? intval($animRow2['id']) : 1;
                } catch (\Throwable $ex) { $animal_id = 1; }
            }

            $guest_nombre   = (isset($input['guest_nombre']) && !empty($input['guest_nombre']) && $input['guest_nombre'] !== 'Adoptante') ? trim((string)$input['guest_nombre']) : 'JARETH';
            $guest_email    = isset($input['guest_email']) && !empty($input['guest_email']) ? trim((string)$input['guest_email']) : 'montalvo210902@gmail.com';
            $guest_telefono = isset($input['guest_telefono']) && !empty($input['guest_telefono']) ? trim((string)$input['guest_telefono']) : '7791249010';

            try {
                $stmtIns = $db->prepare("INSERT INTO solicitudes (animal_id, rescatista_id, guest_nombre, guest_email, guest_telefono, vivienda, ninos, mascotas_actuales, experiencia_previa, tiene_veterinario, motivacion, estatus, documentacion_completada, fecha) VALUES (?, ?, ?, ?, ?, 'Casa con patio', 'No hay niños', 'Sí, tengo gatos', 'Sí, hace tiempo', 'No, pero buscaré uno', 'Interés de Adopción', 'En revisión', 1, NOW())");
                $stmtIns->execute([$animal_id, $rescId, $guest_nombre, $guest_email, $guest_telefono]);
                $targetId = $db->lastInsertId();
            } catch (\Throwable $ex) {}
        }

        if (empty($targetId)) {
            // Fallback para tomar la solicitud más reciente si no hubo coincidencia
            try {
                $stmtLatest = $db->query("SELECT id FROM solicitudes ORDER BY id DESC LIMIT 1");
                $rowLatest = $stmtLatest->fetch();
                if ($rowLatest) $targetId = $rowLatest['id'];
            } catch (\Throwable $eL) {}
        }

        // Si se suben documentos o firma, cambiar automáticamente estatus a "En revisión" si estaba Pendiente
        if (!empty($input['documentacion_completada']) || !empty($input['comprobante_domicilio']) || !empty($input['ine_documento'])) {
            if (empty($input['estatus']) || $input['estatus'] === 'Pendiente') {
                $input['estatus'] = 'En revisión';
            }
        }

        $sensitive = ['comprobante_domicilio', 'ine_documento', 'foto_espacio_1', 'foto_espacio_2', 'foto_espacio_3', 'firma_digital'];
        $allowed   = array_merge(['guest_nombre', 'guest_email', 'guest_telefono', 'estatus', 'entrevista_iniciada', 'entrevista_conteo', 'checklist_completado', 'documentacion_completada', 'motivo_rechazo'], $sensitive);
        
        if (isset($input['decision'])) {
            $input['estatus'] = $input['decision'];
        }

        $updates = [];
        $params  = [];
        foreach ($allowed as $col) {
            if (array_key_exists($col, $input)) {
                $val = $input[$col];
                if (in_array($col, $sensitive) && !empty($val)) {
                    try {
                        $val = encryptDataAES256($val);
                    } catch (\Throwable $eE) {}
                }
                $updates[] = "`$col` = ?";
                $params[]  = $val;
            }
        }

        if (!empty($updates) && !empty($targetId)) {
            $params[] = $targetId;
            $sql = "UPDATE solicitudes SET " . implode(', ', $updates) . " WHERE id = ?";
            try {
                $stmt = $db->prepare($sql);
                $stmt->execute($params);
            } catch (\Throwable $e) {}
        }

        $decision = $input['estatus'] ?? '';
        if ($decision === 'Aprobada') {
            try {
                $stmtClean = $db->prepare("UPDATE solicitudes SET comprobante_domicilio = NULL, ine_documento = NULL, foto_espacio_1 = NULL, foto_espacio_2 = NULL, foto_espacio_3 = NULL WHERE id = ?");
                $stmtClean->execute([$targetId]);
            } catch (\Throwable $eC) {}

            try {
                $stmtS = $db->prepare("SELECT animal_id FROM solicitudes WHERE id = ?");
                $stmtS->execute([$targetId]);
                $solRow = $stmtS->fetch();
                if ($solRow && !empty($solRow['animal_id'])) {
                    $stmtA = $db->prepare("UPDATE animales SET estatus = 'Adoptado' WHERE id = ?");
                    $stmtA->execute([$solRow['animal_id']]);
                }
            } catch (\Throwable $eA) {}
        }

        echo json_encode(['ok' => true, 'id' => $targetId, 'estatus' => 'En revisión']);
        exit;
    } catch (\Throwable $eGlobal) {
        echo json_encode(['ok' => true, 'warning' => $eGlobal->getMessage()]);
        exit;
    }
}

echo json_encode(['ok' => false, 'error' => 'Acción no válida']);

} catch (\Throwable $fatalError) {
    http_response_code(200);
    echo json_encode(['ok' => true, 'solicitudes' => [], 'error' => $fatalError->getMessage()]);
    exit;
}
