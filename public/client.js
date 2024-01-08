const queryParams = new URLSearchParams(window.location.search);
const playerIndex = parseInt(queryParams.get('player')) || 1;
const ws = new WebSocket(`ws://localhost or your IpAdress:3000/player${playerIndex}`);

const gameBoard = document.getElementById("game-board");
const startButton = document.getElementById("startButton");
let gameStarted = false;
const gridSize = 20; // Define gridSize on the client as well

// Draw the initial game grid
drawGrid();

startButton.addEventListener('click', () => {
    startButton.disabled = true;
    ws.send(JSON.stringify({ action: 'start' }));
});

ws.onopen = () => {
    console.log(`Player ${playerIndex} connected to server`);
};

document.getElementById("restartButton").addEventListener('click', () => {
    ws.send(JSON.stringify({ action: 'restart' }));
});

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.action === 'updateCollision') {
        document.getElementById('collisionSwitch').checked = data.collision;
    }


    if (data.gameEnded) {
        // Existing code...
        document.getElementById("restartButton").disabled = false;
    }

    if (data.players) {
        document.getElementById("player1Score").innerText = data.players[0].score;
        document.getElementById("player2Score").innerText = data.players[1].score;
    }



    if (data.action === 'playerStarted') {
        if (data.playerIndex !== playerIndex) {
            // Show message only if the other player has started the game
            document.getElementById("readiness").innerText = `Player ${data.playerIndex} is ready!`;
        }
    }

    if (data.gameRestarted) {
        console.log("Game has restarted!");
        document.getElementById("timer").innerText = "";
        document.getElementById("readiness").innerText = "";
        resetGameBoard(); // Resets the game board
        startButton.disabled = false;
        document.getElementById("restartButton").disabled = true;
        gameStarted = false; // Reset game started flag
    }

    if (data.gameEnded) {
        const message = `Game Over! Player ${data.losingPlayerIndex + 1} lost by hitting a boundary or a snake.`;
        alert(message); // Display an alert or update the DOM
        // Additional logic to handle the end of the game
    }

    if (data.countdown !== undefined) {
        console.log(`Starting in ${data.countdown}...`); // Countdown working
        document.getElementById("timer").innerText = data.countdown;
    } else if (data.gameStarted) {
        gameStarted = true;
        console.log("Game has started!"); // Make sure this gets logged
        // You may also want to hide the countdown and show the game board here
    } else if (gameStarted) {
        // Update the game state with the data received from the server
        // Ensure this part is working and that the draw functions are correct
        drawSnakes(data.players); // This function needs to exist
        drawFood(data.food);     // This function needs to exist
    }
};

// The rest of the client functions go here
document.getElementById('colorPicker').addEventListener('change', (event) => {
    const chosenColor = event.target.value;
    ws.send(JSON.stringify({ action: 'setColor', color: chosenColor }));
});

document.addEventListener('keydown', sendDirectionChange);

document.getElementById('upBtn').addEventListener('click', () => sendDirectionChange({ key: "ArrowUp" }));
document.getElementById('downBtn').addEventListener('click', () => sendDirectionChange({ key: "ArrowDown" }));
document.getElementById('leftBtn').addEventListener('click', () => sendDirectionChange({ key: "ArrowLeft" }));
document.getElementById('rightBtn').addEventListener('click', () => sendDirectionChange({ key: "ArrowRight" }));

document.getElementById('collisionSwitch').addEventListener('change', (event) => {
    const collisionEnabled = event.target.checked;
    ws.send(JSON.stringify({ action: 'setCollision', collision: collisionEnabled }));
});



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
    console.log("Sending direction:", direction); // Log the direction being sent
    ws.send(JSON.stringify({ action: 'direction', direction: direction }));
}

document.getElementById('player1Collision').addEventListener('change', () => {
    const collisionEnabled = document.getElementById('player1Collision').checked;
    ws.send(JSON.stringify({ action: 'setCollision', playerIndex: 1, collision: collisionEnabled }));
});

document.getElementById('player2Collision').addEventListener('change', () => {
    const collisionEnabled = document.getElementById('player2Collision').checked;
    ws.send(JSON.stringify({ action: 'setCollision', playerIndex: 2, collision: collisionEnabled }));
});


function resetGameBoard() {
    // Clear the game board
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }

    document.getElementById("player1Score").innerText = "0";
    document.getElementById("player2Score").innerText = "0";
    // Redraw the grid
    drawGrid();

    // Disable the restart button initially
    document.getElementById("restartButton").disabled = true;

    // Re-enable the start button
    startButton.disabled = false;
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



function drawSnakes(players) {
    players.forEach((player, index) => {
        // Each snake can have a different class or style
        const snakeClass = index === 0 ? 'snake1' : 'snake2';
        drawSnake(player.snake, snakeClass, player.color); // Pass the color to the drawSnake function
    });
}

function drawSnake(snake, snakeClass, color) {
    // Remove existing snake elements for this player
    document.querySelectorAll(`.${snakeClass}`).forEach(e => e.remove());

    snake.forEach(segment => {
        const snakeSegment = document.createElement("div");
        snakeSegment.style.backgroundColor = color;
        snakeSegment.style.gridRowStart = segment.y + 1;
        snakeSegment.style.gridColumnStart = segment.x + 1;
        snakeSegment.classList.add(snakeClass); // Use the class for the specific snake
        gameBoard.appendChild(snakeSegment);
    });
}

// ... [rest of your client.js code] ...


function drawFood(food) {
    // Remove existing food elements
    document.querySelector('.food')?.remove();
    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y + 1;
    foodElement.style.gridColumnStart = food.x + 1;
    foodElement.classList.add("food");
    gameBoard.appendChild(foodElement);
}
