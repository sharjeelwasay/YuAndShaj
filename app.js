function goToLogin() {
  window.location.href = "login.html";
}

// LOGIN FUNCTION
function login() {
  const password = document.getElementById("password").value;
  const email = "wedding@yuandshaj.com";

  const errorEl = document.getElementById("error");

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "upload.html";
    })
    .catch((error) => {
      errorEl.innerText = "Incorrect password. Please try again.";
    });
}
