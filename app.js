function goToLogin() {
  window.location.href = "login.html";
}

/* =========================
   LOGIN
========================= */

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

/* =========================
   FILE PREVIEW (UPLOAD PAGE)
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const fileList = document.getElementById("fileList");
      fileList.innerHTML = "";

      Array.from(e.target.files).forEach((file) => {
        const item = document.createElement("div");

        if (file.type.startsWith("image/")) {
          const img = document.createElement("img");
          img.src = URL.createObjectURL(file);
          item.appendChild(img);
        }

        const name = document.createElement("div");
        name.innerText = "📄 " + file.name;

        item.appendChild(name);
        fileList.appendChild(item);
      });
    });
  }
});

/* =========================
   UPLOAD FILES
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
        console.error(error);
        status.innerText = "Upload failed for: " + file.name;
      },

      () => {
        uploadedCount++;

        if (uploadedCount === files.length) {
          progress.innerText = "";

          status.innerHTML = `
            <div style="margin-top:10px;">
              <h3>Thank you ❤️</h3>
              <p>Your memories have been shared with us.</p>
            </div>
          `;

          btn.disabled = false;
          btn.innerText = "Upload Memories";

          document.getElementById("fileInput").value = "";
          document.getElementById("fileList").innerHTML = "";
        } else {
          status.innerText = `Uploaded ${uploadedCount} of ${files.length}`;
        }
      }
    );
  });
}
