// TODO:
//
//      2. fix the bugs for not having the correct url
//      3. add a donation option in the popup.html page -- link to the cofi page or whatever
//      4. upload to the chrome store - https://chrome.google.com/webstore/devconsole/0132d04a-6270-4514-8db7-5457ddd9f8f2


// TODO: currently there is a bug where if you have a video paused and select another one then the URL for the QR code is stale...
//      stale if the video ends and another recommendation is clicked as well

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

function getQRSize() {
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

function setQRSize() {
  if (qrSizeInput != null && typeof qrSizeInput != "undefined") {
    qrSizeInput.addEventListener("input", (event) => {
      chrome.storage.sync.set({ qrSize: event.target.value }).then(() => {
        logMessage("YTATTRIBUTION -------- set qrSize = " + event.target.value);
        qrSizeInputValue.textContent = event.target.value;
      })
    });
  }
}

function getQRHeightOffset() {
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

function setQRHeightOffset() {
  if (qrHeightOffsetInput != null && typeof qrHeightOffsetInput != "undefined") {
    qrHeightOffsetInput.addEventListener("input", (event) => {
      chrome.storage.sync.set({ qrHeightOffset: event.target.value }).then(() => {
        logMessage("YTATTRIBUTION -------- set qrHeightOffset = " + event.target.value);
        qrHeightOffsetInputValue.textContent = event.target.value;
      })
    });
  }
}

function getQRWidthOffset() {
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

function setQRWidthOffset() {
  if (qrWidthOffsetInput != null && typeof qrWidthOffsetInput != "undefined") {
    qrWidthOffsetInput.addEventListener("input", (event) => {
      chrome.storage.sync.set({ qrWidthOffset: event.target.value }).then(() => {
        logMessage("YTATTRIBUTION -------- set qrWidthOffset = " + event.target.value);
        qrWidthOffsetInputValue.textContent = event.target.value;
      })
    });
  }
}

function getQRLabel() {
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

function setQRLabel() {
  if (qrLabelInput != null && typeof qrLabelInput != "undefined") {
    qrLabelInput.addEventListener("input", (event) => {
      chrome.storage.sync.set({ qrLabel: event.target.value }).then(() => {
        logMessage("YTATTRIBUTION -------- set qrLabel = " + event.target.value);
        qrLabelInputValue.textContent = event.target.value;
      })
    });
  }
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Function to create a QR code overlay
function createQROverlay() {
  logMessage("YTATTRIBUTION --------createQROverlay-------- createQROverlay")

  videoUrl = window.location.href;

  if (videoUrl === null || typeof videoUrl === "undefined" || videoUrl === "https://www.youtube.com/") {
    logMessage("YTATTRIBUTION --------createQROverlay-------- videoUrl null!!!!")
    sleep(800).then(() => {
      createQROverlay();
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
      createQROverlay();
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
    createQROverlay();
  })

  player = document.querySelector("video");
  if (player) {
    logMessage("YTATTRIBUTION --------player-------- found player");
    createQROverlay();
  }
}, false);
