let shooterball = {x: 300, y: 325, key: null};

let targetBall;
let shotsfired = [];
let bouncyballs = [];
let exportData = [];

let points = 0;
let pointsTemp = 0;
let pointStr = "Points = 0";
let ballsStr = "Balls = 0";
let writer;

let table;

function preload() {
    //my table is comma separated value "csv"
    //and has a header specifying the columns labels
    table = loadTable("data.csv", "csv", "header");
    //the file can be remote
    //table = loadTable("http://p5js.org/reference/assets/mammals.csv",
    //                  "csv", "header");
}

function setup() {
    createCanvas(400, 460);

    writer = createWriter("data.csv");

    //count the columns
    print(table.getRowCount() + " total rows in table");
    print(table.getColumnCount() + " total columns in table");

    // print(table.getColumn("name"));
    //["Goat", "Leopard", "Zebra"]

    //cycle through the table
    // for (let r = 0; r < table.getRowCount(); r++)
    //     for (let c = 0; c < table.getColumnCount(); c++) {
    //         print(table.getString(r, c));
    //     }
}

//#################################### Draw ####################################
function draw() {
    background(10);

    //shooter ball
    fill(255, 255, 255);
    ellipse(shooterball.x, shooterball.y, 24, 24);

    stroke(255);
    // line(0, 20, 400, 20);
    line(0, 150, 400, 150);
    line(0, 250, 400, 250);
    line(0, 400, 400, 400);

    //Vertical Line the serves no purpose
    stroke(75);
    line(200, 20, 200, 400);

    textSize(32);
    fill(255, 255, 255);
    text(pointStr, 10, 440);
    text(ballsStr, 250, 440);

    if (keyIsDown(LEFT_ARROW)) {
        shooterball.key = "LEFT_ARROW";
        if (shooterball.x <= 12) {
            shooterball.x = shooterball.x;
        } else {
            shooterball.x -= 5;
        }
    }

    if (keyIsDown(RIGHT_ARROW)) {
        shooterball.key = "RIGHT_ARROW";
        if (shooterball.x >= 388) {
            shooterball.x = shooterball.x;
        } else {
            shooterball.x += 5;
        }
    }

    //#################################### Bouncy balls stuff ####################################
    for (let i = 0; i < bouncyballs.length; i++) {
        bouncyballs[i].checkBoundary();
        bouncyballs[i].update();
        bouncyballs[i].display(false);

        if (i === bouncyballs.length - 1) {
            bouncyballs[i].display(true);
        }

        for (let j = 0; j < i; j++) {
            bouncyballs[i].collide(bouncyballs[j]);
        }
    }

    //#################################### Shots Fired Stuff ####################################
    let hit = false;
    let ballHit = 0;
    let shotThatHit = 0;
    if (shotsfired.length > 0) {
        for (let i = 0; i < shotsfired.length; i++) {
            for (let j = 0; j < bouncyballs.length; j++) {
                hit = shotsfired[i].collide(bouncyballs[j]);
                if (hit === true) {
                    ballHit = j;
                    shotThatHit = i;
                    exportData[exportData.length - 1].hit = 1;
                    //Write Data when hit
                    writer.write(
                        shooterball.key +
                            ";" +
                            shooterball.x +
                            ";" +
                            shooterball.y +
                            ";" +
                            targetBall.pos.x +
                            ";" +
                            targetBall.pos.y +
                            ";" +
                            targetBall.getScaledVelo() +
                            ";" +
                            targetBall.getVector().x +
                            ";" +
                            targetBall.getVector().y +
                            ";" +
                            1 +
                            ";" +
                            "\n"
                    );
                    break;
                }
            }
        }
    }

    if (hit === true) {
        if (ballHit === bouncyballs.length - 1) {
            points = points + 1;
            pointStr = concat("Points = ", points);
        } else {
            points = points - 1;
            pointStr = concat("Points = ", points);
            hit = false;
        }

        shotsfired.shift();
        hit = false;
    }

    if (shotsfired.length > 0) {
        for (let i = 0; i < shotsfired.length; i++) {
            shotsfired[i].update();
            if (shotsfired[i].pos.y < 0) {
                shotsfired.shift();

                if (exportData[exportData.length - 1].hit === null) {
                    exportData[exportData.length - 1].hit = 0;

                    //Write Data when missed
                    writer.write(
                        shooterball.key +
                            ";" +
                            shooterball.x +
                            ";" +
                            shooterball.y +
                            ";" +
                            targetBall.pos.x +
                            ";" +
                            targetBall.pos.y +
                            ";" +
                            targetBall.getScaledVelo() +
                            ";" +
                            targetBall.getVector().x +
                            ";" +
                            targetBall.getVector().y +
                            ";" +
                            0 +
                            ";" +
                            "\n"
                    );
                }
            } else {
                shotsfired[i].display();
            }
        }
    }

    //if a point is acheived all the updateballs function, (which might create another ball on the screen)
    if (points !== pointsTemp) {
        UpdateBalls();
    }
    pointsTemp = points;

    if (bouncyballs.length > 0) {
        targetBall.update(
            bouncyballs[bouncyballs.length - 1].pos,
            bouncyballs[bouncyballs.length - 1].vel,
            bouncyballs
        );
        targetBall.averageDist();
    }
}

//#################################### Taking shots and making bouncy balls ####################################
function keyPressed() {
    if (keyCode === 32) {
        shotsfired.push(new Shot(createVector(shooterball.x, shooterball.y)));

        exportData.push(
            new ExportData(
                shooterball.x,
                shooterball.y,
                targetBall.getScaledVelo(),
                targetBall.getVector(),
                null
            )
        );
    }

    if (keyCode === 13) {
        if (bouncyballs.length < 10) {
            bouncyballs.push(
                new BouncyBall(
                    createVector(random(width), random(150)),
                    p5.Vector.random2D().mult(random(2)),
                    12,
                    color(random(255), random(255), random(255))
                )
            );
        }
        ballsStr = concat("Balls = ", bouncyballs.length);

        targetBall = new TargetBall();
    }

    if (keyCode === 16) {
        writer.close();
    }
}

//#################################### Classes ####################################
class Shot {
    constructor(pos) {
        this.pos = pos;
        this.vel = 5;
        this.radius = 2.5;

        this.update = function () {
            this.pos.sub(0, this.vel);
        };

        this.display = function () {
            fill(255, 255, 255);
            ellipse(this.pos.x, this.pos.y, this.radius * 2);
        };

        this.collide = function (interceptors) {
            let relative = p5.Vector.sub(interceptors.pos, this.pos);
            this.distance = relative.mag() - (this.radius + interceptors.radius);
            if (this.distance < 0) {
                return true;
            } else {
                return false;
            }
        };
    }
}

class BouncyBall {
    constructor(pos, vel, radius, color) {
        this.pos = pos;
        this.vel = vel;
        this.radius = radius;
        this.color = color;

        this.update = function () {
            this.pos.add(this.vel);
        };

        this.checkBoundary = function () {
            if (this.pos.x < 12) {
                this.pos.x = 12;
                this.vel.x = -this.vel.x;
            }
            if (this.pos.x > width - this.radius) {
                this.pos.x = width - this.radius;
                this.vel.x = -this.vel.x;
            }
            if (this.pos.y < 0 + this.radius) {
                this.pos.y = 0 + this.radius;
                this.vel.y = -this.vel.y;
            }
            if (this.pos.y > 150 - this.radius) {
                this.pos.y = 150 - this.radius;
                this.vel.y = -this.vel.y;
            }
        };

        this.display = function (changeColor) {
            if (changeColor === true) {
                fill(255, 255, 255);
            } else {
                fill(this.color);
            }

            ellipse(this.pos.x, this.pos.y, this.radius * 2);
        };

        this.collide = function (otherballs) {
            if (otherballs === this) {
                return;
            }
            let relative = p5.Vector.sub(otherballs.pos, this.pos);
            let dist = relative.mag() - (this.radius + otherballs.radius);
            if (dist < 0) {
                let movement = relative.copy().setMag(abs(dist / 2));
                this.pos.sub(movement);
                otherballs.pos.add(movement);
                let thisToOtherNormal = relative.copy().normalize();
                let approachedSpeed =
                    this.vel.dot(thisToOtherNormal) + -otherballs.vel.dot(thisToOtherNormal);
                let approachVector = thisToOtherNormal.copy().setMag(approachedSpeed);
                this.vel.sub(approachVector);
                otherballs.vel.add(approachVector);
            }
        };
    }
}

//#################################### Export Data ####################################
class ExportData {
    constructor(shooterXpos, shooterYpos, targetVelocity, targetVector, hit) {
        this.shooterXpos = shooterXpos;
        this.shooterYpos = shooterYpos;
        this.targetVelocity = targetVelocity;
        this.targetVector = targetVector;
        this.hit = hit;
    }
}

class TargetBall {
    constructor() {
        this.pos;
        this.balls;
        this.arrayOfBalls = [];
        this.vector;

        this.update = function (pos, vel, bouncyBalls) {
            this.pos = pos;
            this.vel = vel;
            this.balls = bouncyBalls;
        };

        this.getScaledVelo = function () {
            let vectorTemp = createVector(this.vel.x * 2.666667, this.vel.y * 0.375, this.vel.z);
            let velocity = vectorTemp.mag();
            return velocity;
        };

        this.getVector = function () {
            let vectorTemp = createVector(this.vel.x * 2.666667, this.vel.y * 0.375, this.vel.z);
            return {x: vectorTemp.x, y: vectorTemp.y};
        };

        this.averageDist = function () {
            for (let i = 0; i < this.balls.length - 1; i++) {
                let ballPosition = createVector(this.balls[i].pos.x, this.balls[i].pos.y, 0);
                let targetballPos = createVector(this.pos.x, this.pos.y, 0);
                let relative = p5.Vector.sub(ballPosition, targetballPos);

                if (i != this.balls.length - 1) {
                    this.arrayOfBalls.push(relative.mag());
                }
                if (this.arrayOfBalls.length > this.balls.length - 1) {
                    this.arrayOfBalls.shift();
                }
                let average = (balls) => balls.reduce((a, b) => a + b) / balls.length;
                return average(this.arrayOfBalls);
            }
        };
    }
}
