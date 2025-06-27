class Form {
  constructor(idForm, classEditInput) {
    this.objForm = document.getElementById(idForm);
    this.classEdit = classEditInput;
    this.VALIDATIONS = {
      text: {
        messageError: "Please enter a valid text (3-20 alphanumeric characters)",
        regExp: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]{3,20}$/
      },
      number: {
        messageError: "Please enter a valid Number (0-9 numeric characters)",
        regExp: /^[0-9]*$/
      },
      email: {
        messageError: "Please enter a valid Email",
        regExp: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      },
      password: {
        messageError: "Password must: be 8-15 chars, have lowercase, uppercase, number, and special character ($@$!%*?&)",
        regExp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/
      },

    };
  }

  getForm() {
    return this.objForm;
  }

  validateForm() {
    const elementsForm = Array.from(this.objForm.querySelectorAll("input, select, textarea"));

    for (const element of elementsForm) {
      if (!element.classList.contains(this.classEdit))
        if (!this.validateInputs(element)) {
          // If any input is invalid, return false
          element.focus();
          return false;
        }
    }
    return true;
  };

  validateInputs(input) {
    if (input.id === 'token') return true;
    
    const type = input.type;
    const validation = this.VALIDATIONS[type];

    if (!validation) return true; // No validation rules for this type of input
    const isValid = validation.regExp.test(input.value.trim());

    if (!isValid) {
      input.classList.add("is-invalid");
      const spanError = input.parentNode.querySelectorAll("span");
      if (spanError.length == 0) {
        let objSpan = document.createElement("span");
        objSpan.classList.add("text-danger");
        objSpan.innerHTML = validation.messageError;
        input.parentNode.insertBefore(objSpan, input.nextSibling);
      } else {
        console.log(spanError[0].classList);
        spanError[0].classList.add("text-danger");
        spanError[0].innerHTML = validation.messageError;
      }
      return false;
    } else {
      input.classList.remove("is-invalid");
      const spanError = input.parentNode.querySelectorAll("span");
      if (spanError.length > 0) {
        spanError[0].classList.remove("text-danger");
        spanError[0].innerHTML = "";
      }
    }

    return isValid
  };

  getDataFormData() {
    const elementsForm = this.objForm.querySelectorAll('input, select, textarea');
    const formData = new FormData();

    elementsForm.forEach(function (element) {
      if (element.id) {
        if (element.tagName === 'INPUT') {
          if (element.type === 'checkbox') {
            formData.append(element.id, element.checked);
          } else if (element.type === 'file') {
            if (element.files.length > 0) {
              formData.append(element.id, element.files[0]); // ✅ AQUÍ está el archivo
            }
          } else {
            formData.append(element.id, element.value.trim());
          }
        } else if (element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
          formData.append(element.id, element.value.trim());
        }
      }
    });

    return formData;
  }

  setDataFormJson(json) {
    let elements = this.objForm.querySelectorAll("input,select,textarea");
    let jsonKeys = Object.keys(json);

    for (let i = 0; i < elements.length; i++) {
      let el = elements[i];

      if (el.type === "file") {
        // No hacer nada con archivos
        continue;
      }

      if (!jsonKeys.includes(el.id)) continue;

      if (el.type === "checkbox") {
        el.checked = json[el.id] == 1 || json[el.id] === true;
      } else if (el.tagName === "SELECT" || el.tagName === "TEXTAREA") {
        el.value = json[el.id];
      } else if (el.type === "date") {
        // ✨ Formatear fecha ISO a YYYY-MM-DD para input date
        el.value = new Date(json[el.id]).toISOString().split("T")[0];
      } else {
        el.value = json[el.id];
      }
    }
  }

  getDataForm() {
    var elementsForm = this.objForm.querySelectorAll('input, select, textarea');
    let getJson = {};
    elementsForm.forEach(function (element) {
      if (element.id) {
        if (element.tagName === 'INPUT') {
          if (element.type === 'checkbox') {
            getJson[element.id] = element.checked;
          } else {
            getJson[element.id] = element.value.trim();
          }
        } else if (element.tagName === 'SELECT') {
          getJson[element.id] = element.value.trim();
        } else if (element.tagName === 'TEXTAREA') {
          getJson[element.id] = element.value.trim();
        }
      }
    });
    return getJson;
  }

  resetForm() {
    let elementInput = this.objForm.querySelectorAll('input,select');
    let elementTextarea = this.objForm.querySelectorAll('textarea');
    for (let i = 0; i < elementInput.length; i++) {
      elementInput[i].value = "";
    }
    for (let j = 0; j < elementTextarea.length; j++) {
      elementTextarea[j].value = "";
    }
    this.objForm.reset();
  }

  disabledForm() {
    let elementInput = this.objForm.querySelectorAll('input,select');
    let elementTextarea = this.objForm.querySelectorAll('textarea');
    for (let i = 0; i < elementInput.length; i++) {
      elementInput[i].disabled = true;
    }
    for (let j = 0; j < elementTextarea.length; j++) {
      elementTextarea[j].disabled = true;
    }
    this.objForm.reset();
  }

  enabledForm() {
    let elementInput = this.objForm.querySelectorAll('input,select');
    let elementTextarea = this.objForm.querySelectorAll('textarea');
    for (let i = 0; i < elementInput.length; i++) {
      elementInput[i].disabled = false;
    }
    for (let j = 0; j < elementTextarea.length; j++) {
      elementTextarea[j].disabled = false;
    }
    this.objForm.reset();
  }

  enabledEditForm() {
    let elementInput = this.objForm.querySelectorAll('input,select');
    let elementTextarea = this.objForm.querySelectorAll('textarea');

    for (let i = 0; i < elementInput.length; i++) {
      if (elementInput[i].classList.contains(this.classEdit)) {
        elementInput[i].disabled = true;
      } else {
        elementInput[i].disabled = false;
      }
    }
    for (let j = 0; j < elementTextarea.length; j++) {
      elementTextarea[j].disabled = false;
      if (elementTextarea[j].classList.contains(this.classEdit)) {
        elementTextarea[j].disabled = true;
      } else {
        elementTextarea[j].disabled = false;
      }
    }
    this.objForm.reset();
  }

  disabledButton() {
    let elementButton = this.objForm.querySelectorAll('button');
    //console.log(elementButton);
    for (let i = 0; i < elementButton.length; i++) {
      elementButton[i].disabled = true;
    }
  }

  enabledButton() {
    let elementButton = this.objForm.querySelectorAll('button');
    for (let i = 0; i < elementButton.length; i++) {
      elementButton[i].disabled = false;
    }
  }

  hiddenButton() {
    let elementButton = this.objForm.querySelectorAll('button');
    for (let i = 0; i < elementButton.length; i++) {
      elementButton[i].style.display = "none";
    }
  }

  showButton() {
    let elementButton = this.objForm.querySelectorAll('button');
    for (let i = 0; i < elementButton.length; i++) {
      elementButton[i].style.display = "block";
    }
  }
}

