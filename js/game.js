var jcanvas;
var canvas;
var context;
var resizeId;
var tilewidth;
var tileheight;
var cursnack;
var anchor;
var updatetimeout;
var fieldsize;
var curcanvasname;
var score;
var headimg, snackimg, bodyimg, tailimg, bodycurveimg;

function resize() {
    jcanvas.width(jcanvas.height());
    canvas.width = jcanvas.width();
    canvas.height = jcanvas.width();
    tilewidth = canvas.width / fieldsize;
    tileheight = canvas.height / fieldsize;
}

function body() {
    this.x = 0;
    this.y = 0;
    this.prevdirection = 0;
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
        this.x = Math.floor(Math.random() * fieldsize);
        this.y = Math.floor(Math.random() * fieldsize);
        for(var i = 0; i < anchor.bodyparts.length; i++) {
            if (collide(this, anchor.bodyparts[i])) {
                created = false;
                break;
            } else {
                created = true;
            }
        }
    }
}

function snake() {
    this.bodyparts = [this];
    this.x = fieldsize / 2;
    this.y = fieldsize / 2;
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
            if(i !== 0) {
                this.bodyparts[i].direction = this.bodyparts[i - 1].direction;

                if(i !== this.bodyparts.length - 1) {
                    if(this.bodyparts[i + 1].y < this.bodyparts[i].y) { //PREV IS OVER
                        this.bodyparts[i].prevdirection = "up";
                    } else if(this.bodyparts[i + 1].y > this.bodyparts[i].y){ //PREV IS UNDER
                        this.bodyparts[i].prevdirection = "down";
                    } else if(this.bodyparts[i + 1].x > this.bodyparts[i].x){ //PREV IS RIGHT
                        this.bodyparts[i].prevdirection = "right";
                    } else { //PREV IS LEFT
                        this.bodyparts[i].prevdirection = "left";
                    }
                }
            }
        }
        if(this.direction === "up") {
            this.y--;
        } else if(this.direction === "left") {
            this.x--;
        } else if(this.direction === "down") {
            this.y++;
        } else if(this.direction === "right") {
            this.x++;
        } 
    }

    this.draw = function() {

        var rotation = 0;

        for(var i = 0; i < this.bodyparts.length; i++) {
           
            rotation = 0;

            if(i === 0 || i === this.bodyparts.length - 1) { // HEAD OR TAIL
                context.save();

                if(this.bodyparts[i].direction === "right") {
                    context.translate(this.bodyparts[i].x * tilewidth + tilewidth, this.bodyparts[i].y * tileheight);
                    rotation = 90;
                } else if(this.bodyparts[i].direction === "left") {
                    context.translate(this.bodyparts[i].x * tilewidth, this.bodyparts[i].y * tileheight + tileheight);             
                    rotation = -90;
                } else if(this.bodyparts[i].direction === "down") {
                    context.translate(this.bodyparts[i].x * tilewidth + tilewidth, this.bodyparts[i].y * tileheight + tileheight)                
                    rotation = 180;
                } else {
                    context.translate(this.bodyparts[i].x * tilewidth, this.bodyparts[i].y * tileheight);
                }

                context.rotate(rotation * (Math.PI / 180));

                if(i === 0) { 
                    context.drawImage(headimg, 0, 0, tilewidth, tileheight); 
                } else {
                    context.drawImage(tailimg, 0, 0, tilewidth, tileheight);
                }

                context.restore();

            } else { // BODY
                context.save();
                if((this.bodyparts[i].direction === "right" && this.bodyparts[i].prevdirection === "left") || (this.bodyparts[i].direction === "left" && this.bodyparts[i].prevdirection === "right")) { //SIDEWAYS
                    context.translate(this.bodyparts[i].x * tilewidth + tilewidth, this.bodyparts[i].y * tileheight);
                    rotation = 90;

                    context.rotate(rotation * (Math.PI / 180));
                    context.drawImage(bodyimg, 0, 0, tilewidth, tileheight); 
                } else if((this.bodyparts[i].direction === "up" && this.bodyparts[i].prevdirection === "down") || (this.bodyparts[i].direction === "down" && this.bodyparts[i].prevdirection === "up")) { // VERTICAL WAYS
                    context.translate(this.bodyparts[i].x * tilewidth, this.bodyparts[i].y * tileheight) ;               
                    context.drawImage(bodyimg, 0, 0, tilewidth, tileheight);
                } else if((this.bodyparts[i].direction === "up" && this.bodyparts[i].prevdirection === "right") || (this.bodyparts[i].direction === "right" && this.bodyparts[i].prevdirection === "up")) { // TOP TO RIGHT
                    context.translate(this.bodyparts[i].x * tilewidth + tilewidth, this.bodyparts[i].y * tileheight + tileheight);
                    rotation = 180;

                    context.rotate(rotation * (Math.PI / 180));
                    context.drawImage(bodycurveimg, 0, 0, tilewidth, tileheight); 
                } else if((this.bodyparts[i].direction === "up" && this.bodyparts[i].prevdirection === "left") || (this.bodyparts[i].direction === "left" && this.bodyparts[i].prevdirection === "up")) { // TOP TO LEFT
                    context.translate(this.bodyparts[i].x * tilewidth + tilewidth, this.bodyparts[i].y * tileheight);
                    rotation = 90;

                    context.rotate(rotation * (Math.PI / 180));
                    context.drawImage(bodycurveimg, 0, 0, tilewidth, tileheight); 
                } else if((this.bodyparts[i].direction === "down" && this.bodyparts[i].prevdirection === "left") || (this.bodyparts[i].direction === "left" && this.bodyparts[i].prevdirection === "down")) { // DOWN TO LEFT
                    context.translate(this.bodyparts[i].x * tilewidth, this.bodyparts[i].y * tileheight);
                    context.drawImage(bodycurveimg, 0, 0, tilewidth, tileheight); 
                } else if((this.bodyparts[i].direction === "down" && this.bodyparts[i].prevdirection === "right") || (this.bodyparts[i].direction === "right" && this.bodyparts[i].prevdirection === "down")) { // DOWN TO RIGHT
                    context.translate(this.bodyparts[i].x * tilewidth, this.bodyparts[i].y * tileheight + tileheight);
                    rotation = -90;
                    context.rotate(rotation * (Math.PI / 180));
                    context.drawImage(bodycurveimg, 0, 0, tilewidth, tileheight); 
                }
  
                context.restore();    
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

    if(anchor.x >= fieldsize || anchor.x < 0 || anchor.y >= fieldsize || anchor.y < 0) {
        gameover();
    }

    //Drawing
    if(cursnack) {
        context.drawImage(snackimg, cursnack.x * tilewidth, cursnack.y * tileheight, tilewidth, tileheight);
    }
    anchor.draw();

    var tmp_txt = "Score: " + (anchor.bodyparts.length - 1);
    context.fillText(tmp_txt, (canvas.width / 2) - (context.measureText(tmp_txt).width / 2), 10);

    updatetimeout = setTimeout(update, 100);
}

function gameover() {
    alert("You Lost!");
    anchor = new snake();
    cursnack = new snack();
}

function gamestart(canvasname) {
    curcanvasname = canvasname;
    fieldsize = 20;
    score = 0;
    clearTimeout(updatetimeout);
    jcanvas = $(canvasname);
    canvas = jcanvas[0];
    context = canvas.getContext("2d");
    window.addEventListener("keydown", move, false); // Start input hook
    anchor = new snake();
    cursnack = new snack();

    headimg = new Image();
    bodyimg = new Image();
    tailimg = new Image();
    bodycurveimg = new Image();
    snackimg = new Image();

    if(canvasname === "#pixelart-game") {
        context.font = "10px Press Start 2P"
        headimg.src = "images/pixelart/head.png"; //Hier einfach zu svg ändern falls nötig
        bodyimg.src = "images/pixelart/body.png";
        tailimg.src = "images/pixelart/tail.png";
        bodycurveimg.src = "images/pixelart/bodycurve.png";
        snackimg.src = "images/pixelart/snack.png";
    } else if(canvasname === "#hand-drawn-game") {
        context.font = "10px Indie Flower"
        headimg.src = "images/hand-drawn/head.png";
        bodyimg.src = "images/hand-drawn/body.png";
        tailimg.src = "images/hand-drawn/tail.png";
        bodycurveimg.src = "images/hand-drawn/bodycurve.png";
        snackimg.src = "images/hand-drawn/snack.png";
    } else if(canvasname === "#flat-game") {
        context.font = "10px Roboto"
        headimg.src = "images/flat/head.svg";
        bodyimg.src = "images/flat/body.svg";
        tailimg.src = "images/flat/tail.svg";
        bodycurveimg.src = "images/flat/bodycurve.svg";
        snackimg.src = "images/flat/snack.svg";
    }

    resize();
    snackimg.addEventListener("load", update()); // Start update loop
}

$(window).resize(function() { //wait for resize to finish
    clearTimeout(resizeId);
    resizeId = setTimeout(resize, 500);
});