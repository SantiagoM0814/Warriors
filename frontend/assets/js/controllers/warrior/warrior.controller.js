document.addEventListener('DOMContentLoaded', async () => {
  document.querySelector('body').style.display = 'none';
  document.querySelector('body').style.opacity = 0;

  await checkAuth();
  console.log('user controller has been loaded');
  fadeInElement(document.querySelector('body'), 1000);
  // Initialize the loading screen

});

const objForm = new Form('documentTypeForm', 'edit-input');
const objCart = document.getElementById('container-carts')
const objModal = new bootstrap.Modal(document.getElementById('appModal'));
const objSelectBreed = document.getElementById('breed_fk');
const objSelectMagic = document.getElementById('magic_fk');
const objSelectTWarrior = document.getElementById('typeWarrior_fk');
const myForm = objForm.getForm();
const textConfirm = "Press a button!\nEither OK or Cancel.";
const appTable = "#app-table";

let insertUpdate = true;
let keyId;
let documentData = "";
let httpMethod = "";
let endpointUrl = "";

myForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!objForm.validateForm()) {
    console.log("Error");
    return;
  }
  toggleLoading(true);
  if (insertUpdate) {
    console.log("Insert");
    httpMethod = METHODS[1]; // POST method
    endpointUrl = URL_WARRIOR;
  } else {
    console.log("Update");
    httpMethod = METHODS[2]; // PUT method
    endpointUrl = URL_WARRIOR + keyId;
  }
  documentData = objForm.getDataFormData();
  const resultServices = getDataServices(documentData, httpMethod, endpointUrl);
  resultServices.then(response => {
    return response.json();
  }).then(data => {
    //console.log(data);
  }).catch(error => {
    console.log(error);
  }).finally(() => {
    //console.log("finally");
    loadView();
    showHiddenModal(false);
  });
});

function add() {
  showHiddenModal(true);
  insertUpdate = true;
  objForm.resetForm();
  objForm.enabledForm();
  objForm.enabledButton();
  objForm.showButton();
}

function showId(id) {
  objForm.resetForm();
  objForm.disabledForm();
  objForm.disabledButton();
  objForm.hiddenButton();
  getDataId(id);
}

function edit(id) {
  insertUpdate = false;
  objForm.resetForm();
  objForm.enabledEditForm();
  objForm.enabledButton();
  objForm.showButton();
  keyId = id;
  getDataId(id);
}

function delete_(id) {
  objForm.resetForm();
  objForm.enabledForm();
  objForm.enabledButton();
  if (confirm(textConfirm)) {
    documentData = "";
    httpMethod = METHODS[3]; // DELETE method
    endpointUrl = URL_WARRIOR + id;
    const resultServices = getDataServices(documentData, httpMethod, endpointUrl);
    resultServices.then(response => {
      return response.json();
    }).then(data => {
    }).catch(error => {
      console.log(error);
    }).finally(() => {
      //console.log("finally");
      loadView();
    });
  } else {
    console.log("cancel");
  }
}

function getDataId(id) {
  documentData = "";
  httpMethod = METHODS[0]; // GET method
  endpointUrl = URL_WARRIOR + id;
  const resultServices = getDataServices(documentData, httpMethod, endpointUrl);
  resultServices.then(response => {
    return response.json();
  }).then(data => {
    let getData = data["data"];
    console.log(getData)
    objForm.setDataFormJson(getData);
  }).catch(error => {
    console.log(error);
  }).finally(() => {
    //console.log("finally");
    showHiddenModal(true);
  });
}

async function getData() {
  try {
    toggleLoading(true);
    const documentData = "";
    const httpMethod = METHODS[0]; // GET
    const endpointUrl = URL_WARRIOR;

    const response = await getDataServices(documentData, httpMethod, endpointUrl);

    // Validar si la respuesta es incorrecta
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.data)) {
      throw new Error("La respuesta no contiene datos válidos.");
    }


    createTable(data);
    mostrarToast("Datos cargados correctamente", "success");

  } catch (error) {
    console.error("Error al obtener datos:", error);
    mostrarToast("No existen guerreros", "danger");
  } finally {
    new DataTable(appTable);
    toggleLoading(false);
  }
}


function createTable(data) {
  objCart.innerHTML = "";
  if (!data || !Array.isArray(data.data)) {
    objCart.innerHTML = `<h1 class="text-white text-center mt-5">No hay datos disponibles</h1>`;
    return;
  }

  let getData = data['data'];
  let rowLong = getData.length;
  for (let i = 0; i < rowLong; i ++) {
    let row = getData[i];
    let dataRow = `
      <div class="cart">
            <h6 class="name">${row.name}</h6>
            <div class="estrellas">${generarEstrellas(row.intelligence)}</div>
            <div class="container-img">
                <img src="../../../${row.photo}" class="photo">
            </div>
            <div class="atributos">
                <p><strong>Raza: </strong>${row.breed_name}</p>
                <p><strong>Magia: </strong>${row.magic_name}</p>
                <p><strong>Tipo Guerrero: </strong>${row.type_warrior_name}</p>
            </div>
            <div class="cart-actions">
              <button class="btn btn-success btn-sm" onclick="showId(${row.id})"><i class="fa-regular fa-eye"></i></button>
              <button class="btn btn-primary btn-sm" onclick="edit(${row.id})"><i class="fa-solid fa-pencil"></i></button>
              <button class="btn btn-danger btn-sm" onclick="delete_(${row.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `;
    objCart.innerHTML += dataRow
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

function showHiddenModal(type) {
  if (type) {
    objModal.show();
  } else {
    objModal.hide();
  }
}

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

function getDataBreed() {
  documentData = "";
  httpMethod = METHODS[0]; // GET method
  endpointUrl = URL_BREED;
  const resultServices = getDataServices(documentData, httpMethod, endpointUrl);
  resultServices.then(response => {
    return response.json();
  }).then(data => {
    createSelectBreed(data);
  }).catch(error => {
    console.log(error);
  }).finally(() => {
    //console.log("finally");
    new DataTable(appTable);
    toggleLoading(false);
  });
}

function createSelectBreed(data) {
  objSelectBreed.innerHTML = "<option value='' selected disabled>Open this select menu</option>";

  let getData = data['data'];
  if (getData[0] === 0) return;//Validate if the data is empty
  let rowLong = getData.length;
  for (let i = 0; i < rowLong; i++) {
    let row = getData[i];
    let dataRow = `<option value="${row.id}">${row.name}</option>`;
    objSelectBreed.innerHTML += dataRow;
  }
}

function getDataMagic() {
  documentData = "";
  httpMethod = METHODS[0]; // GET method
  endpointUrl = URL_MAGIC;
  const resultServices = getDataServices(documentData, httpMethod, endpointUrl);
  resultServices.then(response => {
    return response.json();
  }).then(data => {
    createSelectMagic(data);
  }).catch(error => {
    console.log(error);
  }).finally(() => {
    //console.log("finally");
    new DataTable(appTable);
    toggleLoading(false);
  });
}

function createSelectMagic(data) {
  objSelectMagic.innerHTML = "<option value='' selected disabled>Open this select menu</option>";

  let getData = data['data'];
  if (getData[0] === 0) return;//Validate if the data is empty
  let rowLong = getData.length;
  for (let i = 0; i < rowLong; i++) {
    let row = getData[i];
    let dataRow = `<option value="${row.id}">${row.name}</option>`;
    objSelectMagic.innerHTML += dataRow;
  }
}

function getDataTypeWarrior() {
  documentData = "";
  httpMethod = METHODS[0]; // GET method
  endpointUrl = URL_TYPE_WARRIOR;
  const resultServices = getDataServices(documentData, httpMethod, endpointUrl);
  resultServices.then(response => {
    return response.json();
  }).then(data => {
    createSelectTypeWarrior(data);
  }).catch(error => {
    console.log(error);
  }).finally(() => {
    //console.log("finally");
    new DataTable(appTable);
    toggleLoading(false);
  });
}

function createSelectTypeWarrior(data) {
  objSelectTWarrior.innerHTML = "<option value='' selected disabled>Open this select menu</option>";

  let getData = data['data'];
  if (getData[0] === 0) return;//Validate if the data is empty
  let rowLong = getData.length;
  for (let i = 0; i < rowLong; i++) {
    let row = getData[i];
    let dataRow = `<option value="${row.id}">${row.name}</option>`;
    objSelectTWarrior.innerHTML += dataRow;
  }
}

function loadView() {
  getData();
  toggleLoading(true);
}

window.addEventListener('load', () => {
  loadView();
  getDataBreed();
  getDataMagic();
  getDataTypeWarrior();
});

