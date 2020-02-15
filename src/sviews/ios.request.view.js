class IOSRequestView extends GameView{

    constructor({title, splash, font, cssFont, requestCb}){
        super();
        this.title = title;
        this.splash = splash;
        this.font = font;
        this.cssFont = cssFont;
        this.requestCb = requestCb;
        this.status = false;
    }

    initGui(){
        this.btn = $(document.createElement("button"));
        this.btn.get(0).innerHTML = "Entendido";

        this.btn.css({
            "background": "#85F9CF",
            "position": "absolute",
            "border": "none",
            "box-shadow": "0px 8px 0px 0px rgba(24,110,116,1)",
            "border-radius": "20px",
            "width": "240px",
            "height": "60px",
            "bottom": "25px",
            "left": "50%",
            "transform": "translateX(-50%)",
            "font-family": this.cssFont,
            "font-weight": "bold",
            "font-size": "18px"
        });
        this.btn.focus(() => {
            this.btn.css({"outline": "none"});
        });
        this.btn.click(() => {
            this.requestCb();
            this.btn.remove();
        })
        $("body").append(this.btn);
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
    }
}