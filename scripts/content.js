var qrSizeHeight = '96'
var qrSizeWidth = '96'
var qrOffsetWidth = '64'
var qrOffsetHeight = '64'
var videoUrl = null

// TODO:
//
//      1. Add customization for width and height offsets into the popup.html
//      2. fix the bugs for not having the correct url
//      3. add a donation option in the popup.html page -- link to the cofi page or whatever
//      4. upload to the chrome store - https://chrome.google.com/webstore/devconsole/0132d04a-6270-4514-8db7-5457ddd9f8f2


// TODO: currently there is a bug where if you have a video paused and select another one then the URL for the QR code is stale...
//      stale if the video ends and another recommendation is clicked as well


function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// TODO: I think we can remove this
// function findReferenceNode() {
//   const selectors = [
//     "#player-container-id", // Mobile YouTube
//     "#movie_player",
//     ".html5-video-player", // May 2023 Card-Based YouTube Layout
//     "#c4-player", // Channel Trailer
//     "#player-container", // Preview on hover
//     "#main-panel.ytmusic-player-page", // YouTube music
//     "#player-container .video-js", // Invidious
//     ".main-video-section > .video-container", // Cloudtube
//     ".shaka-video-container", // Piped
//     "#player-container.ytk-player", // YT Kids
//   ];

//   let referenceNode = document.querySelector(selectors);

//   if (referenceNode === null) {
//     //for embeds
//     const player = document.getElementById("player");
//     referenceNode = player?.firstChild;
//     if (referenceNode) {
//       let index = 1;

//       //find the child that is the video player (sometimes it is not the first)
//       while (index < player.children.length && (!referenceNode.classList?.contains("html5-video-player") || !referenceNode.classList?.contains("ytp-embed"))) {
//         referenceNode = player.children[index];

//         index++;
//       }
//     }
//   }

//   return referenceNode;
// }

// Function to create a QR code overlay
function createQROverlay() {
  console.log("YTATTRIBUTION --------createQROverlay-------- createQROverlay")

  videoUrl = window.location.href;

  if (!videoUrl || videoUrl === "https://www.youtube.com/"){
  console.log("YTATTRIBUTION --------createQROverlay-------- videoUrl null!!!!")
    sleep(800).then(() => {
      createQROverlay();
      return;
    });
  }

  // Find the YouTube player element
  const playerElement = document.getElementById("full-bleed-container");
  if (playerElement) {
    console.log("YTATTRIBUTION --------createQROverlay-------- found full bleed container")
    oldQr = document.getElementById("qrOverlay")
    if (oldQr)
    {
      console.log("YTATTRIBUTION --------createQROverlay-------- removing old QR code")
      oldQr.remove();
    }
  // Create a div to hold the QR code
  const qrOverlay = document.createElement('div');
  qrOverlay.id = 'qrOverlay';
  qrOverlay.style.position = 'absolute';
  qrOverlay.style.top = qrOffsetHeight + 'px';
  qrOverlay.style.right = qrOffsetWidth + 'px';
  qrOverlay.style.zIndex = '1000';
  qrOverlay.style.outline = "3px solid white"

  console.log("YTATTRIBUTION --------createQROverlay-------- videoUrl href = " + window.location.href)

  const qrDiv = document.createElement('div');
  qrDiv.id = 'qrcode';

  const qr = new QRCode(qrDiv, {
    text: videoUrl,
    width: qrSizeWidth,
    height: qrSizeHeight,
    colorDark : '#000',
    colorLight : '#fff',
  });

  console.log("YTATTRIBUTION --------createQROverlay-------- videoUrl href = " + window.location.href)

  qr.clear();
  qr.makeCode(videoUrl);
  qrOverlay.appendChild(qrDiv);

  console.log("YTATTRIBUTION --------createQROverlay-------- Appending new qrOverlay" + qrOverlay)

  // Append the QR code to the player element
  playerElement.appendChild(qrOverlay);
  }
  else {
    console.log("YTATTRIBUTION --------createQROverlay-------- waiting for player to load")
    sleep(800).then(() => {
      createQROverlay();
      return;
    });
  }
}

window.addEventListener("load", function load(event){
    console.log("YTATTRIBUTION ---------------- event listener for load");

    window.navigation.addEventListener("navigate", (event) => {
        console.log('location changed!');
        createQROverlay()
    })

    player = document.querySelector("video");
    if (player)
    {
      console.log("YTATTRIBUTION --------player-------- found player");
      createQROverlay()
    }
},false);
