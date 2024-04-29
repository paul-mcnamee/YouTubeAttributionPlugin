// TODO:
//
//      2. fix the bugs for not having the correct url
//      3. add a donation option in the popup.html page -- link to the cofi page or whatever
//      4. upload to the chrome store - https://chrome.google.com/webstore/devconsole/0132d04a-6270-4514-8db7-5457ddd9f8f2


// TODO: currently there is a bug where if you have a video paused and select another one then the URL for the QR code is stale...
//      stale if the video ends and another recommendation is clicked as well

var enableLogging = false;

var qrSizeDefault = '96';
var qrSize;

var qrOffsetWidthDefault = '64';
var qrOffsetWidth;

var qrOffsetHeightDefault = '64';
var qrOffsetHeight;

var videoUrl = null;

var qrSizeInput = document.querySelector("#qrSizeInput");
var qrHeightOffsetInput = document.querySelector("#qrHeightOffsetInput");
var qrWidthOffsetInput = document.querySelector("#qrWidthOffsetInput");
var qrSizeInputValue = document.querySelector("#qrSizeInputValue");
var qrHeightOffsetInputValue = document.querySelector("#qrHeightOffsetInputValue");
var qrWidthOffsetInputValue = document.querySelector("#qrWidthOffsetInputValue");

function logMessage(message){
  if (enableLogging) {
    console.log(message);
  }
}

function getQRSize() {
  qrSizeInput = document.querySelector("#qrSizeInput");
  chrome.storage.sync.get(["qrSize"]).then((result) => {
    logMessage("YTATTRIBUTION --------  got qrSize  result.qrSize = " + result.qrSize)
    if (result === null || typeof result === "undefined" || !result.qrSize) {
      logMessage("YTATTRIBUTION --------  setting default for qrSize");
      result.qrSize = qrSizeDefault;
      chrome.storage.sync.set({qrSize: qrSizeDefault});
    }

    if (qrSizeInput != null && typeof qrSizeInput != "undefined") {
      qrSizeInput.value = result.qrSize;
    }

    qrSize = result.qrSize;
  });
}

function setQRSize() {
  qrSizeInput = document.querySelector("#qrSizeInput");
  if (qrSizeInput != null && typeof qrSizeInput != "undefined") {
    qrSizeInput.addEventListener("input", (event) => {
      chrome.storage.sync.set({qrSize: event.target.value}).then( () => {
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
      chrome.storage.sync.set({qrHeightOffset: result.qrHeightOffset});
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
      chrome.storage.sync.set({qrHeightOffset: event.target.value}).then( () => {
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
      chrome.storage.sync.set({qrWidthOffset: result.qrWidthOffset});
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
      chrome.storage.sync.set({qrWidthOffset: event.target.value}).then( () => {
        logMessage("YTATTRIBUTION -------- set qrWidthOffset = " + event.target.value);
        qrWidthOffsetInputValue.textContent = event.target.value;
      })
    });
  }
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Function to create a QR code overlay
function createQROverlay() {
  logMessage("YTATTRIBUTION --------createQROverlay-------- createQROverlay")

  videoUrl = window.location.href;

  if (videoUrl === null || typeof videoUrl === "undefined" || videoUrl === "https://www.youtube.com/"){
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
    if (oldQr)
    {
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
    qrOverlay.style.outline = "3px solid white"

    logMessage("YTATTRIBUTION --------createQROverlay-------- videoUrl href = " + window.location.href)

    const qrDiv = document.createElement('div');
    qrDiv.id = 'qrcode';

    // Generate the QR code
    const qr = new QRCode(qrDiv, {
      text: videoUrl,
      width: qrSize,
      height: qrSize,
      colorDark : '#000',
      colorLight : '#fff',
    });

    logMessage("YTATTRIBUTION --------createQROverlay-------- videoUrl href = " + window.location.href)

    qr.clear();
    qr.makeCode(videoUrl);
    qrOverlay.appendChild(qrDiv);

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

window.addEventListener("load", function load(event){
    logMessage("YTATTRIBUTION --------load-------- event listener for load");

    qrSizeInput = document.querySelector("#qrSizeInput");
    qrHeightOffsetInput = document.querySelector("#qrHeightOffsetInput");
    qrWidthOffsetInput = document.querySelector("#qrWidthOffsetInput");
    qrSizeInputValue = document.querySelector("#qrSizeInputValue");
    qrHeightOffsetInputValue = document.querySelector("#qrHeightOffsetInputValue");
    qrWidthOffsetInputValue = document.querySelector("#qrWidthOffsetInputValue");

    getQRSize();
    getQRHeightOffset();
    getQRWidthOffset();

    setQRSize();
    setQRHeightOffset();
    setQRWidthOffset();

    window.navigation.addEventListener("navigate", (event) => {
        logMessage("YTATTRIBUTION ----navigate---- location changed!");
        createQROverlay()
    })

    player = document.querySelector("video");
    if (player)
    {
      logMessage("YTATTRIBUTION --------player-------- found player");
      createQROverlay()
    }
},false);
