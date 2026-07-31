<?php
// mailer.php — Envío de correos automatizados por SMTP (Neubox) con fallbacks robustos

define('SMTP_HOST', 'mail.teotek.com.mx');
define('SMTP_USER', 'dogood@teotek.com.mx');
define('SMTP_PASS', 'sjSn!q^e!KA1[7pz');
define('SMTP_FROM_NAME', 'DoGood Adopciones');

/**
 * Enviar correo HTML de bienvenida al nuevo Rescatista
 */
function sendWelcomeEmailSMTP($toEmail, $toName, $tempPassword = '') {
    $subject = "¡Bienvenido a DoGood! Tu cuenta de Rescatista 🐾";
    $htmlContent = getWelcomeEmailHTML($toName, $toEmail, $tempPassword);

    // 1. Intentar Socket SMTP 587 (TLS)
    if (sendSocketSMTP($toEmail, $toName, $subject, $htmlContent, 587, 'tls')) {
        return true;
    }

    // 2. Intentar Socket SMTP 465 (SSL)
    if (sendSocketSMTP($toEmail, $toName, $subject, $htmlContent, 465, 'ssl')) {
        return true;
    }

    // 3. Fallback nativo mail() de PHP
    $headers  = "Date: " . date("r") . "\r\n";
    $headers .= "Message-ID: <" . time() . "." . md5($toEmail) . "@teotek.com.mx>\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . SMTP_FROM_NAME . " <" . SMTP_USER . ">\r\n";
    $headers .= "Reply-To: " . SMTP_USER . "\r\n";
    $headers .= "X-Mailer: DoGood PHP Mailer\r\n";

    return @mail($toEmail, "=?UTF-8?B?" . base64_encode($subject) . "?=", $htmlContent, $headers);
}

function sendSocketSMTP($toEmail, $toName, $subject, $htmlBody, $port = 587, $type = 'tls') {
    $timeout = 10;
    $host = ($type === 'ssl') ? 'ssl://' . SMTP_HOST : SMTP_HOST;
    $socket = @fsockopen($host, $port, $errno, $errstr, $timeout);
    
    if (!$socket) {
        return false;
    }

    $read = function() use ($socket) {
        $res = '';
        while ($line = fgets($socket, 512)) {
            $res .= $line;
            if (substr($line, 3, 1) === ' ') break;
        }
        return $res;
    };

    $send = function($cmd) use ($socket, $read) {
        fputs($socket, $cmd . "\r\n");
        return $read();
    };

    try {
        $banner = $read(); // banner
        if (empty($banner)) { fclose($socket); return false; }

        $send("EHLO " . gethostname());

        if ($type === 'tls') {
            $send("STARTTLS");
            @stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT | STREAM_CRYPTO_METHOD_TLS_CLIENT);
            $send("EHLO " . gethostname());
        }

        $send("AUTH LOGIN");
        $send(base64_encode(SMTP_USER));
        $resAuth = $send(base64_encode(SMTP_PASS));

        if (strpos($resAuth, '235') === false && strpos($resAuth, '250') === false) {
            fclose($socket);
            return false;
        }

        $send("MAIL FROM: <" . SMTP_USER . ">");
        $send("RCPT TO: <$toEmail>");
        $send("DATA");

        $headers  = "Date: " . date("r") . "\r\n";
        $headers .= "Message-ID: <" . time() . "." . md5($toEmail) . "@teotek.com.mx>\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: " . SMTP_FROM_NAME . " <" . SMTP_USER . ">\r\n";
        $headers .= "Reply-To: " . SMTP_USER . "\r\n";
        $headers .= "To: $toName <$toEmail>\r\n";
        $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
        $headers .= "X-Mailer: DoGood PHP Mailer\r\n";

        $cleanBody = str_replace(["\r\n", "\r"], "\n", $htmlBody);
        $cleanBody = preg_replace('/^\./m', '..', $cleanBody);
        $cleanBody = str_replace("\n", "\r\n", $cleanBody);

        $rawEmail = $headers . "\r\n" . $cleanBody . "\r\n.";
        $response = $send($rawEmail);
        $send("QUIT");
        fclose($socket);

        return strpos($response, '250') !== false;
    } catch (\Throwable $e) {
        @fclose($socket);
        return false;
    }
}

/**
 * Plantilla de correo HTML profesional con diseño DoGood
 */
function getWelcomeEmailHTML($name, $email, $password) {
    $loginUrl  = "https://teotek.com.mx";
    $safeName  = htmlspecialchars($name);
    $safeEmail = htmlspecialchars($email);
    $passText  = !empty($password) ? htmlspecialchars($password) : "(La contraseña que asignaste)";

    return <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Bienvenido a DoGood!</title>
    <style>
        body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #FFF8DF; margin: 0; padding: 24px; color: #111111; }
        .email-card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1.5px solid #DDD5D6; overflow: hidden; box-shadow: 0 12px 40px rgba(22,83,187,0.12); }
        .header { background: linear-gradient(135deg, #1653BB 0%, #0F45A2 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
        .body { padding: 32px 30px; }
        .greeting { font-size: 20px; font-weight: 800; color: #1653BB; margin-bottom: 12px; }
        .p-text { font-size: 15px; line-height: 1.7; color: #3C3A3A; margin-bottom: 20px; }
        .cred-box { background: #FFF7DA; border: 1.5px solid #F0C21D; border-radius: 16px; padding: 20px; margin: 24px 0; }
        .cred-item { font-size: 14px; margin-bottom: 10px; color: #111111; }
        .cred-item strong { color: #1653BB; min-width: 140px; display: inline-block; }
        .btn-cta { display: block; width: 100%; max-width: 320px; margin: 28px auto 10px; padding: 14px 24px; background: #1653BB; color: #ffffff !important; text-decoration: none; text-align: center; font-weight: 800; font-size: 15px; border-radius: 999px; box-shadow: 0 8px 24px rgba(22,83,187,0.28); }
        .footer { background: #111111; color: rgba(255,255,255,0.6); padding: 24px 30px; text-align: center; font-size: 13px; line-height: 1.6; }
        .footer a { color: #F8D868; text-decoration: none; font-weight: 700; }
    </style>
</head>
<body>
    <div class="email-card">
        <div class="header">
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto 12px auto;">
                <tr>
                    <td align="center" valign="middle" style="background:#ffffff; border-radius:50%; width:64px; height:64px; text-align:center; font-size:32px; line-height:64px; box-shadow:0 6px 16px rgba(0,0,0,0.2);">
                        🐾
                    </td>
                </tr>
            </table>
            <div style="font-family:Arial, sans-serif; font-size:28px; font-weight:800; letter-spacing:1.5px; color:#ffffff; margin-bottom:2px;">
                DOGOOD
            </div>
            <div style="font-size:13px; color:rgba(255,255,255,0.88); font-weight:700; text-transform:uppercase; letter-spacing:1px;">
                Plataforma de Adopción Responsable de Mascotas
            </div>
        </div>
        <div class="body">
            <div class="greeting">¡Hola, {$safeName}! 🐾</div>
            <p class="p-text">
                Te damos la bienvenida a <strong>DoGood</strong>. Tu cuenta ha sido activada y ya puedes acceder a tu panel de administración.
            </p>

            <div class="cred-box">
                <div style="font-size:13px; font-weight:800; color:#1653BB; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;">
                    🔑 Tus Credenciales de Acceso
                </div>
                <div class="cred-item">
                    <strong>Titular de la cuenta:</strong> {$safeName}
                </div>
                <div class="cred-item">
                    <strong>Correo de acceso:</strong> <span style="color:#1653BB; font-weight:700;">{$safeEmail}</span>
                </div>
                <div class="cred-item" style="margin-bottom:0;">
                    <strong>Contraseña asignada:</strong> <span style="background:#ffffff; padding:4px 10px; border-radius:6px; border:1px solid #DDD5D6; font-family:monospace; font-weight:700; color:#111111;">{$passText}</span>
                </div>
            </div>

            <p class="p-text">
                Desde tu panel podrás gestionar solicitudes de adopción, publicar rescatados y realizar seguimiento a los procesos de adopción de manera segura.
            </p>
        </div>
        <div class="footer">
            <strong>DoGood Adopciones México</strong><br>
            Impulsando el bienestar animal y la adopción responsable.<br>
            Soporte técnico: <a href="mailto:dogood@teotek.com.mx">dogood@teotek.com.mx</a>
        </div>
    </div>
</body>
</html>
HTML;
}
