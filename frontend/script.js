document.addEventListener('DOMContentLoaded', async () => {
  const authButton = document.getElementById('auth-button');
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const newBtn = document.getElementById('new-btn');
  const profileBtn = document.getElementById('profile-btn');
  const updateBtns = document.querySelectorAll('.protected-button');
  const userIdElement = document.getElementById('user-id');

  // Log elements to verify they are correctly selected
  console.log({ authButton, signupForm, loginForm, newBtn, profileBtn, updateBtns, userIdElement });

  // Function to check if user is logged in
  function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
  }

  // Function to update authentication button text
  function updateAuthButton() {
    if (isLoggedIn()) {
      authButton.textContent = 'Logout';
    } else {
      authButton.textContent = 'Login/Signup';
    }
  }

  // Function to update visibility of Create Package button
  function updateNewBtn() {
    if (isLoggedIn()) {
      const role = localStorage.getItem('role');
      if (role === 'admin') {
        newBtn.textContent = 'Create Package';
      } else {
        newBtn.textContent = 'Subscribe';
      }
    } else {
      newBtn.textContent = '';
    }
  }

  // Function to update visibility and state of protected buttons
  function updateProtectedBtns() {
    updateBtns.forEach(button => {
      if (isLoggedIn()) {
        button.removeAttribute('disabled');
      } else {
        button.setAttribute('disabled', 'true');
        button.href = '#';
      }
    });
  }

  // Function to update visibility of profile button
  function updateProfileBtn() {
    if (!isLoggedIn() && profileBtn) {
      profileBtn.remove();
    }
  }

  // Function to update user ID display
  function updateUserId() {
    const username = localStorage.getItem('username');
    if (username) {
      userIdElement.innerHTML = `Welcome ${username}`;
    } else {
      userIdElement.innerHTML = '';
    }
  }

  // Initial logout if not logged in
  if (!isLoggedIn()) {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        localStorage.setItem('loggedIn', 'false');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
      } else {
        console.error('Initial logout failed');
      }
    } catch (error) {
      console.error('An error occurred during initial logout:', error);
    }
  }

  // Event listener for authentication button (Login/Logout)
  if (authButton) {
    authButton.addEventListener('click', async () => {
      if (isLoggedIn()) {
        try {
          const response = await fetch('http://localhost:5000/logout', {
            method: 'GET',
            credentials: 'include'
          });
          if (response.ok) {
            localStorage.setItem('loggedIn', 'false');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            alert('Logged out');
            updateAuthButton();
            updateProtectedBtns();
            updateNewBtn();
            updateProfileBtn();
            updateUserId();
          } else {
            const error = await response.json();
            alert(`Logout failed: ${error.message}`);
          }
        } catch (error) {
          alert('An error occurred during logout.');
          console.error('Logout error:', error);
        }
      } else {
        window.location.href = 'login.html';
      }
    });
  }

  // Event listener for signup form submission
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, username, password })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('username', username);
          alert('Signup successful!');
          window.location.href = 'login.html';
        } else {
          const error = await response.json();
          alert(`Signup failed: ${error.message}`);
        }
      } catch (error) {
        alert('An error occurred during signup.');
        console.error('Signup error:', error);
      }
    });
  }

  // Event listener for login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password }),
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('username', username);
          localStorage.setItem('role', data.role); // Assuming role is returned in response
          alert('Logged in');
          window.location.href = 'index.html';
        } else {
          const error = await response.json();
          alert(`Login failed: ${error.message}`);
        }
      } catch (error) {
        alert('An error occurred during login.');
        console.error('Login error:', error);
      }
    });
  }

  // Initialize UI components on page load
  updateAuthButton();
  updateProtectedBtns();
  updateNewBtn();
  updateProfileBtn();
  updateUserId();
});
