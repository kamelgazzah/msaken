// Fonction pour lire un cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Langue courante
let currentLang = getCookie('site_lang') || navigator.language.slice(0,2);

// Charger et afficher le contenu du dashboard
async function renderDashboard() {
  try {
    const res = await fetch('/private/data/dashboard.json');
    const data = await res.json();

    // Titre et description
    document.getElementById('dashboard-title').textContent =
      data.title[currentLang] || data.title['fr'];
    document.getElementById('dashboard-description').textContent =
      data.description[currentLang] || data.description['fr'];

    // Contenu principal
    const contentItems = document.getElementById('content-items');
    contentItems.innerHTML = '';
    data.content.forEach(item => {
      const block = document.createElement('div');
      block.className = 'content-block';

      const img = document.createElement('img');
      img.src = item.image;

      const p = document.createElement('p');
      p.textContent = item.text[currentLang] || item.text['fr'];

      block.appendChild(img);
      block.appendChild(p);
      contentItems.appendChild(block);
    });

    // Side info
    const sideInfo = document.getElementById('side-info');
    sideInfo.innerHTML = '';
    data.sideInfo.forEach(info => {
      const t = document.createElement('h4');
      t.textContent = info.title[currentLang] || info.title['fr'];

      const c = document.createElement('p');
      c.textContent = info.content[currentLang] || info.content['fr'];

      sideInfo.appendChild(t);
      sideInfo.appendChild(c);
    });

    // Footer
    const footer = document.getElementById('dashboard-footer');
    footer.textContent = data.footer[currentLang] || data.footer['fr'];

  } catch (err) {
    console.error('Erreur lors du chargement du dashboard:', err);
  }
}

// Initialiser
renderDashboard();
