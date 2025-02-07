<?php
// auth.php
require_once 'db.php'; // Include your database connection file
session_start();

// Generate CSRF token if not already set
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Helper function to sanitize inputs
function sanitize_input($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? null;
    $csrf_token = $_POST['csrf_token'] ?? '';

    // Validate CSRF token
    if ($csrf_token !== $_SESSION['csrf_token']) {
        http_response_code(403); // Forbidden
        echo json_encode(['status' => 'error', 'message' => 'Invalid CSRF token.']);
        exit;
    }

    // Handle Registration
    if ($action === 'register') {
        $username = sanitize_input($_POST['username']);
        $email = filter_var(sanitize_input($_POST['email']), FILTER_VALIDATE_EMAIL);
        $password = $_POST['password'];

        // Validate inputs
        if (!$email || strlen($password) < 8) {
            http_response_code(400); // Bad Request
            echo json_encode(['status' => 'error', 'message' => 'Invalid input. Password must be at least 8 characters long.']);
            exit;
        }

        // Hash the password
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);

        try {
            // Insert user into the database
            $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
            $stmt->execute([$username, $email, $hashed_password]);

            // Redirect to login page after successful registration
            header('Location: login.html?success=registration_successful');
            exit;
        } catch (PDOException $e) {
            http_response_code(409); // Conflict
            echo json_encode(['status' => 'error', 'message' => 'Email already exists.']);
            exit;
        }
    }

    // Handle Login
    if ($action === 'login') {
        $email = filter_var(sanitize_input($_POST['email']), FILTER_VALIDATE_EMAIL);
        $password = $_POST['password'];

        // Validate inputs
        if (!$email) {
            http_response_code(400); // Bad Request
            echo json_encode(['status' => 'error', 'message' => 'Invalid email.']);
            exit;
        }

        // Fetch user from the database
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            session_regenerate_id(true); // Regenerate session ID to prevent session fixation
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];

            // Redirect to dashboard or home page after successful login
            header('Location: dashboard.html');
            exit;
        } else {
            http_response_code(401); // Unauthorized
            echo json_encode(['status' => 'error', 'message' => 'Invalid credentials.']);
            exit;
        }
    }
}

// Handle Logout
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header('Location: login.html');
    exit;
}
?>