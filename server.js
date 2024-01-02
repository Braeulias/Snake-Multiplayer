// script.js

const gameBoard = document.getElementById("game-board");
const gridSize = 10;
const snakeSpeed = 100; // in milliseconds

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = "right";
let isGameRunning = true;

function getRandomPosition() {
    return Math.floor(Math.random() * gridSize);
}

function drawSnake() {
    gameBoard.innerHTML = "";
    snake.forEach((segment) => {
        const snakeSegment = document.createElement("div");
        snakeSegment.style.gridRowStart = segment.y;
        snakeSegment.style.gridColumnStart = segment.x;
        snakeSegment.classList.add("snake");
        gameBoard.appendChild(snakeSegment);
    });
}

function drawFood() {
    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    gameBoard.appendChild(foodElement);
}

function update() {
    const head = { ...snake[0] };
    switch (direction) {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head);
        food = { x: getRandomPosition(), y: getRandomPosition() };
        drawFood();
    } else {
        snake.pop();
        snake.unshift(head);
    }

    // Check for collision with walls or self
    if (
        head.x < 1 ||
        head.x > gridSize ||
        head.y < 1 ||
        head.y > gridSize ||
        snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
        isGameRunning = false;
        alert("Game Over!");
        return;
    }

    drawSnake();

    if (isGameRunning) {
        setTimeout(update, snakeSpeed);
    }
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

drawSnake();
drawFood();
update();
