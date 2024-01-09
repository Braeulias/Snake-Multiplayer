# 🐍 Multiplayer Snake Game

This repository hosts the code for a simple yet engaging multiplayer snake game, designed to be run in a web browser. Utilizing WebSocket for real-time communication, this game allows two players to compete against each other in the classic snake game. Mobile and Desktop

## 🚧 Project Status

This is still a demo, with more features incoming:
- Game modes

## 🎮 How to Play

- **Starting the Game:** Players can start the game by clicking the 'Start Game' button.
- **Controlling the Snake:** Use the arrow keys to control the snake's direction (Up, Down, Left, Right).
- **Scoring and Growing:** Eating food (red blocks) grows the snake and increases the score.
- **Game Over Conditions:** Hitting the boundaries or self-colliding will end the game.
- **Restarting the Game:** The 'Restart Game' button can be used to reset the game after it has ended.

## ✨ Features

- **Mobile Support:** This game is also supported on mobile devices
- **Multiplayer Gameplay:** Allows two players to play simultaneously.
- **Real-Time Updates:** Leveraging WebSocket for fluid, real-time gameplay.
- **Customizable Snakes:** Players can choose their snake color.
- **Scoreboard:** Real-time score update for both players.
- **Countdown Timer:** A countdown at the beginning for a synchronized start.

## 📂 Project Structure

- `index.html`: The main HTML file for the game interface.
- `styles.css`: Contains styling for the game interface.
- `client.js`: Handles client-side logic, WebSocket communication, and UI interactions.
- `server.js`: Sets up the server, WebSocket, and game logic.

## ⚙️ Setup and Installation

1. **Clone the Repository:**
   ```bash
   git clone [repository-url]
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   npm install express
   ```
3. **Start the Server:**
   ```bash
   node server.js
   ```
4. **Access the Game:**
   Open **http://localhost:3000** in a web browser to play locally, or use your IP address to play with others on your network.

## 🛠 Technologies Used

- **HTML/CSS:** For building the user interface.
- **JavaScript:** For client-side and server-side logic.
- **Node.js and Express.js**: For setting up the server.
- **WebSocket:** For real-time bi-directional communication between clients and the server.

## 🤝 Contributing
   Contributions, issues, and feature requests are welcome! Feel free to check issues page.

## ✉️ Contact
Elias Bräuer


   
