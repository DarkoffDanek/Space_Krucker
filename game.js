const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 800;

let keys = {};

let player = {
  x: 280,
  y: 700,
  w: 40,
  h: 40,
  speed: 5,
  hp: 100,
  ammo: 50,
  damage: 1
};

let bullets = [];
let enemies = [];
let coins = 0;

// управление
document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

// спавн врагов
setInterval(() => {
  enemies.push({
    x: Math.random() * 560,
    y: -40,
    w: 40,
    h: 40,
    hp: 3
  });
}, 1000);

// обновление
function update() {

  // движение
  if (keys['arrowleft']) player.x -= player.speed;
  if (keys['arrowright']) player.x += player.speed;
  if (keys['arrowup']) player.y -= player.speed;
  if (keys['arrowdown']) player.y += player.speed;

  // стрельба
  if (keys['x'] && player.ammo > 0) {
    bullets.push({
      x: player.x + player.w / 2 - 2,
      y: player.y
    });
    player.ammo--;
    keys['x'] = false;
  }

  // пули
  bullets.forEach((b, i) => {
    b.y -= 10;
    if (b.y < 0) bullets.splice(i, 1);
  });

  // враги
  enemies.forEach((e, ei) => {
    e.y += 2;

    // столкновение с игроком
    if (
      e.x < player.x + player.w &&
      e.x + e.w > player.x &&
      e.y < player.y + player.h &&
      e.y + e.h > player.y
    ) {
      player.hp -= 10;
      enemies.splice(ei, 1);
    }

    // ушёл вниз
    if (e.y > canvas.height) {
      player.hp -= 5;
      enemies.splice(ei, 1);
    }
  });

  // попадания
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (
        b.x < e.x + e.w &&
        b.x + 5 > e.x &&
        b.y < e.y + e.h &&
        b.y + 10 > e.y
      ) {
        e.hp -= player.damage;
        bullets.splice(bi, 1);

        if (e.hp <= 0) {
          enemies.splice(ei, 1);
          coins += 5;
        }
      }
    });
  });

  // обновление UI
  document.getElementById('hp').textContent = player.hp;
  document.getElementById('coins').textContent = coins;
  document.getElementById('ammo').textContent = player.ammo;

  // смерть
  if (player.hp <= 0) {
    alert('Ты проиграл!');
    location.reload();
  }
}

// отрисовка
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // игрок
  ctx.fillStyle = 'cyan';
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // пули
  ctx.fillStyle = 'yellow';
  bullets.forEach(b => {
    ctx.fillRect(b.x, b.y, 5, 10);
  });

  // враги
  ctx.fillStyle = 'red';
  enemies.forEach(e => {
    ctx.fillRect(e.x, e.y, e.w, e.h);
  });
}

// цикл
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

// магазин
function buy(type) {
  if (type === 'damage' && coins >= 10) {
    player.damage++;
    coins -= 10;
  }

  if (type === 'speed' && coins >= 10) {
    player.speed++;
    coins -= 10;
  }

  if (type === 'ammo' && coins >= 5) {
    player.ammo += 20;
    coins -= 5;
  }
}
