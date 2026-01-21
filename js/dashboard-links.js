// Fonction pour lire un cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Détecte la langue courante
let currentLang = getCookie('site_lang') || navigator.language.slice(0, 2);

// Fonction pour charger et afficher les liens
async function renderLinks() {
    try {
        const res = await fetch('/private/data/dashboard.json');
        const data = await res.json();

        const linksContainer = document.getElementById('links');
        linksContainer.innerHTML = '';

        data.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            // Titre selon la langue, fallback sur FR si pas disponible
            a.textContent = link.title[currentLang] || link.title['fr'];
            a.target = '_blank';
            linksContainer.appendChild(a);
        });

        // Appliquer RTL si arabe
        if (currentLang === 'ar') {
            linksContainer.classList.add('rtl');
        } else {
            linksContainer.classList.remove('rtl');
        }

    } catch (err) {
        console.error('Erreur lors du chargement des liens dashboard:', err);
    }
}

// Initialiser
renderLinks();
