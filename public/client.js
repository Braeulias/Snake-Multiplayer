const ws = new WebSocket('ws://localhost:3000');
const gameBoard = document.getElementById("game-board");
const startButton = document.getElementById("startButton");
let gameStarted = false;
const gridSize = 20; // Define gridSize here

// Draw grid once when the game is initially loaded
drawGrid();

startButton.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        startButton.textContent = 'Restart Game';
        ws.send(JSON.stringify({ action: 'start' }));
    } else {
        ws.send(JSON.stringify({ action: 'restart' }));
    }
});

ws.onopen = () => {
    console.log('Connected to server');
    document.addEventListener("keydown", sendDirectionChange);
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.gameOver) {
        alert('Game Over!');
        gameStarted = false;
        startButton.textContent = 'Start Game';
    } else {
        drawSnake(data.snake);
        drawFood(data.food);
    }
};

function sendDirectionChange(event) {
    let direction;
    switch (event.key) {
        case "ArrowUp":
            direction = "up";
            break;
        case "ArrowDown":
            direction = "down";
            break;
        case "ArrowLeft":
            direction = "left";
            break;
        case "ArrowRight":
            direction = "right";
            break;
        default:
            return;
    }
    ws.send(JSON.stringify({ direction }));
}

function drawGrid() {
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("game-cell");
        gameBoard.appendChild(cell);
    }
}

function drawSnake(snake) {
    // Remove existing snake elements
    document.querySelectorAll('.snake').forEach(e => e.remove());

    snake.forEach(segment => {
        const snakeSegment = document.createElement("div");
        snakeSegment.style.gridRowStart = segment.y + 1;
        snakeSegment.style.gridColumnStart = segment.x + 1;
        snakeSegment.classList.add("snake");
        gameBoard.appendChild(snakeSegment);
    });
}

function drawFood(food) {
    // Remove existing food elements
    document.querySelector('.food')?.remove();

    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y + 1;
    foodElement.style.gridColumnStart = food.x + 1;
    foodElement.classList.add("food");
    gameBoard.appendChild(foodElement);
}
