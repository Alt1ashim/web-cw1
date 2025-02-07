document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');

  // Function to validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Function to validate password (minimum 8 characters)
  function isValidPassword(password) {
    return password.length >= 8;
  }

  // Handle Registration Form Interactivity
  if (registerForm) {
    const usernameInput = document.getElementById('register-username');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('error-message');
    registerForm.appendChild(errorContainer);

    registerForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent form submission

      // Clear previous errors
      errorContainer.textContent = '';

      // Validate inputs
      let hasError = false;

      if (!usernameInput.value.trim()) {
        errorContainer.textContent += 'Username is required. ';
        hasError = true;
      }

      if (!isValidEmail(emailInput.value)) {
        errorContainer.textContent += 'Invalid email address. ';
        hasError = true;
      }

      if (!isValidPassword(passwordInput.value)) {
        errorContainer.textContent += 'Password must be at least 8 characters long. ';
        hasError = true;
      }

      // Simulate success if no errors
      if (!hasError) {
        submitButton.disabled = true;
        submitButton.textContent = 'Registering...';

        // Simulate a delay (e.g., backend processing)
        setTimeout(() => {
          alert('Registration successful! (Simulated)');
          submitButton.disabled = false;
          submitButton.textContent = 'Register';
          registerForm.reset();
        }, 2000); // 2 seconds delay
      }
    });
  }

  // Handle Login Form Interactivity
  if (loginForm) {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('error-message');
    loginForm.appendChild(errorContainer);

    loginForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent form submission

      // Clear previous errors
      errorContainer.textContent = '';

      // Validate inputs
      let hasError = false;

      if (!isValidEmail(emailInput.value)) {
        errorContainer.textContent += 'Invalid email address. ';
        hasError = true;
      }

      if (!passwordInput.value.trim()) {
        errorContainer.textContent += 'Password is required. ';
        hasError = true;
      }

      // Simulate success if no errors
      if (!hasError) {
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';

        // Simulate a delay (e.g., backend processing)
        setTimeout(() => {
          alert('Login successful! (Simulated)');
          submitButton.disabled = false;
          submitButton.textContent = 'Login';
          loginForm.reset();
        }, 2000); // 2 seconds delay
      }
    });
  }

  // Password Visibility Toggle
  document.querySelectorAll('.auth-form input[type="password"]').forEach((passwordInput) => {
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.textContent = 'Show';
    toggleButton.classList.add('toggle-password');

    toggleButton.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      toggleButton.textContent = type === 'password' ? 'Show' : 'Hide';
    });

    passwordInput.parentNode.insertBefore(toggleButton, passwordInput.nextSibling);
  });
});