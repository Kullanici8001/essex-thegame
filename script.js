const gameContainer = document.getElementById('game-container');
const donkey = document.getElementById('donkey');
const grassTexture = 'grass.png'; // Çimen texture dosyasının yolu

let donkeyX = 10;
let donkeyY = 10;
let speed = 5;

const butters = [];
const trees = [];
let toaster = null;  // Tost makinesi nesnesi

let isResetting = false; // Reset işlemi kontrolü
let collectedAllButters = false; // Bütün tereyağları toplandı mı?

// Tuş takibi
const keys = {
    w: false,
    s: false,
    a: false,
    d: false,
};

// Tereyağı ve ağaç ekleme
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

// Tost makinesi ekleme
function createToaster() {
    toaster = document.createElement('div');
    toaster.className = 'toaster';
    toaster.style.left = `${Math.random() * 750}px`;
    toaster.style.top = `${Math.random() * 550}px`;
    
    // Tost makinesinin boyutunu sınırlayalım
    toaster.style.width = '100px';  // Genişlik
    toaster.style.height = 'auto';  // Yükseklik oranı korunarak ayarlanacak

    toaster.innerHTML = `<img src="tost.png" alt="toaster" style="width: 100%; height: auto;">`;  // Resim boyutunu da kontrol ediyoruz
    gameContainer.appendChild(toaster);
}

// Başlangıçta tereyağı ve ağaç ekleyelim
generateItems(10, 'butter', 'teremyag.png', butters);
generateItems(7, 'tree', 'tree.png', trees);
createToaster();  // Tost makinesini oluştur

// Çimen texture ekleme
gameContainer.style.backgroundImage = `url(${grassTexture})`;
gameContainer.style.backgroundSize = '50px 50px'; // Tekrarlanan doku boyutu
gameContainer.style.backgroundRepeat = 'repeat'; // Doku tekrarı


// Hareketi sürekli kontrol et
function moveDonkey() {
    if (isResetting) return; // Reset işlemi yapılıyorsa hareket etme

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

// Hitbox kontrolünü küçük yapalım
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

        // Hitbox'ı küçültüyoruz (tereyağı için 0.5, yani %50)
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

        // Hitbox'ı küçültüyoruz (ağaç için 0.6, yani %60)
        if (checkCollision(rect1, rect2, 0.6)) {
            showVideoAndReset();
        }
    });
}

function checkToasterCollision() {
    if (!collectedAllButters) return; // Eğer tereyağları toplanmadıysa tost makinesiyle çarpışma olmasın

    const rect1 = donkey.getBoundingClientRect();
    const rect2 = toaster.getBoundingClientRect();

    // Hitbox'ı küçültüyoruz (tost makinesi için 0.7, yani %70)
    if (checkCollision(rect1, rect2, 0.7)) {
        showFinalVideo();
    }
}

// Video oynat ve oyunu sıfırla
function showVideoAndReset() {
    isResetting = true; // Reset işlemi başladı

    // Video elementi oluştur
    const video = document.createElement('video');
    video.src = 'enesbatur.mp4';
    video.autoplay = true;
    video.controls = false;
    video.muted = false; // Ses açıldı
    video.style.position = 'absolute';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.top = '0';
    video.style.left = '0';
    gameContainer.appendChild(video);

    // 2 saniye sonra oyunu sıfırla
    setTimeout(() => {
        video.remove();
        resetGame();
        isResetting = false; // Reset işlemi bitti
    }, 2000);
}

// Final videosunu oynat ve oyunu bitir
function showFinalVideo() {
    isResetting = true;

    // Final video elementi oluştur
    const video = document.createElement('video');
    video.src = 'essex.mp4';
    video.autoplay = true;
    video.controls = false;
    video.muted = false; // Ses açıldı
    video.style.position = 'absolute';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.top = '0';
    video.style.left = '0';
    gameContainer.appendChild(video);

    // 5 saniye sonra oyunu sıfırla
    setTimeout(() => {
        video.remove();
        alert('BRAVO KORNACI!!');
        resetGame();
        isResetting = false; // Oyun bitişi
    }, 5000);
}

// Oyunu sıfırla
function resetGame() {
    donkeyX = 10;
    donkeyY = 10;
    butters.forEach((butter) => butter.remove());
    trees.forEach((tree) => tree.remove());
    butters.length = 0;
    trees.length = 0;
   // createToaster();  // Tost makinesini tekrar oluştur
    generateItems(10, 'butter', 'teremyag.png', butters);
    generateItems(7, 'tree', 'tree.png', trees);
    donkey.style.left = `${donkeyX}px`;
    donkey.style.top = `${donkeyY}px`;
    collectedAllButters = false;
}

// Tuş takibi için event listeners
document.addEventListener('keydown', (e) => {
    if (e.key in keys) keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) keys[e.key] = false;
});

// Ana döngü
setInterval(moveDonkey, 20);
