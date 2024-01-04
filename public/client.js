const queryParams = new URLSearchParams(window.location.search);
const playerIndex = queryParams.get('player') || 1;
const ws = new WebSocket(`ws://192.168.0.129:3000/player${playerIndex}`);

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

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.gameEnded) {
        const message = `Game Over! Player ${data.losingPlayerIndex + 1} lost by hitting a boundary.`;
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


document.addEventListener('keydown', sendDirectionChange);

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



function drawGrid() {
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("game-cell");
        gameBoard.appendChild(cell);
    }
}

// Client-side Code (Inside client.js)

// ... [previous code] ...

function drawSnakes(players) {
    players.forEach((player, index) => {
        // Each snake can have a different class or style
        const snakeClass = index === 0 ? 'snake1' : 'snake2';
        drawSnake(player.snake, snakeClass);
    });
}

function drawSnake(snake, snakeClass) {
    // Remove existing snake elements for this player
    document.querySelectorAll(`.${snakeClass}`).forEach(e => e.remove());

    snake.forEach(segment => {
        const snakeSegment = document.createElement("div");
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
