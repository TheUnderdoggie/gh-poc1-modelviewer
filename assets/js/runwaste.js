/**
 * @Date:   2019-10-04T14:41:15+02:00
 * @Email:  code@bramkorsten.nl
 * @Project: RunWaste
 * @Filename: runwaste.js
 * @Last modified time: 2019-10-21T12:13:55+02:00
 * @Copyright: Copyright 2019 - Bram Korsten
 */

const version = "1.0.2";

var viewer;
var selector;
var isModelLoading = false;
var changeModelButton;

$(async function() {
  console.log(
    "Run Waste Model Viewer - Version " + version + " by Bram Korsten"
  );
  viewer = $("model-viewer");
  selector = $(".selectionOverlay");
  loadingWindow = $(".loader");
  loadingWindow.removeClass("invisible");
  setupClickHandlers();
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
    loadingWindow.removeClass("invisible");
    setTimeout(function() {
      loadingWindow.addClass("transitionIn").removeClass("transitionOut");
      isModelLoading = true;
    }, 10);
  } else {
    loadingWindow.addClass("transitionOut").removeClass("transitionIn");
    isModelLoading = false;
    loaderTimeout = setTimeout(function() {
      loadingWindow.removeClass("transitionOut");
      loadingWindow.addClass("invisible");
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

function setupClickHandlers() {
  $(".openAbout").click(function() {
    $(".aboutOverlay").toggleClass("visible");
  });

  $(".aboutOverlay .closeButton").click(function() {
    $(".aboutOverlay").toggleClass("visible");
  });

  $(".toggleMobileMenu").click(function() {
    toggleMenu();
  });

  $(".mobileMenu .menuButton").click(function() {
    toggleMenu();
  });
}

function toggleMenu() {
  $("#mobileMenu").toggleClass("visible");

  if ($("#mobileMenu").hasClass("visible")) {
    $("#menuIcon .burger").removeClass("visible");
    $("#menuIcon .close").addClass("visible");
  } else {
    $("#menuIcon .burger").addClass("visible");
    $("#menuIcon .close").removeClass("visible");
  }
}
