-- Estructura de la Base de Datos para DoGood (teotekco_dogood)

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `rol` ENUM('admin', 'rescatista', 'usuario') NOT NULL DEFAULT 'usuario',
  `telefono` VARCHAR(30) DEFAULT NULL,
  `abierto_a_opciones` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `animales` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `especie` VARCHAR(20) NOT NULL DEFAULT 'perro',
  `sexo` VARCHAR(10) NOT NULL DEFAULT 'Hembra',
  `talla` VARCHAR(20) NOT NULL DEFAULT 'mediano',
  `peso` VARCHAR(20) DEFAULT NULL,
  `edad` INT DEFAULT NULL,
  `caracter` VARCHAR(100) DEFAULT NULL,
  `historia` TEXT DEFAULT NULL,
  `raza` VARCHAR(100) DEFAULT 'Mestizo / Criollo',
  `rescatista_id` INT NOT NULL,
  `emoji` VARCHAR(20) DEFAULT '🐾',
  `color` VARCHAR(100) DEFAULT NULL,
  `estatus` ENUM('En adopción', 'En proceso', 'Adoptado') NOT NULL DEFAULT 'En adopción',
  `foto_url` TEXT DEFAULT NULL,
  `cuota` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `aplica_cuota` TINYINT(1) NOT NULL DEFAULT 0,
  `desglose_cuota` TEXT DEFAULT NULL,
  `desparasitado` TINYINT(1) NOT NULL DEFAULT 1,
  `vacunas` VARCHAR(255) DEFAULT 'Vacunación al día',
  `esterilizado` TINYINT(1) NOT NULL DEFAULT 1,
  `microchip` VARCHAR(100) DEFAULT NULL,
  `condicion_salud` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`rescatista_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `solicitudes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `animal_id` INT NOT NULL,
  `rescatista_id` INT NOT NULL,
  `usuario_id` INT DEFAULT NULL,
  `guest_nombre` VARCHAR(120) DEFAULT NULL,
  `guest_email` VARCHAR(150) DEFAULT NULL,
  `guest_telefono` VARCHAR(30) DEFAULT NULL,
  `vivienda` VARCHAR(100) DEFAULT NULL,
  `ninos` VARCHAR(50) DEFAULT NULL,
  `mascotas_actuales` VARCHAR(100) DEFAULT NULL,
  `experiencia_previa` VARCHAR(100) DEFAULT NULL,
  `tiene_veterinario` VARCHAR(100) DEFAULT NULL,
  `motivacion` TEXT DEFAULT NULL,
  `fotos_espacio` TEXT DEFAULT NULL,
  `pregunta_predeterminada` VARCHAR(255) DEFAULT NULL,
  `entrevista_iniciada` TINYINT(1) NOT NULL DEFAULT 0,
  `entrevista_conteo` INT NOT NULL DEFAULT 0,
  `checklist_completado` TINYINT(1) NOT NULL DEFAULT 0,
  `documentacion_completada` TINYINT(1) NOT NULL DEFAULT 0,
  `comprobante_domicilio` TEXT DEFAULT NULL,
  `ine_documento` TEXT DEFAULT NULL,
  `foto_espacio_1` TEXT DEFAULT NULL,
  `foto_espacio_2` TEXT DEFAULT NULL,
  `foto_espacio_3` TEXT DEFAULT NULL,
  `firma_digital` TEXT DEFAULT NULL,
  `estatus` ENUM('Pendiente', 'En revisión', 'En conversación', 'Aprobada', 'Rechazada') NOT NULL DEFAULT 'Pendiente',
  `fecha` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`animal_id`) REFERENCES `animales`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`rescatista_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `seguimiento` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `animal_id` INT NOT NULL,
  `meses` INT NOT NULL DEFAULT 3,
  `comentario` TEXT NOT NULL,
  `foto_url` TEXT DEFAULT NULL,
  `fecha` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`animal_id`) REFERENCES `animales`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usuarios iniciales
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `telefono`, `abierto_a_opciones`) VALUES
(1, 'Admin DoGood', 'dogood@teotek.com.mx', '$2y$10$eE08X6U.0Yj1B8k6p3bZ..609pT71/z82V1k4X7Z09K4Z7X09K4Z7', 'admin', '5512345678', 0),
(2, 'Refugio Demo', 'refugio@dogood.mx', '$2y$10$eE08X6U.0Yj1B8k6p3bZ..609pT71/z82V1k4X7Z09K4Z7X09K4Z7', 'rescatista', '5500000000', 0),
(3, 'Carlos Adoptante', 'carlos@gmail.com', '$2y$10$eE08X6U.0Yj1B8k6p3bZ..609pT71/z82V1k4X7Z09K4Z7X09K4Z7', 'usuario', '5511111111', 1)
ON DUPLICATE KEY UPDATE `nombre`=`nombre`;

-- Animales iniciales
INSERT INTO `animales` (`id`, `nombre`, `especie`, `sexo`, `talla`, `peso`, `edad`, `caracter`, `historia`, `raza`, `rescatista_id`, `emoji`, `color`, `estatus`, `cuota`) VALUES
(9001, 'Moka', 'perro', 'Hembra', 'mediano', '14 kg', 2, 'Juguetón/a', 'Rescatada en colonia vecina. Ya socializa con niños y pasea sin jalar.', 'Mestizo / Criollo', 2, '🐕', 'linear-gradient(135deg,#1653BB 0%,#4C78CC 100%)', 'En adopción', 0.00),
(9002, 'Nina', 'gato', 'Hembra', 'pequeño', '4 kg', 1, 'Cariñoso/a', 'Le encanta dormir al sol y convive perfecto en departamento.', 'Siamés', 2, '🐈', 'linear-gradient(135deg,#1653BB 0%,#F0C21D 100%)', 'En adopción', 500.00),
(9003, 'Rocco', 'perro', 'Macho', 'grande', '22 kg', 4, 'Tranquilo/a', 'Es noble y obediente. Busca familia con espacio para paseos diarios.', 'Labrador Retriever', 2, '🐕', 'linear-gradient(135deg,#0F45A2 0%,#1653BB 100%)', 'En adopción', 0.00),
(9004, 'Luna', 'gato', 'Hembra', 'pequeño', '3 kg', 3, 'Independiente', 'Muy limpia y curiosa. Compatible con rutina de oficina.', 'British Shorthair', 2, '🐈', 'linear-gradient(135deg,#2B2B2B 0%,#616161 100%)', 'En adopción', 300.00)
ON DUPLICATE KEY UPDATE `nombre`=`nombre`;
