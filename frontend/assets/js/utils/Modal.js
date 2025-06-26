class Modal {
  constructor(modalSelector) {
    this.modal = document.getElementById(modalSelector);

    const closeBtn = this.modal.querySelector(".btn-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.hide());
    }
  }

  show() {
    this.modal.classList.add("show");
    this.modal.classList.remove("hide");
    this.modal.style.display = "block";
  }

  hide() {
    this.modal.classList.add("hide");
    this.modal.classList.remove("show");
    this.modal.style.display = "none";
  }

  toggle() {
    if (this.modal.style.display === "none" || !this.modal.classList.contains("show")) {
      this.show();
    } else {
      this.hide();
    }
  }
}
