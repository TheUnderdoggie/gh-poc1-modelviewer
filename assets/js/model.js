/**
 * @Date:   2019-10-04T11:21:03+02:00
 * @Email:  code@bramkorsten.nl
 * @Project: RunWaste
 * @Filename: model.js
 * @Last modified time: 2019-10-21T13:20:38+02:00
 * @Copyright: Copyright 2019 - Bram Korsten
 */

var models;
var currentModel;
var currentModelId = 0;
var animations;
var stopTime;

const modelLocation = "assets/models/";
const dataLocation = "assets/data/";

async function getModels() {
  // Fetch the models from the models.json file
  const response = await fetch(dataLocation + "models.json");
  models = await response.json();
  // Setup the selection system
  parseModels(models);
  return models;
}

async function parseModels(models) {
  const response = await fetch("assets/templates/selection.mst");
  const selectionTemplate = await response.text();

  for (var model in models.models) {
    const renderedView = Mustache.render(selectionTemplate, {
      modelId: model,
      modelPoster: "assets/models/" + models.models[model].poster,
      modelName: models.models[model].name
    });
    $("#selectionContainer").append(renderedView);
  }

  bindModelSelectors();
}

function loadModel(model) {
  isLoading(true);
  setTimeout(function() {
    showSelector(false);
    currentModelId = model;
    currentModel = models.models[model];
    console.log("Loading model: '" + currentModel.name + "'");
    setSource(currentModel);
    setupViewerScene(currentModel);
    viewer.attr("animation-name", _getStopAnimation(currentModel));
    currentModel.stopTime =
      currentModel.animations.stop.frames /
      currentModel.animations.stop.framerate;
  }, 700);
}

function setSource(model) {
  const modelSrc = modelLocation + model.gltf;
  viewer.attr("src", modelSrc);
  if (model.hasOwnProperty("usdz")) {
    viewer.attr("ios-src", model.usdz);
  } else {
    viewer.removeAttr("ios-src");
  }
}

function setupViewerScene(model) {
  if (currentModel.hasOwnProperty("sceneOptions")) {
    const sceneOptions = model.sceneOptions;
    if (sceneOptions.hasOwnProperty("cameraOrbit")) {
      viewer.attr("camera-orbit", sceneOptions.cameraOrbit);
    } else {
      viewer.removeAttr("camera-orbit");
    }
    if (sceneOptions.hasOwnProperty("autoRotate") && sceneOptions.autoRotate) {
      viewer.attr("auto-rotate", true);
      if (sceneOptions.hasOwnProperty("autoRotateDelay")) {
        viewer.attr("auto-rotate-delay", sceneOptions.autoRotateDelay);
      } else {
        viewer.removeAttr("auto-rotate-delay");
      }
    } else {
      viewer.removeAttr("auto-rotate");
    }
    return true;
  } else {
    console.warn("Model has no scene options. Consider implementing them.");
    return false;
  }
}

function onFrame() {
  window.requestAnimationFrame(onFrame);
  if (!_isModelLoading()) {
    viewer.each(function(i, e) {
      if (_isStopAnimation(e) && _stopAnimationFinished(e)) {
        $(e).attr("animation-name", _getIdleAnimation(currentModel));
      }
    });
  }
}

function bindModelSelectors() {
  $(".selectionOverlay .selection").click(function() {
    const modelId = $(this).data("model-id");
    if (modelId !== undefined) {
      if (modelId == currentModelId) {
        console.log("Model already selected");
        showSelector(false);
        changeModelButton.addClass("visible");
        return false;
      }
      loadModel($(this).data("model-id"));
      return false;
    }
    console.warn("The selected model does not have a valid ID");
  });
}

function _isStopAnimation(viewer) {
  if (
    currentModel &&
    currentModel.animations.stop.name == $(viewer).attr("animation-name")
  ) {
    return true;
  }
  return false;
}

function _stopAnimationFinished(viewer) {
  if (viewer.currentTime >= currentModel.stopTime - 1) {
    return true;
  }
  return false;
}

function _getIdleAnimation(model, returnObject = false) {
  if (returnObject) {
    return model.animations.idle;
  }
  return model.animations.idle.name;
}

function _getStopAnimation(model, returnObject = false) {
  if (returnObject) {
    return model.animations.stop;
  }
  return model.animations.stop.name;
}
