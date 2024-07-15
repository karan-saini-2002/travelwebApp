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

  