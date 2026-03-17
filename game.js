document.addEventListener("DOMContentLoaded", () => {

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

let gameOver = false;

// PLAYER
const player = {
    x: 200,
    y: 400,
    size: 20,
    speed: 4,
    hp: 100,
    damage: 1,
    fireRate: 300
};

let coins = 0;
let bullets = [];
let enemies = [];
let effects = [];

let lastShot = 0;

// UPGRADES
const upgrades = {
    damage: { level: 0, max: 5 },
    speed: { level: 0, max: 5 },
    ammo: { level: 0, max: 5 }
};

function initShop() {
    document.querySelectorAll(".upgrade").forEach(el => {
        const type = el.dataset.type;
        const levelsDiv = el.querySelector(".levels");

        for (let i = 0; i < upgrades[type].max; i++) {
            const box = document.createElement("div");
            box.classList.add("level");
            levelsDiv.appendChild(box);
        }

        el.querySelector("button").onclick = () => buyUpgrade(type);
    });
}
initShop();

function updateShopUI() {
    document.querySelectorAll(".upgrade").forEach(el => {
        const type = el.dataset.type;
        const boxes = el.querySelectorAll(".level");

        boxes.forEach((b, i) => {
            b.classList.toggle("filled", i < upgrades[type].level);
        });
    });

    document.getElementById("hp").textContent = player.hp;
    document.getElementById("coins").textContent = coins;
}

function buyUpgrade(type) {
    const up = upgrades[type];
    const cost = (up.level + 1) * 10;

    if (coins >= cost && up.level < up.max) {
        coins -= cost;
        up.level++;

        if (type === "damage") player.damage++;
        if (type === "speed") player.speed += 0.5;
        if (type === "ammo") player.fireRate -= 40;

        updateShopUI();
    }
}

// SHOOT
function shoot() {
    const now = Date.now();
    if (now - lastShot < player.fireRate) return;

    bullets.push({
        x: player.x,
        y: player.y,
        size: 5,
        speed: 7
    });

    effects.push({
        x: player.x,
        y: player.y,
        life: 10
    });

    lastShot = now;
}

// ENEMIES
function spawnEnemy() {
    enemies.push({
        x: Math.random() * canvas.width,
        y: -20,
        size: 20,
        speed: 2 + Math.random() * 2,
        hp: 2
    });
}

setInterval(spawnEnemy, 1000);

// UPDATE
function update() {
    if (gameOver) return;

    // MOVE
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;
    if (keys["ArrowUp"]) player.y -= player.speed;
    if (keys["ArrowDown"]) player.y += player.speed;

    // SHOOT
    if (keys["x"] || keys["X"]) shoot();

    // BULLETS
    bullets.forEach((b, i) => {
        b.y -= b.speed;
        if (b.y < 0) bullets.splice(i, 1);
    });

    // ENEMIES
    enemies.forEach((e, i) => {
        e.y += e.speed;

        if (e.y > canvas.height) enemies.splice(i, 1);

        // COLLISION PLAYER
        if (Math.abs(e.x - player.x) < 20 && Math.abs(e.y - player.y) < 20) {
            player.hp -= 10;
            enemies.splice(i, 1);

            if (player.hp <= 0) endGame();
        }
    });

    // COLLISION BULLETS
    bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
            if (Math.abs(b.x - e.x) < 15 && Math.abs(b.y - e.y) < 15) {
                e.hp -= player.damage;
                bullets.splice(bi, 1);

                effects.push({ x: e.x, y: e.y, life: 10 });

                if (e.hp <= 0) {
                    coins += 5;
                    enemies.splice(ei, 1);
                }
            }
        });
    });

    // EFFECTS
    effects.forEach((ef, i) => {
        ef.life--;
        if (ef.life <= 0) effects.splice(i, 1);
    });

    updateShopUI();
}

// DRAW
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // PLAYER
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(player.x - 10, player.y - 10, 20, 20);

    // BULLETS
    ctx.fillStyle = "#facc15";
    bullets.forEach(b => {
        ctx.fillRect(b.x, b.y, 4, 10);
    });

    // ENEMIES
    ctx.fillStyle = "#ef4444";
    enemies.forEach(e => {
        ctx.fillRect(e.x - 10, e.y - 10, 20, 20);
    });

    // EFFECTS
    effects.forEach(ef => {
        ctx.fillStyle = "white";
        ctx.globalAlpha = ef.life / 10;
        ctx.fillRect(ef.x - 5, ef.y - 5, 10, 10);
        ctx.globalAlpha = 1;
    });
}

// GAME LOOP
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}
loop();

// GAME OVER
function endGame() {
    gameOver = true;
    document.getElementById("gameOver").classList.remove("hidden");
}

});
