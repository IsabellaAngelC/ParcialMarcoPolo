let socket = io("http://localhost:5050", { path: "/real-time" });

document.getElementById("join-button").addEventListener("click", fetchData);
document.getElementById("submit-button").addEventListener("click", function(event) {
  event.preventDefault(); // Evita el comportamiento por defecto del botón


// Obtener el valor del nickname ingresado
const nickname = document.getElementById("player-name").value;

// Guardar el nickname en el localStorage para poder usarlo en la página de start
localStorage.setItem("nickname", nickname);

// Redirigir a la página de start
window.location.href = "start.html";
});

async function submitData() {
  let userNickname = document.getElementById("nickname").value;
  let userMessage = document.getElementById("message").value;
  socket.emit("message", { nickname: userNickname, message: userMessage });
}

// Escuchar el evento 'roleAssigned' cuando el servidor asigna el rol
socket.on('roleAssigned', (data) => {
  // data debería contener tanto el nickname como el rol asignado
  const { role, nickname } = data;

  // Verificar que el nickname esté bien recibido
  if (nickname) {
    // Mostrar el nickname en la pantalla correctamente
    document.getElementById("data-container").innerHTML = `<p>Bienvenido ${nickname}</p>`;
  } else {
    console.error("Nickname no está definido correctamente");
  }

  // Mostrar el rol asignado también en pantalla
  document.getElementById("role-container").innerHTML = `<p>Has sido asignado como ${role}</p>`;
});

// Cuando el usuario se une, envía su nickname al servidor
document.getElementById("joinForm").addEventListener("submit", (event) => {
  event.preventDefault();
  
  // Obtener el nickname desde el formulario
  const nickname = document.getElementById("nicknameInput").value;

  // Enviar el nickname al servidor usando sockets
  socket.emit("joinGame", { nickname: nickname });
});



async function fetchData() {
  socket.emit("joinGame", { nickname: "Spiderman xd" }); // Sends a string message to the server
}

socket.on("userJoined", (data) => {
  console.log(data);
});

// Esta función tomará los nombres ingresados por el usuario y los enviará al servidor
socket.on("userNickname", () => { let userNickname = document.getElementById("nickname").value;
  socket.emit("nickname", userNickname);
  });



socket.on("userList", (data) => {
  document.getElementById("user-list").innerHTML = "";
  for(const user of data) {
    document.getElementById("user-list").innerHTML += `<p>${user}</p>`;
  }
  });

document.getElementById("data-container").innerHTML += `<p>Your nickname is ${userNickname}</p>`;
