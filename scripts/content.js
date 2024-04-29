var enableLogging = false;

var qrSizeDefault = 128;
var qrSize;

var qrOffsetWidthDefault = 20;
var qrOffsetWidth;

var qrOffsetHeightDefault = 20;
var qrOffsetHeight;

var qrLabelDefault = "^ Current Video URL ^";
var qrLabel;

var videoUrl = null;

const qrSizeInput = document.querySelector("#qrSizeInput");
const qrHeightOffsetInput = document.querySelector("#qrHeightOffsetInput");
const qrWidthOffsetInput = document.querySelector("#qrWidthOffsetInput");
const qrLabelInput = document.querySelector("#qrLabelInput");

const qrSizeInputValue = document.querySelector("#qrSizeInputValue");
const qrHeightOffsetInputValue = document.querySelector("#qrHeightOffsetInputValue");
const qrWidthOffsetInputValue = document.querySelector("#qrWidthOffsetInputValue");
const qrLabelInputValue = document.querySelector("#qrLabelInputValue");

function logMessage(message) {
  if (enableLogging) {
    console.log(message);
  }
}

// NOTE: probably could clean this stuff up but it is nice to have them as separate methods for debugging.
function getQRSize() {
  if (chrome.runtime?.id) {
    chrome.storage.sync.get(["qrSize"]).then((result) => {
      logMessage("YTATTRIBUTION --------  got qrSize  result.qrSize = " + result.qrSize)
      if (result === null || typeof result === "undefined" || !result.qrSize) {
        logMessage("YTATTRIBUTION --------  setting default for qrSize");
        result.qrSize = qrSizeDefault;
        chrome.storage.sync.set({ qrSize: qrSizeDefault });
      }
      if (qrSizeInput != null && typeof qrSizeInput != "undefined") {
        qrSizeInput.value = result.qrSize;
      }
      qrSize = result.qrSize;
    });
  }
}

function setQRSize() {
  if (chrome.runtime?.id) {
    if (qrSizeInput != null && typeof qrSizeInput != "undefined") {
      qrSizeInput.addEventListener("input", (event) => {
        chrome.storage.sync.set({ qrSize: event.target.value }).then(() => {
          logMessage("YTATTRIBUTION -------- set qrSize = " + event.target.value);
          if (qrSizeInputValue === null || typeof qrSizeInputValue === "undefined") {
            return
          }
          qrSizeInputValue.textContent = event.target.value;
        })
      });
    }
  }
}

function getQRHeightOffset() {
  if (chrome.runtime?.id) {
    chrome.storage.sync.get(["qrHeightOffset"]).then((result) => {
      logMessage("YTATTRIBUTION --------  got qrHeightOffset = " + result.qrHeightOffset)
      if (result === null || typeof result === "undefined" || !result.qrHeightOffset) {
        logMessage("YTATTRIBUTION --------  setting default for qrHeightOffset");
        result.qrHeightOffset = qrOffsetHeightDefault;
        chrome.storage.sync.set({ qrHeightOffset: result.qrHeightOffset });
      }
      if (qrHeightOffsetInput != null && typeof qrHeightOffsetInput != "undefined") {
        qrHeightOffsetInput.value = result.qrHeightOffset;
      }
      qrOffsetHeight = result.qrHeightOffset;
    });
  }
}

function setQRHeightOffset() {
  if (chrome.runtime?.id) {
    if (qrHeightOffsetInput != null && typeof qrHeightOffsetInput != "undefined") {
      qrHeightOffsetInput.addEventListener("input", (event) => {
        chrome.storage.sync.set({ qrHeightOffset: event.target.value }).then(() => {
          logMessage("YTATTRIBUTION -------- set qrHeightOffset = " + event.target.value);
          if (qrHeightOffsetInputValue === null || typeof qrHeightOffsetInputValue === "undefined") {
            return;
          }
          qrHeightOffsetInputValue.textContent = event.target.value;
        })
      });
    }
  }
}

function getQRWidthOffset() {
  if (chrome.runtime?.id) {
    chrome.storage.sync.get(["qrWidthOffset"]).then((result) => {
      logMessage("YTATTRIBUTION --------  got qrWidthOffset = " + result.qrWidthOffset)
      if (result === null || typeof result === "undefined" || !result.qrWidthOffset) {
        logMessage("YTATTRIBUTION --------  setting default for qrWidthOffset");
        result.qrWidthOffset = qrOffsetWidthDefault;
        chrome.storage.sync.set({ qrWidthOffset: result.qrWidthOffset });
      }
      if (qrWidthOffsetInput != null && typeof qrWidthOffsetInput != "undefined") {
        qrWidthOffsetInput.value = result.qrWidthOffset;
      }
      qrOffsetWidth = result.qrWidthOffset;
    });
  }
}

function setQRWidthOffset() {
  if (chrome.runtime?.id) {
    if (qrWidthOffsetInput != null && typeof qrWidthOffsetInput != "undefined") {
      qrWidthOffsetInput.addEventListener("input", (event) => {
        chrome.storage.sync.set({ qrWidthOffset: event.target.value }).then(() => {
          logMessage("YTATTRIBUTION -------- set qrWidthOffset = " + event.target.value);
          if (qrWidthOffsetInputValue === null || typeof qrWidthOffsetInputValue === "undefined") {
            return;
          }
          qrWidthOffsetInputValue.textContent = event.target.value;
        })
      });
    }
  }
}

function getQRLabel() {
  if (chrome.runtime?.id) {
    chrome.storage.sync.get(["qrLabel"]).then((result) => {
      logMessage("YTATTRIBUTION --------  got qrLabel  result.qrLabel = " + result.qrLabel)
      if (result === null || typeof result === "undefined" || !result.qrLabel) {
        logMessage("YTATTRIBUTION --------  setting default for qrLabel");
        result.qrLabel = qrLabelDefault;
        chrome.storage.sync.set({ qrLabel: qrLabelDefault });
      }
      if (qrLabelInput != null && typeof qrLabelInput != "undefined") {
        qrLabelInput.value = result.qrLabel;
      }
      qrLabel = result.qrLabel;
    });
  }
}

function setQRLabel() {
  if (chrome.runtime?.id) {
    if (qrLabelInput != null && typeof qrLabelInput != "undefined") {
      qrLabelInput.addEventListener("input", (event) => {
        chrome.storage.sync.set({ qrLabel: event.target.value }).then(() => {
          logMessage("YTATTRIBUTION -------- set qrLabel = " + event.target.value);
          if (qrLabelInputValue === null || typeof qrLabelInputValue === "undefined") {
            return
          }
          qrLabelInputValue.textContent = event.target.value;
        })
      });
    }
  }
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Function to create a QR code overlay
function createQROverlay(url) {
  logMessage("YTATTRIBUTION --------createQROverlay-------- createQROverlay")

  videoUrl = url;

  if (videoUrl === null || typeof videoUrl === "undefined" || videoUrl === "https://www.youtube.com/") {
    logMessage("YTATTRIBUTION --------createQROverlay-------- videoUrl null!!!!")
    sleep(800).then(() => {
      createQROverlay(window.location.href);
      return;
    });
  }

  // Find the YouTube player element
  const playerElement = document.getElementById("full-bleed-container");
  if (playerElement) {
    logMessage("YTATTRIBUTION --------createQROverlay-------- found full bleed container")
    oldQr = document.getElementById("qrOverlay")
    if (oldQr) {
      logMessage("YTATTRIBUTION --------createQROverlay-------- removing old QR code")
      oldQr.remove();
    }

    getQRSize();
    getQRHeightOffset();
    getQRWidthOffset();

    // Create a div to hold the QR code
    const qrOverlay = document.createElement('div');
    qrOverlay.id = 'qrOverlay';
    qrOverlay.style.position = 'absolute';
    qrOverlay.style.top = qrOffsetHeight + 'px';
    qrOverlay.style.right = qrOffsetWidth + 'px';
    qrOverlay.style.zIndex = '1000';


    logMessage("YTATTRIBUTION --------createQROverlay-------- videoUrl href = " + window.location.href)

    const qrDiv = document.createElement('div');
    qrDiv.id = 'qrcode';
    qrDiv.style.outline = "3px solid white"

    // Generate the QR code
    const qr = new QRCode(qrDiv, {
      text: videoUrl,
      width: qrSize,
      height: qrSize,
      colorDark: '#000',
      colorLight: '#fff',
    });

    logMessage("YTATTRIBUTION --------createQROverlay-------- videoUrl href = " + window.location.href)

    qr.clear();
    qr.makeCode(videoUrl);
    qrOverlay.appendChild(qrDiv);

    // Add the label to the bottom of the QR code.
    const qrLabelElement = document.createElement('div');
    qrLabelElement.id = 'qrLabel';
    qrLabelElement.style = 'text-align: center; margin-top: 5px; color: white; font-size: 1.3em;'
    qrLabelElement.textContent = qrLabel;
    qrOverlay.appendChild(qrLabelElement);


    logMessage("YTATTRIBUTION --------createQROverlay-------- Appending new qrOverlay" + qrOverlay)

    // Append the QR code to the player element
    playerElement.appendChild(qrOverlay);
  }
  else {
    logMessage("YTATTRIBUTION --------createQROverlay-------- waiting for player to load")
    sleep(800).then(() => {
      createQROverlay(window.location.href);
      return;
    });
  }
}

window.addEventListener("load", function load(event) {
  logMessage("YTATTRIBUTION --------load-------- event listener for load");

  getQRSize();
  getQRHeightOffset();
  getQRWidthOffset();
  getQRLabel();

  setQRSize();
  setQRHeightOffset();
  setQRWidthOffset();
  setQRLabel();

  window.navigation.addEventListener("navigate", (event) => {
    logMessage("YTATTRIBUTION ----navigate---- location changed!");
    videoUrl = "https://www.youtube.com/"
    createQROverlay(event.destination.url);
  })

  player = document.querySelector("video");
  if (player) {
    logMessage("YTATTRIBUTION --------player-------- found player");
    createQROverlay(window.location.href);
  }
}, false);
