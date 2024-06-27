document.addEventListener('DOMContentLoaded', () => {
  
  sessionStorage.clear();
  
  const authButton = document.getElementById('auth-button');
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const newBtn = document.getElementById('new-btn');
  const updateBtn = document.querySelectorAll('.protected-button');

  

  function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
}

  function updateAuthButton() {
    if (isLoggedIn()) {
        authButton.textContent = 'Logout';
    } else {
        authButton.textContent = 'Login/Signup';
    }
}
function newbtns() {
  if (isLoggedIn()) {
      newBtn.textContent = 'CreatePackage';
  } else {
      newBtn.textContent = '';
  }
}
function updateBtnfxn(){
  updateBtn.forEach(button => {
    if (isLoggedIn()) {
        button.removeAttribute('disabled'); // Enable the button
    } else {
        button.setAttribute('disabled', 'true'); // Disable the button
        button.href = '#'; // Prevent navigation
    }
});
}

if(authButton){
authButton.addEventListener('click', () => {
  if (isLoggedIn()) {
      // Log out the user
      localStorage.setItem('loggedIn', 'false');
      alert('Logged out');
      updateAuthButton();
      updateBtnfxn();
      newbtns();
  } else {
    window.location.href = 'login.html';
  }
});

}
  
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

      else {
        localStorage.setItem(username, password);
          alert('Signup successful!');
          window.location.href = 'login.html'; // Redirect to login page after successful signup
        }  
    });
  }

  if(loginForm){
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      if (localStorage.getItem(username) === password) {
        localStorage.setItem('loggedIn', 'true');
        alert('Logged in');
        window.location.href = 'index.html';
        
    } else {
        alert('Invalid username or password');
    }
    });
  }
  updateAuthButton();
  updateBtnfxn();
  newbtns();
});
