const camera = document.getElementById("camera");
const button = document.querySelector("button");
const camera_container = document.getElementById("camera-container");
let stream;
let mediaRecorder;
let options;
let chunks = [];
let blob;
let blobURL;

startCamera();

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode: { exact: "environment" },
      },
    });
    camera.srcObject = stream;
  } catch (error) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode: { exact: "user" },
        },
      });
      camera.srcObject = stream;
    } catch (error) {
      console.error("Device has no camera");
    }
  }
}

button.addEventListener("click", async () => {
  try {
    if (MediaRecorder.isTypeSupported("video/mp4")) {
      options = { mimeType: "video/mp4", videoBitsPerSecond: 100000 };
    } else {
      options = { mimeType: "video/webm" };
    }
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      blob = new Blob(chunks, { type: options.mimeType });
      blobURL = URL.createObjectURL(blob);
      const videoElement = document.createElement("video");
      videoElement.setAttribute("id", "recording");
      videoElement.loop = true;
      videoElement.muted = true;
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.src = blobURL;
      camera_container.innerHTML = "";
      camera_container.appendChild(videoElement);
    };

    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
    }, 1500);
  } catch (error) {
    console.error("Error recording video:", error);
  }
});
