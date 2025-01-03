const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const score = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");

let gameRunning = false;
let animationId = null;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speedX: 7,
    speedY: 7,
    radius: 10,
    color: "white",

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = 7 * (Math.random() > 0.5 ? 1 : -1);
        this.speedY = 7 * (Math.random() > 0.5 ? 1 : -1);
    },

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wall collisions
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }

        // Paddle collisions
        if (this.x - this.radius < paddle1.x + paddle1.width && 
            this.y > paddle1.y && 
            this.y < paddle1.y + paddle1.height &&
            this.speedX < 0) {
            this.speedX = -this.speedX;
            this.speedUp();
        }

        if (this.x + this.radius > paddle2.x && 
            this.y > paddle2.y && 
            this.y < paddle2.y + paddle2.height &&
            this.speedX > 0) {
            this.speedX = -this.speedX;
            this.speedUp();
        }

        // Score points
        if (this.x + this.radius > canvas.width) {
            alert("Point for Player 1!");
            paddle1.score++;
            updateScore();
            resetGame();
        } else if (this.x - this.radius < 0) {
            alert("Point for Player 2!");
            paddle2.score++;
            updateScore();
            resetGame();
        }
    },

    speedUp() {
        this.speedX *= 1.1;
        this.speedY *= 1.1;
    },

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
};

const paddle1 = {
    x: 10,
    y: canvas.height / 2 - 50,
    width: 20,
    height: 100,
    score: 0,
    color: "blue",

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

const paddle2 = {
    x: canvas.width - 30,
    y: canvas.height / 2 - 50,
    width: 20,
    height: 100,
    score: 0,
    color: "red",

    update() {
        const targetY = ball.y - this.height / 2;
        const aiSpeed = 5;
        
        if (this.y < targetY) {
            this.y += aiSpeed;
        } else if (this.y > targetY) {
            this.y -= aiSpeed;
        }

        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    },

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

function updateScore() {
    score.innerText = `Player 1: ${paddle1.score} | Player 2: ${paddle2.score}`;
}

function resetGame() {
    gameRunning = false;
    startBtn.textContent = "Start Game";
    ball.reset();
    paddle1.y = canvas.height / 2 - 50;
    paddle2.y = canvas.height / 2 - 50;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    draw();
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        startBtn.textContent = "Pause Game";
        animate();
    } else {
        gameRunning = false;
        startBtn.textContent = "Resume Game";
        cancelAnimationFrame(animationId);
    }
}

function fullReset() {
    paddle1.score = 0;
    paddle2.score = 0;
    updateScore();
    resetGame();
}

function animate() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    paddle2.update();
    ball.update();
    
    draw();
    
    animationId = requestAnimationFrame(animate);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paddle1.draw();
    paddle2.draw();
    ball.draw();
}

window.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;
    paddle1.y = Math.max(0, Math.min(canvas.height - paddle1.height, mouseY));
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', fullReset);

draw();