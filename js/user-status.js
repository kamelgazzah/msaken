// user-status.js

async function showUserStatus() {
  const container = document.getElementById('user-status');
  if (!container) return;

  try {
    const res = await fetch('/api/profile'); // API privée
    if (!res.ok) throw new Error('Pas connecté');
    const user = await res.json();

    container.innerHTML = `
      <img src="${user.photos[0].value}" alt="User" style="width:40px; border-radius:50%;">
      <!--<span>${user.displayName}</span>-->
      <!--<a href="/logout" style="margin-left:10px;">Déconnexion</a>-->
    `;
  } catch (err) {
    // utilisateur non connecté
    container.innerHTML = `
      <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Anonyme" style="width:40px; border-radius:50%;">
      <!--<span>Invité</span>-->
      <!--<a href="/auth/google" style="margin-left:10px;">Se connecter</a>-->
    `;
  }
}

// Exécuter automatiquement
document.addEventListener('DOMContentLoaded', showUserStatus);
