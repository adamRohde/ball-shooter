var MAX_NUM = 200;
var circles = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(0);

    noStroke();
}

function draw() {
    background(0, 50);

    for (var i = 0; i < circles.length; i++) {
        circles[i].checkBoundary();
        circles[i].update();
        circles[i].display();
    }
}

function mouseClicked() {
    if (circles.length < MAX_NUM) {
        for (var i = 0; i < 5; i++) {
            circles.push(new Circle(mouseX, mouseY));
        }
    }
}

function keyPressed() {
    if (key == " ") {
        for (var i = 0; i < circles.length; i++) {
            circles[i].speedX = random(-5, 5) * 2;
            circles[i].speedY = random(-5, 5) * 2;
        }
    }
}

function Circle(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = random(-5, 5);
    this.speedY = random(-5, 5);
    this.size = random(25, 50);
    this.color = color(random(255), random(255), random(255), 100);

    this.checkBoundary = function () {
        if (this.x < 0) {
            this.x = 0;
            this.speedX *= -1;
        }
        if (this.x > width) {
            this.x = width;
            this.speedX *= -1;
        }
        if (this.y < 0) {
            this.y = 0;
            this.speedY *= -1;
        }
        if (this.y > height) {
            this.y = height;
            this.speedY *= -1;
        }
    };

    this.update = function () {
        //restitution
        this.speedX *= 0.98;
        this.speedY *= 0.98;
        this.x += this.speedX;
        this.y += this.speedY;
    };

    this.display = function () {
        push();
        fill(this.color);
        ellipse(this.x, this.y, this.size, this.size);
        pop();
    };
}

// if (
//     this.x > otherballs[i].x - 12 &&
//     this.x < otherballs[i].x + 12 &&
//     this.y > otherballs[i].y - 12 &&
//     this.y < otherballs[i].y + 12
// ) {
//     if (this.x > otherballs[i].x - 12 && this.x < otherballs[i].x + 12) {
//         console.log("Crossed X Paths", "i=", i);
//         this.speedY *= -1;
//     }
//     if (this.x > otherballs[i].x - 12 && this.x < otherballs[i].x + 12) {
//         console.log("Cross Y Paths", "i=", i);
//         this.speedX *= -1;
//     }
// }
// if (
//     Math.abs(this.x - othersballs[i].x) < 24 &&
//     Math.abs(this.y - othersballs[i].y) < 24
// ) {
//     console.log("Cross Y Paths", "i=", i);
// }
