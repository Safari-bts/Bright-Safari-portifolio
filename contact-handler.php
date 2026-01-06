<?php
/**
 * Contact Form Handler for Bright Safari Portfolio
 * Sends messages via Email and SMS
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Debug mode - set to false in production
$debug = true;

// Your email address
$your_email = "safaribright93@gmail.com";

// Twilio credentials for SMS (optional - if you want SMS notifications)
// Get these from https://www.twilio.com (free trial available)
$twilio_sid = "your_twilio_sid_here";
$twilio_token = "your_twilio_token_here";
$twilio_from = "your_twilio_number_here";
$your_phone = "+255748042678";

function validate_input($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input);
    return $input;
}

function send_email($to, $subject, $message, $headers, $debug = false) {
    if ($debug) {
        error_log("Email Debug - To: $to, Subject: $subject");
        return true;
    }
    return mail($to, $subject, $message, $headers);
}

function send_sms_twilio($to, $message, $debug = false) {
    if ($debug) {
        error_log("SMS Debug - To: $to, Message: $message");
        return true;
    }
    
    // Uncomment and configure if you set up Twilio
    /*
    $url = "https://api.twilio.com/2010-04-01/Accounts/{$GLOBALS['twilio_sid']}/Messages.json";
    
    $fields = [
        'To' => $to,
        'From' => $GLOBALS['twilio_from'],
        'Body' => $message
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_USERPWD, $GLOBALS['twilio_sid'] . ":" . $GLOBALS['twilio_token']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($fields));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return $response;
    */
    
    return false; // SMS disabled by default
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Validate required fields
        $required_fields = ['name', 'email', 'subject', 'message'];
        
        foreach ($required_fields as $field) {
            if (empty($data[$field])) {
                throw new Exception("Please fill in all required fields.");
            }
        }
        
        // Sanitize inputs
        $name = validate_input($data['name']);
        $email = validate_input($data['email']);
        $phone = isset($data['phone']) ? validate_input($data['phone']) : '';
        $subject = validate_input($data['subject']);
        $message = validate_input($data['message']);
        $copy_me = isset($data['copyMe']) && $data['copyMe'] == 'true';
        
        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Please enter a valid email address.");
        }
        
        // Email subject mapping
        $subject_map = [
            'project' => 'Project Collaboration Inquiry',
            'job' => 'Job Opportunity',
            'freelance' => 'Freelance Work Request',
            'partnership' => 'Business Partnership Inquiry',
            'question' => 'Technical Question',
            'other' => 'General Inquiry'
        ];
        
        $email_subject = isset($subject_map[$subject]) ? $subject_map[$subject] : 'New Message from Portfolio';
        
        // Email body
        $email_body = "You have received a new message from your portfolio website:\n\n";
        $email_body .= "Name: $name\n";
        $email_body .= "Email: $email\n";
        if ($phone) {
            $email_body .= "Phone: $phone\n";
        }
        $email_body .= "Subject: $email_subject\n";
        $email_body .= "\nMessage:\n$message\n\n";
        $email_body .= "---\n";
        $email_body .= "This message was sent from your portfolio at brightsafari.space\n";
        
        // Email headers
        $headers = "From: Portfolio Contact <noreply@brightsafari.space>\r\n";
        $headers .= "Reply-To: $name <$email>\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        
        // Send email to you
        $email_sent = send_email($your_email, $email_subject, $email_body, $headers, $debug);
        
        // Send copy to sender if requested
        if ($copy_me && $email != $your_email) {
            $copy_subject = "Copy of your message to Bright Safari";
            $copy_body = "This is a copy of the message you sent to Bright Safari:\n\n$message\n\n";
            $copy_body .= "---\nThank you for your message! I'll get back to you soon.\n";
            $copy_body .= "Bright Safari\nsafaribright93@gmail.com\n";
            
            send_email($email, $copy_subject, $copy_body, $headers, $debug);
        }
        
        // Optional: Send SMS notification
        $sms_sent = false;
        if ($phone || $your_phone) {
            $sms_message = "New message from $name: " . substr($message, 0, 50) . "...";
            $sms_sent = send_sms_twilio($your_phone, $sms_message, $debug);
        }
        
        // Store message in local file for backup (optional)
        $log_entry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'subject' => $subject,
            'message' => $message,
            'email_sent' => $email_sent,
            'sms_sent' => $sms_sent
        ];
        
        $log_file = 'contact_messages.json';
        $existing_logs = [];
        
        if (file_exists($log_file)) {
            $existing_logs = json_decode(file_get_contents($log_file), true) ?: [];
        }
        
        $existing_logs[] = $log_entry;
        file_put_contents($log_file, json_encode($existing_logs, JSON_PRETTY_PRINT));
        
        // Return success response
        echo json_encode([
            'success' => true,
            'message' => 'Message sent successfully! I\'ll get back to you soon.',
            'methods' => [
                'email' => $email_sent,
                'sms' => $sms_sent
            ]
        ]);
        
    } catch (Exception $e) {
        // Return error response
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);
}
?>