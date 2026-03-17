const canvas = document.getElementById('game');
}
setInterval(spawnEnemy, 1000);

function update(){
  if(keys['ArrowLeft']) player.x -= player.speed;
  if(keys['ArrowRight']) player.x += player.speed;
  if(keys['ArrowUp']) player.y -= player.speed;
  if(keys['ArrowDown']) player.y += player.speed;

  if(keys['x'] && player.ammo > 0){
    bullets.push({ x: player.x+10, y: player.y });
    player.ammo--;
    keys['x'] = false;
  }

  bullets.forEach(b => b.y -= 10);

  enemies.forEach(e => e.y += 2);

  // collisions
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if(b.x < e.x+e.w && b.x+5 > e.x && b.y < e.y+e.h && b.y+10 > e.y){
        e.hp -= player.damage;
        bullets.splice(bi,1);
        if(e.hp <= 0){
          enemies.splice(ei,1);
          coins += 5;
        }
      }
    });
  });

  enemies.forEach(e => {
    if(e.y > canvas.height){
      player.hp -= 10;
    }
  });

  document.getElementById('hp').innerText = player.hp;
  document.getElementById('coins').innerText = coins;
  document.getElementById('ammo').innerText = player.ammo;
}

function draw(){
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = 'yellow';
  bullets.forEach(b => ctx.fillRect(b.x, b.y, 5, 10));

  ctx.fillStyle = 'red';
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.w, e.h));
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

function buy(type){
  if(type === 'damage' && coins >= 10){
    player.damage++;
    coins -= 10;
  }
  if(type === 'speed' && coins >= 10){
    player.speed++;
    coins -= 10;
  }
  if(type === 'ammo' && coins >= 5){
    player.ammo += 20;
    coins -= 5;
  }
}
