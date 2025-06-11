<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get the raw POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
if (empty($data['name']) || empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name and email are required']);
    exit;
}

// Sanitize input data
$name = htmlspecialchars(trim($data['name']));
$email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
$project_type = htmlspecialchars(trim($data['project_type'] ?? 'Not specified'));
$requirements = htmlspecialchars(trim($data['requirements'] ?? 'No additional requirements specified'));

// Validate email
if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Email configuration
$to = 'von@vonsit.com';
$subject = "New Quote Request from " . $name;

// Email content
$message = "
Hello vonsIT Team,

You have received a new quote request:

Name: $name
Email: $email
Project Type: $project_type

Requirements:
$requirements

Please respond within 24 hours.

Best regards,
vonsIT Contact Form
";

// Email headers
$headers = [
    'From: noreply@vonsit.com',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

// Send email
$success = mail($to, $subject, $message, implode("\r\n", $headers));

// Return response
if ($success) {
    echo json_encode([
        'success' => true, 
        'message' => "✅ Thank you, $name! Your quote request has been sent successfully. We'll get back to you within 24 hours at $email."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Sorry, there was an error sending your request. Please try again or contact us directly at von@vonsit.com'
    ]);
}
?> 