$(document).ready(function() {
  $("#fullpage").fullpage({
    onLeave: function(index, nextIndex, direction) {
      if(nextIndex === 2) {
        gamestart("#pixelart-game");
      } else if(nextIndex === 3) {
        gamestart("#hand-drawn-game");
      } else if (nextIndex === 4) {
        gamestart("#flat-game");
      }
    }
  });
});

$(document).keydown(function (e) {
    if (e.keyCode === 37) {
        $(".carousel-control-prev").click();
    }
    if (e.keyCode === 39) {
        $(".carousel-control-next").click();
    }
});
