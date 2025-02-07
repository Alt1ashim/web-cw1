document.addEventListener('DOMContentLoaded', () => {
  const noteForm = document.getElementById('note-form');
  const notesList = document.getElementById('notes-list');

  let currentNoteId = null; // To track the note being edited

  // Fetch and display notes on page load
  fetchNotes();

  // Handle form submission (Add or Update Note)
  noteForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();

    if (!title || !content) {
      alert('Title and content are required.');
      return;
    }

    const action = currentNoteId ? 'update' : 'add';
    const payload = {
      action,
      title,
      content,
      note_id: currentNoteId,
    };

    try {
      const response = await fetch('notes.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert(result.message);
        noteForm.reset();
        currentNoteId = null;
        noteForm.querySelector('button[type="submit"]').textContent = 'Add Note';
        fetchNotes(); // Refresh the notes list
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred.');
    }
  });

  // Fetch notes from the backend
  async function fetchNotes() {
    try {
      const response = await fetch('notes.php', { method: 'GET' });
      const result = await response.json();

      if (result.status === 'success') {
        renderNotes(result.data);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      alert('Failed to fetch notes.');
    }
  }

  // Render notes dynamically
  function renderNotes(notes) {
    notesList.innerHTML = ''; // Clear existing notes

    notes.forEach((note) => {
      const noteCard = document.createElement('div');
      noteCard.classList.add('note-card');

      noteCard.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <div class="note-actions">
          <button class="btn btn-edit" data-id="${note.id}">Edit</button>
          <button class="btn btn-delete" data-id="${note.id}">Delete</button>
        </div>
      `;

      // Add event listeners for Edit and Delete buttons
      noteCard.querySelector('.btn-edit').addEventListener('click', () => editNote(note));
      noteCard.querySelector('.btn-delete').addEventListener('click', () => deleteNote(note.id));

      notesList.appendChild(noteCard);
    });
  }

  // Edit a note
  function editNote(note) {
    document.getElementById('note-title').value = note.title;
    document.getElementById('note-content').value = note.content;
    currentNoteId = note.id;
    noteForm.querySelector('button[type="submit"]').textContent = 'Update Note';
  }

  // Delete a note
  async function deleteNote(noteId) {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch('notes.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_id: noteId }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert(result.message);
        fetchNotes(); // Refresh the notes list
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note.');
    }
  }
});