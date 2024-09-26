const grid = document.querySelector('.grid');
const scoredisplay = document.querySelector('#score');
const blockwidth = 220;
const blockheight = 20;
const boardwidth = 1480;
const boardheight = 650;
const ballDiameter = 20;
let xDirection = -2;
let yDirection = 2;

let timerId;
let score = 0;

const userstart = [600, 10];
let currentposition = userstart;

const ballstart = [690, 20];
let ballcurrentposition = ballstart;

// Block class
class Block {
    constructor(xAxis, yAxis) {
        this.bottomleft = [xAxis, yAxis];
        this.bottomright = [xAxis + blockwidth, yAxis];
        this.topright = [xAxis + blockwidth, yAxis + blockheight];
        this.topleft = [xAxis, yAxis + blockheight];
    }
}

// Array of blocks
const blocks = [
    //Row 1
    new Block(20, 610),
    new Block(260, 610),
    new Block(500, 610),
    new Block(740, 610),
    new Block(980, 610),
    new Block(1230, 610),

    // //Row 2
    new Block(20, 560),
    new Block(260, 560),
    new Block(500, 560),
    new Block(740, 560),
    new Block(980, 560),
    new Block(1230, 560),

    // // //Row 3
    new Block(20, 510),
    new Block(260, 510),
    new Block(500, 510),
    new Block(740, 510),
    new Block(980, 510),
    new Block(1230, 510),


    //Row 4
    // new Block(10, 525),
    // new Block(120, 525),
    // new Block(220, 525),
    // new Block(320, 525),
    // new Block(450, 525),
];

// Draw blocks
function addblocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.left = blocks[i].bottomleft[0] + 'px';
        block.style.bottom = blocks[i].bottomleft[1] + 'px';
        grid.appendChild(block);
    }
}
addblocks();

// Add user
const user = document.createElement('div');
user.classList.add('user');
grid.appendChild(user);
drawuser();

// Add ball
const ball = document.createElement('div');
ball.classList.add('ball');
grid.appendChild(ball);
drawball();

function drawuser() {
    user.style.left = currentposition[0] + 'px';
    user.style.bottom = currentposition[1] + 'px';
}

function drawball() {
    ball.style.left = ballcurrentposition[0] + 'px';
    ball.style.bottom = ballcurrentposition[1] + 'px';
}

// Move user
function moveuser(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (currentposition[0] > 0) {
                currentposition[0] -= 10;
                drawuser();
            }
            break;
        case 'ArrowRight':
            if (currentposition[0] < (boardwidth - blockwidth)) {
                currentposition[0] += 10;
                drawuser();
            }
            break;
    }
}

document.addEventListener('keydown', moveuser);

// Move ball
function moveball() {
    ballcurrentposition[0] += xDirection;
    ballcurrentposition[1] += yDirection;
    drawball();
    checkForCollision();
}

timerId = setInterval(moveball, 10); //speed of the ball

// Check for collision
function checkForCollision() {
    // Check for block collision
    for (let i = 0; i < blocks.length; i++) {
        if (
            ballcurrentposition[0] > blocks[i].bottomleft[0] &&
            ballcurrentposition[0] < blocks[i].bottomright[0] &&
            (ballcurrentposition[1] + ballDiameter) > blocks[i].bottomleft[1] &&
            ballcurrentposition[1] < blocks[i].topleft[1]
        ) {
            const allBlocks = document.querySelectorAll('.block');
            allBlocks[i].classList.remove('block');
            blocks.splice(i, 1);
            yDirection = -2; // Force the ball to move downward
            score++;
            scoredisplay.innerHTML = score;

            if (blocks.length === 0) {
                scoredisplay.innerHTML = "You Win!!";
                clearInterval(timerId);
                document.removeEventListener('keydown', moveuser);
            }
            break; // Exit loop after handling collision
        }
    }

    // Check for wall hits
    if (ballcurrentposition[0] >= (boardwidth - ballDiameter) || // Right wall
        ballcurrentposition[0] <= 0 // Left wall
    ) {
        xDirection *= -1; // Reverse x direction
    }

    if (ballcurrentposition[1] >= (boardheight - ballDiameter)) { // Top wall
        yDirection = -2; // Always move down after hitting top
    }

    // Check for user collision
    if (
        ballcurrentposition[0] > currentposition[0] &&
        ballcurrentposition[0] < currentposition[0] + blockwidth &&
        (ballcurrentposition[1] > currentposition[1] && ballcurrentposition[1] < currentposition[1] + blockheight)
    ) {
        yDirection = 2; // Bounce up after hitting the paddle
    }

    // Game over
    if (ballcurrentposition[1] <= 0) {
        clearInterval(timerId);
        scoredisplay.innerHTML = "You Lose";
        document.removeEventListener('keydown', moveuser);
    }
}

// Change ball direction
function changeDirection() {
    // Adjusted to set specific directions rather than toggle
    if (yDirection > 0) {
        yDirection = -2; // Move down
    } else {
        yDirection = 2; // Move up
    }
    xDirection *= -1; // Reverse x direction
}




