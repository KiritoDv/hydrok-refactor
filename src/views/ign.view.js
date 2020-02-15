
let balls = [];

var waterControls = [];

var aX = 0;
var aY = 0;

var pSelectedBall = null;
var maxVelocity = 2;

let textures = {}
let textures_g = {}

var spawned = false;
let pointsNeeded;
let points = 0;
let time;

let gameOver = false;
let font;

var m;

var gameStarted = false;

var endGame;

var header;
function preload(){
    
    textures["ss"] = loadImage("src/assets/WaterGame.png")

    textures["bg"] = loadImage("src/assets/background.jpg")
    textures["bubble"] = loadImage("src/assets/Bubble_r.png")

    textures["bg-u"] = loadImage("src/assets/cage/BGRedux2.png")
    textures["bg-h"] = loadImage("src/assets/cage/HeaderBG.png")

    textures["bg-a"] = loadImage("src/assets/cage/Background.png")
    textures["cage"] = loadImage("src/assets/cage/Cage.png")
    textures["bar"] = loadImage("src/assets/cage/Bar.png")

    textures["wfx"] = loadImage("src/assets/WaterFx.png")
    textures["bottle"] = loadImage("src/assets/bottle/FixedBottle.png")
    textures["request"] = loadImage("src/assets/ios/request.png")

    textures_g["gummy-b"] = loadImage("src/assets/gummy/B.png")
    textures_g["gummy-g"] = loadImage("src/assets/gummy/G.png")
    textures_g["gummy-o"] = loadImage("src/assets/gummy/O.png")
    textures_g["gummy-p"] = loadImage("src/assets/gummy/P.png")
    textures_g["gummy-r"] = loadImage("src/assets/gummy/R.png")
    textures_g["gummy-r2"] = loadImage("src/assets/gummy/R2.png")
}

var state = "prompt";
var splash, terms, instructions, request;

function setup(){
    time = 60;
    pointsNeeded = 20;    
    font = loadFont("src/assets/Gotham.ttf");
    header = new Header({
        "items": [
            {
                sprite: loadImage("src/assets/gameover/Koin.png"),
                text: points
            },
            {
                sprite: loadImage("src/assets/gameover/Reloj.png"),
                text: time
            },
            {
                sprite: loadImage("src/assets/gameover/Tiro.png"),
                text: pointsNeeded
            }            
        ],
        "font": font
    });

    m = new GameTransactionController({
		userId: getCookie("ui"),
		accessCode: getCookie("ac"),
		gameId: getCookie("gi"),
        md5: getCookie("m"),
        isRelease: getCookie("isRelease")
	});

    endGame = new GameOver({isTraining: getCookie("ac") == null || getCookie("ac") == '',
        pos: {
            x: 0, y: 0
        },
        path: "./src/assets",
        click: ()=>{
            if(getCookie("ac") == null || getCookie("ac") == ''){
                balls = [];
                gameOver = false;
                time = 60;
                points = 0;
                pointsNeeded = 20;
                spawned = false;
            }else{
                restart();
            }
        }
    });
    endGame.preload();

    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    var dRadius = 16;    

    waterControls.push(new WaterFlow(windowWidth - 90, windowHeight/7*6 + 64-10));
    waterControls.push(new WaterFlow(90, windowHeight/7*6 + 64-10));

    setInterval(() =>{
        if(gameStarted && !gameOver){
            if(time <= 0 && pointsNeeded > 0){
                gameOver = true;
            }
            if(!gameOver){
                if(pointsNeeded <= 0){
                    time = 60;
                    pointsNeeded = 20;
                }
                if(time > 0){
                    time--;
                }
            }
        }
    }, 1000);    
}

let updatedPoints = false;

function simulateGyroscope(){
    setInterval(()=> {
        aX = random(-10, 10);
    }, 2000)

    setInterval(()=> {
        aY = random(-10, 10);
    }, 2000) 
}

let gravity = {
    x: 0,
    y: 0
}

function mouseClicked(){
    switch (state) {
        case "terms": {
            splash.hookMouseClicked(0);
            break;
        }
        case "main": {
            splash.hookMouseClicked(1);
            break;
        }
        case "instructions": {
            splash.hookMouseClicked(2);
            break;
        }
    }
}

function handleAcceleration(event){    
    if(event){
        aX = -Math.sin( event.gamma * Math.PI) * 360;
        aY = Math.sin( ( Math.PI / 4 ) + event.beta * Math.PI ) * 180;
    }    
}

function restart() {
	if (getCookie("ac") == null) { alert("Se detecto una actividad inusual con los datos del usuario"); return }
	if (getCookie("ui") == null) { alert("Se detecto una actividad inusual con los datos del usuario"); return }
	if (getCookie("gi") == null) { alert("Se detecto una actividad inusual con los datos del usuario"); return }
	if (getCookie("m") == null) { alert("Se detecto una actividad inusual con los datos del usuario"); return }
	try {
		var gtc = new GameTransactionController({
			accessCode: getCookie("ac"),
			userId:     getCookie("ui"),
			gameId:     getCookie("gi"),
            md5:        getCookie("m"),
            isRelease: getCookie("isRelease")
		});

		gtc.modifyKoins({
			koins: -1
		}).then(e => {
            var obj = JSON.parse(e);

			if (obj.code == "210") {
				balls = [];
                gameOver = false;
                time = 60;
                points = 0;
                pointsNeeded = 20;
                spawned = false;
			} else {
				alert("Ya no tienes monedas :(")
			}
		})
	} catch (e) {
		alert("No hay una instanciacion valida del gtc")
	}
}

function draw(){    

    if(gameStarted){
        drawIG();
        if(gameOver)
            //drawGameOver();
            endGame.draw(points);
    }else{
        switch(state){
			case "main":{
				splash.drawSplash();
				break;
			}
			case "instructions":{
				instructions.drawInstructions();
				break;
			}
			case "terms":{
				terms.drawTerms();
				break;
            }
            case "prompt": {
                request.drawRequest();
                break;
            }
		}
    }
}

function drawGradient() {
    noFill();
    var c1 = color(78, 81, 107);
    var c2 = color(0, 0, 0);
    for (var y = 0; y < height; y++) {
      var inter = map(y, 0, height, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(0, y, width, y);
    }
}

function drawGameOver(){
    fill(255)
    textFont(font)
    textSize(24)
    textAlign(CENTER)
    text("Has perdido!\nPuntos: "+points, (windowWidth) * 0.1, windowHeight / 4, windowWidth * 0.8)

    textAlign(CENTER)
    textFont(font)
    textSize(22)
    text("Tap para reiniciar", windowWidth / 2, windowHeight / 1.5)

    balls = [];

    for(var touch = 0; touch < touches.length; touch++){
        gameOver = false;
        time = 60;
        points = 0;
        pointsNeeded = 20;
        spawned = false;
    }
}

function requestPermission(){
    window.addEventListener("devicemotion", (e) => {
        if( navigator.platform.substr(0,2) === 'iP' ) {
            if( window.webkit && window.webkit.messageHandlers ) {
                var bAeX = e.accelerationIncludingGravity.x;
                aX = bAX;
                //aY = 3.81 + bAZ;
            }else{
                var bAX = e.accelerationIncludingGravity.x;
                aX = bAX;
                //aY = 3.81 + bAZ;
            }
        }else{
            var bAX = -e.accelerationIncludingGravity.x;
            aX = bAX;
            //aY = 3.81 - bAZ;
        }
    }, true);
}

function drawMainMenu(){
    background(30, 30, 37)
    noSmooth();
    fill(56, 97, 160);
    rect(0, 0, windowWidth, windowHeight)
    var bG = getAspectRatio(181, 204, windowWidth);
    var bGY = Math.abs(windowHeight - bG.height);
    image(textures["bg-u"], 0, bGY, bG.width, bG.height);

    var cS = getAspectRatio(64, 64, bG.height/8);
    var cX = Math.abs((cS.width / 2) - windowWidth / 2)
    var cY = Math.abs(windowHeight - bG.height)+cS.height
    image(textures["ss"],  cX, cY, cS.width, cS.height, 14, 104, 28, 30)

    fill(255)
    textFont(font)
    textSize(16)
    textAlign(CENTER)
    text("Encesta las gomas en la canasta antes de que se te acabe el tiempo \n\nCada 20 encestos \nrecuperas 60 segundos", (windowWidth) * 0.1, windowHeight / 4, windowWidth * 0.8)

    textAlign(CENTER)
    textFont(font)
    textSize(22)
    //text("Tap para iniciar", windowWidth / 2, windowHeight / 1.5)
    textAlign(LEFT)
    //for(var touch = 0; touch < touches.length; touch++){}
}

var tmpX = 0
var tmpY = 0

function drawIG(){

    if(keyIsPressed){
        if(key == "w"){
            tmpY += 1;
        }
        if(key == "a"){
            tmpX -= 1;
        }
        if(key == "s"){
            tmpY -= 1;
        }
        if(key == "d"){
            tmpX += 1;
        }
    }

    //aX = tmpX;
    //aY = tmpY;

    background(0)
    image(textures["bg"], 0, 0, windowWidth, windowHeight);

    noStroke();
    fill(255,255,255,60)
    rect(25,25,windowWidth-50,windowHeight-50);
    fill(255)
    var vecCollidingPairs = []

    var height = 320;
    var aW = (181 / 45) * height;
    var aH = aW / (181 / 45);
    noSmooth();
    fill(56, 97, 160);
    rect(0, 0, windowWidth, windowHeight)

    var bG = getAspectRatio(181, 204, windowWidth);
    var bGY = Math.abs(windowHeight - bG.height);
    image(textures["bg-u"], 0, bGY, bG.width, bG.height);

    var cS = getAspectRatio(64, 64, bG.height/8);
    var cX = Math.abs((cS.width / 2) - windowWidth / 2)
    var cY = Math.abs(windowHeight - bG.height)+cS.height
    image(textures["ss"],  cX, cY, cS.width, cS.height, 14, 104, 28, 30)

    aR = getAspectRatio(181, 38, windowWidth);
    image(textures["bg-h"], 0, 0, aR.width, aR.height);

    waterControls.forEach(water => {
        water.handleCircle(textures["wfx"])
    });

    var aR1 = getAspectRatio(166, 188, windowWidth - 60);
    //image(textures["cage"], Math.abs((aR1.width / 2) - windowWidth / 2), Math.abs((aR1.height / 2) - windowHeight / 2), aR1.width, aR1.height);

    var aR2 = getAspectRatio(181, 45, windowWidth - 60);
    var barX = Math.abs((aR2.width / 2) - windowWidth / 2);
    var barY = Math.abs(windowHeight - aR.height - (aR.height / 2));

    //drawWater(40, 20, windowWidth-80, 20)

    //fill(255,255,255, 30)
    //stroke(218, 41, 28, 140);
    //strokeWeight(3);
    //rect(40,60, windowWidth-80, Math.abs(60-barY)+30);

    strokeWeight(0)
    image(textures["bar"], barX, barY, aR2.width, aR2.height);
    image(textures["bottle"], 4, 10, windowWidth - 8, windowHeight)

    var ss = getAspectRatio(64, 64, aR2.height/2+8);
    var bX = Math.abs((aR2.width / 2) - windowWidth / 2)+(aR2.width/16);
    var bY = Math.abs(windowHeight - aR.height)-ss.height/2;
    image(textures["ss"], bX, bY, ss.width, ss.height, 54, 2, 30, 30)

    var b2X = aR2.width - ss.width;
    var b2Y = Math.abs(windowHeight - aR.height)-ss.height/2;
    image(textures["ss"], b2X, b2Y, ss.width, ss.height, 54, 2, 30, 30)

    //fill(0)
    //rect(cX, cY, 2, cS.width);
    //rect(cX+cS.width, cY, 2, cS.width);
    //rect(windowWidth/2, 0, 1, windowHeight);

    //rect(0, windowHeight/2, windowWidth, 2);

    if(!spawned){
        var dRadius = 20;
        var txe = Object.entries(textures_g);
        for(var i = 0; i < txe.length; i++){
            //Math.round(Math.random() * (txe.length-1))
            addBall(random(barX, aR2.width), barY - dRadius, dRadius, textures_g[txe[i][0]]);
        }
        spawned = true;
    }

    balls.forEach(ball => {
        //console.log(`sX: ${aX} sY: ${aX} fVX: ${tvX}thi fvY: ${tvY}`)

        if(aX > 0.05 || aX < 0.05){
            const iV = ball.vx.valueOf();
            ball.vx = constrain(aX - iV, -3, 3);
        }


        if(aY > 0 || aY < 0){
            const iV = ball.vy.valueOf();
            ball.vy = constrain(aY + iV, -3, 3);
        }

        //ball.vx = -constrain(aX, -2, 2);
        //ball.vy = constrain(aY, -2, 2);

        waterControls.forEach(water => {
            water.particles.forEach(p => {
                if((p.x >= ball.px && p.y >= ball.py && p.x <= ball.px + (ball.radius * 2) && p.y <= ball.py + (ball.radius * 2))){
                    if(p.alpha > 0){
                        //ball.vy -= (4.81);
                        ball.vy = p.vy * deltaTime * 0.03;
                        //ball.vx = ( ball.vx * (32-32) + (2 * 32 * p.vx) ) / (32+32)
                        //ball.canMove.y = false;
                        //ball.vy = p.vx;
                    }
                }
            })
        })

        ball.vy += ball.vy >= maxVelocity ? 0 : deltaTime * 0.0005;

        //ball.ax = -ball.vx * 0.8;
        //ball.ay = -ball.vy * 0.8;
        //// Update ball physics
        //ball.vx += ball.ax * (deltaTime / 120);
        //ball.vy += ball.ay * (deltaTime / 120);
        //ball.px += ball.vx * (deltaTime / 120);
        //ball.py += ball.vy * (deltaTime / 120);

        //
        //rect(cX-10, cY, 10, cS.height)
          //rect(cS.width+cX, cY, 10, cS.height)

        //rect(cX, cY+cS.height, cS.width, 10)


        var rd = ball.radius * 2;

        if(ball.px < (cX + rd) && ball.px + rd > cX + 2 && ball.py < cY + cS.height && ball.py + rd > cY){
            ball.vx = 0;
            ball.canMove.x = false;
        }else{
            ball.canMove.x = true;
        }

        if(ball.px < ((cX+cS.width) + rd) && ball.px + rd > (cX + 2)+cS.width && ball.py < cY + cS.height && ball.py + (rd) > cY){
            ball.vx = 0;
            ball.canMove.x = false;
        }else{
            ball.canMove.x = true;
        }

        if(ball.px >= cX && ball.px <= cX+cS.width && ball.py >= cY+(cS.height/2) && ball.py <= cY+cS.height && ball.vy >= 0){
            ball.vx = 0;
            //ball.vy+=1.5;
            //ball.py = ball.py + 1;
            //ball.px = random(barX, aR2.width);
            //ball.py = barY - dRadius;
            if(!ball.updatedPoints){
                pointsNeeded--;
                ball.updatedPoints = true;
                points++;
                m.modifyStars({ stars: 1 }).then(res => {});
            }
            //balls.splice(balls.indexOf(ball), 1)
        }else{
            ball.updatedPoints = false;
        }

        /** INFO: Object collide with screen borders */
        if(ball.px >= windowWidth-110 + (ball.radius + ball.radius)){
            //ball.vx = 0;
            ball.px = windowWidth-110 + (ball.radius + ball.radius);
        }
        if(ball.px < 40+(ball.radius + ball.radius)){
            //ball.vx = 0;
            ball.px = 40+(ball.radius + ball.radius);
        }
        if(ball.py < 120){
            //ball.vy = 0;
            ball.py = 120;
        }
        if(ball.py >= 60 + Math.abs(60-barY) - ball.radius){
            //ball.vy = 0;
            ball.py = 60 + Math.abs(60-barY)  - ball.radius
        }

        /* TODO: Clean
            // Wrap the balls around screeny
            if (ball.px < 0) ball.px += windowWidth;
            if (ball.px >= windowWidth) ball.px -= windowWidth;
            if (ball.py < 0) ball.py += windowHeight;
            if (ball.py >= windowHeight) ball.py -= windowHeight;
            // Clamp velocity near zero
            if (Math.abs(ball.vx*ball.vx + ball.vy*ball.vy) < 0.01)
            {
                ball.vx = 0;
                ball.vy = 0;
            }
        */        

        //X: 9
        
    //ball.vy += ball.vy >= maxVelocity ? 0 : deltaTime * 0.05;

        if(ball.canMove.x)
            ball.px += ball.vx;
        if(ball.canMove.y)
            ball.py += ball.vy;

        balls.forEach(target => {
            if(ball.id != target.id){
                if(doCirclesOverlap(ball.px, ball.py, ball.radius, target.px, target.py, target.radius)){
                    
                    vecCollidingPairs.push({
                        ball: ball,
                        target: target
                    })

                    var fDistance = sqrt((ball.px - target.px)*(ball.px - target.px) + (ball.py - target.py)*(ball.py - target.py));
                    var fOverlap = 0.5 * (fDistance - ball.radius - target.radius);

                    ball.px -= fOverlap * (ball.px - target.px) / fDistance;
                    ball.py -= fOverlap * (ball.py - target.py) / fDistance;

                    target.px += fOverlap * (ball.px - target.px) / fDistance;
                    target.py += fOverlap * (ball.py - target.py) / fDistance;
                }
            }

        })
        fill(255)

        var x = ball.px;
        var y = ball.py;
        //drawCircle(x, y, ball.radius)
        push()
        translate(x, y)
        rotate(-Math.atan2(lerp(ball.py + (ball.vy/ball.radius*2), (ball.vy/ball.radius), 0.00005), lerp(ball.px + ((ball.vx-aX)/ball.radius), ((ball.vx-aX)/ball.radius), 0.00005)) * 46)

        if(ball.textureFrame >= ball.maxTextureFrames-1){
            ball.textureFrame = 0;
        }else{
            ball.textureFrame += 0.3;
        }

        rotate(20);

        fill(0)

        image(ball.texture, -ball.radius, -ball.radius, 40, 40, Math.round(ball.textureFrame) * 50, 0, 50, 50)        
        //textSize(12)
        //text(Math.round(ball.vy), 0, 0)
        pop()

        //drawCircle(ball.px, ball.py, ball.radius)
    });

    if(!gameOver){
                
        push()
        header.items[0].text = points;
        header.items[1].text = time;
        header.items[2].text = pointsNeeded <= 0 ? 0 : pointsNeeded;
        header.drawHeader()
        pop()

        push()
        fill(255)
        textSize(20)
        textAlign(LEFT)
        //text(`Gx: ${aX}\nGy: ${aY}`, 20, 40);
        pop()
        //fill(0, 15, 15)
        //rect(0, 0, windowWidth, 15)
        //fill(255)
        //textAlign(CENTER)
        //text(`Gomas por encestar: ${pointsNeeded}`, windowWidth/2, 80)
//
        //textAlign(RIGHT)
        //text(`Tienes solo: ${time} Segundos!`, windowWidth-3, 13)
//
        //textAlign(LEFT)
        //text(`Puntos: ${points}`, 3, 13)
//
        //textAlign(LEFT)
        //text(`FPS: ${Math.round(frameRate())}`, 3, 33)
    }

    vecCollidingPairs.forEach(c => {
        var b1 = c.ball;
        var b2 = c.target;

        // Distance between balls
        var fDistance = sqrt((b1.px - b2.px)*(b1.px - b2.px) + (b1.py - b2.py)*(b1.py - b2.py));

        // Normal
        var nx = (b2.px - b1.px) / fDistance;
        var ny = (b2.py - b1.py) / fDistance;

        // Tangent
        var tx = -ny;
        var ty = nx;

        // Dot Product Tangent
        var dpTan1 = b1.vx * tx + b1.vy * ty;
        var dpTan2 = b2.vx * tx + b2.vy * ty;

        // Dot Product Normal
        var dpNorm1 = b1.vx * nx + b1.vy * ny;
        var dpNorm2 = b2.vx * nx + b2.vy * ny;

        // Conservation of momentum in 1D
        var m1 = (dpNorm1 * (b1.mass - b2.mass) + 2.0 * b2.mass * dpNorm2) / (b1.mass + b2.mass);
        var m2 = (dpNorm2 * (b2.mass - b1.mass) + 2.0 * b1.mass * dpNorm1) / (b1.mass + b2.mass);

        // Update ball velocities
        b1.vx = tx * dpTan1 + nx * m1;
        b1.vy = ty * dpTan1 + ny * m1;
        b2.vx = tx * dpTan2 + nx * m2;
        b2.vy = ty * dpTan2 + ny * m2;

        stroke(255,0,0);
        line(c.ball.px, c.ball.py, c.target.px, c.target.py)
    });

    if(pSelectedBall != null){
        stroke(0,255,0);
        line(pSelectedBall.px, pSelectedBall.py, mouseX, mouseY);
    }

    if(mouseIsPressed){
        if(IsInPointInCircle(windowWidth - 90, windowHeight/7*6 + 64-10, 32, mouseX, mouseY)){
            c1 = 100;
            //waterControls[0].addMoreParticles()
        }
        if(IsInPointInCircle(90, windowHeight/7*6 + 64-10, 32, mouseX, mouseY)){
            c2 = 100;
            //waterControls[1].addMoreParticles()
        }
    }else{
        c1 = 200;
        c2 = 200;
    }

    for(var touch = 0; touch < touches.length; touch++){
        var t = touches[touch]

        //console.log(t)

        //ellipse(b2X+(ss.width / 2), b2Y+(ss.height / 2), ss.width)
        //ellipse(bX+(ss.width / 2), bY+(ss.height / 2), ss.width+ss.width)
        waterControls[0].setPosition(aR2.width - (ss.width / 2), b2Y+(ss.height / 2))
        waterControls[1].setPosition(bX+(ss.width / 2), bY+(ss.height / 2), ss.width/2)
        if(IsInPointInCircle(aR2.width - (ss.width / 2), b2Y+(ss.height / 2), ss.width/2, t.x, t.y)){
            c1 = 100;
            waterControls[0].addMoreParticles()
        }
        if(IsInPointInCircle(bX+(ss.width / 2), bY+(ss.height / 2), ss.width/2, t.x, t.y)){
            c2 = 100;
            waterControls[1].addMoreParticles()
        }
    }
}

let yoff = 0.0;

function drawWater(x, y, w, h){
    fill(95, 207, 246, 40)
    push();
    beginShape();

    let xoff = 0; // Option #1: 2D Noise
    // let xoff = yoff; // Option #2: 1D Noise
    // Iterate over horizontal pixels
    for (let x = 44; x <= width-40; x += 10) {
        // Calculate a y value according to noise, map to

        // Option #1: 2D Noise
        let y = map(noise(xoff, yoff), 0, 1, 80, 105);

        // Option #2: 1D Noise
        // let y = map(noise(xoff), 0, 1, 200,300);

        // Set the vertex
        vertex(x, y);
        // Increment x dimension for noise
        xoff += 0.05;
    }
    // increment y dimension for noise
    yoff += 0.01;
    vertex(width-45, height-100);
    vertex(44, height-100);
    endShape(CLOSE);
    pop()
}

function getAspectRatio(bW, bH, width){
    var aW = width;
    var aH = aW / (bW / bH);
    return {
        width: aW,
        height: aH
    }
}

function drawGui(cb){
    function getAspectRatio(bW, bH, width){
        var aW = width;
        var aH = aW / (bW / bH);
        return {
            width: aW,
            height: aH
        }
    }

    var height = 320;
    var aW = (181 / 45) * height;
    var aH = aW / (181 / 45);
    noSmooth();
    fill(56, 97, 160);
    rect(0, 0, windowWidth, windowHeight)

    var bG = getAspectRatio(181, 204, windowWidth);
    var bGY = Math.abs(windowHeight - bG.height);
    image(textures["bg-u"], 0, bGY, bG.width, bG.height);

    var ss = getAspectRatio(64, 64, bG.height/8);
    image(textures["ss"],  Math.abs((ss.width / 2) - windowWidth / 2),  Math.abs(windowHeight - bG.height)+ss.height, ss.width, ss.height, 14, 104, 28, 30)

    aR = getAspectRatio(181, 38, windowWidth);
    image(textures["bg-h"], 0, 0, aR.width, aR.height);


    cb()

    var aR1 = getAspectRatio(166, 188, windowWidth - 60);
    //image(textures["cage"], Math.abs((aR1.width / 2) - windowWidth / 2), Math.abs((aR1.height / 2) - windowHeight / 2), aR1.width, aR1.height);

    var aR2 = getAspectRatio(181, 45, windowWidth - 60);
    var barY = Math.abs(windowHeight - aR.height - (aR.height / 2));

    //drawWater(40, 20, windowWidth-80, 20)

    fill(255,255,255, 30)
    stroke(218, 41, 28, 140);
    strokeWeight(3);
    rect(40,60, windowWidth-80, Math.abs(60-barY)+30);

    strokeWeight(0)
    image(textures["bar"], Math.abs((aR2.width / 2) - windowWidth / 2), barY, aR2.width, aR2.height);

    var ss = getAspectRatio(64, 64, aR2.height/2+8);
    image(textures["ss"],  Math.abs((aR2.width / 2) - windowWidth / 2)+(aR2.width/16), Math.abs(windowHeight - aR.height)-ss.height/2, ss.width, ss.height, 54, 2, 30, 30)
    image(textures["ss"],  Math.abs((aR2.width / 2) - windowWidth)+(aR2.width/6), Math.abs(windowHeight - aR.height)-ss.height/2, ss.width, ss.height, 54, 2, 30, 30)

    fill(0)
    rect(windowWidth/2, 0, 1, windowHeight);

    rect(0, windowHeight/2, windowWidth, 2);

    ss = getAspectRatio(48, 48, aR2.height/2);



    image(textures["ss"], Math.abs((aR2.width / 2) - windowWidth / 2)+(aR2.width/2)-(ss.width/2), Math.abs(windowHeight - aR.height)-ss.height/2, ss.width, ss.height, 14, 1, 24, 25)
    //var aR3 = getAspectRatio(181, 45, windowWidth - 60);
    //image(textures["bar"], Math.abs((aR2.width / 2) - windowWidth / 2), Math.abs(windowHeight - aR.height - (aR.height / 2)), aR2.width, aR2.height);
    //image(textures["cage"], Math.abs((aW / 2) - windowWidth / 2), 100, getAspectRatio(320).width, getAspectRatio(320).height);

    //fill(c1);
    //drawCircle(windowWidth - 90, windowHeight/7*6 + 64-10, 32);

    //fill(c2);
    //drawCircle(90, windowHeight/7*6 + 64-10, 32);
}

function getCookie(parameterName){
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function mouseDragged(e){
    if(e.buttons == 1){
        if(pSelectedBall != null){
            pSelectedBall.px = mouseX;
            pSelectedBall.py = mouseY;
        }
    }
}

function mouseReleased(e){
    if(e.button == 0){
        pSelectedBall = null;
    }
    if(e.button == 2){
        if(pSelectedBall != null){
            pSelectedBall.vx = 1.0 * ((pSelectedBall.px) - mouseX);
			pSelectedBall.vy = 1.0 * ((pSelectedBall.py) - mouseY);
        }
        pSelectedBall = null;
    }
}

function addBall(x, y, r, tex){
    balls.push({
        px: x,
        py: y,
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,
        radius: r,
        mass: r * 10,
        id: balls.length,
        texture: tex,
        textureFrame: 0,
        maxTextureFrames: tex.width / 50,
        canMove: {
            x: true,
            y: true
        },
        updatedPoints: false
    });
}

function maxVal(curr, max){
    return curr >= max ? max : curr;
}

function minVal(curr, min){
    return curr <= min ? min : curr;
}

function drawCircle(x, y, r){
    ellipse(x, y, r*2, r*2);
}

function doCirclesOverlap(x1, y1, r1, x2, y2, r2){
    return abs((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) <= (r1 + r2)*(r1 + r2);
}

function IsInPointInCircle(x1, y1, r1, px, py){
    var a = abs((x1 - px)*(x1 - px) + (y1 - py)*(y1 - py)) < (r1 * r1);
    return a;
}