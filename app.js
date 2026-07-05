function goToLogin() {
  window.location.href = "login.html";
}

/* =========================
   LOGIN (Firebase Auth)
========================= */

function login() {
  const password = document.getElementById("password").value;
  const email = "wedding@yuandshaj.com";
  const errorEl = document.getElementById("error");

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "upload.html";
    })
    .catch((error) => {
      console.error(error);
      errorEl.innerText = "Incorrect password. Please try again.";
    });
}

/* =========================
   UPLOAD FILES (Firebase Storage)
========================= */

function uploadFiles() {
  const files = document.getElementById("fileInput").files;
  const progress = document.getElementById("progress");
  const status = document.getElementById("status");
  const btn = document.getElementById("uploadBtn");

  if (!files || files.length === 0) {
    status.innerText = "Please select files first.";
    return;
  }

  btn.disabled = true;
  btn.innerText = "Uploading...";

  let uploadedCount = 0;

  Array.from(files).forEach((file) => {

    // safer filename (prevents overwrite + spaces issues)
    const safeName = Date.now() + "_" + file.name.replace(/\s/g, "_");

    const ref = storage.ref("wedding/" + safeName);
    const task = ref.put(file);

    task.on(
      "state_changed",
      (snapshot) => {
        const percent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        progress.innerText =
          `Uploading ${file.name}: ${Math.round(percent)}%`;
      },

      (error) => {
        console.error("Upload error:", error);
        status.innerText = "Upload failed for: " + file.name;
      },

      () => {
        uploadedCount++;

        status.innerText =
          `Uploaded ${uploadedCount} of ${files.length}`;

        if (uploadedCount === files.length) {
          progress.innerText = "";
          status.innerText = "All memories uploaded successfully ❤️";

          btn.disabled = false;
          btn.innerText = "Upload Memories";

          document.getElementById("fileInput").value = "";
        }
      }
    );
  });
}
