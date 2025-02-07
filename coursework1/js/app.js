// app.js

// Toggle Dark Mode
document.getElementById('toggle-theme')?.addEventListener('click', () => {
    const themeStyle = document.getElementById('theme-style');
    if (themeStyle.getAttribute('href') === 'css/dark-mode.css') {
      themeStyle.setAttribute('href', '');
    } else {
      themeStyle.setAttribute('href', 'css/dark-mode.css');
    }
  });