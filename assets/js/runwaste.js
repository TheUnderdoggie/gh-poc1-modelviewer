/**
 * @Date:   2019-10-04T14:41:15+02:00
 * @Email:  code@bramkorsten.nl
 * @Project: RunWaste
 * @Filename: runwaste.js
 * @Last modified time: 2019-10-07T16:51:26+02:00
 * @Copyright: Copyright 2019 - Bram Korsten
 */

const version = "1.0.0";

var viewer;
var selector;
var isModelLoading = false;
var changeModelButton;

$(async function() {
  console.log(
    "RunWaste Model Viewer - Version " + version + " by Bram Korsten"
  );
  viewer = $("model-viewer");
  selector = $(".selectionOverlay");
  loadingWindow = $(".loader");
  changeModelButton = $(".changeModelButton");
  changeModelButton.click(function() {
    showSelector(true);
  });
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
      changeModelButton.addClass("visible");
    }, 700);
  }
}

function _isModelLoading() {
  return isModelLoading;
}

function showSelector(visible) {
  if (visible) {
    selector.addClass("visible");
    changeModelButton.removeClass("visible");
    return true;
  }
  selector.removeClass("visible");
  return false;
}
