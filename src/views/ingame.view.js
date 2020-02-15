class IGNView extends GameView{

    constructor(parent) {
        super();
        this.parent = parent;
    }

    initGui(){
        this.textures_g = {};
        this.balls = [];
        this.waterControls = [];

        this.textures["bg"] = loadImage("src/assets/background/background.png");
        this.textures["bg-header"] = loadImage("src/assets/background/header.png");

        this.textures["l-bottle"] = loadImage("src/assets/layout/FixedBottleA.png");
        this.textures["l-button"] = loadImage("src/assets/layout/Button.png");
        this.textures["l-bar"] = loadImage("src/assets/layout/Bar.png");
        this.textures["l-cup"] = loadImage("src/assets/layout/Cup.png");

        this.textures_g["gummy-b"] = loadImage("src/assets/characters/B.png");
        this.textures_g["gummy-g"] = loadImage("src/assets/characters/G.png");
        this.textures_g["gummy-o"] = loadImage("src/assets/characters/O.png");
        this.textures_g["gummy-p"] = loadImage("src/assets/characters/P.png");
        this.textures_g["gummy-r"] = loadImage("src/assets/characters/R.png");
        this.textures_g["gummy-r2"] = loadImage("src/assets/characters/R2.png");

        this.time = 100;
        this.points = 0;
        this.pointsNeeded = 20;
        this.gameOver = false;
        this.spawned = false;
        this.aX = 0;

        this.header = new Header(getDefaultFont(), {
            Koin: loadImage("src/assets/gameover/Koin.png"),
            Reloj: loadImage("src/assets/gameover/Reloj.png"),
            Tiro: loadImage("src/assets/gameover/Tiro.png"),
        });

        this.endGame = new GameOver({isTraining: isPractice(),
            font: getDefaultFont(),
            pos: {
                x: 0, y: 0
            },
            path: "./src/assets/gameover",
            click: ()=>{
                if(!isPractice()){
                    getTransactionController().modifyKoins({
                        koins: -1
                    }).then(e => {
                        var obj = JSON.parse(e);
                        displayGuiScreen(obj.code == "210" ? new IGNView(this.parent) : this.parent);
                    })
                }else{
                    displayGuiScreen(new IGNView(this.parent));
                }
            }
        });

        this.waterControls.push(new WaterFlow());
        this.waterControls.push(new WaterFlow());

        setInterval(() =>{
            if(!this.gameOver){
                if(this.time <= 0 && this.pointsNeeded > 0){
                    this.gameOver = true;
                }

                if(this.pointsNeeded <= 0){
                    this.time = 60;
                    this.pointsNeeded = 20;
                }

                if(this.time > 0){
                    this.time--;
                }
            }
        }, 1000);

        window.addEventListener('devicemotion', (e) => {
            this.aX = -e.accelerationIncludingGravity.x * 2;
        })
    }

    drawScreen(mouseX, mouseY, deltaTime){
        noStroke();
        noSmooth();
        this.drawLayout();

        if(!this.spawned){
            var dRadius = 15;
            var txe = Object.entries(this.textures_g);
            for(var i = 0; i < txe.length; i++){
                this.addBall(random(this.barPos.x, this.bottlePos.w), this.barPos.y - dRadius, this.textures_g[txe[i][0]]);
            }
            this.spawned = true;
        }

        var ag = 9.81;
        var density = 1000;
        var drag = 1;
        var gravity = 0.5;
        var fps = 1 / 60;

        for(var i = 0; i < this.balls.length; i++){
            var fx = -0.5 * drag * density * this.balls[i].area * this.balls[i].velocity.x * this.balls[i].velocity.x * (this.balls[i].velocity.x / Math.abs(this.balls[i].velocity.x));
            var fy = -0.5 * drag * density * this.balls[i].area * this.balls[i].velocity.y * this.balls[i].velocity.y * (this.balls[i].velocity.y / Math.abs(this.balls[i].velocity.y));

            fx = (isNaN(fx)? 0 : fx);
            fy = (isNaN(fy)? 0 : fy);
            //Calculating the accleration of the ball
            //F = ma or a = F/m
            var ax = fx / this.balls[i].mass;
            var ay = (ag * gravity) + (fy / this.balls[i].mass);

            //Calculating the ball velocity
            this.balls[i].velocity.x += (ax + this.aX) * fps;
            this.balls[i].velocity.y += ay * fps;

            //Calculating the position of the ball
            this.balls[i].position.x += this.balls[i].velocity.x * fps * 100;
            this.balls[i].position.y += this.balls[i].velocity.y * fps * 100;

            fill(255, 100, 100);
            // Only for debug
            //ellipse(this.balls[i].position.x, this.balls[i].position.y, this.balls[i].radius * 2)

            var height = (this.balls[i].radius * 2);
            var width = height * 50 / 50;

            push();
            var aX = 0;
            translate(this.balls[i].position.x, this.balls[i].position.y);
            //TODO: Fix this thing
            rotate(-Math.atan2(lerp(this.balls[i].position.y + (this.balls[i].velocity.y/this.balls[i].radius*2), (this.balls[i].velocity.y/this.balls[i].radius), 0.00005), lerp(this.balls[i].position.x + ((this.balls[i].velocity.x-aX)/this.balls[i].radius), ((this.balls[i].velocity.x-aX)/this.balls[i].radius), 0.00005)) * 46);
            //END
            image(this.balls[i].character, -this.balls[i].radius, -this.balls[i].radius, width, height, 50, 0, 50, 50);
            pop();

            this.collisionBubbles(this.balls[i]);

            if(this.balls){
                this.collisionBall(this.balls[i]);
                this.collisionWall(this.balls[i]);
            }
        }

        this.header.drawHeader([
            {
                sprite: "Koin",
                text: this.points
            },
            {
                sprite: "Reloj",
                text: this.time
            },
            {
                sprite: "Tiro",
                text: this.pointsNeeded
            }
        ]);
        if(this.gameOver) this.endGame.draw(this.points);

        super.drawScreen(mouseX, mouseY);
    }

    collisionBubbles(ball){
        let bX = ball.position.x - ball.radius;
        let bY = ball.position.y - ball.radius;
        let bW = ball.radius * 2;
        let bH = ball.radius * 2;
        this.waterControls.forEach(wc => {
            wc.particles.forEach(p => {
                if(p.x >= bX && p.y >= bY && p.x + 16 <= bX + bW && p.y + 16 <= bY + bH){
                    ball.velocity.y = p.vy;
                }
            })
        });
    }

    collisionWall(ball){
        if(ball.position.x > (this.bottlePos.x + this.bottlePos.w) - ball.radius){
            ball.velocity.x *= ball.e;
            ball.position.x = (this.bottlePos.x + this.bottlePos.w) - ball.radius;
        }
        if(ball.position.y > this.barPos.y - ball.radius){
            ball.velocity.y *= ball.e;
            ball.position.y = this.barPos.y - ball.radius;
        }
        if(ball.position.x < this.bottlePos.x + ball.radius){
            ball.velocity.x *= ball.e;
            ball.position.x = this.bottlePos.x + ball.radius;
        }
        if(ball.position.y < (this.bottlePos.x + this.bottlePos.w / 3) - ball.radius){
            ball.velocity.y *= ball.e;
            ball.position.y = (this.bottlePos.x + this.bottlePos.w / 3) - ball.radius;
        }

        if(ball.position.x > (this.cupPos.x) - (ball.radius * 0.25) && ball.position.y > (this.cupPos.y) - ball.radius && ball.position.x < (this.cupPos.x + 20) && ball.position.y < (this.cupPos.y + 20) - ball.radius){
            ball.position.x += ball.radius / 2;
            this.points++;
            //ball.velocity.y = 0;
        }
        if(ball.position.x > (this.cupPos.x + this.cupPos.w - 10) - (ball.radius * 0.25) && ball.position.y > (this.cupPos.y) - ball.radius && ball.position.x < (this.cupPos.x + this.cupPos.w + 10) && ball.position.y < (this.cupPos.y + 20) - ball.radius){
            ball.position.x -= ball.radius;
            this.points++;
        }
    }

    collisionBall(b1){
        for(var i = 0; i < this.balls.length; i++){
            var b2 = this.balls[i];
            if(b1 != b2){
                //quick check for potential collisions using AABBs
                if(b1.position.x + b1.radius + b2.radius > b2.position.x
                    && b1.position.x < b2.position.x + b1.radius + b2.radius
                    && b1.position.y + b1.radius + b2.radius > b2.position.y
                    && b1.position.y < b2.position.y + b1.radius + b2.radius){

                    //pythagoras
                    var distX = b1.position.x - b2.position.x;
                    var distY = b1.position.y - b2.position.y;
                    var d = Math.sqrt((distX) * (distX) + (distY) * (distY));

                    //checking circle vs circle collision
                    if(d < b1.radius + b2.radius){
                        var nx = (b2.position.x - b1.position.x) / d;
                        var ny = (b2.position.y - b1.position.y) / d;
                        var p = 2 * (b1.velocity.x * nx + b1.velocity.y * ny - b2.velocity.x * nx - b2.velocity.y * ny) / (b1.mass + b2.mass);

                        // calulating the point of collision
                        var colPointX = ((b1.position.x * b2.radius) + (b2.position.x * b1.radius)) / (b1.radius + b2.radius);
                        var colPointY = ((b1.position.y * b2.radius) + (b2.position.y * b1.radius)) / (b1.radius + b2.radius);

                        //stoping overlap
                        b1.position.x = colPointX + b1.radius * (b1.position.x - b2.position.x) / d;
                        b1.position.y = colPointY + b1.radius * (b1.position.y - b2.position.y) / d;
                        b2.position.x = colPointX + b2.radius * (b2.position.x - b1.position.x) / d;
                        b2.position.y = colPointY + b2.radius * (b2.position.y - b1.position.y) / d;

                        //updating velocity to reflect collision
                        b1.velocity.x -= p * b1.mass * nx;
                        b1.velocity.y -= p * b1.mass * ny;
                        b2.velocity.x += p * b2.mass * nx;
                        b2.velocity.y += p * b2.mass * ny;
                    }
                }
            }
        }
    }

    drawLayout(){
        fill(56, 97, 160);
        rect(0, 0, windowWidth, windowHeight);

        var aR = this.getAspectRatio(181, 204, windowWidth);
        var bGY = Math.abs(windowHeight - aR.height);
        image(this.textures["bg"], 0, bGY, aR.width, aR.height);

        var aRCup = this.getAspectRatio(this.textures["l-cup"].width * 2, this.textures["l-cup"].height * 2, aR.height / 8);

        this.cupPos = {
            x: Math.abs((aRCup.width / 2) - windowWidth / 2) + 2,
            y: Math.abs(windowHeight - aR.height) + aRCup.height,
            w: aRCup.width,
            h: aRCup.height
        };

        image(this.textures["l-cup"], this.cupPos.x, this.cupPos.y, this.cupPos.w, this.cupPos.h);

        aR = this.getAspectRatio(181, 38, windowWidth);
        image(this.textures["bg-header"], 0, 0, aR.width, aR.height);

        aR = this.getAspectRatio(181, 45, windowWidth - 60);

        let barX = Math.abs((aR.width / 2) - windowWidth / 2);
        let barY = Math.abs(windowHeight - aR.height - (aR.height / 2));

        this.waterControls.forEach(wc => {
            wc.handleCircle(null);
        });

        this.bottlePos = {
            x: 40,
            y: 20,
            w: windowWidth - 80,
            h: windowHeight - 20
        };

        image(this.textures["l-bottle"], 30, 20, windowWidth - 60, windowHeight - 20)

        this.barPos = {
            x: barX,
            y: barY,
            w: aR.width
        };

        image(this.textures["l-bar"], barX, barY, aR.width, aR.height);

        var btnW = aR.width / 6;
        var btnH = btnW * 30 / 30;

        this.btnPos = {
            btnLeft: {
                x: barX + btnW * 0.2,
                y: barY + btnH * 0.23,
                w: btnW,
                h: btnH
            },
            btnRight: {
                x: (barX + aR.width - btnW) - btnW * 0.2,
                y: barY + btnH * 0.23,
                w: btnW,
                h: btnH
            }
        };

        image(this.textures["l-button"], this.btnPos.btnLeft.x, this.btnPos.btnLeft.y, this.btnPos.btnLeft.w, this.btnPos.btnLeft.h);
        image(this.textures["l-button"], this.btnPos.btnRight.x, this.btnPos.btnRight.y, this.btnPos.btnRight.w, this.btnPos.btnRight.h);

        if(!this.gameOver){
            for(var touch = 0; touch < touches.length; touch++){
                var t = touches[touch];
                if(t.x > this.btnPos.btnLeft.x && t.y > this.btnPos.btnLeft.y && t.x < this.btnPos.btnLeft.x + this.btnPos.btnLeft.w && t.y < this.btnPos.btnLeft.y + this.btnPos.btnLeft.y){
                    this.waterControls[0].addMoreParticles(this.btnPos.btnLeft.x + this.btnPos.btnLeft.w / 2, this.btnPos.btnLeft.y);
                }
                if(t.x > this.btnPos.btnRight.x && t.y > this.btnPos.btnRight.y && t.x < this.btnPos.btnRight.x + this.btnPos.btnRight.w && t.y < this.btnPos.btnRight.y + this.btnPos.btnRight.y){
                    this.waterControls[1].addMoreParticles(this.btnPos.btnRight.x + this.btnPos.btnRight.w / 2, this.btnPos.btnRight.y);
                }
            }
        }
    }

    addBall(x, y, char){
        var radius = 20;
        this.balls.push({
            position: {x: x, y: y},
            velocity: {x: 0, y: 0},
            e: 0.4,
            mass: radius,
            radius: radius,
            area: (Math.PI * radius * radius) / 10000,
            character: char
        })
    }

    mouseClicked(mX, mY, mB){
        if(this.gameOver) this.endGame.handleClick(mX, mY);
    }
}