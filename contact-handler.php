<?php
// SMTP Email Handler for vonsIT Contact Form
// Sends emails directly through Gmail SMTP to prevent spam issues

// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS headers for security
header('Access-Control-Allow-Origin: https://vonsit.com');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['name', 'email', 'project_type', 'budget_range'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required field: ' . $field]);
        exit;
    }
}

// Sanitize inputs
$name = htmlspecialchars(trim($input['name']));
$email = filter_var(trim($input['email']), FILTER_VALIDATE_EMAIL);
$phone = htmlspecialchars(trim($input['phone'] ?? ''));
$project_type = htmlspecialchars(trim($input['project_type']));
$budget_range = htmlspecialchars(trim($input['budget_range']));
$project_details = htmlspecialchars(trim($input['project_details'] ?? ''));
$referral_source = htmlspecialchars(trim($input['referral_source'] ?? ''));
$newsletter_opt_in = isset($input['newsletter_opt_in']) && $input['newsletter_opt_in'];

// Validate email
if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Create timestamp
$timestamp = date('l, F j, Y g:i A T');

// Create email subject and body
$subject = "[QUOTE REQUEST] $project_type - $budget_range | $name";

$email_body = "
🎯 NEW QUOTE REQUEST FROM VONSIT.COM

📅 SUBMITTED: $timestamp

👤 CLIENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Name: $name
• Email: $email
• Phone: " . ($phone ?: 'Not provided') . "

💼 PROJECT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Project Type: $project_type
• Budget Range: $budget_range
• How They Found Us: " . ($referral_source ?: 'Not specified') . "
• Newsletter Opt-in: " . ($newsletter_opt_in ? 'Yes' : 'No') . "

📝 PROJECT DESCRIPTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
" . ($project_details ?: 'No additional details provided') . "

🔗 NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Review project requirements
2. Prepare detailed quote
3. Send proposal within 24 hours to: $email

---
This message was sent from vonsIT.com contact form
Generated on: $timestamp
";

// Email configuration
$to = 'von@vonsit.com';
$from_email = 'von@vonsit.com';
$from_name = 'vonsIT Contact Form';
$reply_to = $email;

// Create headers
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $from_name . ' <' . $from_email . '>',
    'Reply-To: ' . $name . ' <' . $reply_to . '>',
    'Return-Path: ' . $from_email,
    'X-Mailer: PHP/' . phpversion(),
    'X-Originating-IP: ' . $_SERVER['REMOTE_ADDR'],
    'Date: ' . date('r'),
];

// Basic spam protection
$spam_keywords = ['casino', 'viagra', 'lottery', 'winner', 'million dollars'];
$combined_text = strtolower($name . ' ' . $email . ' ' . $project_details);
foreach ($spam_keywords as $keyword) {
    if (strpos($combined_text, $keyword) !== false) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Message flagged as spam']);
        exit;
    }
}

// Rate limiting - simple IP-based (in production, use database)
$rate_limit_file = 'rate_limit_' . md5($_SERVER['REMOTE_ADDR']) . '.txt';
if (file_exists($rate_limit_file)) {
    $last_submission = filemtime($rate_limit_file);
    if (time() - $last_submission < 60) { // 1 minute cooldown
        http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Please wait before submitting another form']);
        exit;
    }
}

// Send email using PHP's mail function
// NOTE: For production, configure your server's sendmail or use SMTP library like PHPMailer
$success = mail($to, $subject, $email_body, implode("\r\n", $headers));

if ($success) {
    // Update rate limiting
    file_put_contents($rate_limit_file, time());
    
    // Log successful submission (optional)
    error_log("Quote form submitted successfully from: $email");
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => "Thank you, $name! Your quote request has been sent successfully. We'll get back to you within 24 hours at $email."
    ]);
} else {
    // Log error
    error_log("Failed to send quote form email from: $email");
    
    // Return error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email. Please contact von@vonsit.com directly.'
    ]);
}
?> 