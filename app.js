window.location.href = "login.html";
}

// LOGIN FUNCTION
// LOGIN
function login() {
const password = document.getElementById("password").value;
const email = "wedding@yuandshaj.com";
@@ -13,7 +13,38 @@ function login() {
.then(() => {
window.location.href = "upload.html";
})
    .catch((error) => {
    .catch(() => {
errorEl.innerText = "Incorrect password. Please try again.";
});
}


// UPLOAD FUNCTION
function uploadFiles() {
  const files = document.getElementById("fileInput").files;
  const progress = document.getElementById("progress");
  const status = document.getElementById("status");
  const btn = document.getElementById("uploadBtn");

  if (!files.length) {
    status.innerText = "Please select files first.";
    return;
  }

  btn.disabled = true;
  btn.innerText = "Uploading...";

  let uploadedCount = 0;

  Array.from(files).forEach((file, index) => {

    const safeName = Date.now() + "_" + file.name.replace(/\s/g, "_");
    const ref = storage.ref("wedding/" + safeName);

    const task = ref.put(file);

    task.on(
      "state_changed",
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress.innerText = `Uploading ${file.name}: ${Math.round(percent)}%`;
      },
      (error) => {
        console.error(error);
        status.innerText = "Upload failed for: " + file.name;
      },
      () => {
        uploadedCount++;

        status.innerText = `Uploaded ${uploadedCount} of ${files.length}`;

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
