const autBtn=document.getElementById('autbtn');
document.getElementById("myForm").style.display = "none";



function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
}

function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }

  if(autBtn){
    autBtn.addEventListener('click', () => {
      if (isLoggedIn()) {
          // Log out the user
          localStorage.setItem('loggedIn', 'false');
          alert('Logged out');

      } else {
        window.location.href = 'login.html';
      }
    });
}