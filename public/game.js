const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const score = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const difficultySelect = document.getElementById("difficulty");
const winScoreSelect = document.getElementById("win-score");
const pointPopup = document.getElementById("point-popup");
const pointMessage = document.getElementById("point-message");
const continueBtn = document.getElementById("continue-btn");
const countdownOverlay = document.getElementById("countdown-overlay");
const countdownNumber = document.getElementById("countdown-number");
const winPopup = document.getElementById("win-popup");
const winnerMessage = document.getElementById("winner-message");
const finalScore = document.getElementById("final-score");
const newGameBtn = document.getElementById("new-game-btn");

let gameRunning = false;
let animationId = null;
let waitingForContinue = false;
let countdownActive = false;
let winScore = parseInt(winScoreSelect.value);

// Difficulty settings
const difficulties = {
    easy: { aiSpeed: 3, ballSpeedMultiplier: 1, speedIncrement: 1.05 },
    medium: { aiSpeed: 5, ballSpeedMultiplier: 1.2, speedIncrement: 1.1 },
    hard: { aiSpeed: 7, ballSpeedMultiplier: 1.5, speedIncrement: 1.15 },
    impossible: { aiSpeed: 12, ballSpeedMultiplier: 2, speedIncrement: 1.2 }
};

let currentDifficulty = difficulties.medium;

difficultySelect.addEventListener("change", function() {
    currentDifficulty = difficulties[this.value];
    resetGame();
});

winScoreSelect.addEventListener("change", function() {
    winScore = parseInt(this.value);
    resetGame();
});

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
        // Apply difficulty multiplier to ball speed
        const baseSpeed = 7 * currentDifficulty.ballSpeedMultiplier;
        this.speedX = baseSpeed * (Math.random() > 0.5 ? 1 : -1);
        this.speedY = baseSpeed * (Math.random() > 0.5 ? 1 : -1);
    },

    update() {
        if (waitingForContinue || countdownActive) return;
        
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
            paddle1.score++;
            updateScore();
            checkWinCondition();
            if (!checkWinCondition()) {
                showPointPopup("Player 1", 1);
            }
        } else if (this.x - this.radius < 0) {
            paddle2.score++;
            updateScore();
            checkWinCondition();
            if (!checkWinCondition()) {
                showPointPopup("Player 2", 2);
            }
        }
    },

    speedUp() {
        this.speedX *= currentDifficulty.speedIncrement;
        this.speedY *= currentDifficulty.speedIncrement;
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
    color: "#4f46e5", // indigo-600

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
    color: "#db2777", // pink-600

    update() {
        if (waitingForContinue || countdownActive) return;
        
        const targetY = ball.y - this.height / 2;
        const aiSpeed = currentDifficulty.aiSpeed;
        
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

function showWinPopup(player, playerNum) {
    winnerMessage.innerHTML = `<span class="player${playerNum}-color winner-animation">${player}</span> Wins!`;
    finalScore.innerHTML = `<span class="player1-color">${paddle1.score}</span> - <span class="player2-color">${paddle2.score}</span>`;
    winPopup.classList.remove("hidden");
    gameRunning = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

function checkWinCondition() {
    // Skip win check if we're in endless mode (winScore = 0)
    if (winScore === 0) return false;
    
    if (paddle1.score >= winScore) {
        showWinPopup("Player 1", 1);
        return true;
    } else if (paddle2.score >= winScore) {
        showWinPopup("Player 2", 2);
        return true;
    }
    return false;
}

function showPointPopup(player, playerNum) {
    waitingForContinue = true;
    pointMessage.innerHTML = `<span class="player${playerNum}-color">${player}</span> scores a point!`;
    pointPopup.classList.remove("hidden");
}

function startCountdown() {
    countdownActive = true;
    countdownOverlay.classList.remove("hidden");
    let count = 3;
    countdownNumber.textContent = count;
    countdownNumber.classList.add("countdown-animation");
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.textContent = count;
            countdownNumber.classList.remove("countdown-animation");
            void countdownNumber.offsetWidth; // Trigger reflow
            countdownNumber.classList.add("countdown-animation");
        } else {
            clearInterval(countdownInterval);
            countdownOverlay.classList.add("hidden");
            countdownNumber.classList.remove("countdown-animation");
            countdownActive = false;
            
            // Start the game animation when countdown finishes
            animate();
        }
    }, 1000);
}

continueBtn.addEventListener("click", function() {
    pointPopup.classList.add("hidden");
    waitingForContinue = false;
    resetBall();
    if (gameRunning) {
        startCountdown();
    }
});

newGameBtn.addEventListener("click", function() {
    winPopup.classList.add("hidden");
    fullReset();
});

function resetBall() {
    ball.reset();
    paddle1.y = canvas.height / 2 - 50;
    paddle2.y = canvas.height / 2 - 50;
}

function updateScore() {
    score.innerHTML = `<span class="player1-color">Player 1: ${paddle1.score}</span> | <span class="player2-color">Player 2: ${paddle2.score}</span>`;
}

function resetGame() {
    gameRunning = false;
    waitingForContinue = false;
    countdownActive = false;
    startBtn.textContent = "▶ Start Game";
    pointPopup.classList.add("hidden");
    countdownOverlay.classList.add("hidden");
    winPopup.classList.add("hidden");
    
    ball.reset();
    paddle1.y = canvas.height / 2 - 50;
    paddle2.y = canvas.height / 2 - 50;
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    draw();
}

function startGame() {
    if (waitingForContinue || countdownActive) return;
    
    if (!gameRunning) {
        gameRunning = true;
        startBtn.textContent = "⏸ Pause Game";
        startCountdown();
    } else {
        gameRunning = false;
        startBtn.textContent = "▶ Resume Game";
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
    if (!gameRunning || waitingForContinue || countdownActive) return;
    
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
    if (waitingForContinue || countdownActive) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;
    paddle1.y = Math.max(0, Math.min(canvas.height - paddle1.height, mouseY));
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', fullReset);

// Initialize score display with colors
updateScore();
draw();