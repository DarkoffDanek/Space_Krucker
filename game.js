const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

const WIDTH = canvas.width
const HEIGHT = canvas.height

let player = {x: WIDTH/2-25, y: HEIGHT-60, w:50, h:40}
let playerSpeed = 8

let bullets = []
let asteroids = []

let score = 0
let lives = 3

let asteroidSpeed = 3

let maxShots = 15
let shots = 0

let reloading = false
let reloadTime = 0
let reloadDuration = 120

let spawnTimer = 0
let gameOver = false

let keys = {}

document.addEventListener("keydown", e=>{

keys[e.key]=true

if(e.key==="x" || e.key==="X"){

if(!reloading && shots < maxShots && !gameOver){

bullets.push({
x:player.x + player.w/2 -3,
y:player.y,
w:6,
h:15
})

shots++

if(shots>=maxShots)
reloading=true

}

}

if(gameOver && e.key==="r"){
resetGame()
}

})

document.addEventListener("keyup", e=>{
keys[e.key]=false
})

function resetGame(){

bullets=[]
asteroids=[]

score=0
lives=3
shots=0

asteroidSpeed=3

reloading=false
reloadTime=0

player.x = WIDTH/2-25

gameOver=false

}

function drawAmmo(){

let size=14
let spacing=4
let x=20
let startY=120

for(let i=0;i<maxShots;i++){

let y=startY + i*(size+spacing)

ctx.strokeStyle="white"
ctx.strokeRect(x,y,size,size)

if(i < maxShots - shots){

ctx.fillStyle="lime"
ctx.fillRect(x+2,y+2,size-4,size-4)

}

}

}

function update(){

if(gameOver) return

if(keys["ArrowLeft"] && player.x>0)
player.x-=playerSpeed

if(keys["ArrowRight"] && player.x+player.w<WIDTH)
player.x+=playerSpeed

bullets.forEach(b=> b.y-=10)
bullets = bullets.filter(b=> b.y>-20)

spawnTimer++

if(spawnTimer>40){

asteroids.push({
x:Math.random()*(WIDTH-40),
y:-40,
w:40,
h:40
})

spawnTimer=0

}

asteroids.forEach(a=> a.y += asteroidSpeed)

asteroids = asteroids.filter(a=> a.y < HEIGHT+50)

asteroids.forEach((a,ai)=>{

if(
a.x < player.x + player.w &&
a.x + a.w > player.x &&
a.y < player.y + player.h &&
a.y + a.h > player.y
){

asteroids.splice(ai,1)

lives--

if(lives<=0)
gameOver=true

}

bullets.forEach((b,bi)=>{

if(
b.x < a.x + a.w &&
b.x + b.w > a.x &&
b.y < a.y + a.h &&
b.y + b.h > a.y
){

asteroids.splice(ai,1)
bullets.splice(bi,1)

score++

if(score % 10 === 0)
asteroidSpeed++

}

})

})

if(reloading){

reloadTime++

if(reloadTime>reloadDuration){

shots=0
reloadTime=0
reloading=false

}

}

}

function draw(){

ctx.clearRect(0,0,WIDTH,HEIGHT)

ctx.fillStyle="white"
ctx.fillRect(player.x,player.y,player.w,player.h)

ctx.fillStyle="yellow"
bullets.forEach(b=>{
ctx.fillRect(b.x,b.y,b.w,b.h)
})

ctx.fillStyle="red"
asteroids.forEach(a=>{
ctx.fillRect(a.x,a.y,a.w,a.h)
})

ctx.fillStyle="white"
ctx.font="18px Arial"

ctx.fillText("Score: "+score,10,20)
ctx.fillText("Lives: "+lives,10,40)

drawAmmo()

if(reloading){

ctx.fillStyle="orange"
ctx.fillText("Reloading...",WIDTH/2-40,HEIGHT-30)

}

if(gameOver){

ctx.fillStyle="red"
ctx.font="60px Arial"
ctx.fillText("GAME OVER",WIDTH/2-180,260)

ctx.font="30px Arial"
ctx.fillStyle="white"

ctx.fillText("Final score: "+score,WIDTH/2-100,320)
ctx.fillText("Press R to restart",WIDTH/2-120,360)

}

}

function gameLoop(){

update()
draw()

requestAnimationFrame(gameLoop)

}

gameLoop()
