class IGNView extends GameView {

    constructor(parent) {
        super();
        this.parent = parent;
        this.gummies = [];
        this.gameOver = false;
        this.gameStarted = false;
        this.player = {
            x: 0,
            y: windowHeight - 100
        };

        this.points = 0;

        this.timer = 1;
        this.badRange = 10;

        this.frameIndex = 0;


        this.lifeAmount = 3;

        this.incrementSpeed = 20;

        this.fallSpeed = 0.2;
        this.genSeconds = 1500;
        this.fallSpeedUpdate = false;

        this.intervalId = -1;

    }

    initGui() {


        this.header = new Header(getDefaultFont(), {
            Koin: loadImage("src/assets/gameover/Koin.png"),
            Heart: loadImage("src/assets/gameover/Heart.png")
        });

        this.endGame = new GameOver({
            isTraining: isPractice(),
            font: getDefaultFont(),
            pos: {
                x: 0, y: 0
            },
            path: "./src/assets/gameover",
            click: () => {
                if (!isPractice()) {
                    getTransactionController().modifyKoins({
                        koins: -1
                    }).then(e => {
                        var obj = JSON.parse(e);
                        displayGuiScreen(obj.code == "210" ? new IGNView(this.parent) : this.parent);
                    })
                } else {
                    displayGuiScreen(new IGNView(this.parent));
                }
            }
        });

        this.textures['food'] = loadImage('assets/gomas.png');
        this.textures['counter'] = loadImage('assets/counter.png');
        this.textures['bg'] = loadImage('assets/foodbg.png');
        this.textures['player'] = loadImage('assets/bolsa.png');
        this.textures['dfont'] = loadFont('assets/04B.ttf');
        this.textures['heart'] = loadImage("assets/Heart.png")
        this.textures['coin'] = loadImage("assets/Star.png")

    }

    drawScreen(mouseX, mouseY, deltaTime) {

        clear();
        noSmooth();
        background(this.textures['bg']);
        image(this.textures['player'], this.player.x, this.player.y, 80, 80, 64, 0, 64, 83);

        this.gummies.forEach(g => {
            if (g.d) {
                image(this.textures['food'], g.x, g.y, 46, 40, !g.k ? 0 : 32 * this.frameIndex, g.s * 32, 32, 32);
            }
            g.y += this.fallSpeed * deltaTime;

            if (this.player.x + 20 <= g.x + 40 && this.player.x + 60 >= g.x && this.player.y + 50 <= g.y + 40 && this.player.y + 80 >= g.y) {
                if (g.d) {
                    this.gameOver = !g.k;
                    this.points += this.gameOver ? 0 : 1;
                    g.d = false;
                    if (this.gameOver) {
                        this.lifeAmount = 0;
                    } else {
                        if (!isPractice()) {
                            getTransactionController.modifyStars({ stars: 1 }).then(res => { });
                        }
                    }
                }
            }

            if (g.y > windowHeight) {
                if (this.lifeAmount <= 0) {
                    this.gameOver = true;
                } else {
                    if (g.d && g.k) {
                        this.lifeAmount--;
                    }
                }
                g.d = false;
                if (this.points % this.incrementSpeed == 0) {
                    if (!this.fallSpeedUpdate) {
                        this.fallSpeed += (this.fallSpeed / 100) * 15;
                        this.genSeconds -= 10;

                        //clearInterval(this.intervalId);
                        //this.intervalId = setInterval(() => this.gen(), this.genSeconds)

                        this.fallSpeedUpdate = true;
                    }
                } else {
                    this.fallSpeedUpdate = false;
                }
            }
        })

        image(this.textures['player'], this.player.x, this.player.y, 80, 80, 0, 0, 64, 83);




        if (this.frameCount % 6 == 0) {
            if (this.frameIndex >= 4) {
                this.frameIndex = 0;
            }
            else {
                this.frameIndex += 1;
            }
        }

        if (touches.length > 0) {
            if (!this.gameOver) {
                this.player.x = touches[0].x - 40;
            } else {
                displayGuiScreen(this);
            }
        }
        this.intervalId = setInterval(() => this.gen(), this.genSeconds)
        this.header.drawHeader([
            {
                sprite: "Heart",
                text: this.lifeAmount
            },
            {
                sprite: "Koin",
                text: this.points
            }
        ]);
        if (this.gameOver) this.endGame.draw(this.points);

        super.drawScreen(mouseX, mouseY);
    }

    gen() {
        console.log("PENE")
        if (!this.gameOver) {
            var bad = Math.random() * 50 >= this.badRange;
            this.gummies.push({
                x: (Math.random() * (windowWidth - 64)),
                y: -70,
                s: bad ? Math.round(Math.random() * 5) : 6,
                d: true,
                k: bad
            })
        }
    }
    mouseClicked(mX, mY, mB) {
        if (this.gameOver) this.endGame.handleClick(mX, mY);
    }
}