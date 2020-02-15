class InstructionsView extends GameView{

    constructor({lines, font, click, icons, size}){
        super();
        this.lines = lines;
        this.font = font;
        this.click = click;
        this.fontSize = 18;
        this.icons = icons;
        this.size = size;
    }

    drawScreen(mX, mY, dT){
        this.drawBackgroundGradient();
        textAlign(CENTER);
        fill(255);
        textSize(36);
        text("INSTRUCCIONES", windowWidth / 2, 36 + 40);

        var a = 0;

        this.lines.forEach((txt, i) => {
            textSize(this.fontSize)
            this.drawText(txt, windowWidth / 2, (18 + 120)+a);

            a += (txt.split('\n').length + 1) * this.fontSize + 20
        });

        push();
        stroke(218, 41, 28);
        textSize(this.fontSize);
        text("Ahora que sabes lo básico\n¡Vamos a divertirnos!", windowWidth / 2, windowHeight - 60);
        pop();

        noStroke();
        super.drawScreen(mX, mY, dT)
    }

    mouseClicked(mX, mY, mB){
        this.click();
    }

    drawText(txt, x, y){
        var w = 0;
        var k = 0;
        var is = this.size;

        var icon = "";
        var dIcon = false;
        var nl = "";

        push()
        txt.split("\n").forEach((l)=>{

            w = 0;
            y += 20;

            l.split("").forEach((c) => {
                if(c == "{"){
                    dIcon = true;
                }

                if(dIcon){
                    icon += c;
                }

                if(c == "}"){
                    dIcon = false;
                }

                nl += c;

                var fx = (x + w) - textWidth(l.trim())/2

                if(fx >= windowWidth){
                    c += "\n"
                }

                y += (c.split('\n').length-1) * 20;
                c = c.replace('\n', '')

                if(!dIcon){
                    if(!this.icons[icon]){
                        textAlign(LEFT)
                        text(c, fx, y);
                    }else{
                        var h = is * this.icons[icon].height / this.icons[icon].width;
                        image(this.icons[icon], fx, y-(h - (h / 4)), is, h)
                    }

                    w += (!this.icons[icon] ? textWidth(c) : is) + k;
                    icon = "";
                }
            });
        })
        pop()
    }

    textHeight(text, maxWidth) {
        var words = text.split(' ');
        var line = '';
        var h = this.fontSize + 5;

        for (var i = 0; i < words.length; i++) {
            var testLine = line + words[i] + ' ';
            var testWidth = drawingContext.measureText(testLine).width;

            if (testWidth > maxWidth && i > 0) {
                line = words[i] + ' ';
                h += this.fontSize + 5;
            } else {
                line = testLine;
            }
        }

        return h;
    }
}