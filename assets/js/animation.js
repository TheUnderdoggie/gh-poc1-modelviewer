var viewers;
var animations;
var stopTime;

$(async function() {
  viewers = $("model-viewer");

  const response = await fetch("assets/models/char1/animation.json");
  animations = await response.json();

  stopTime = animations.stop.frames / animations.stop.framerate;

  window.requestAnimationFrame(onFrame);
});

function onFrame() {
  window.requestAnimationFrame(onFrame);
  viewers.each(function(i, e) {
    if (
      $(e).attr("animation-name") == "stop" &&
      e.currentTime >= stopTime - 1
    ) {
      // e.pause();
      $(e).attr("animation-name", "idle");
    }
    // console.log(e.currentTime);
  });
}
