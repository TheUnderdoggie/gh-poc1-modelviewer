/**
 * @Date:   2019-10-04T14:41:15+02:00
 * @Email:  code@bramkorsten.nl
 * @Project: RunWaste
 * @Filename: runwaste.js
 * @Last modified time: 2019-10-07T12:24:06+02:00
 * @Copyright: Copyright 2019 - Bram Korsten
 */

const version = "1.0.0";

var viewer;
var isModelLoading = false;

$(async function() {
  console.log(
    "RunWaste Model Viewer - Version " + version + " by Bram Korsten"
  );
  viewer = $("model-viewer");
  loadingWindow = $(".loader");
  await getModels();
  setupLoadingHandler();

  loadModel(0);

  window.requestAnimationFrame(onFrame);
});

function setupLoadingHandler() {
  viewer.on("model-visibility", function(e) {
    if (e.detail.visible) {
      isLoading(false);
      console.log("Loading complete!");
    }
  });
}

var loaderTimeout;

function isLoading(isLoading) {
  if (isLoading) {
    loadingWindow.addClass("transitionIn").removeClass("transitionOut");
    isModelLoading = true;
  } else {
    loadingWindow.addClass("transitionOut").removeClass("transitionIn");
    isModelLoading = false;
    loaderTimeout = setTimeout(function() {
      loadingWindow.removeClass("transitionOut");
    }, 700);
  }
}

function _isModelLoading() {
  return isModelLoading;
}
