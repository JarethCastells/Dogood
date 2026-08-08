<?php
// animales.php — Catálogo de animales
require_once __DIR__ . '/config.php';
setupCORS();

$action = $_GET['action'] ?? 'list';
$input  = json_decode(file_get_contents('php://input'), true) ?? [];
$db     = getDBConnection();

if ($action === 'list') {
    $rescatista_id = isset($_GET['rescatista_id']) ? intval($_GET['rescatista_id']) : 0;
    if ($rescatista_id > 0) {
        $sql = "SELECT a.*, u.nombre AS rescatista_nombre, u.telefono AS rescatista_tel 
                FROM animales a 
                LEFT JOIN usuarios u ON a.rescatista_id = u.id 
                WHERE a.rescatista_id = ?
                ORDER BY a.id DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute([$rescatista_id]);
    } else {
        $sql = "SELECT a.*, u.nombre AS rescatista_nombre, u.telefono AS rescatista_tel 
                FROM animales a 
                LEFT JOIN usuarios u ON a.rescatista_id = u.id 
                ORDER BY a.id DESC";
        $stmt = $db->query($sql);
    }
    $animals = $stmt->fetchAll();

    echo json_encode(['ok' => true, 'animals' => $animals]);
    exit;
}

if ($action === 'create') {
    $nombre          = trim($input['nombre'] ?? '');
    $especie         = $input['especie'] ?? 'perro';
    $sexo            = $input['sexo'] ?? 'Hembra';
    $talla           = $input['talla'] ?? 'mediano';
    $peso            = trim($input['peso'] ?? '');
    $edad            = !empty($input['edad']) ? intval($input['edad']) : null;
    $caracter        = trim($input['caracter'] ?? '');
    $historia        = trim($input['historia'] ?? '');
    $raza            = trim($input['raza'] ?? 'Mestizo / Criollo');
    $rescatista_id   = intval($input['rescatista_id'] ?? 1);
    $emoji           = $input['emoji'] ?? '🐾';
    $color           = $input['color'] ?? 'linear-gradient(135deg,#1653BB 0%,#4C78CC 100%)';
    $foto_url        = trim($input['foto_url'] ?? '');
    $cuota           = floatval($input['cuota'] ?? 0);
    $aplica_cuota    = isset($input['aplica_cuota']) ? ($input['aplica_cuota'] ? 1 : 0) : ($cuota > 0 ? 1 : 0);
    $desglose_cuota  = trim($input['desglose_cuota'] ?? 'Esterilización, Vacunas iniciales, Desparasitación');
    $desparasitado   = isset($input['desparasitado']) ? ($input['desparasitado'] ? 1 : 0) : 1;
    $vacunas         = trim($input['vacunas'] ?? 'Vacunación al día');
    $esterilizado    = isset($input['esterilizado']) ? ($input['esterilizado'] ? 1 : 0) : 1;
    $microchip       = trim($input['microchip'] ?? '');
    $condicion_salud = trim($input['condicion_salud'] ?? 'Saludable y en perfecto estado');

    if (empty($nombre) || empty($historia)) {
        echo json_encode(['ok' => false, 'error' => 'Nombre e historia son obligatorios']);
        exit;
    }

    // Verificar que el rescatista_id exista en la tabla usuarios
    $checkU = $db->prepare("SELECT id FROM usuarios WHERE id = ?");
    $checkU->execute([$rescatista_id]);
    if (!$checkU->fetch()) {
        $firstU = $db->query("SELECT id FROM usuarios ORDER BY id ASC LIMIT 1")->fetch();
        $rescatista_id = $firstU ? intval($firstU['id']) : 1;
    }

    try {
        $sql = "INSERT INTO animales (nombre, especie, sexo, talla, peso, edad, caracter, historia, raza, rescatista_id, emoji, color, estatus, foto_url, cuota, aplica_cuota, desglose_cuota, desparasitado, vacunas, esterilizado, microchip, condicion_salud) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'En adopción', ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($sql);
        $stmt->execute([$nombre, $especie, $sexo, $talla, $peso, $edad, $caracter, $historia, $raza, $rescatista_id, $emoji, $color, $foto_url, $cuota, $aplica_cuota, $desglose_cuota, $desparasitado, $vacunas, $esterilizado, $microchip, $condicion_salud]);

        echo json_encode(['ok' => true, 'id' => $db->lastInsertId()]);
    } catch (\Throwable $e) {
        // Fallback si la tabla no se ha migrado aún
        $sql = "INSERT INTO animales (nombre, especie, sexo, talla, peso, edad, caracter, historia, raza, rescatista_id, emoji, color, estatus, foto_url, cuota) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'En adopción', ?, ?)";
        $stmt = $db->prepare($sql);
        $stmt->execute([$nombre, $especie, $sexo, $talla, $peso, $edad, $caracter, $historia, $raza, $rescatista_id, $emoji, $color, $foto_url, $cuota]);
        echo json_encode(['ok' => true, 'id' => $db->lastInsertId()]);
    }
    exit;
}

if ($action === 'update') {
    $id              = intval($input['id'] ?? 0);
    $nombre          = trim($input['nombre'] ?? '');
    $raza            = trim($input['raza'] ?? '');
    $estatus         = $input['estatus'] ?? 'En adopción';
    $historia        = trim($input['historia'] ?? '');
    $peso            = trim($input['peso'] ?? '');
    $edad            = trim($input['edad'] ?? '');
    $cuota           = floatval($input['cuota'] ?? 0);
    $foto_url        = trim($input['foto_url'] ?? '');
    $aplica_cuota    = isset($input['aplica_cuota']) ? ($input['aplica_cuota'] ? 1 : 0) : ($cuota > 0 ? 1 : 0);
    $desglose_cuota  = trim($input['desglose_cuota'] ?? '');
    $desparasitado   = isset($input['desparasitado']) ? ($input['desparasitado'] ? 1 : 0) : 1;
    $vacunas         = trim($input['vacunas'] ?? '');
    $esterilizado    = isset($input['esterilizado']) ? ($input['esterilizado'] ? 1 : 0) : 1;
    $microchip       = trim($input['microchip'] ?? '');
    $condicion_salud = trim($input['condicion_salud'] ?? '');

    if ($id <= 0) {
        echo json_encode(['ok' => false, 'error' => 'ID inválido']);
        exit;
    }

    if ($db) {
        try {
            $sql = "UPDATE animales SET 
                    nombre = IF(? != '', ?, nombre), 
                    raza = IF(? != '', ?, raza), 
                    estatus = ?, 
                    historia = IF(? != '', ?, historia),
                    peso = IF(? != '', ?, peso),
                    edad = IF(? != '', ?, edad),
                    cuota = ?,
                    aplica_cuota = ?,
                    desglose_cuota = IF(? != '', ?, desglose_cuota),
                    desparasitado = ?,
                    vacunas = IF(? != '', ?, vacunas),
                    esterilizado = ?,
                    microchip = IF(? != '', ?, microchip),
                    condicion_salud = IF(? != '', ?, condicion_salud),
                    foto_url = IF(? != '', ?, foto_url) 
                    WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute([
                $nombre, $nombre, $raza, $raza, $estatus, $historia, $historia, 
                $peso, $peso, $edad, $edad, $cuota, $aplica_cuota, 
                $desglose_cuota, $desglose_cuota, $desparasitado, $vacunas, $vacunas, 
                $esterilizado, $microchip, $microchip, $condicion_salud, $condicion_salud, 
                $foto_url, $foto_url, $id
            ]);
        } catch (\Throwable $e) {
            $sql = "UPDATE animales SET 
                    nombre = IF(? != '', ?, nombre), 
                    raza = IF(? != '', ?, raza), 
                    estatus = ?, 
                    historia = IF(? != '', ?, historia),
                    peso = IF(? != '', ?, peso),
                    edad = IF(? != '', ?, edad),
                    cuota = ?, 
                    foto_url = IF(? != '', ?, foto_url) 
                    WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute([$nombre, $nombre, $raza, $raza, $estatus, $historia, $historia, $peso, $peso, $edad, $edad, $cuota, $foto_url, $foto_url, $id]);
        }
    }

    echo json_encode(['ok' => true]);
    exit;
}

if ($action === 'delete') {
    $id = intval($input['id'] ?? 0);
    if ($id <= 0) {
        echo json_encode(['ok' => false, 'error' => 'ID inválido']);
        exit;
    }

    $stmt = $db->prepare("DELETE FROM animales WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['ok' => true]);
    exit;
}

echo json_encode(['ok' => false, 'error' => 'Acción no válida']);
