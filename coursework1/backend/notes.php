<?php
// notes.php
require_once 'db.php'; // Include your database connection file
session_start();

// Helper function to sanitize inputs
function sanitize_input($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['status' => 'error', 'message' => 'You must be logged in to perform this action.']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Handle POST requests (Add or Update Note)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? null;

    if ($action === 'add') {
        $title = sanitize_input($_POST['title']);
        $content = sanitize_input($_POST['content']);

        if (!$title || !$content) {
            http_response_code(400); // Bad Request
            echo json_encode(['status' => 'error', 'message' => 'Title and content are required.']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)");
            $stmt->execute([$user_id, $title, $content]);
            echo json_encode(['status' => 'success', 'message' => 'Note added successfully!']);
        } catch (PDOException $e) {
            http_response_code(500); // Internal Server Error
            echo json_encode(['status' => 'error', 'message' => 'Failed to add note.']);
        }
    }

    if ($action === 'update') {
        $note_id = intval($_POST['note_id']);
        $title = sanitize_input($_POST['title']);
        $content = sanitize_input($_POST['content']);

        if (!$title || !$content) {
            http_response_code(400); // Bad Request
            echo json_encode(['status' => 'error', 'message' => 'Title and content are required.']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?");
            $stmt->execute([$title, $content, $note_id, $user_id]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(['status' => 'success', 'message' => 'Note updated successfully!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Note not found or unauthorized.']);
            }
        } catch (PDOException $e) {
            http_response_code(500); // Internal Server Error
            echo json_encode(['status' => 'error', 'message' => 'Failed to update note.']);
        }
    }
}

// Handle DELETE requests (Delete Note)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents('php://input'), $data);
    $note_id = intval($data['note_id']);

    try {
        $stmt = $pdo->prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
        $stmt->execute([$note_id, $user_id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Note deleted successfully!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Note not found or unauthorized.']);
        }
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete note.']);
    }
}

// Handle GET requests (Fetch Notes)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("SELECT * FROM notes WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['status' => 'success', 'data' => $notes]);
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch notes.']);
    }
}
?>