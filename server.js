const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = getRandomFoodPosition();
let direction = "right";
let isGameRunning = false;
let gameInterval = null;

app.use(express.static('public'));

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.action === 'start' || data.action === 'restart') {
            snake = [{ x: 10, y: 10 }];
            food = getRandomFoodPosition();
            direction = "right";
            isGameRunning = true;
            startGame(ws);
        } else {
            direction = data.direction;
        }
    });
});

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

function startGame(ws) {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        if (isGameRunning) {
            updateGame(ws);
        }
    }, 125); // Update every 125 milliseconds
}

function updateGame(ws) {
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
    } else {
        snake.pop();
        snake.unshift(head);
    }

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        isGameRunning = false;
        clearInterval(gameInterval);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ gameOver: true }));
            }
        });
    } else {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ snake, food, gridSize })); // Include gridSize
            }
        });
    }
}

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
