let currentView;
let lastKeyCode = null;
let lastKeyText = null;

let font;
let gameTransactionController = undefined;

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(60);

    font = loadFont("src/assets/Gotham.ttf");

    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        currentView = new IOSRequestView({
            title: "Necesitamos\ntu ayuda",
            font: font,
            splash: loadImage("src/assets/ios/request.png"),
            cssFont: "Gotham",
            requestCb: () => {
                DeviceMotionEvent.requestPermission().then(permissionState => {
                    if (permissionState === 'granted') {
                        state = "main"
                    }else{
                        console.log("execute: close")
                    }
                }).catch(console.error);
            }
        });
    } else {
        currentView = new SplashView({
            title: "Bienvenido a\nHydroK",
            splash: loadImage("src/assets/splash/splash.png"),
            path: 'src/assets',
            font: font,
            start: () => {
                if(!isPractice()){
                    getTransactionController().modifyKoins({
                        koins: -1
                    }).then(e => {
                        var obj = JSON.parse(e);

                        if (obj.code == "210") {
                            displayGuiScreen(new IGNView());
                        } else {
                            alert("Ya no tienes monedas :(")
                        }
                    })
                }else{
                    displayGuiScreen(new IGNView());
                }
            },
            instructions: (parent) => {
                displayGuiScreen(new InstructionsView({
                    size: 24,
                    icons: {
                        '{c}': loadImage("src/assets/instructions/BCase.png"),
                        '{b}': loadImage("src/assets/instructions/Button.png"),
                        '{r}': loadImage("src/assets/instructions/Reloj.png"),
                        '{rt}': loadImage("src/assets/instructions/Rotate.png"),
                    },
                    lines: [
                        'Presiona los botones {b} para\nhacer nadar a las gomas en el agua.',
                        'Debes encestar las gomas en\nel {c} para hacer puntos.',
                        'Cada 20 encestos {c} se\nrestablecerá el tiempo {r} para\nque sigas haciendo puntos.',
                        'Puedes girar {rt} la pantalla\npara usar la gravedad a tu favor si es\nnecesario.'
                    ],
                    font: font,
                    click: () => {
                        displayGuiScreen(parent);
                    }
                }));
            },
            terms: (parent) => {
                displayGuiScreen(new TermsView({
                    path: './info.json',
                    logo: loadImage("src/assets/splash/splash.png"),
                    font: font,
                    click: () => {
                        displayGuiScreen(parent);
                    }
                }));
            }
        });
    }

    if(currentView) currentView.initGui()
}

function isPractice() {
    return getParam("ac") == null;
}

function getParam(param) {
    var url = new URL(window.location.href);
    var tmp = url.searchParams.get(param);
    return tmp;
}

function getDefaultFont() {
    return font;
}

function getTransactionController() {
    return !gameTransactionController ? gameTransactionController = new GameTransactionController({
        userId: getParam("ui"),
        accessCode: getParam("ac"),
        gameId: getParam("gi"),
        md5: getParam("m"),
        isRelease: getParam("isRelease")
    }) : gameTransactionController;
}

function draw(){
    clear();
    if(currentView) currentView.drawScreen(mouseX, mouseY, deltaTime);
    lastKeyText = key;
    lastKeyCode = keyCode;

    if(lastKeyCode != 0 && lastKeyText != "" && currentView && currentView.keyRepeat){
        currentView.keyTyped(key, keyCode)
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    if(currentView) {
        currentView.onResize();
    }
}

function displayGuiScreen(view){
    if(currentView) currentView.onGuiClosed();

    lastKeyText = "";
    lastKeyCode = 0;
    currentView = view;

    if(view){
        view.initGui()
    }
}

function mousePressed() {
    if(currentView) currentView.handleMouseInput(0, mouseX, mouseY, mouseButton)
}

function mouseReleased() {
    if(currentView) currentView.handleMouseInput(1, mouseX, mouseY, mouseButton)
}

function mouseDragged() {
    if(currentView) currentView.handleMouseInput(2, mouseX, mouseY, mouseButton)
}

function keyReleased() {
    if(lastKeyText == key){
        key = "";
    }
    if(lastKeyCode == keyCode){
        keyCode = 0;
    }
}

function keyPressed() {
    if(currentView && !currentView.keyRepeat){
        currentView.keyTyped(key, keyCode)
    }
}