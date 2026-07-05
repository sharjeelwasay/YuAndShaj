
function goToLogin() {
  window.location.href = "login.html";
}

function goToUpload() {
  window.location.href = "upload.html";
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
   CONFETTI EFFECT
========================= */

function launchConfetti() {
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "fixed";
    confetti.style.width = "8px";
    confetti.style.height = "8px";
    confetti.style.background =
      ["#d4af37", "#ffffff", "#ffdf80"][Math.floor(Math.random() * 3)];

    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.top = "-10px";
    confetti.style.borderRadius = "50%";
    confetti.style.zIndex = "9999";
    confetti.style.opacity = "0.9";

    document.body.appendChild(confetti);

    let fall = setInterval(() => {
      confetti.style.top = confetti.offsetTop + 5 + "px";

      if (confetti.offsetTop > window.innerHeight) {
        clearInterval(fall);
        confetti.remove();
      }
    }, 16);
  }
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

          launchConfetti();

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

          // redirect to gallery
          setTimeout(() => {
            window.location.href = "gallery.html";
          }, 3000);

        } else {
          status.innerText = `Uploaded ${uploadedCount} of ${files.length}`;
        }
      }
    );
  });
}

/* =========================
   GALLERY LOADER (SAFE FIXED VERSION)
========================= */

function loadGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  storage.ref("wedding").listAll()
    .then((result) => {

      result.items.forEach((itemRef) => {

        itemRef.getDownloadURL().then((url) => {

          const isVideo =
            url.includes(".mp4") ||
            url.includes(".mov") ||
            url.includes(".webm");

          let el;

          if (isVideo) {
            el = document.createElement("video");
            el.src = url;
            el.controls = true;
          } else {
            el = document.createElement("img");
            el.src = url;

            // CLICK TO OPEN LIGHTBOX
            el.onclick = () => openLightbox(url);
          }

          grid.appendChild(el);
        });

      });

    })
    .catch(console.error);
}

/* =========================
   SAFE AUTO-RUN ONLY ON GALLERY PAGE
========================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("galleryGrid")) {
    loadGallery();
  }
});
