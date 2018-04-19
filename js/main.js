$(document).ready(function () {
    $('#fullpage').fullpage();
});

$(document).keydown(function (e) {
    if (e.keyCode === 37) {
        $(".carousel-control-prev").click();
    }
    if (e.keyCode === 39) {
        $(".carousel-control-next").click();
    }
});


