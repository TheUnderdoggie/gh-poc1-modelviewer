/**
 * @Date:   2019-10-04T11:21:03+02:00
 * @Email:  code@bramkorsten.nl
 * @Project: RunWaste
 * @Filename: model.js
 * @Last modified time: 2019-10-07T12:24:47+02:00
 * @Copyright: Copyright 2019 - Bram Korsten
 */

var models;
var currentModel;
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
    currentModel = models.models[model];
    console.log("Loading model: '" + currentModel.name + "'");
    const modelSrc = modelLocation + currentModel.gltf;
    viewer.attr("src", modelSrc);
    if (currentModel.hasOwnProperty("usdz")) {
      viewer.attr("ios-src", modelSrc);
    } else {
      viewer.attr("ios-src", "");
    }
    viewer.attr("animation-name", _getStopAnimation(currentModel));
    currentModel.stopTime =
      currentModel.animations.stop.frames /
      currentModel.animations.stop.framerate;
  }, 700);
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

function _isStopAnimation(viewer) {
  if (currentModel.animations.stop.name == $(viewer).attr("animation-name")) {
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
