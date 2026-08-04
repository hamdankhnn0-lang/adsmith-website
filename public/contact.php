<?php
/**
 * Adsmith contact endpoint.
 *
 * Takes the JSON the contact form posts, checks it, and emails it to the
 * address below. Designed for cPanel style shared hosting, where PHP and
 * mail() are already available, so no third party form service is needed.
 *
 * Upload this alongside index.html in public_html.
 *
 * ---------------------------------------------------------------------------
 * BEFORE THIS WORKS: the TO_ADDRESS mailbox has to exist. Create it in cPanel
 * under Email Accounts. Mail sent to an address that does not exist is dropped
 * silently and you will never see the enquiry.
 * ---------------------------------------------------------------------------
 */

declare(strict_types=1);

/** Where enquiries are delivered. */
const TO_ADDRESS = 'enquiries@adsmithsolutions.com';

/**
 * The envelope sender. This must be an address on your own domain or the mail
 * will be rejected as spoofing. It is not where replies go; Reply-To handles
 * that, and is set to whoever filled in the form.
 */
const FROM_ADDRESS = 'website@adsmithsolutions.com';

const SITE_NAME = 'Adsmith';
const MAX_BODY_BYTES = 20000;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/** Reply with a JSON status and stop. */
function respond(int $code, array $payload): never
{
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    respond(204, []);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Use POST.']);
}

$raw = file_get_contents('php://input');

if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'error' => 'That message is too long.']);
}

$data = json_decode($raw, true);

// The form also works without JavaScript, which posts as a normal form.
if (!is_array($data)) {
    $data = $_POST;
}

$field = static fn(string $key): string => trim((string) ($data[$key] ?? ''));

$name = $field('name');
$email = $field('email');
$company = $field('company');
$service = $field('service');
$message = $field('message');
$trap = $field('website');

// Bots fill the hidden field. Accept it so they do not learn they were caught,
// then drop it on the floor.
if ($trap !== '') {
    respond(200, ['ok' => true]);
}

$errors = [];
if ($name === '') {
    $errors['name'] = 'Please tell us your name.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'A valid email address is required.';
}
if (mb_strlen($message) < 10) {
    $errors['message'] = 'A sentence or two about your goals helps us prepare.';
}

if ($errors !== []) {
    respond(422, ['ok' => false, 'errors' => $errors]);
}

// Header injection guard. Anything with a newline in it never reaches a header.
$clean = static fn(string $value): string => str_replace(["\r", "\n", "%0a", "%0d"], ' ', $value);

$safeName = $clean($name);
$safeEmail = $clean($email);

$lines = [
    'New enquiry from the website',
    '',
    'Name:      ' . $safeName,
    'Email:     ' . $safeEmail,
    'Business:  ' . ($company !== '' ? $clean($company) : 'Not given'),
    'Interest:  ' . ($service !== '' ? $clean($service) : 'Not specified'),
    'Received:  ' . gmdate('D, d M Y H:i') . ' UTC',
    'IP:        ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'),
    '',
    'Message',
    '-------',
    $message,
    '',
    'Reply straight to this email to answer ' . $safeName . '.',
];

$subject = sprintf('[%s] Enquiry from %s', SITE_NAME, $safeName);

$headers = implode("\r\n", [
    'From: ' . SITE_NAME . ' Website <' . FROM_ADDRESS . '>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    'X-Mailer: PHP/' . phpversion(),
]);

$sent = @mail(
    TO_ADDRESS,
    $subject,
    implode("\n", $lines),
    $headers,
    '-f' . FROM_ADDRESS
);

if (!$sent) {
    // Keep a copy on disk so nothing is lost while mail is misconfigured.
    @file_put_contents(
        __DIR__ . '/.enquiries.log',
        gmdate('c') . ' ' . json_encode(
            compact('name', 'email', 'company', 'service', 'message'),
            JSON_UNESCAPED_UNICODE
        ) . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );

    respond(502, ['ok' => false, 'error' => 'The mail server did not accept the message.']);
}

respond(200, ['ok' => true]);
