var jcanvas = $("#pixelart-game");
var canvas = jcanvas[0];
var context = canvas.getContext("2d");

jcanvas.width(jcanvas.height());

var resizeId;
$(window).resize(function() {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});

function doneResizing(){
    jcanvas.width(jcanvas.height());
}

var width = canvas.width / 30;
var height = canvas.height / 30;



function body() {
    this.x = 0;
    this.y = 0;
}

function snack() {
    this.x = width * Math.floor(Math.random() * 29);
    this.y = height * Math.floor(Math.random() * 29);
    console.log("new snack: " + this.x + " " + this.y);

}



function snake() {
    this.bodyparts = [this];
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.direction = 0;

    this.move = function() {
        for(var i = this.bodyparts.length - 1; i !== 0; i--) {

            this.bodyparts[i].y = this.bodyparts[i - 1].y;
            this.bodyparts[i].x = this.bodyparts[i - 1].x;
        }
        if(this.direction === 0) { // Up
            this.y -= height;
        } else if(this.direction === 1) { // Right
            this.x -= width;
        } else if(this.direction === 2) { // Down
            this.y += height;
        } else if(this.direction === 3) { // Left
            this.x += width;
        }
    }

    this.draw = function() {
        for(var i = 0; i < this.bodyparts.length; i++) {
            context.fillStyle = "#FFFFFF";
            context.fillRect(this.bodyparts[i].x, this.bodyparts[i].y, width, height);

        }
    }
}

var anchor = new snake();

window.addEventListener("keydown", this.move, false);

update();

function move(e) {

    if(e.keyCode === 87) { // W
        anchor.direction = 0;
    } else if(e.keyCode === 65) { // A
        anchor.direction = 1;
    } else if(e.keyCode === 83) { // S
        anchor.direction = 2;
    } else if(e.keyCode === 68) { // D
        anchor.direction = 3;
    }

}

var cursnack;

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);

            //Draw Player
    if(cursnack) {
        if(anchor.x === cursnack.x && anchor.y === cursnack.y) {
            cursnack = null;
            anchor.bodyparts.push(new body());
        }
    } else {
            cursnack = new snack();
    }
    anchor.move();

    if(cursnack) {
        context.fillStyle = "#FF0000";
        context.fillRect(cursnack.x, cursnack.y, width, height);
    }

    anchor.draw();

    window.setTimeout(update, 100);
}
