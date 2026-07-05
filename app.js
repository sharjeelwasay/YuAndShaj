
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
   CONFETTI
========================= */

function launchConfetti() {
  for (let i = 0; i < 60; i++) {
    const c = document.createElement("div");
    c.style.position = "fixed";
    c.style.width = "8px";
    c.style.height = "8px";
    c.style.background = ["#d4af37", "#fff", "#ffdf80"][Math.floor(Math.random()*3)];
    c.style.left = Math.random() * window.innerWidth + "px";
    c.style.top = "-10px";
    c.style.borderRadius = "50%";
    c.style.zIndex = "9999";

    document.body.appendChild(c);

    let fall = setInterval(() => {
      c.style.top = c.offsetTop + 5 + "px";
      if (c.offsetTop > window.innerHeight) {
        clearInterval(fall);
        c.remove();
      }
    }, 16);
  }
}

/* =========================
   FILE PREVIEW
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const fileList = document.getElementById("fileList");
      fileList.innerHTML = "";

      Array.from(e.target.files).forEach(file => {
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
   UPLOAD
========================= */

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

  let uploaded = 0;

  Array.from(files).forEach(file => {

    const safeName = Date.now() + "_" + file.name.replace(/\s/g, "_");
    const ref = storage.ref("wedding/" + safeName);

    const task = ref.put(file);

    task.on("state_changed",
      snap => {
        progress.innerText =
          `Uploading ${file.name}: ${Math.round((snap.bytesTransferred/snap.totalBytes)*100)}%`;
      },

      err => {
        console.error(err);
        status.innerText = "Upload failed: " + file.name;
      },

      () => {
        uploaded++;

        if (uploaded === files.length) {
          launchConfetti();

          status.innerHTML = `
            <div style="margin-top:10px;">
              <h3>Thank you ❤️</h3>
              <p>Your memories have been shared.</p>
            </div>
          `;

          btn.disabled = false;
          btn.innerText = "Upload Memories";

          document.getElementById("fileInput").value = "";
          document.getElementById("fileList").innerHTML = "";

          setTimeout(() => {
            window.location.href = "gallery.html";
          }, 2500);
        }
      }
    );
  });
}

/* =========================
   GALLERY LOADER (FIXED LIGHTBOX)
========================= */

function loadGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  storage.ref("wedding").listAll()
    .then(res => {

      res.items.forEach(item => {
        item.getDownloadURL().then(url => {

          const isVideo =
            url.includes(".mp4") ||
            url.includes(".mov") ||
            url.includes(".webm");

          if (isVideo) {
            const vid = document.createElement("video");
            vid.src = url;
            vid.controls = true;
            grid.appendChild(vid);
          } else {
            const img = document.createElement("img");
            img.src = url;

            // FIXED CLICK HANDLER (guaranteed working)
            img.addEventListener("click", function () {
              openLightbox(url);
            });

            grid.appendChild(img);
          }
        });
      });

    })
    .catch(console.error);
}

/* =========================
   LIGHTBOX (FIXED)
========================= */

function openLightbox(url) {
  let box = document.getElementById("lightbox");
  let img = document.getElementById("lightboxImg");

  if (!box || !img) return;

  img.src = url;
  box.style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

/* =========================
   SAFE INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("galleryGrid")) {
    loadGallery();
  }
});
