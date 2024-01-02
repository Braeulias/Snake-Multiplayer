const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const gridSize = 20;
let players = [{}, {}]; // Supports two players
let food = getRandomFoodPosition();
let countdownValue = 3;
let gameStarted = false;

app.use(express.static('public'));

function getRandomPosition() {
    return Math.floor(Math.random() * gridSize);
}

function getRandomFoodPosition() {
    let position;
    do {
        position = { x: getRandomPosition(), y: getRandomPosition() };
    } while (players.some(player => player.snake && player.snake.some(segment => segment.x === position.x && segment.y === position.y)));
    return position;
}

function initializePlayer(player, index) {
    if (index === 0) {
        // First player starts from the left side moving right
        player.snake = [{ x: 5, y: 10 }];
        player.direction = "right";
    } else if (index === 1) {
        // Second player starts from the right side moving left
        player.snake = [{ x: 15, y: 10 }];
        player.direction = "left";
    }
    player.isReady = false;
}


function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function moveSnake(player) {
    // Create a new head for the snake based on the direction
    const newHead = { x: player.snake[0].x, y: player.snake[0].y };
    switch (player.direction) {
        case 'up': newHead.y -= 1; break;
        case 'down': newHead.y += 1; break;
        case 'left': newHead.x -= 1; break;
        case 'right': newHead.x += 1; break;
    }

    // Check if the new head position is the same as the food
    if (newHead.x === food.x && newHead.y === food.y) {
        // The snake grows and new food is generated
        food = getRandomFoodPosition();
    } else {
        // Remove the last segment of the snake
        player.snake.pop();
    }

    // Add the new head to the snake
    player.snake.unshift(newHead);
}

function checkCollisions() {
    players.forEach(player => {
        const head = player.snake[0];
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            // Handle collision with the grid boundaries
            // For example, end the game or reset the snake's position
            console.log(`Player collided with boundary.`);
            // Reset the player's snake for simplicity
            initializePlayer(player, players.indexOf(player));
        }
    });
}

function updateGame() {
    if (!gameStarted) return; // Ensure game doesn't update before starting

    // Move each snake
    players.forEach(player => {
        if (player.snake) {
            moveSnake(player);
        }
    });

    // Check for collisions
    checkCollisions();

    // After updating the game state, broadcast it to all clients
    broadcast({ players, food, gridSize });

    // Set the next game update
    setTimeout(updateGame, 125); // Adjust the timing as needed
}

function startCountdown() {
    let countdown = countdownValue;
    let countdownInterval = setInterval(() => {
        broadcast({ countdown: countdown });
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            gameStarted = true;
            broadcast({ gameStarted: true }); // Make sure this is being sent
            updateGame(); // This should start the game logic
        }
    }, 1000);
}



wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`Player connected from IP: ${ip}`);

    const playerIndex = players.findIndex(p => !p.isConnected);
    if (playerIndex === -1) {
        console.log('Maximum number of players reached.');
        ws.close();
        return;
    }

    console.log(`Player ${playerIndex + 1} has connected.`);


    // ... existing code ...

    initializePlayer(players[playerIndex], playerIndex); // Pass the player index
    players[playerIndex].isConnected = true;
    players[playerIndex].isConnected = true;
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        const player = players[playerIndex];

        if (data.action === 'start') {
            player.isReady = true;
            const allReady = players.every(p => p.isReady);
            if (allReady && !gameStarted) {
                startCountdown();
            }
        } else if (data.action === 'direction') {
            // Process direction changes outside of the 'start' condition
            const newDirection = data.direction;
            if (!isOppositeDirection(player.direction, newDirection)) {
                player.direction = newDirection;
            }
        }
    });
});
function isOppositeDirection(dir1, dir2) {
    return (dir1 === 'left' && dir2 === 'right') ||
        (dir1 === 'right' && dir2 === 'left') ||
        (dir1 === 'up' && dir2 === 'down') ||
        (dir1 === 'down' && dir2 === 'up');
}

server.listen(3000, '192.168.0.129', () => {
    console.log('Server running on http://192.168.0.129:3000');
});
