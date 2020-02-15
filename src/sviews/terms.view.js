class TermsView extends GameView{

    constructor({path, logo, click, font}){
        super();
        this.logo = logo;
        this.click = click;
        this.font = font;
        this.info = {name: "", version: 1.0};
        this.path = path;
    }

    initGui(){
        fetch(this.path).then((response) => {
            return response.json();
        }).then((info) => {
            this.info = info;
        });

        this.buttons.push(new IButton(windowWidth / 2- 100, windowHeight - 80, 200, 50, "Regresar", {r: 178, g: 80, b: 216}, { r: 255, g: 255, b: 255}, this.click));
    }

    drawScreen(mX, mY, dT){
        this.drawBackgroundGradient();
        var spW = (windowWidth * 0.4);
        var spH = spW * this.logo.height / this.logo.width;

        image(this.logo, (windowWidth / 2) - (spW / 2), spH * 0.5, spW, spH);
        textAlign(CENTER);
        textFont(this.font);
        textSize(36);
        fill(255);
        text(this.info.name, windowWidth / 2, ((spH * 0.5 + spH) + 36));
        textSize(18);
        text(`Desarrollado por Lucky\nIntelligence S.A.P.I. de\nC.V. exclusivamente\npara Playrooms CK.\n\nLos personajes del juego\nson propiedad de Circle K\nMéxico.\n\nVersion: ${this.info.version}`, windowWidth / 2, ((spH * 0.5 + spH) + 90));

        noStroke();
        super.drawScreen(mX, mY, dT)
    }

    mouseClicked(mX, mY, mB){
        if(mouseX >= this.termsX && mouseY >= this.termsY && mouseX <= this.termsX + this.termsW && mouseY <= this.termsY + this.termsH) {
            this.termsBtn();
        }
        super.mouseClicked(mX, mY, mB )
    }
}