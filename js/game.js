var jcanvas = $("#pixelart-game");
var canvas = jcanvas[0];
var context = canvas.getContext("2d");
var resizeId;
var tilewidth;
var tileheight;
var cursnack;
var anchor;
var updatetimeout;
var headimg, snackimg, bodyimg, tailimg;

function doneResizing(){
    jcanvas.width(jcanvas.height());
    tilewidth = canvas.width / 30;
    tileheight = canvas.height / 30;
}

function body() {
    this.x = 0;
    this.y = 0;
    this.direction = 0;
}

function collide(a, b) {
    if(a.x === b.x && a.y === b.y) {
        return true;
    } else {
        return false;
    }
}

function snack() {
    var created = false;

    while(created === false) {
        this.x = tilewidth * Math.floor(Math.random() * 29);
        this.y = tileheight * Math.floor(Math.random() * 29);
        for(var i = 0; i < anchor.bodyparts.length; i++) {
            if (collide(this, anchor.bodyparts[i])) {
                created = false;
            } else {
                created = true;
                break;
            }
        }
    }
    //Still created inside Snake sometimes
    console.log("new snack: " + this.x + " " + this.y);
}

function snake() {
    this.bodyparts = [this];
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.direction = 0;
    this.newdirection = 0;

    this.move = function() {
        if(this.newdirection != 0) {
            this.direction = this.newdirection;
        }
        this.newdirection = 0;

        for(var i = this.bodyparts.length - 1; i !== 0; i--) {
            this.bodyparts[i].y = this.bodyparts[i - 1].y;
            this.bodyparts[i].x = this.bodyparts[i - 1].x;
            this.bodyparts[i].direction = this.bodyparts[i - 1].direction;
        }
        if(this.direction === "up") {
            this.y -= tileheight;
        } else if(this.direction === "left") {
            this.x -= tilewidth;
        } else if(this.direction === "down") {
            this.y += tileheight;
        } else if(this.direction === "right") {
            this.x += tilewidth;
        } 
    }
    this.draw = function() {

        var rotation = 0;
        var widthmod = 1;
        var heightmod = 1;

        for(var i = 0; i < this.bodyparts.length; i++) {
           
            rotation = 0;
            widthmod = 1;
            heightmod = 1;

            if(i === 0 || i === this.bodyparts.length - 1) { // HEAD OR TAIL
                context.save();

                if(this.bodyparts[i].direction === "right") {
                    context.translate(this.bodyparts[i].x + tilewidth, this.bodyparts[i].y)
                    rotation = 90;
                    widthmod = 0.5;
                    heightmod = 2;
                } else if(this.bodyparts[i].direction === "left") {
                    context.translate(this.bodyparts[i].x, this.bodyparts[i].y + tileheight)                
                    rotation = -90;
                    widthmod = 0.5;
                    heightmod = 2;
                } else if(this.bodyparts[i].direction === "down") {
                    context.translate(this.bodyparts[i].x + tilewidth, this.bodyparts[i].y + tileheight)                
                    rotation = 180;
                } else {
                    context.translate(this.bodyparts[i].x, this.bodyparts[i].y)
                }

                context.rotate(rotation * (Math.PI / 180));

                console.log("rotation" + rotation * (Math.PI / 180));

                if(i === 0) { 
                    context.drawImage(headimg, 0, 0, tilewidth * widthmod, tileheight * heightmod); 
                } else {
                    context.drawImage(tailimg, 0, 0, tilewidth * widthmod, tileheight * heightmod);
                }

                context.restore();

            } else { // BODY
                context.drawImage(bodyimg, this.bodyparts[i].x, this.bodyparts[i].y, tilewidth, tileheight);        
            }
        }
    }
}

function move(e) {
    if(e.keyCode === 87) { // W
        if(anchor.direction != "down") {
            anchor.newdirection = "up";
        }
    } else if(e.keyCode === 65) { // A
        if(anchor.direction != "right") {
            anchor.newdirection = "left";
        }
    } else if(e.keyCode === 83) { // S
        if(anchor.direction != "up") {
            anchor.newdirection = "down";
        }
    } else if(e.keyCode === 68) { // D
        if(anchor.direction != "left") {
            anchor.newdirection = "right";
        }
    }
}

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    //Snack logic
    if(cursnack) {
        if(anchor.x === cursnack.x && anchor.y === cursnack.y) {
            cursnack = null;
            anchor.bodyparts.push(new body());
        }
    } else {
        cursnack = new snack();
    }

    //Movement per tick
    anchor.move();

    //Check if lost
    for(var i = 1; i < anchor.bodyparts.length; i++) {
        if (collide(anchor, anchor.bodyparts[i])) {
            gameover();
        }
    }

    if(anchor.x > tilewidth * 29 || anchor.x < 0 || anchor.y > tileheight * 29 || anchor.y < 0) {
        gameover();
    }

    //Drawing
    if(cursnack) {
        context.drawImage(snackimg, cursnack.x, cursnack.y, tilewidth, tileheight);
    }
    anchor.draw();

    updatetimeout = setTimeout(update, 100);
}

function gameover() {
    alert("You Lost!");
    anchor = new snake();
    cursnack = new snack();
}

function gamestart(canvasname) {
    clearTimeout(updatetimeout);
    jcanvas = $(canvasname);
    canvas = jcanvas[0];
    context = canvas.getContext("2d");
    window.addEventListener("keydown", move, false); // Start input hook
    doneResizing(); //Set width and height
    anchor = new snake();
    cursnack = new snack();

    headimg = new Image();
    bodyimg = new Image();
    tailimg = new Image();
    snackimg = new Image();

    if(canvasname === "#pixelart-game") {
        headimg.src = "images/pixelart/head.png";
        bodyimg.src = "images/pixelart/body.png";
        tailimg.src = "images/pixelart/tail.png";
        snackimg.src = "images/pixelart/snack.png";
    } else if(canvasname === "#hand-drawn-game") {
        headimg.src = "images/hand-drawn/head.png";
        bodyimg.src = "images/hand-drawn/body.png";
        tailimg.src = "images/hand-drawn/tail.png";
        snackimg.src = "images/hand-drawn/snack.png";
    } else if(canvasname === "#flat-game") {
        headimg.src = "images/flat/head.png";
        bodyimg.src = "images/flat/body.png";
        tailimg.src = "images/flat/tail.png";
        snackimg.src = "images/flat/snack.png";
    }

    snackimg.addEventListener("load", update()); // Start update loop
}

$(window).resize(function() {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});