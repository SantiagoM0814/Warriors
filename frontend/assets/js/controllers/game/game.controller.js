const cartasDisponibles = [
      { nombre: "Espadachín", fuerza: 7, defensa: 5, magia: 1 },
      { nombre: "Mago", fuerza: 3, defensa: 3, magia: 9 },
      { nombre: "Arquero", fuerza: 6, defensa: 4, magia: 2 },
      { nombre: "Hechicera", fuerza: 4, defensa: 2, magia: 8 },
      { nombre: "Dragón", fuerza: 10, defensa: 7, magia: 5 },
      { nombre: "Orco", fuerza: 8, defensa: 6, magia: 1 },
      { nombre: "Guerrero de Fuego", fuerza: 6, defensa: 5, magia: 4 },
      { nombre: "Nigromante", fuerza: 2, defensa: 4, magia: 9 },
    ];

    let seleccionJugador1 = [];
    let seleccionJugador2 = [];

    function validarToken() {
      const token = document.getElementById("token").value;
      if (token === "GUERREROS2025") {
        document.getElementById("tokenArea").classList.add("hidden");
        document.getElementById("juegoArea").classList.remove("hidden");
        renderCartas("cartasJugador1", seleccionJugador1, 1);
        renderCartas("cartasJugador2", seleccionJugador2, 2);
      } else {
        alert("Token inválido");
      }
    }

    function renderCartas(containerId, seleccion, jugador) {
      const container = document.getElementById(containerId);
      container.innerHTML = "";
      cartasDisponibles.forEach((carta, index) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `<strong>${carta.nombre}</strong><br>⚔️ ${carta.fuerza} 🛡️ ${carta.defensa} ✨ ${carta.magia}`;
        div.onclick = () => seleccionarCarta(jugador, index);
        container.appendChild(div);
      });
    }

    function seleccionarCarta(jugador, index) {
      const seleccion = jugador === 1 ? seleccionJugador1 : seleccionJugador2;
      if (seleccion.includes(index)) {
        const idx = seleccion.indexOf(index);
        seleccion.splice(idx, 1);
      } else if (seleccion.length < 5) {
        seleccion.push(index);
      }

      renderCartas(`cartasJugador${jugador}`, seleccion, jugador);
      seleccion.forEach(i => {
        const cards = document.querySelectorAll(`#cartasJugador${jugador} .card`);
        cards[i].classList.add("selected");
      });

      if (seleccionJugador1.length === 5 && seleccionJugador2.length === 5) {
        document.getElementById("btnJugar").classList.remove("hidden");
      } else {
        document.getElementById("btnJugar").classList.add("hidden");
      }
    }

    function jugar() {
      let puntosJ1 = calcularPuntos(seleccionJugador1);
      let puntosJ2 = calcularPuntos(seleccionJugador2);

      const resultado = document.getElementById("resultado");
      if (puntosJ1 > puntosJ2) {
        resultado.textContent = "🏆 ¡Jugador 1 gana!";
      } else if (puntosJ2 > puntosJ1) {
        resultado.textContent = "🏆 ¡Jugador 2 gana!";
      } else {
        resultado.textContent = "⚔️ ¡Empate!";
      }
    }

    function calcularPuntos(indices) {
      return indices.reduce((acc, i) => {
        const carta = cartasDisponibles[i];
        return acc + carta.fuerza + carta.defensa + carta.magia;
      }, 0);
    }