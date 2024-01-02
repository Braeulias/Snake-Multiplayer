const gameBoard = document.getElementById("game-board");
const gridSize = 20;
const snakeSpeed = 100; // in milliseconds

let snake = [{ x: 10, y: 10 }];
let food = getRandomFoodPosition();
let direction = "right";
let isGameRunning = true;

function getRandomPosition() {
    return Math.floor(Math.random() * gridSize);
}

function getRandomFoodPosition() {
    let x, y;
    do {
        x = getRandomPosition();
        y = getRandomPosition();
    } while (snake.some(segment => segment.x === x && segment.y === y));

    return { x, y };
}

function drawGrid() {
    gameBoard.innerHTML = "";
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("game-cell");
        gameBoard.appendChild(cell);
    }
}

function drawSnake() {
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

function drawFood() {
    // Remove existing food elements
    document.querySelector('.food')?.remove();

    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y + 1;
    foodElement.style.gridColumnStart = food.x + 1;
    foodElement.classList.add("food");
    gameBoard.appendChild(foodElement);
}

function update() {
    if (!isGameRunning) return;

    const head = { ...snake[0] };
    switch (direction) {
        case "up":
            head.y -= 1;
            break;
        case "down":
            head.y += 1;
            break;
        case "left":
            head.x -= 1;
            break;
        case "right":
            head.x += 1;
            break;
    }

    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head);
        food = getRandomFoodPosition();
        drawFood();
    } else {
        snake.pop();
        snake.unshift(head);
    }

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        isGameRunning = false;
        alert("Game Over!");
        return;
    }

    drawSnake();
    setTimeout(update, snakeSpeed);
}

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (direction !== "down") direction = "up";
            break;
        case "ArrowDown":
            if (direction !== "up") direction = "down";
            break;
        case "ArrowLeft":
            if (direction !== "right") direction = "left";
            break;
        case "ArrowRight":
            if (direction !== "left") direction = "right";
            break;
    }
});

drawGrid();
drawSnake();
drawFood();
setTimeout(update, snakeSpeed);
