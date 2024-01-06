

░█▀▄▀█ ░█─░█ ░█─── ▀▀█▀▀ ▀█▀ ░█▀▀█ ░█─── ─█▀▀█ ░█──░█ ░█▀▀▀ ░█▀▀█ 　 ░█▀▀▀█ ░█▄─░█ ─█▀▀█ ░█─▄▀ ░█▀▀▀ 　 ░█▀▀█ ─█▀▀█ ░█▀▄▀█ ░█▀▀▀ 
░█░█░█ ░█─░█ ░█─── ─░█── ░█─ ░█▄▄█ ░█─── ░█▄▄█ ░█▄▄▄█ ░█▀▀▀ ░█▄▄▀ 　 ─▀▀▀▄▄ ░█░█░█ ░█▄▄█ ░█▀▄─ ░█▀▀▀ 　 ░█─▄▄ ░█▄▄█ ░█░█░█ ░█▀▀▀ 
░█──░█ ─▀▄▄▀ ░█▄▄█ ─░█── ▄█▄ ░█─── ░█▄▄█ ░█─░█ ──░█── ░█▄▄▄ ░█─░█ 　 ░█▄▄▄█ ░█──▀█ ░█─░█ ░█─░█ ░█▄▄▄ 　 ░█▄▄█ ░█─░█ ░█──░█ ░█▄▄▄

This repository hosts the code for a simple yet engaging multiplayer snake game, designed to be run in a web browser. Utilizing WebSocket for real-time communication, this game allows two players to compete against each other in the classic snake game. Below is a guide to help you understand and navigate through the project.

## How to Play

1. **Starting the Game:** Players can start the game by pressing the 'Start Game' button.
2. **Controlling the Snake:** Use arrow keys to control the snake's direction (Up, Down, Left, Right).
3. **Scoring and Growing:** Eating food (red blocks) grows the snake and increases the score.
4. **Game Over Conditions:** Hitting the boundaries or self-colliding will end the game.
5. **Restarting the Game:** The 'Restart Game' button can be used to reset the game.

## Features

- **Multiplayer Gameplay:** Two players can play simultaneously.
- **Real-Time Updates:** Leveraging WebSocket for fluid, real-time gameplay.
- **Customizable Snakes:** Players can choose their snake color.
- **Scoreboard:** Real-time score update for both players.
- **Countdown Timer:** A countdown at the beginning for synchronized start.

## Project Structure

- `index.html`: Main HTML file for the game interface.
- `styles.css`: Contains styling for the game interface.
- `client.js`: Handles client-side logic, WebSocket communication, and UI interactions.
- `server.js`: Sets up the server, WebSocket, and game logic.

## Setup and Installation

1. **Clone the Repository:**
   ```bash
   git clone [repository-url]
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Start the Server:**
   ```bash
   node server.js
   ```
4. **Access the Game:**
   Open `http://localhost:3000` in a web browser.

## Technologies Used

- **HTML/CSS:** For building the user interface.
- **JavaScript:** For client-side and server-side logic.
- **Node.js and Express.js:** For setting up the server.
- **WebSocket:** For real-time bi-directional communication between clients and server.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](link-to-issues-page).

## License

IDK

## Contact

Your Name - Elias Bräuer

Project Link: [repository-url]

---

Happy Gaming! 🎮 🌟
