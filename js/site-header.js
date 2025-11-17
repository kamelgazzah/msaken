class SiteHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/header.css">
      <div class="header">
        <div>
            <img src="img/tree.svg" alt="Arbre généalogique" width="40" height="40">
        </div>
        <h2>شجرة عائلات أهل القصور الخمسة، مساكن</h2>
        <h3>Msaken Family Tree, Tunisia</h3>
        <div>
            <p>by Kamel El-GAZZAH </p>
        </div>
        <div>
            <img src="img/tree.svg" alt="Arbre généalogique" width="40" height="40">
        </div>
      </div>

      <div id="popup-overlay" class="popup-overlay">
        <div id="popup-content" class="popup-content"></div>
      </div>

      <!-- Réseaux sociaux sous le header -->
      <div class="social-links-container">
        <a href="#" onclick="openPopup('popups/details.html')">
          <img src="img/about.svg" alt="À propos" width="40" height="40">
        </a>
        <a href="https://www.yfull.com/tree/J-L271/" target="_blank">
          <img src="img/yfull.png" width="40" height="40" alt="yfull">
        </a>
        <a href="https://www.facebook.com/kmlgzh" target="_blank" aria-label="Facebook" class="facebook">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M22 12a10 10 0 1 0-11 9.95V15h-2v-3h2v-2c0-2 1-3 3-3h2v3h-1c-1 0-1 .5-1 1v1h2l-1 3h-1v6.95A10 10 0 0 0 22 12z" />
          </svg>
        </a>
        <a href="https://www.facebook.com/groups/567910344161630">
          <img src="img/dna.svg" width="50" alt="Msaken DNA Facebook Group">
        </a>
        <a href="https://x.com/kemalgazzah" target="_blank" aria-label="X" class="x">
          <img src="img/x.svg" alt="X" width="40" height="40">
        </a>
        <a href="https://www.linkedin.com/in/kamel-gazzah/" target="_blank" aria-label="LinkedIn" class="linkedin">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M4 4h4v16H4V4zm6 0h4v2h.1c.5-.9 1.8-2 3.9-2 4 0 4.5 2.6 4.5 6v10h-4v-9c0-2-1-3-2.5-3S12 11 12 13v7h-4V4z" />
          </svg>
        </a>
        <a href="./" target="_blank" aria-label="Home" class="home">
          <img src="img/home.svg" alt="HomeX" width="40" height="40">
        </a>
      </div>
    `;
  }
}

customElements.define('site-header', SiteHeader);
