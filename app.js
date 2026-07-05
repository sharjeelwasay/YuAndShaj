function goToLogin() {
  window.location.href = "login.html";
}

// LOGIN
function login() {
  const password = document.getElementById("password").value;
  const email = "wedding@yuandshaj.com";

  const errorEl = document.getElementById("error");

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "upload.html";
    })
    .catch(() => {
      errorEl.innerText = "Incorrect password. Please try again.";
    });
}


// UPLOAD FUNCTION
function uploadFiles() {
  const files = document.getElementById("fileInput").files;
  const progress = document.getElementById("progress");
  const status = document.getElementById("status");

  if (!files.length) {
    status.innerText = "Please select files first.";
    return;
  }

  Array.from(files).forEach((file) => {
    const uploadTask = storage.ref("wedding/" + Date.now() + "_" + file.name).put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress.innerText = "Uploading: " + Math.round(percent) + "%";
      },
      (error) => {
        status.innerText = "Upload failed: " + error.message;
      },
      () => {
        status.innerText = "Upload complete 🎉 Thank you!";
      }
    );
  });
}
