

document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const sidebarToggle = document.getElementById('sidebarToggle');

  sidebarToggle.addEventListener('click', function () {
    if (window.innerWidth > 992) {
      sidebar.classList.toggle('sidebar-collapsed');
      mainContent.classList.toggle('content-expanded');
    } else {
      sidebar.classList.toggle('show');
    }
  });

  if (window.innerWidth <= 992) {
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('show');
      });
    });
  }

});
const iframe = document.getElementById('contentFrame');
iframe.addEventListener('load', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' }); // sube al inicio suavemente
});

function resizeIframe(iframe) {
    try {
      const contentDoc = iframe.contentDocument || iframe.contentWindow.document;
      const contentHeight = contentDoc.body.scrollHeight;
      iframe.style.height = contentHeight + 'px';
    } catch (e) {
      iframe.style.height = "100vh"; // fallback
    }
  }

  window.addEventListener("hashchange", () => {
    const iframe = document.getElementById("contentFrame");
    setTimeout(() => resizeIframe(iframe), 500);
  });

function logout() {
  localStorage.removeItem('token-app'); // O sessionStorage si usas eso
  window.location.href = './views/login/index.html'; // O a donde quieras redirigir
}
