var models;
var animations;
var stopTime;

const modelLocation = "assets/models/";
const dataLocation = "assets/data/";

async function getModels() {
  const response = await fetch(dataLocation + "models.json");
  models = await response.json();
  // stopTime = models.stop.frames / models.stop.framerate;
  return models;
}

function loadModel(model) {
  isLoading(true);
  setTimeout(function() {
    model = models.models[model];
    const modelSrc = modelLocation + model.gltf;
    viewer.attr("src", modelSrc);
    viewer.attr("animation-name", "stop");
    stopTime = model.animations.stop.frames / model.animations.stop.framerate;
  }, 700);
}

function onFrame() {
  window.requestAnimationFrame(onFrame);
  viewer.each(function(i, e) {
    if (
      $(e).attr("animation-name") == "stop" &&
      e.currentTime >= stopTime - 1
    ) {
      $(e).attr("animation-name", "idle");
    }
  });
}
