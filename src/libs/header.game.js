class Header{
    constructor(font, icons){
        this.font = font;
        this.icons = icons;
    }

    drawHeader(items){
        smooth();
        fill(0, 0, 0, 140);
        rect(0, 0, windowWidth, 60);

        items.forEach((item, index) => {
            var fontSize = item.fontSize ? item.fontSize : 34;
            var spriteSize = 35;
            var itemPadding = 10;
            var itemWidth = 90;
            push();
            textSize(fontSize);
            textFont(this.font);
            var iX = (itemPadding+itemWidth) * (index+1);
            translate(windowWidth - iX, 0);
            image(this.icons[item.sprite], 0, 10, spriteSize, spriteSize);
            fill(255);
            text(item.text, spriteSize+25+textWidth(item.text), fontSize + 6);
            pop();
        });
    }

    getWidth(spriteSize, itemPadding, items){
        return new Promise((resolve) => {
            var tX;
            items.map((item, index) => {
                tX += (((spriteSize+textWidth(item.text))+itemPadding) * (index))
                if(index >= items.length)
                    resolve(tX)
            })
        })
    }
}