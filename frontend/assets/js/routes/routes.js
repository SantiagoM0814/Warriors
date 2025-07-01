document.addEventListener('DOMContentLoaded', async function() {
const contentFrame = document.getElementById('contentFrame');
  document.querySelector('body').style.display = 'none';
  document.querySelector('body').style.opacity = 0;
await checkAuth();
console.log('Content controller has been loaded');
fadeInElement(document.querySelector('body'), 1000);

/*Routes for the application*/
const routes = {
  '#warrior': 'views/warrior/index.html',
  '#game': 'views/game/index.html',
  '#player': 'views/player/index.html',
  '#power': 'views/power/index.html',
  '#magic': 'views/magic/index.html'
};

function loadContent() {
  const hash = window.location.hash || '#game';
  const viewPath = routes[hash] || routes['#game'];
  contentFrame.src = viewPath;
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === hash);
  });
}

loadContent();
window.addEventListener('hashchange', loadContent);

});