class Table {
  constructor(tablaId, columnsShow) {
    this.table = document.getElementById(tablaId);
    this.body = this.table.querySelector('tbody');
    this.columnsShow = columnsShow; // ['nombre', 'correo', 'rol']
  }

  cleanTable(){
    this.body.innerHTML = "";
  }

  loadData(data) {
    // Limpiar la tabla (excepto encabezado si lo tiene)
    this.cleanTable();

    // Recorrer cada dato
    data.forEach(item => {
      const row = document.createElement('tr');

      // Crear celdas solo con las columnas que quieres mostrar
      this.columnsShow.forEach(col => {
        const cell = document.createElement('td');
        if (col === 'password_hash') {
          // Si es la columna de la contraseña, mostrar un input oculto
          cell.innerHTML = `<input type="password" value="${item[col]}" disabled readonly />`;
        } else if (col === 'photo_url') {
          cell.innerHTML = `<img src="../../../../${item[col]}" height="50px">`;
        } else if (col === 'gamePlayer_winner') {
          const estado = item[col] === 1 ? 'Ganador' : 'Perdedor';
          cell.innerHTML = estado;
        }
        else {
          // Si es otra columna, mostrar texto normal
          cell.textContent = item[col];
        }
        row.appendChild(cell);
      });

      const cellActions = document.createElement('td');
      cellActions.innerHTML = `
        <button type="button" title="Button Show"class="btn btn-success" onclick="showId(${item.id})"><i class='fas fa-eye'></i></button>
        <button type="button"title="Button Edit" class="btn btn-primary" onclick="edit(${item.id})"><i class='fas fa-edit' ></i></button>
        <button type="button" title="Button Delete" class="btn btn-danger" onclick="delete_(${item.id})"><i class='fas fa-trash' ></i></button> `;
      row.appendChild(cellActions);

      this.table.querySelector('tbody').appendChild(row);
    });
  }
}

