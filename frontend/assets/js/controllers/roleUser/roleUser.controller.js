

document.addEventListener('DOMContentLoaded', async ()=> {
  document.querySelector('body').style.display = 'none';
  document.querySelector('body').style.opacity = 0;
 
  await checkAuth();
  console.log('document type controller has been loaded');
  fadeInElement(document.querySelector('body'), 1000);
  // Initialize the loading screen
    
});
const objForm = new Form('documentTypeForm', 'edit-input');
const objTable = new Table('app-table',['id','username','role','status','assigned']);
const objModal = new bootstrap.Modal(document.getElementById('appModal'));
const objSelectUser = document.getElementById('user_id');
const objSelectRole = document.getElementById('role_id');
const objSelectStatus = document.getElementById('status_id');
const objSelectAssigned = document.getElementById('assigned_by');
const objTableBody = document.getElementById('app-table-body');
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
    endpointUrl = URL_USER_ROLE;
  } else {
    console.log("Update");
    httpMethod = METHODS[2]; // PUT method
    endpointUrl = URL_USER_ROLE + keyId;
  }
  documentData = objForm.getDataForm();
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
    endpointUrl = URL_USER_ROLE + id;
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
    });
  } else {
    console.log("cancel");
  }
}

function getDataId(id) {
  documentData = "";
  httpMethod = METHODS[0]; // GET method
  endpointUrl = URL_USER_ROLE + id;
  const resultServices = getDataServices(documentData, httpMethod, endpointUrl);
  resultServices.then(response => {
    return response.json();
  }).then(data => {
    console.log(data);
    let getData = data["data"];
    objForm.setDataFormJson(getData);
  }).catch(error => {
    console.log(error);
  }).finally(() => {
    //console.log("finally");
    showHiddenModal(true);
  });
}

function getData() {
  documentData = "";
  httpMethod = METHODS[0]; // GET method
  endpointUrl = URL_USER_ROLE;
  const resultServices = getDataServices(documentData, httpMethod, endpointUrl);
  resultServices.then(response => {
    return response.json();
  }).then(data => {
    //Create table 
    //console.log(data['data']);
    createTable(data);
  }).catch(error => {
    console.log(error);
  }).finally(() => {
    //console.log("finally");
    new DataTable(appTable);
    toggleLoading(false);
  });
}

function createTable(data) {
  objTable.loadData(data.data);
//   objTableBody.innerHTML = ""; // Clear previous table data
//   let getData = data['data'];
//   if (getData[0] === 0) return;//Validate if the data is empty
//   let rowLong = getData.length;
//   for (let i = 0; i < rowLong; i++) {
//     let row = getData[i];
//     let dataRow = `<tr>
// <td>${row.id}</td>
// <td>${row.name}</td>
// <td>${row.description}</td>
// <td>
// <button type="button" title="Button Show"class="btn btn-success" onclick="showId(${row.id})"><i class='fas fa-eye'></i></button>
// <button type="button"title="Button Edit" class="btn btn-primary" onclick="edit(${row.id})"><i class='fas fa-edit' ></i></button>
// <button type="button" title="Button Delete" class="btn btn-danger" onclick="delete_(${row.id})"><i class='fas fa-trash' ></i></button> `;
//     objTableBody.innerHTML += dataRow;
//   }
}

function showHiddenModal(type) {
  if (type) {
    objModal.show();
  } else {
    objModal.hide();
  }
}

function createSelect(data) {
  objSelectUser.innerHTML = "<option value='' selected disabled>Open this select menu</option>";

  let getData = data['data'];
  if (getData[0] === 0) return;//Validate if the data is empty
  let rowLong = getData.length;
  for (let i = 0; i < rowLong; i++) {
    let row = getData[i];
    let dataRow = `<option value="${row.id}">${row.username}</option>`;
    objSelectUser.innerHTML += dataRow;
  }
}
function createSelectAssigned(data) {
  objSelectAssigned.innerHTML = "<option value='' selected disabled>Open this select menu</option>";

  let getData = data['data'];
  if (getData[0] === 0) return;//Validate if the data is empty
  let rowLong = getData.length;
  for (let i = 0; i < rowLong; i++) {
    let row = getData[i];
    let dataRow = `<option value="${row.id}">${row.username}</option>`;
    objSelectAssigned.innerHTML += dataRow;
  }
}

function createSelectRole(data) {
  objSelectRole.innerHTML = "<option value='' selected disabled>Open this select menu</option>";

  let getData = data['data'];
  if (getData[0] === 0) return;//Validate if the data is empty
  let rowLong = getData.length;
  for (let i = 0; i < rowLong; i++) {
    let row = getData[i];
    let dataRow = `<option value="${row.id}">${row.name}</option>`;
    objSelectRole.innerHTML += dataRow;
  }
}

function createSelectStatus(data) {
  objSelectStatus.innerHTML = "<option value='' selected disabled>Open this select menu</option>";

  let getData = data['data'];
  if (getData[0] === 0) return;//Validate if the data is empty
  let rowLong = getData.length;
  for (let i = 0; i < rowLong; i++) {
    let row = getData[i];
    let dataRow = `<option value="${row.id}">${row.name}</option>`;
    objSelectStatus.innerHTML += dataRow;
  }
}

function getDataUser() {
  documentData = "";
  httpMethod = METHODS[0]; // GET method
  endpointUrl = URL_USER;
  const resultServices = getDataServices(documentData, httpMethod, endpointUrl);
  resultServices.then(response => {
    return response.json();
  }).then(data => {
    createSelect(data);
    createSelectAssigned(data);
  }).catch(error => {
    console.log(error);
  }).finally(() => {
    //console.log("finally");
    new DataTable(appTable);
    toggleLoading(false);
  });
}

function getDataRole() {
  documentData = "";
  httpMethod = METHODS[0]; // GET method
  endpointUrl = URL_ROLE;
  const resultServices = getDataServices(documentData, httpMethod, endpointUrl);
  resultServices.then(response => {
    return response.json();
  }).then(data => {
    createSelectRole(data);
  }).catch(error => {
    console.log(error);
  }).finally(() => {
    //console.log("finally");
    new DataTable(appTable);
    toggleLoading(false);
  });
}

function getDataStatus() {
  documentData = "";
  httpMethod = METHODS[0]; // GET method
  endpointUrl = URL_USER_STATUS;
  const resultServices = getDataServices(documentData, httpMethod, endpointUrl);
  resultServices.then(response => {
    return response.json();
  }).then(data => {
    createSelectStatus(data);
  }).catch(error => {
    console.log(error);
  }).finally(() => {
    //console.log("finally");
    new DataTable(appTable);
    toggleLoading(false);
  });
}

function loadView() {
  getData();
  toggleLoading(true);
}

window.addEventListener('load', () => {
  loadView();
  getDataUser();
  getDataRole();
  getDataStatus();
});

