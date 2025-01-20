const gameContainer = document.getElementById('game-container');
const donkey = document.getElementById('donkey');
const grassTexture = 'grass.png'; 

let donkeyX = 10;
let donkeyY = 10;
let speed = 5;

const butters = [];
const trees = [];
let toaster = null;  

let isResetting = false; 
let collectedAllButters = false; 

const keys = {
    w: false,
    s: false,
    a: false,
    d: false,
};

function generateItems(count, className, imgSrc, arr) {
    for (let i = 0; i < count; i++) {
        const item = document.createElement('div');
        item.className = className;
        item.style.left = `${Math.random() * 750}px`;
        item.style.top = `${Math.random() * 550}px`;
        item.innerHTML = `<img src="${imgSrc}" alt="${className}">`;
        gameContainer.appendChild(item);
        arr.push(item);
    }
}

function createToaster() {
    toaster = document.createElement('div');
    toaster.className = 'toaster';
    toaster.style.left = `${Math.random() * 750}px`;
    toaster.style.top = `${Math.random() * 550}px`;
    
    toaster.style.width = '100px';  
    toaster.style.height = 'auto'; 

    toaster.innerHTML = `<img src="tost.png" alt="toaster" style="width: 100%; height: auto;">`;  
    gameContainer.appendChild(toaster);
}

generateItems(10, 'butter', 'teremyag.png', butters);
generateItems(7, 'tree', 'tree.png', trees);
createToaster();  

gameContainer.style.backgroundImage = `url(${grassTexture})`;
gameContainer.style.backgroundSize = '50px 50px'; 
gameContainer.style.backgroundRepeat = 'repeat'; 


function moveDonkey() {
    if (isResetting) return; 

    if (keys.w) donkeyY = Math.max(0, donkeyY - speed);
    if (keys.s) donkeyY = Math.min(550, donkeyY + speed);
    if (keys.a) donkeyX = Math.max(0, donkeyX - speed);
    if (keys.d) donkeyX = Math.min(750, donkeyX + speed);

    donkey.style.left = `${donkeyX}px`;
    donkey.style.top = `${donkeyY}px`;

    checkButterCollision();
    checkTreeCollision();
    checkToasterCollision();
}

function checkCollision(rect1, rect2, scale = 1) {
    const scaledRect1 = {
        x: rect1.x + rect1.width * (1 - scale) / 2,
        y: rect1.y + rect1.height * (1 - scale) / 2,
        width: rect1.width * scale,
        height: rect1.height * scale,
    };
    
    const scaledRect2 = {
        x: rect2.x + rect2.width * (1 - scale) / 2,
        y: rect2.y + rect2.height * (1 - scale) / 2,
        width: rect2.width * scale,
        height: rect2.height * scale,
    };

    return (
        scaledRect1.x < scaledRect2.x + scaledRect2.width &&
        scaledRect1.x + scaledRect1.width > scaledRect2.x &&
        scaledRect1.y < scaledRect2.y + scaledRect2.height &&
        scaledRect1.y + scaledRect1.height > scaledRect2.y
    );
}

function checkButterCollision() {
    butters.forEach((butter, index) => {
        const rect1 = donkey.getBoundingClientRect();
        const rect2 = butter.getBoundingClientRect();

        if (checkCollision(rect1, rect2, 0.5)) {
            butter.remove();
            butters.splice(index, 1);
        }
    });

    if (butters.length === 0 && !collectedAllButters) {
        collectedAllButters = true;
    }
}

function checkTreeCollision() {
    trees.forEach((tree) => {
        const rect1 = donkey.getBoundingClientRect();
        const rect2 = tree.getBoundingClientRect();

        if (checkCollision(rect1, rect2, 0.6)) {
            showVideoAndReset();
        }
    });
}

function checkToasterCollision() {
    if (!collectedAllButters) return; 

    const rect1 = donkey.getBoundingClientRect();
    const rect2 = toaster.getBoundingClientRect();

    if (checkCollision(rect1, rect2, 0.7)) {
        showFinalVideo();
    }
}

function showVideoAndReset() {
    isResetting = true; 

    const video = document.createElement('video');
    video.src = 'enesbatur.mp4';
    video.autoplay = true;
    video.controls = false;
    video.muted = false; 
    video.style.position = 'absolute';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.top = '0';
    video.style.left = '0';
    gameContainer.appendChild(video);

    setTimeout(() => {
        video.remove();
        resetGame();
        isResetting = false; 
    }, 2000);
}

function showFinalVideo() {
    isResetting = true;

    const video = document.createElement('video');
    video.src = 'essex.mp4';
    video.autoplay = true;
    video.controls = false;
    video.muted = false; 
    video.style.position = 'absolute';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.top = '0';
    video.style.left = '0';
    gameContainer.appendChild(video);

    setTimeout(() => {
        video.remove();
        alert('BRAVO KORNACI!!');
        resetGame();
        isResetting = false; 
    }, 5000);
}

function resetGame() {
    donkeyX = 10;
    donkeyY = 10;
    butters.forEach((butter) => butter.remove());
    trees.forEach((tree) => tree.remove());
    butters.length = 0;
    trees.length = 0;
    generateItems(10, 'butter', 'teremyag.png', butters);
    generateItems(7, 'tree', 'tree.png', trees);
    donkey.style.left = `${donkeyX}px`;
    donkey.style.top = `${donkeyY}px`;
    collectedAllButters = false;
}

document.addEventListener('keydown', (e) => {
    if (e.key in keys) keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) keys[e.key] = false;
});

setInterval(moveDonkey, 20);
