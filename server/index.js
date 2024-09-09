const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express(); // Crea el servidor HTTP con Express
app.use(express.json()); // Para procesar solicitudes JSON
app.use(cors()); // Permite solicitudes desde cualquier origen

const httpServer = createServer(app); // Crea un servidor HTTP desde la aplicación Express

const io = new Server(httpServer, {
  path: "/real-time",
  cors: {
    origin: "*", // Permite solicitudes desde cualquier origen
  },
}); // Crea el servidor WebSocket usando el mismo servidor HTTP

// Simulamos una base de datos en memoria
const db = {
  players: [], // Lista de jugadores
};

// AQUI INICIAN LOS CAMBIOS


// Al establecerse la conexión de un cliente
io.on("connection", (socket) => {

  // Manejar el evento de cuando un jugador se une
  socket.on("joinGame", (user) => {
    db.players.push({ id: socket.id, nickname: user.nickname });
    console.log(`${user.nickname} se ha unido al juego.`);

    // Asignar un rol aleatorio al jugador
    const randomRole = Math.random() < 0.5 ? "Marco" : "Polo";
    socket.emit("roleAssigned", { role: randomRole, nickname: user.nickname });
    
    // Emite la lista actualizada de jugadores a todos los clientes
    io.emit("userJoined", db.players); 
  });

  // Evento para cuando un jugador presiona el botón de "Iniciar Juego"
  socket.on("startGame", () => {
    console.log("El juego ha comenzado");
    io.emit("gameStarted"); // Notifica a todos los clientes que el juego ha comenzado
  });

  // Evento para seleccionar un jugador como "Marco"
  socket.on("notifyMarco", () => {
    if (db.players.length > 0) {
      const randomPlayerIndex = Math.floor(Math.random() * db.players.length);
      const randomPlayer = db.players[randomPlayerIndex];
      randomPlayer.isMarco = true; // Marca al jugador como "Marco"
      
      // Emite el mensaje solo al jugador seleccionado como "Marco"
      io.to(randomPlayer.id).emit("roleAssigned", { role: "Marco", message: "Has sido seleccionado como Marco." });
  
      console.log(`${randomPlayer.nickname} ha sido seleccionado como Marco.`);
    }
  });
  
  // Evento para seleccionar un jugador como "Polo"
  socket.on("notifyPolo", () => {
    if (db.players.length > 0) {
      const randomPlayerIndex = Math.floor(Math.random() * db.players.length);
      const randomPlayer = db.players[randomPlayerIndex];
      randomPlayer.isMarco = false; // Marca al jugador como "Polo"
      
      // Emite el mensaje solo al jugador seleccionado como "Polo"
      io.to(randomPlayer.id).emit("roleAssigned", { role: "Polo", message: "Has sido seleccionado como Polo." });
  
      console.log(`${randomPlayer.nickname} ha sido seleccionado como Polo.`);
    }
  });

  // Evento cuando el jugador selecciona a "Polo" durante el juego
  socket.on("onSelectPolo", (selectedPlayer) => {
    console.log(`Jugador ${selectedPlayer.nickname} ha seleccionado a Polo.`);
    // Aquí puedes manejar la lógica adicional según las reglas del juego.
  });

  // Cuando un cliente se desconecta
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");

    // Elimina al jugador desconectado de la lista `db.players`
    db.players = db.players.filter(player => player.id !== socket.id);
    
    // Emite la lista actualizada de jugadores a todos los clientes
    io.emit("userJoined", db.players);
  });
});

// Inicia el servidor en el puerto 5050
httpServer.listen(5050, () => {
  console.log("Servidor corriendo en http://localhost:5050");
});
