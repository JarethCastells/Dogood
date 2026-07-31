<?php
// share.php — Script servidor para previsualizaciones de Facebook / WhatsApp / Twitter
$pet_id = isset($_GET['pet']) ? intval($_GET['pet']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);

// Default metadata
$title = "¡Adopta una mascota en DoGood! 🐾";
$description = "Encuentra a tu compañero ideal en adopción responsable. Refugios y rescatistas verificados en México.";
$image = "https://dogood.mx/brand/logo-primary-trim.png";
$url = "https://" . ($_SERVER['HTTP_HOST'] ?? 'dogood.mx') . "/adoptar" . ($pet_id ? "?pet=" . $pet_id : "");

// Demo backup data
if ($pet_id > 0) {
    $demo_animals = [
        9001 => ["nombre" => "Moka", "raza" => "Mestizo / Criollo", "especie" => "Perro", "sexo" => "Hembra", "historia" => "Rescatada en colonia vecina. Ya socializa con niños y pasea sin jalar.", "rescatista" => "Refugio Demo"],
        9002 => ["nombre" => "Nina", "raza" => "Siamés", "especie" => "Gato", "sexo" => "Hembra", "historia" => "Le encanta dormir al sol y convive perfecto en departamento.", "rescatista" => "Refugio Demo"],
        9003 => ["nombre" => "Rocco", "raza" => "Labrador Retriever", "especie" => "Perro", "sexo" => "Macho", "historia" => "Es noble y obediente. Busca familia con espacio para paseos diarios.", "rescatista" => "Casa Huellas"],
        9004 => ["nombre" => "Luna", "raza" => "British Shorthair", "especie" => "Gato", "sexo" => "Hembra", "historia" => "Muy limpia y curiosa. Compatible con rutina de oficina.", "rescatista" => "Casa Huellas"],
    ];

    if (isset($demo_animals[$pet_id])) {
        $p = $demo_animals[$pet_id];
        $title = "¡Adopta a " . $p['nombre'] . "! 🐾 (" . $p['raza'] . ") — DoGood";
        $description = $p['nombre'] . " (" . $p['sexo'] . ") está en adopción responsable. " . $p['historia'] . " — Refugio: " . $p['rescatista'];
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title><?php echo htmlspecialchars($title); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($description); ?>">

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="DoGood">
    <meta property="og:title" content="<?php echo htmlspecialchars($title); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($description); ?>">
    <meta property="og:image" content="<?php echo htmlspecialchars($image); ?>">
    <meta property="og:url" content="<?php echo htmlspecialchars($url); ?>">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($title); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($description); ?>">
    <meta name="twitter:image" content="<?php echo htmlspecialchars($image); ?>">

    <script>
        // Redirect regular browser users directly to the SPA adoption page
        window.location.href = "<?php echo $url; ?>";
    </script>
</head>
<body>
    <p>Redirigiendo a <a href="<?php echo $url; ?>"><?php echo htmlspecialchars($title); ?></a>...</p>
</body>
</html>
