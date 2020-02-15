class SplashView extends GameView{

    constructor({title, splash, font, start, instructions, terms}){
        super();
        this.title = title;
        this.splash = splash;
        this.startBtn = start;
        this.termsBtn = terms;
        this.instructionsBtn = instructions;
        this.font = font;
    }

    initGui(){
        this.buttons.push(new IButton(windowWidth / 2 - 100, windowHeight - 200, 200, 50, "Empezar", {r: 218, g: 41, b: 28}, { r: 255, g: 255, b: 255}, this.startBtn));

        this.buttons.push(new IButton(windowWidth / 2- 100, windowHeight - 130, 200, 50, "Instrucciones", {r: 53, g: 219, b: 159}, { r: 0, g: 0, b: 0}, ()=>{
            this.instructionsBtn(this);
        }));
    }

    drawScreen(mX, mY, dT){
        this.drawBackgroundGradient();
        fill(255);
        textFont(this.font);
        textAlign(CENTER);
        textSize(36);
        text(this.title, windowWidth / 2, 80);
        textSize(24);
        fill(255, 255, 255, 255 * 0.7);

        var spW = (windowWidth * 0.8);
        var spH = spW * this.splash.height / this.splash.width;

        image(this.splash, (windowWidth / 2) - (spW / 2), (windowHeight / 2) - (spH / 2), spW, spH);

        textAlign(CENTER)
        textSize(18)
        var txt = "Terminos y condiciones";
        var txtWidth = textWidth(txt);
        fill(45, 156, 219, 140)

        this.termsX = windowWidth / 2 - (txtWidth / 2) + 1;
        this.termsY = windowHeight - 58;
        this.termsW = txtWidth;
        this.termsH = 31;

        noStroke();
        text(txt, windowWidth / 2, windowHeight - 40);
        rect(windowWidth / 2 - (txtWidth / 2) + 1, windowHeight - 32, txtWidth, 5, 100);
        super.drawScreen(mX, mY, dT)
    }

    mouseClicked(mX, mY, mB){
        if(mouseX >= this.termsX && mouseY >= this.termsY && mouseX <= this.termsX + this.termsW && mouseY <= this.termsY + this.termsH) {
            this.termsBtn(this);
        }
        super.mouseClicked(mX, mY, mB )
    }
}