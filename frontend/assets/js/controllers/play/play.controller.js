const objForm = new Form('tokenForm', 'edit-input');
let namePlayer1 = null;
let namePlayer2 = null;
const appStorage = new AppStorage();
const myForm = objForm.getForm();

let documentData = "";
let httpMethod = "";
let endpointUrl = "";

myForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validar campos del formulario (salvo el campo token)
  if (!objForm.validateForm()) {
    console.log("Error en validación");
    return;
  }

  toggleLoading(true); // Mostrar cargando
  console.log("Validando token...");

  const httpMethod = METHODS[1]; // POST
  const endpointUrl = URL_TOKEN_GAME;
  const documentData = objForm.getDataForm(); // { token: '...' }

  try {
    const response = await getDataServices(documentData, httpMethod, endpointUrl);
    const result = await response.json();
    if (result.error || !result.data) {
      console.error("Token inválido o error:", result.error);
      document.getElementById("token").value = "";
      mostrarToast("Token inválido o expirado", "danger");
      return;
    }

    // ✅ Almacenar datos de la partida
    const partida = result.data;
    appStorage.setItem("game_id", partida.id);
    appStorage.setItem("created_at", partida.created_at);
    appStorage.setItem("expires_at", partida.expires_at);

    const expiresAt = appStorage.getItem("expires_at");

    if (expiresAt) {
      iniciarContadorTiempo(expiresAt);
    }

    document.getElementById("token").value = "";
    console.log("Token válido, redirigiendo al juego...");
    mostrarToast("Token válido", "success");
    document.getElementById("tokenForm").classList.add("hidden");
    document.getElementById("juegoArea").classList.remove("hidden");
  } catch (error) {
    console.error("Error al validar token", error);
    mostrarToast("Error de conexión con el servidor", "danger");
  } finally {
    toggleLoading(false); // Ocultar cargando
  }
});



function mostrarToast(mensaje = 'Operación exitosa', tipo = 'success') {
  const toastEl = document.getElementById('liveToast');
  const toastBody = toastEl.querySelector('.toast-body');
  const toast = new bootstrap.Toast(toastEl);

  // Cambiar el mensaje
  toastBody.textContent = mensaje;

  // Cambiar color (clase de fondo)
  toastEl.className = `toast align-items-center text-white bg-${tipo} border-0`;

  toast.show();
}

async function addPlayer(jugador) {
  const input = document.getElementById(`nombreJugador${jugador}`);
  const button = document.getElementById(`btn-accept${jugador}`);
  const card = document.getElementById(`cartasJugador${jugador}`);

  if (!input.value.trim()) {
    input.reportValidity(); // muestra el mensaje de requerido
    return;
  }

  if (jugador === 1) {
    namePlayer1 = input.value.trim();
  } else if (jugador === 2) {
    namePlayer2 = input.value.trim();
  }

  button.classList.add("hidden");
  input.disabled = true;
  card.classList.remove("ocultar-cartas");
}

function getData() {
  documentData = "";
  httpMethod = METHODS[0]; // GET method
  endpointUrl = URL_WARRIOR;

  const resultServices = getDataServices(documentData, httpMethod, endpointUrl);
  resultServices.then(response => {
    return response.json();
  }).then(data => {
    //Create table 
    createCards(data, "cartasJugador1", "jugador1");
    createCards(data, "cartasJugador2", "jugador2");
    // createTable(data);
  }).catch(error => {
    console.log(error);
  }).finally(() => {
    //console.log("finally");
    toggleLoading(false);
  });
}

function createCards(data, contenedorId, jugador) {
  const contenedor = document.getElementById(contenedorId);
  contenedor.innerHTML = "";
  if (!data || !Array.isArray(data.data)) {
    objCart.innerHTML = `<h1 class="text-white text-center mt-5">No hay datos disponibles</h1>`;
    return;
  }

  let warriors = data['data'];

  shuffleArray(warriors);
  warriors.forEach(row => {
    const cartaDiv = document.createElement("div");
    cartaDiv.classList.add("cart", "seleccionable");
    cartaDiv.dataset.cartaId = row.id;
    cartaDiv.dataset.jugador = jugador;

    cartaDiv.innerHTML = `
      <h6 class="name">${row.name}</h6>
      <div class="estrellas">${generarEstrellas(row.intelligence)}</div>
      <div class="container-img">
        <img src="../../../${row.photo}" class="photo" alt="${row.name}">
      </div>
      <div class="atributos">
        <p><strong>Raza: </strong>${row.breed_name}</p>
        <p><strong>Magia: </strong>${row.magic_name}</p>
        <p><strong>Tipo Guerrero: </strong>${row.type_warrior_name}</p>
      </div>
    `;

    cartaDiv.addEventListener("click", () => seleccionarCarta(row, jugador));
    contenedor.appendChild(cartaDiv);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function generarEstrellas(inteligencia) {
  const estrellasCompletas = Math.floor(inteligencia / 1000);
  const medioCirculo = inteligencia % 1000 >= 500 ? 1 : 0;

  let estrellas = '';
  for (let i = 0; i < estrellasCompletas; i++) {
    estrellas += '<i class="fas fa-circle full-star"></i>';
  }
  if (medioCirculo) estrellas += '<i class="fas fa-adjust half-star"></i>';

  return estrellas;
}

// Almacenes temporales por jugador
const cartasSeleccionadas = {
  jugador1: [],
  jugador2: []
};

function seleccionarCarta(carta, jugador) {
  const maxCartas = 5;
  const seleccion = cartasSeleccionadas[jugador];

  const cartaElemento = document.querySelector(`.cart[data-carta-id="${carta.id}"][data-jugador="${jugador}"]`);
  const index = seleccion.findIndex(c => c.id === carta.id);

  if (index > -1) {
    // 🧹 Deselecciona la carta
    seleccion.splice(index, 1);
    cartaElemento.classList.remove("seleccionada");

    // ✅ Mostrar nuevamente las ocultas para seguir seleccionando
    const cartasJugador = document.querySelectorAll(`.cart[data-jugador="${jugador}"]`);
    cartasJugador.forEach(card => {
      card.classList.remove("carta-oculta");
    });

  } else {
    if (seleccion.length >= maxCartas) {
      mostrarToast(`Solo puedes seleccionar ${maxCartas} cartas`, "warning");
      return;
    }

    seleccion.push(carta);
    cartaElemento.classList.add("seleccionada");

    // ✅ Ocultar las que no están seleccionadas si ya llegó a 5
    if (seleccion.length === maxCartas) {
      const cartasJugador = document.querySelectorAll(`.cart[data-jugador="${jugador}"]`);
      cartasJugador.forEach(card => {
        const cartaId = parseInt(card.dataset.cartaId);
        const estaSeleccionada = seleccion.some(c => c.id === cartaId);
        if (!estaSeleccionada) {
          card.classList.add("carta-oculta");
        }
      });
      mostrarToast(`Jugador ${jugador} completó su selección`, "success");
    }
  }
  validarTodoListo();
}

function validarTodoListo() {
  const nombre1 = document.getElementById("nombreJugador1").value.trim();
  const nombre2 = document.getElementById("nombreJugador2").value.trim();

  const tiene5CartasJugador1 = cartasSeleccionadas.jugador1.length === 5;
  const tiene5CartasJugador2 = cartasSeleccionadas.jugador2.length === 5;

  const btnJugar = document.getElementById("btnJugar");

  if (nombre1 && nombre2 && tiene5CartasJugador1 && tiene5CartasJugador2) {
    btnJugar.classList.remove("hidden");
  } else {
    btnJugar.classList.add("hidden");
  }
}

async function jugar() {
  if (cartasSeleccionadas.jugador1.length < 5 || cartasSeleccionadas.jugador2.length < 5) {
    mostrarToast("Ambos jugadores deben tener 5 cartas seleccionadas", "danger");
    return;
  }

  const resultadoDiv = document.getElementById("resultado");

  // Sumar un atributo total por jugador (puedes cambiar 'intelligence' por otra lógica si lo deseas)
  const totalJugador1 = cartasSeleccionadas.jugador1.reduce((acc, carta) => acc + (carta.intelligence || 0), 0);
  const totalJugador2 = cartasSeleccionadas.jugador2.reduce((acc, carta) => acc + (carta.intelligence || 0), 0);

  // También puedes incluir un poco de aleatoriedad
  const azar1 = Math.floor(Math.random() * 10); // entre 0 y 9
  const azar2 = Math.floor(Math.random() * 10);

  const puntuacion1 = totalJugador1 + azar1;
  const puntuacion2 = totalJugador2 + azar2;

  let ganadorJugador1 = 0;
  let ganadorJugador2 = 0;
  let mensaje = '';
  if (puntuacion1 > puntuacion2) {
    mensaje = '🎉 ¡Jugador 1 gana la partida!';
    ganadorJugador1 = 1;
  } else if (puntuacion2 > puntuacion1) {
    mensaje = '🎉 ¡Jugador 2 gana la partida!';
     ganadorJugador2 = 1;
  } else {
    mensaje = '🤝 ¡Empate!';
  }

  // Mostrar resultado
  resultadoDiv.textContent = mensaje;
  resultadoDiv.classList.remove("hidden");

  const IdPlayer1 = await registrarJugador(namePlayer1);
  console.log("ID JUGADOR1:", IdPlayer1);
  const IdPlayer2 = await registrarJugador(namePlayer2);
  console.log("ID JUGADOR2:", IdPlayer2);
  
  const IdGame = appStorage.getItem("game_id");

  const IdGamePlayer1 = await gamePlayer(ganadorJugador1, IdGame, IdPlayer1);
  console.log("ID GAMEPLAYER1:", IdGamePlayer1);
  const IdGamePlayer2 = await gamePlayer(ganadorJugador2, IdGame, IdPlayer2);
  console.log("ID GAMEPLAYER2:",IdGamePlayer2);

  for (let cards of cartasSeleccionadas.jugador1){
    await warriorPlayer (IdGamePlayer1, cards.id);
  }

  for (let cards of cartasSeleccionadas.jugador2){
    await warriorPlayer (IdGamePlayer2, cards.id);
  }

  const finalizada = 3;
  updateState(IdGame, finalizada);
  endGame();
}

function endGame () {
  const btnJugar = document.getElementById("btnJugar");
  btnJugar.classList.add("hidden");

  setTimeout(() => {
    location.reload();
  }, 10000);
}

async function warriorPlayer(game, warrior) {
  const httpMethod = METHODS[1]; // POST
  const endpointUrl = URL_WARRIORS_PLAYER;

  const documentData = {
    game_player_fk: game,
    warrior_fk: warrior
  };

  try {
    const response = await getDataServices(documentData, httpMethod, endpointUrl);
    const result = await response.json();

    if (result.error || !result.data) {
      mostrarToast("Error al registrar WarriorPlayer", "danger");
      return null;
    }

    return result.data.id; // Esto tendrá el id del game_player
  } catch (error) {
    console.error("Error registrando WarriorPlayer:", error);
    mostrarToast("Error de conexión", "danger");
    return null;
  }
}

async function registrarJugador(nombreJugador) {
  const httpMethod = METHODS[1]; // POST
  const endpointUrl = URL_PLAYER;

  const documentData = {
    name: nombreJugador
  };

  try {
    const response = await getDataServices(documentData, httpMethod, endpointUrl);
    const result = await response.json();

    if (result.error || !result.data) {
      mostrarToast("Error al registrar jugador", "danger");
      return null;
    }

    return result.data.id; // Esto tendrá el id del game_player
  } catch (error) {
    console.error("Error registrando jugador:", error);
    mostrarToast("Error de conexión", "danger");
    return null;
  }
}

async function updateState(id, status) {
  const httpMethod = METHODS[2]; // POST
  const endpointUrl = URL_GAME + id;

  const documentData = {
    status_fk: status
  };

  try {
    const response = await getDataServices(documentData, httpMethod, endpointUrl);
    const result = await response.json();

    if (result.error || !result.data) {
      mostrarToast("Error al actualizar partida", "danger");
      return null;
    }

    return result.data.id; // Esto tendrá el id del game_player
  } catch (error) {
    console.error("Error actualizando partida:", error);
    mostrarToast("Error de conexión", "danger");
    return null;
  }
}

async function gamePlayer(winner, game, player) {
  const httpMethod = METHODS[1]; // POST
  const endpointUrl = URL_GAME_PLAYER;

  const documentData = {
    winner: winner,
    game_fk: game,
    player_fk: player
  };

  try {
    const response = await getDataServices(documentData, httpMethod, endpointUrl);
    const result = await response.json();

    if (result.error || !result.data) {
      mostrarToast("Error al registrar GamePlayer", "danger");
      return null;
    }

    console.log(result.data.id);
    return result.data.id; // Esto tendrá el id del game_player
  } catch (error) {
    console.error("Error registrando GamePlayer:", error);
    mostrarToast("Error de conexión", "danger");
    return null;
  }
}

function iniciarContadorTiempo(expirationTimeStr) {
  const contadorDiv = document.getElementById("contador-tiempo");
  contadorDiv.classList.add("contador-estilo");
  const expirationTime = new Date(expirationTimeStr).getTime();

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = expirationTime - now;

    if (timeLeft <= 0) {
      clearInterval(interval);
      contadorDiv.textContent = "¡Tiempo agotado!";
      mostrarToast("La partida ha expirado", "warning");
      // Aquí puedes redirigir o bloquear acciones si deseas

      const IdGame = appStorage.getItem("game_id");
      const expirada = 2;
      updateState(IdGame, expirada);

      setTimeout(() => {
        location.reload(); // recarga la página
      }, 3000); // 3000 milisegundos = 3 segundos
      return;
    }

    // Convertir milisegundos a minutos y segundos
    const minutos = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((timeLeft % (1000 * 60)) / 1000);

    contadorDiv.textContent = `Tiempo restante: ${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')} ⌛`;
  }, 1000);
}

function loadView() {
  getData();
}

window.addEventListener('load', () => {
  loadView();
});

