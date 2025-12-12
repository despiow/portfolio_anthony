<?php
// send_email.php

// Définir le header pour retourner du JSON
header('Content-Type: application/json');

// Assurez-vous que les erreurs sont affichées pendant le développement
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

// Chargez le fichier autoload.php de Composer
require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Vérifiez si le formulaire a été soumis
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérez et nettoyez les données du formulaire
    $firstname = isset($_POST["firstname"]) ? trim($_POST["firstname"]) : '';
    $lastname = isset($_POST["lastname"]) ? trim($_POST["lastname"]) : '';
    $email_from = isset($_POST["email_from"]) ? trim($_POST["email_from"]) : '';
    $subject = isset($_POST["subject"]) ? trim($_POST["subject"]) : '';
    $message = isset($_POST["message"]) ? trim($_POST["message"]) : '';

    // Validation côté serveur
    $errors = [];
    if (empty($firstname)) {
        $errors[] = "Le prénom est obligatoire.";
    }
    if (empty($lastname)) {
        $errors[] = "Le nom est obligatoire.";
    }
    if (empty($email_from) || !filter_var($email_from, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "L'adresse email est invalide.";
    }
    if (empty($subject)) {
        $errors[] = "Le sujet est obligatoire.";
    }
    if (empty($message)) {
        $errors[] = "Le message est obligatoire.";
    }

    // Si des erreurs existent, les retourner
    if (!empty($errors)) {
        echo json_encode([
            'success' => false,
            'message' => implode(' ', $errors)
        ]);
        exit();
    }

    // Créez une instance de PHPMailer
    $mail = new PHPMailer(true);
    try {
        // Paramètres du serveur SMTP
        $mail->isSMTP();
        $mail->Host = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = getenv('SMTP_USER') ?: '';
        $mail->Password = getenv('SMTP_PASSWORD') ?: '';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = getenv('SMTP_PORT') ?: 465;
        $mail->CharSet = 'UTF-8';

        // Paramètres du message
        $mail->setFrom(getenv('SMTP_USER') ?: $email_from, 'Contact Portfolio - ' . $firstname . ' ' . $lastname);
        $mail->addAddress(getenv('SMTP_TO') ?: 'contact@example.com');
        $mail->addReplyTo($email_from, $firstname . ' ' . $lastname);

        // Contenu du message
        $mail->isHTML(true);
        $mail->Subject = 'Contact Portfolio: ' . $subject;
        $mail->Body = "
            <h2>Nouveau message depuis le portfolio</h2>
            <p><strong>De:</strong> {$firstname} {$lastname} ({$email_from})</p>
            <p><strong>Sujet:</strong> {$subject}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>" . nl2br(htmlspecialchars($message)) . "</p>
        ";
        $mail->AltBody = "De: {$firstname} {$lastname} ({$email_from})\nSujet: {$subject}\n\nMessage:\n{$message}";

        // Envoyer l'e-mail
        $mail->send();

        // Retourner une réponse JSON de succès
        echo json_encode([
            'success' => true,
            'message' => 'Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.'
        ]);
        exit();
    } catch (Exception $e) {
        // En cas d'erreur, retourner une réponse JSON d'erreur
        echo json_encode([
            'success' => false,
            'message' => 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.'
        ]);
        exit();
    }
} else {
    // Si le formulaire n'a pas été soumis correctement
    echo json_encode([
        'success' => false,
        'message' => 'Méthode de requête invalide.'
    ]);
    exit();
}
?>
