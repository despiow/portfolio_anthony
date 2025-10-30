<?php
// send_email.php

// Assurez-vous que les erreurs sont affichées pendant le développement
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Chargez le fichier autoload.php de Composer
require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Vérifiez si le formulaire a été soumis
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérez les données du formulaire
    $firstname = $_POST["firstname"];
    $lastname = $_POST["lastname"];
    $email_from = $_POST["email_from"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];

    // Créez une instance de PHPMailer
    $mail = new PHPMailer(true);
    try {
        // Paramètres du serveur SMTP
        $mail->isSMTP();
        $mail->Host = getenv('SMTP_HOST'); // Utilisez la variable d'environnement ou une valeur par défaut
        $mail->SMTPAuth = true;
        $mail->Username = getenv('SMTP_USER'); // Utilisez la variable d'environnement ou une valeur par défaut
        $mail->Password = getenv('SMTP_PASSWORD'); // Utilisez la variable d'environnement ou une valeur par défaut
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = getenv('SMTP_PORT'); // Utilisez la variable d'environnement ou une valeur par défaut

        // Paramètres du message
        $mail->setFrom(getenv('SMTP_USER'), 'Contact portfolio_anthony');
        $mail->addAddress(getenv('SMTP_TO')); // Utilisez la variable d'environnement ou une valeur par défaut
        $mail->addReplyTo($email_from);

        // Contenu du message
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;

        // Envoyer l'e-mail
        $mail->send();

        // Rediriger après l'envoi du message
        header('Location: #contact');
        exit();
    } catch (Exception $e) {
        // En cas d'erreur, rediriger vers une page d'erreur
        header('Location: #contact');
        exit();
    }
} else {
    // Si le formulaire n'a pas été soumis, rediriger vers une page d'erreur
    header('Location: message_not_sent.html');
    exit();
}
?>

<script>
    // Vérifier si le paramètre de succès est présent dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');

    // Afficher une alerte en fonction du paramètre de succès
    if (successParam === "1") {
        alert("Votre message a bien été envoyé");
    } else {
        alert("Votre message n'a pas pu être envoyé");
    }
</script>
