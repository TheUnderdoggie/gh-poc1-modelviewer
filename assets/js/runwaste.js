var viewer;

$(async function() {
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
    }
  });
}

var loaderTimeout;

function isLoading(isLoading) {
  if (isLoading) {
    loadingWindow.addClass("transitionIn").removeClass("transitionOut");
  } else {
    loadingWindow.addClass("transitionOut").removeClass("transitionIn");
    loaderTimeout = setTimeout(function() {
      loadingWindow.removeClass("transitionOut");
    }, 700);
  }
}
