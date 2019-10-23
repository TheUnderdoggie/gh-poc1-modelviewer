# Run Waste Model Viewer

This concept was developed by Bram Korsten for the 2019 Dutch Design Week. It is a website for showing off 3D models with animations using Google's Model Viewer webcomponent. Rather than using one viewer per model, this system allows for the use of multiple models in one viewer, with Javascript hooks for custom loading animations, getting model information and more.

## Infrastructure

The files relevant to the actual viewing of models are located in the following folders:

```javascript
"/assets/js"; // runwaste.js - model.js
"/assets/data"; // models.json
"/assets/models"; // All models for the project
```

### Runwaste.js

`runwaste.js` is responsible for most of the actions regarding animations. It does not feature a lot of code related to actually loading and displaying models. The only required functions calling here are:

```Javascript
var viewer;

$(async function() {
    viewer = $("model-viewer"); // Make sure to setup a global variable containing the viewer DOM object

    await getModels(); // Load the model information from the models.json file
    loadModel(0); // Load the first model from that list
});
```

### Model.js

`model.js` is responsible for most of the heavy lifting here. It contains the functions for retrieving, parsing and displaying the models and their animations. Before running any code, be sure to match the `modelLocation` and `dataLocation` to their folders. (This defaults to `assets/models` and `assets/data`)

We'll talk more about the functions in the upcoming sections!

## Getting the model information

The first step in displaying your models is retrieving a list with all the information required for a model. This list is a `JSON` based list that looks something like this:

```Json
{
  "models": [
    {
      "name": "Model Name",
      "poster": "model_path/poster.jpg",
      "gltf": "model_path/model.gltf",
      "sceneOptions": {
        "cameraOrbit": "10deg 105deg 10m",
        "autoRotate": false,
        "autoRotateDelay": 5000
      },
      "defaultAnimation": "dancing",
      "animations": {
        "idle": {
          "name": "dancing",
          "frames": 489,
          "framerate": 30
        },
        "stop": {
          "name": "stop",
          "frames": 91,
          "framerate": 30
        }
      }
    },
    {
        // Repeat per model
    },
  ]
}
```

This list is retrieved in the `getModels()` function, which in turn calls `parseModels(models)` with the retrieved Javascript Object. `parseModels(models)` a function for displaying a list of models on the webpage for selection. This uses [Mustache.js](https://github.com/janl/mustache.js/) for easy rendering of complex HTML. This _ofcourse_ is not necessary, but can be very useful.

## Loading models into the model Viewer

The next step is to load a model into our viewer DOM. This is done with the `loadModel(model)` function. Since our `getModels()` function returns an array of Javascript Object which are the models, `loadModel(model)` requires an index of this array. The function looks like this:

```javascript
function loadModel(model) {
  // Requires an index of the JSON based array
  currentModelId = model; // Set the global 'currentModelId' to the index given
  currentModel = models.models[model]; // Set the 'currentModel' object to the object from the array

  setSource(currentModel); // Call setSource(), which does exactly that. Set the GLTF and optional USDZ source
  setupViewerScene(currentModel); // Setup the scene, based on the 'sceneOptions' object in the model
  viewer.attr("animation-name", _getStopAnimation(currentModel)); // Set the current animation to the stop animation

  // This is a special one. It calculates the time it takes for the model
  // to get to the end of the stopping animation. This is explained later.
  currentModel.stopTime =
    currentModel.animations.stop.frames /
    currentModel.animations.stop.framerate;
}
```

## Animations

This application was written with one specific purpose. We needed a model to have a different animation when first loaded, and blend into a 'idle' animation after one time. This idle animation would then loop. The `onFrame()` function takes care of this.

```javascript
// This function is run on every frame of the window
function onFrame() {
  // Request a new event on the next frame
  window.requestAnimationFrame(onFrame);
  // If the model is not still loading (thus animating)
  if (!_isModelLoading()) {
    viewer.each(function(i, e) {
      // Check if the animation is the stop animation and if that animation is almost finished
      if (_isStopAnimation(e) && _stopAnimationFinished(e)) {
        // If so, set the current animation to the idle animation and let the viewer handle blending
        $(e).attr("animation-name", _getIdleAnimation(currentModel));
      }
    });
  }
}
```

This function should probably be rewritten for being able to do all sorts of blending, playing and more, but I don't know if I will ever do that. If you feel like you can and want to contribute to this, feel free to send me a pull request.
