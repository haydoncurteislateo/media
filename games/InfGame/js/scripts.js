var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth /1.3;
ctx.canvas.height = window.innerHeight /1.5;
var player = {x:50,y:canvas.height-500,r:25,yv:0,jumping:false,colliding:false,pointGained:false};
var container = {x:0,y:0,width:canvas.width,height:canvas.height - 25};
var floor = {x:0,y:canvas.height - 25,width:canvas.width,height:25};
var barrier = {x:canvas.width + 50,y:canvas.height - 150,width:50,height:125,xv:0};
var score = {value:0,txt:document.getElementById('scoreTXT')};
var highScore = {value:0,txt:document.getElementById('highScoreTXT')};


controller = {
    up:false,
    keyListener:function(e) {
        var key_state = (e.type == "keydown")?true:false;
        switch(e.keyCode) {
            //Spacebar
            case 32:
                e.preventDefault();
                controller.up = key_state;
            break;
            //Up arrow
            case 38:
                e.preventDefault();
                controller.up = key_state;
            break;
            //w key
            case 87:
                e.preventDefault();
                controller.up = key_state;
            break;
        }
    }
};

function containerDraw(){
    if (player.colliding) {
        ctx.fillStyle = "#c60731";
        ctx.fillRect(container.x, container.y, container.width, container.height);
    }
    else {
        ctx.fillStyle = "#52c1ea";
        ctx.fillRect(container.x, container.y, container.width, container.height);
    }

}

function floorDraw() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(floor.x, floor.y, floor.width, floor.height);
}

function playerDraw() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2, false);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
}
function barrierDraw() {
    ctx.fillStyle = "#514b33";
    ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
}

function draw() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
    containerDraw();
    floorDraw();
    barrierDraw();
    playerDraw();

    //move player down
    player.yv += 0.6; //gravity
    player.y += player.yv;
    player.yv *= 0.9;

    //stop player moving down
    if (player.y + player.r > floor.y) {
        player.jumping = false;
        player.y = floor.y - player.r;
        player.yv = 0;
    }

    //move player up
    if (controller.up && player.jumping == false) {
        player.yv -=40;
        player.jumping = true;
    }

    //move barrier left
    barrier.xv += 0.5;
    barrier.x -= barrier.xv;
    barrier.xv *= 0.9;

    //reset barrier when it hits edge
    if (barrier.x  + barrier.width < 0) {
        barrier.x = canvas.width + barrier.width;
    }

    // add score
    if ((Math.ceil((player.x + player.r) / 10) * 10) === (Math.ceil((barrier.x + barrier.width) / 10) * 10) && !collisionDetection(player, barrier)) {
        if (!player.pointGained) {
            score.value += 1;
            score.txt.textContent = score.value;
            player.pointGained = true;
        }
    }else {
        player.pointGained = false;
    }
    // console.log(Math.ceil(barrier.x + barrier.width / 10) * 10);

    //reset score when player hits barrier and set high score if score higher than last
    if (collisionDetection(player, barrier)) {
        player.colliding = true;

        if (score.value > highScore.value) {
            highScore.value = score.value;
            highScore.txt.textContent = highScore.value;
        }

        score.value = 0;
        score.txt.textContent = score.value;
    }
    else {
        player.colliding = false;
    }

    window.requestAnimationFrame(draw, canvas);
}

draw();


function collisionDetection(player, barrier) {
    var distX = Math.abs(player.x - barrier.x-barrier.width/2);
    var distY = Math.abs(player.y - barrier.y-barrier.height/2);

    if (distX > (barrier.width/2 + player.r)) { return false; }
    if (distY > (barrier.height/2 + player.r)) { return false; }

    if (distX <= (barrier.width/2)) { return true; }
    if (distY <= (barrier.height/2)) { return true; }

    var dx = distX-barrier.width/2;
    var dy = distY-barrier.height/2;
    return (dx*dx+dy<=(player.r*player.r));
}


window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(draw, canvas);

if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
                                   window.mozRequestAnimationFrame    || 
                                   window.oRequestAnimationFrame      || 
                                   window.msRequestAnimationFrame     || 
                                   function(callback, element) {
                                     window.setTimeout(function() { callback(Date.now()); }, 1000 / 60);
                                   }
  }
  