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
    c.style.background =
      ["#d4af37", "#fff", "#ffdf80"][Math.floor(Math.random() * 3)];

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

      const files = Array.from(e.target.files);


      files.forEach(file => {

        const item = document.createElement("div");
        item.className = "previewItem";


        if (file.type.startsWith("image/")) {

          const img = document.createElement("img");

          img.src = URL.createObjectURL(file);

          item.appendChild(img);


        } else if (file.type.startsWith("video/")) {

          const video = document.createElement("video");

          video.src = URL.createObjectURL(file);

          video.muted = true;

          video.controls = true;

          item.appendChild(video);

        }


        const name = document.createElement("p");

        name.innerText = file.name;

        item.appendChild(name);


        fileList.appendChild(item);


      });


      const status = document.getElementById("status");

      if (status) {

        status.innerText =
          `${files.length} memories selected ❤️`;

      }


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


  if (!files || files.length === 0) {

    status.innerText = "Please select files first.";
    return;

  }


  btn.disabled = true;
  btn.innerText = "Uploading...";


  let uploaded = 0;


  Array.from(files).forEach(file => {


    const safeName =
      Date.now() + "_" + file.name.replace(/\s/g, "_");


    const ref = storage.ref("wedding/" + safeName);


    const task = ref.put(file);


    task.on(

      "state_changed",

      snap => {

        progress.innerText =
          `Uploading ${file.name}: ${Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          )}%`;

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
   GALLERY DATA
========================= */

let galleryItems = [];
let currentIndex = 0;


/* =========================
   LOAD GALLERY
========================= */

function loadGallery() {

  const grid = document.getElementById("galleryGrid");

  if (!grid) return;


  storage.ref("wedding").listAll()

    .then(res => {


      const promises =
        res.items.map(item => item.getDownloadURL());


      Promise.all(promises)

        .then(urls => {


          galleryItems = urls;


          urls.forEach((url,index)=>{


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


              img.addEventListener("click",()=>{

                openViewer(index);

              });


              grid.appendChild(img);


            }


          });


        });


    })

    .catch(console.error);

}



/* =========================
   FULLSCREEN VIEWER
========================= */

function openViewer(index) {


  currentIndex = index;


  let viewer = document.getElementById("viewer");


  if (!viewer) {


    viewer = document.createElement("div");

    viewer.id = "viewer";


    viewer.innerHTML = `

  <div id="viewerBackdrop"></div>

  <button id="closeViewerBtn">✕</button>

  <div id="viewerMedia"></div>

  <div id="viewerControls">

    <button id="prevBtn">‹</button>

    <button id="downloadBtn">⤓</button>

    <button id="nextBtn">›</button>

  </div>

`;


    document.body.appendChild(viewer);



    document.getElementById("viewerBackdrop")
      .onclick = closeViewer;

    document.getElementById("closeViewerBtn")
      .onclick = closeViewer;


    document.getElementById("prevBtn")
      .onclick = () => changeImage(-1);


    document.getElementById("nextBtn")
      .onclick = () => changeImage(1);


    document.getElementById("downloadBtn")
      .onclick = downloadCurrentImage;



    let startX = 0;


    viewer.addEventListener("touchstart", e => {

      startX = e.touches[0].clientX;

    });


    viewer.addEventListener("touchend", e => {


      let endX = e.changedTouches[0].clientX;


      if (startX - endX > 50)
        changeImage(1);


      if (endX - startX > 50)
        changeImage(-1);


    });


  }


  viewer.style.display = "flex";


  updateViewer();

}



/* =========================
   UPDATE VIEWER
========================= */

function updateViewer() {


  const container =
    document.getElementById("viewerMedia");


  if (!container) return;


  const url = galleryItems[currentIndex];


  const isVideo =
    url.includes(".mp4") ||
    url.includes(".mov") ||
    url.includes(".webm");


  container.innerHTML = "";


  if (isVideo) {


    const vid = document.createElement("video");


    vid.src = url;
    vid.controls = true;
    vid.autoplay = true;


    vid.style.maxWidth = "90%";
    vid.style.maxHeight = "80%";
    vid.style.objectFit = "contain";


    container.appendChild(vid);



  } else {


    const img = document.createElement("img");


    img.src = url;


    img.style.maxWidth = "90%";
    img.style.maxHeight = "80%";
    img.style.objectFit = "contain";


    container.appendChild(img);


  }

}


/* =========================
   NEXT / PREVIOUS
========================= */

function changeImage(direction) {


  currentIndex += direction;


  if (currentIndex < 0)
    currentIndex = galleryItems.length - 1;


  if (currentIndex >= galleryItems.length)
    currentIndex = 0;


  updateViewer();

}



/* =========================
   CLOSE VIEWER
========================= */

function closeViewer() {


  const viewer =
    document.getElementById("viewer");


  if (viewer) {

    viewer.style.display = "none";

  }

}



/* =========================
   DOWNLOAD
========================= */

function downloadCurrentImage() {


  const url =
    galleryItems[currentIndex];


  const link =
    document.createElement("a");


  link.href = url;

  link.target = "_blank";

  link.rel = "noopener";


  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);


}



/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded",()=>{


  if(document.getElementById("galleryGrid")){

    loadGallery();

  }


});
