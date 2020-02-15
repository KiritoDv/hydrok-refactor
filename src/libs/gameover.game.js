class GameOver {
    constructor({isTraining, pos, click, path, font}) {
        this.isTraining = isTraining;
        this.pos = pos;
        this.click = click;
        this.font = font;
        this.assets = {
            free: {
                title: loadImage(`${path}/title/endFree.png`),
                button: loadImage(`${path}/btn/continueFree.png`),
                unlock: loadImage(`${path}/lockedStars.png`)
            },
            premium: {
                title: loadImage(`${path}/title/endKoin.png`),
                button: loadImage(`${path}/btn/continueKoin.png`),
                koin: loadImage(`${path}/Koin.png`)
            }
        };
    }

    draw(stars) {
        //background
        var bow = windowWidth * 0.1;
        var boh = Math.round(windowHeight * 0.1);
        var bw = windowWidth - bow * 2;
        var bh = windowHeight - boh * 2;
        var bx = this.pos.x + bow;
        var by = this.pos.y + boh;

        fill('rgba(0, 0, 0, 0.4)');
        rect(bx, by, bw, bh, 20);

        var tx = bx + 10;
        var tw = bw - 20;
        var ty = by - 30;

        var timage = this.assets[this.isTraining ? "free" : "premium"].title;
        image(timage, tx, ty, tw, (tw * timage.height) / timage.width);

        this.bbimage = this.assets[this.isTraining ? "free" : "premium"].button;
        this.bbw = windowWidth * 0.5;
        this.bbh = (this.bbw * this.bbimage.height) / this.bbimage.width;
        this.bbx = ((windowWidth / 2) - (this.bbw / 2)) - this.pos.x;
        this.bby = by + bh;

        this.bby -= this.bbh * 1.5;

        image( this.bbimage, this.bbx, this.bby, this.bbw, this.bbh );
        textFont(this.font);

        if(!this.isTraining){
            fill(255);
            textSize(28);
            //premium text
            textAlign(CENTER);
            text("Ganaste", ( windowWidth / 2 ) - this.pos.x, windowHeight / 2 - 60);
            image(
                this.assets.premium.koin,
                (windowWidth / 2 - 40) - this.pos.x,
                windowHeight / 2 - 40,
                80,
                80
            );
            text(stars + " Stars", (windowWidth / 2) - this.pos.x, windowHeight / 2 + 80);
        }else{
            fill(255, 255, 255, 255 * 0.8);
            textSize(20);
            var iH = this.bbw * this.assets.free.unlock.height / this.assets.free.unlock.width;
            text(`Obtuviste\n${stars} Puntos`, ( windowWidth / 2 ) - this.pos.x, (windowHeight / 2 - (iH / 2)) - 50);
            image(this.assets.free.unlock, (windowWidth / 2) - this.pos.x - (this.bbw / 2), windowHeight / 2 - (iH / 2) + 20, this.bbw, iH);
        }
    }

    handleClick(mX, mY){
        console.log("Clicked owo");
        if(mX >= this.bbx && mY >= this.bby && mX <= this.bbx + this.bbimage.width && mY <= this.bby + this.bbimage.height){
            this.click();
        }
    }

}