const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const gridSize = 20;
let players = [{}, {}]; // S
// upports two players
let food = getRandomFoodPosition();
let countdownValue = 5;
let gameStarted = false;
let losingPlayerIndex = null;
let gameEnded = false;


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

    player.color = 'green';// Default color, will be updated later
    player.score = 0; // Initialize score
    player.lost = false;
    player.isReady = false;
    player.collisionEnabled = false;
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
        player.score += 1;
    } else {
        // Remove the last segment of the snake
        player.snake.pop();
    }

    // Add the new head to the snake
    player.snake.unshift(newHead);
}

function checkCollisions() {
    players.forEach((player, index) => {
        const head = player.snake[0];

        // Check for boundary collisions
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            console.log(`Player ${index + 1} collided with boundary.`);
            gameEnded = true;
            losingPlayerIndex = index;
            return; // Add this line to exit early
        }

        // Check for self-collision
        for (let i = 1; i < player.snake.length; i++) {
            if (head.x === player.snake[i].x && head.y === player.snake[i].y) {
                console.log(`Player ${index + 1} collided with itself.`);
                gameEnded = true;
                losingPlayerIndex = index;
                return; // Add this line to exit early
            }
        }

        if (players.every(p => p.collisionEnabled)) {
            // Check for collisions with the other snake
            const otherPlayerIndex = 1 - index;
            const otherPlayer = players[otherPlayerIndex];
            if (otherPlayer.snake) {
                for (let segment of otherPlayer.snake) {
                    if (head.x === segment.x && head.y === segment.y) {
                        console.log(`Player ${index + 1} collided with player ${otherPlayerIndex + 1}.`);
                        gameEnded = true;
                        losingPlayerIndex = index;
                        return;
                    }
                }
            }
        }
    });
}


function updateGame() {
    if (!gameStarted || gameEnded) return;

    // Move each snake and check collisions
    players.forEach(player => {
        if (player.snake) {
            moveSnake(player);
            checkCollisions();
        }
    });

    if (gameEnded) {
        broadcast({ gameEnded: true, losingPlayerIndex });
    } else {
        broadcast({ players, food, gridSize });
        setTimeout(updateGame, 125);
    }
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

function restartGame() {
    players = players.map((player, index) => {
        const newPlayer = {};
        // Retain the existing color
        const existingColor = player.color;
        const existingCollision = player.collisionEnabled;

        initializePlayer(newPlayer, index);

        newPlayer.isConnected = true; // Keep the player as connected
        newPlayer.lost = false; // Reset the lost status
        newPlayer.color = existingColor; // Set the retained color
        newPlayer.collisionEnabled = existingCollision; // Set the retained collision setting

        return newPlayer;
    });
    players.forEach(player => player.score = 0);
    food = getRandomFoodPosition();
    gameStarted = false;
    gameEnded = false;
    broadcast({ gameRestarted: true, players, food, gridSize });
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


        if (data.action === 'setColor') {
            players[playerIndex].color = data.color; // Update the player's color
        }

        if (data.action === 'restart' && gameEnded == true) {
            restartGame();
        }

        if (data.action === 'setCollision' && gameStarted == false) {
            // Update collision setting for all players
            players.forEach(player => {
                player.collisionEnabled = data.collision;
            });
            broadcast({ action: 'updateCollision', collision: data.collision });
        }



        if (data.action === 'start') {
            player.isReady = true;
            // Broadcast that this player has started the game
            broadcast({ action: 'playerStarted', playerIndex: playerIndex + 1 });

            // Check if all players are ready
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

server.listen(3000, 'Nothing for localhost OR your IP adress', () => {
    console.log('Server running on http://same as aboth:3000');
});
