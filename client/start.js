let socket = io("http://localhost:5050", { path: "/real-time" });

// Recuperar el nickname del localStorage
const nickname = localStorage.getItem("nickname");

// Mostrar el nickname en la pantalla
document.getElementById("data-container").innerHTML = `<p>Bienvenido ${nickname}</p>`;

// Emitir el evento "joinGame" al servidor, para que el servidor sepa que este jugador se ha unido
socket.emit("joinGame", { nickname });

// Escuchar el evento "roleAssigned" desde el servidor
socket.on("roleAssigned", (data) => {
  // Mostrar el rol en la pantalla junto con un botón para iniciar el juego
  document.getElementById("data-container").innerHTML += `
    <p>Tu rol es: ${data.role}</p>
    <button id="start-game-button">Iniciar Juego</button>
  `;
  
  // Escuchar el clic en el botón para iniciar el juego
  document.getElementById("start-game-button").addEventListener("click", () => {
    // Emitir el evento para iniciar el juego
    socket.emit("startGame", { nickname });
  });
});
