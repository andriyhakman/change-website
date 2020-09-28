const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;
const delay = 500; //delay to reset the game

// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 1,
  size: 10,
  speed: 4,
  dx: 1,
  dy: -4,
  visible: true
};

// Create paddle props
const paddleBottom = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
  visible: true
};

const paddleTop = {
  x: canvas.width / 2 - 580,
  y: canvas.height - 560,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
  visible: true
};

// Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 220,
  visible: true
};

// Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.visible ? '#0095dd' : 'transparent';
  ctx.fill();
  ctx.closePath();
}

// Draw paddle on canvas
function drawPaddleBottom() {
  ctx.beginPath();
  ctx.rect(paddleBottom.x, paddleBottom.y, paddleBottom.w, paddleBottom.h);
  ctx.fillStyle = paddleBottom.visible ? '#0095dd' : 'transparent';
  ctx.fill();
  ctx.closePath();
}

function drawPaddleTop() {
  ctx.beginPath();
  ctx.rect(paddleTop.x, paddleTop.y, paddleTop.w, paddleTop.h);
  ctx.fillStyle = paddleTop.visible ? '#001d2c' : 'transparent';
  ctx.fill();
  ctx.closePath();
}

// Draw score on canvas
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Draw bricks on canvas
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}

// Move paddle on canvas
function movePaddleBottom() {
  paddleBottom.x += paddleBottom.dx;

  // Wall detection
  if (paddleBottom.x + paddleBottom.w > canvas.width) {
    paddleBottom.x = canvas.width - paddleBottom.w;
  }

  if (paddleBottom.x < 0) {
    paddleBottom.x = 0;
    }
}

function movePaddleTop() {
  paddleTop.x += paddleTop.dx;

  // Wall detection
  if (paddleTop.x + paddleTop.w > canvas.width) {
    paddleTop.x = canvas.width - paddleTop.w;
  }

  if (paddleTop.x < 0) {
    paddleTop.x = 0;
    }
}


// Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // ball.dx = ball.dx * -1
  }

  // Wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // console.log(ball.x, ball.y);

  // Paddle collision
  if (
    ball.x - ball.size > paddleBottom.x &&
    ball.x + ball.size < paddleBottom.x + paddleBottom.w &&
    ball.y + ball.size > paddleBottom.y
  ) {
    ball.dy = -ball.speed;
  }

  if (
    ball.x - ball.size > paddleTop.x &&
    ball.x + ball.size < paddleTop.x + paddleTop.w &&
    ball.y + ball.size > paddleTop.y
  ) {
    ball.dy = -ball.speed;
  }


  // Brick collision
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  // Hit bottom wall - Lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

// Increase score
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickColumnCount) === 0) {

      ball.visible = false;
      paddleBottom.visible = false;
      paddleTop.visible = false;

      //After 0.5 sec restart the game
      setTimeout(function () {
          showAllBricks();
          score = 0;
          paddleBottom.x = canvas.width / 2 - 40;
          paddleBottom.y = canvas.height - 20;
          ball.x = canvas.width / 2;
          ball.y = canvas.height / 1;
          ball.visible = true;
          paddleBottom.visible = true;
      },delay)
      setTimeout(function () {
          showAllBricks();
          score = 0;
          paddleTop.x = canvas.width / 2 - 580;
          paddleTop.y = canvas.height - 560;
          ball.x = canvas.width / 2;
          ball.y = canvas.height / 1;
          ball.visible = true;
          paddleTop.visible = true;
      },delay)
  }
}



// Make all bricks appear
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
}

// Draw everything
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddleBottom();
  drawPaddleTop();
  drawScore();
  drawBricks();
}

// Update canvas drawing and animation
function update() {
  movePaddleBottom();
  movePaddleTop();
  moveBall();

  // Draw everything
  draw();

  requestAnimationFrame(update);
}

update();

// Keydown event
function keyDownBottom(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddleBottom.dx = paddleBottom.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddleBottom.dx = -paddleBottom.speed;
  }
}

function keyDownTop(e) {
  if (e.key === 'd') {
    paddleTop.dx = paddleTop.speed;
  } else if (e.key === 'a') {
    paddleTop.dx = -paddleTop.speed;
  }
}



// Keyup event
function keyUpBottom(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddleBottom.dx = 0;
  }
}

function keyUpTop(e) {
  if (
    e.key === 'd' ||
    e.key === 'ArrowRight' ||
    e.key === 'a' ||
    e.key === 'ArrowLeft'
  ) {
    paddleTop.dx = 0;
  }
}


// Keyboard event handlers
document.addEventListener('keydown', keyDownBottom);
document.addEventListener('keyup', keyUpBottom);

document.addEventListener('keydown', keyDownTop);
document.addEventListener('keyup', keyUpTop);


// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));