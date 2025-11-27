<?php
/**
 * Online Registration Form Backend
 * Handles form submission with security and validation
 * 
 * @author Your Name
 * @version 1.0
 */

// ===========================================
// SECURITY & HEADERS
// ===========================================

// Set JSON content type
header('Content-Type: application/json');

// Prevent MIME type sniffing
header('X-Content-Type-Options: nosniff');

// Prevent clickjacking
header('X-Frame-Options: DENY');

// Enable XSS protection
header('X-XSS-Protection: 1; mode=block');

// CORS headers (adjust origin as needed)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// ===========================================
// INITIALIZE RESPONSE
// ===========================================

$response = [
    'status'  => 'error',
    'message' => 'An error occurred. Please try again.'
];

// ===========================================
// CHECK REQUEST METHOD
// ===========================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    $response['message'] = 'Method not allowed';
    echo json_encode($response);
    exit;
}

// ===========================================
// RETRIEVE & SANITIZE INPUT DATA
// ===========================================

$fullName         = isset($_POST['fullName']) ? sanitizeInput($_POST['fullName']) : '';
$email            = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
$phone            = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';
$dob              = isset($_POST['dob']) ? sanitizeInput($_POST['dob']) : '';
$password         = isset($_POST['password']) ? $_POST['password'] : '';
$confirmPassword  = isset($_POST['confirmPassword']) ? $_POST['confirmPassword'] : '';

// ===========================================
// VALIDATE INPUT DATA
// ===========================================

// Validate Full Name
if (empty($fullName)) {
    $response['message'] = 'Full name is required';
    echo json_encode($response);
    exit;
}

if (strlen($fullName) < 3 || strlen($fullName) > 100) {
    $response['message'] = 'Full name must be between 3 and 100 characters';
    echo json_encode($response);
    exit;
}

if (!preg_match('/^[a-zA-Z\s\'-]+$/', $fullName)) {
    $response['message'] = 'Full name contains invalid characters';
    echo json_encode($response);
    exit;
}

// Validate Email
if (empty($email)) {
    $response['message'] = 'Email is required';
    echo json_encode($response);
    exit;
}

// Use PHP's built-in filter for email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['message'] = 'Invalid email address';
    echo json_encode($response);
    exit;
}

if (strlen($email) > 254) {
    $response['message'] = 'Email address is too long';
    echo json_encode($response);
    exit;
}

// Validate Phone
if (empty($phone)) {
    $response['message'] = 'Phone number is required';
    echo json_encode($response);
    exit;
}

if (strlen($phone) < 7 || strlen($phone) > 20) {
    $response['message'] = 'Phone number must be between 7 and 20 characters';
    echo json_encode($response);
    exit;
}

if (!preg_match('/^[0-9+\-\s()]+$/', $phone)) {
    $response['message'] = 'Phone number contains invalid characters';
    echo json_encode($response);
    exit;
}

// Validate Date of Birth
if (empty($dob)) {
    $response['message'] = 'Date of Birth is required';
    echo json_encode($response);
    exit;
}

$dobDate = DateTime::createFromFormat('Y-m-d', $dob);
if (!$dobDate) {
    $response['message'] = 'Invalid date format';
    echo json_encode($response);
    exit;
}

$today = new DateTime();
$age = $today->diff($dobDate)->y;

if ($age < 13) {
    $response['message'] = 'You must be at least 13 years old';
    echo json_encode($response);
    exit;
}

if ($age > 120) {
    $response['message'] = 'Please enter a valid date of birth';
    echo json_encode($response);
    exit;
}

// Validate Password
if (empty($password)) {
    $response['message'] = 'Password is required';
    echo json_encode($response);
    exit;
}

if (strlen($password) < 6) {
    $response['message'] = 'Password must be at least 6 characters';
    echo json_encode($response);
    exit;
}

if (strlen($password) > 128) {
    $response['message'] = 'Password is too long';
    echo json_encode($response);
    exit;
}

// Validate Confirm Password
if (empty($confirmPassword)) {
    $response['message'] = 'Please confirm your password';
    echo json_encode($response);
    exit;
}

// Check if passwords match
if ($password !== $confirmPassword) {
    $response['message'] = 'Passwords do not match';
    echo json_encode($response);
    exit;
}

// ===========================================
// PROCESS REGISTRATION
// ===========================================

try {
    // Hash the password using bcrypt
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

    // ===== DATABASE INTEGRATION (Optional) =====
    // If you want to store data in a database, uncomment and configure the following:
    
    /*
    // Database connection details
    $db_host = 'localhost';
    $db_user = 'root';
    $db_pass = '';
    $db_name = 'registration_db';

    // Create database connection
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }

    // Prepare SQL statement to prevent SQL injection
    $stmt = $conn->prepare('INSERT INTO users (full_name, email, phone, password, created_at) VALUES (?, ?, ?, ?, NOW())');

    if (!$stmt) {
        throw new Exception('SQL prepare error: ' . $conn->error);
    }

    // Bind parameters
    $stmt->bind_param('ssss', $fullName, $email, $phone, $hashedPassword);

    // Execute statement
    if (!$stmt->execute()) {
        // Check for duplicate email
        if (strpos($conn->error, 'Duplicate') !== false) {
            throw new Exception('This email is already registered');
        }
        throw new Exception('Registration failed: ' . $stmt->error);
    }

    $stmt->close();
    $conn->close();
    */

    // ===== FILE STORAGE (for demonstration) =====
    // Store registration data in a log file (replace with database in production)
    $registrationData = [
        'timestamp'  => date('Y-m-d H:i:s'),
        'fullName'   => $fullName,
        'email'      => $email,
        'phone'      => $phone,
        'dob'        => $dob,
        'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown'
    ];

    // Log to file (ensure 'logs' directory exists and is writable)
    $logDir = __DIR__ . '/logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }

    $logFile = $logDir . '/registrations_' . date('Y-m-d') . '.log';
    file_put_contents($logFile, json_encode($registrationData) . PHP_EOL, FILE_APPEND | LOCK_EX);

    // Success response
    $response['status']  = 'success';
    $response['message'] = 'Registration successful! Welcome, ' . htmlspecialchars($fullName) . '! We will contact you soon.';

} catch (Exception $e) {
    http_response_code(500);
    $response['status']  = 'error';
    $response['message'] = $e->getMessage();
    error_log('Registration Error: ' . $e->getMessage());
}

// ===========================================
// RETURN JSON RESPONSE
// ===========================================

echo json_encode($response);
exit;

// ===========================================
// HELPER FUNCTION: SANITIZE INPUT
// ===========================================

/**
 * Sanitize user input to prevent XSS attacks
 * 
 * @param string $input The user input to sanitize
 * @return string Sanitized input
 */
function sanitizeInput($input) {
    // Trim whitespace
    $input = trim($input);

    // Remove HTML tags and encode special characters
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');

    return $input;
}

?>
