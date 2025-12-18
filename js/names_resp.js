let namesData = [];
let currentPage = 1;

let ITEMS_PER_ROW = 4;  // initial, sera recalculé
const ROWS_PER_PAGE = 6; // fixe pour garder hauteur stable
const default_rows_per_page = 4;

const QSAR_COLORS = {
  "النجاجرة": "#4CAF50",   // vert
  "الجديديين": "#2196F3",  // bleu
  "الجبليين": "#FFC107",   // jaune
  "القبليين": "#F44336",   // rouge
  "المناعمة": "#9C27B0"    // violet
};

function normalizeArabic(text) {
  return text
    .normalize("NFC")
    .replace(/[\u064B-\u0652]/g, '') // supprime tashkīl
    .trim();
}

async function loadNamesData() {
  try {
    const response = await fetch('data/names.json');
    if (!response.ok) throw new Error('Fichier names.json introuvable');

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('JSON invalide : doit être un tableau');

    for (const item of data) {
      if (typeof item !== 'object' || typeof item.nom !== 'string' || typeof item.number !== 'number') {
        throw new Error('Structure des objets invalide');
      }
    }

    return data;
  } catch (err) {
    throw err;
  }
}

function updateGridColumns() {
  const container = document.getElementById('namesTable');
  if (window.innerWidth <= 600) ITEMS_PER_ROW = 2;
  else if (window.innerWidth <= 1024) ITEMS_PER_ROW = 5;
  else ITEMS_PER_ROW = default_rows_per_page;

  container.style.gridTemplateColumns = `repeat(${ITEMS_PER_ROW}, 1fr)`;
  renderPaginatedGrid(namesData, currentPage); // re-render avec le nouveau nb de colonnes
}

function renderPaginatedGrid(data, page) {
  const container = document.getElementById('namesTable');
  container.innerHTML = '';

  const ITEMS_PER_PAGE = ITEMS_PER_ROW * ROWS_PER_PAGE;
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageData = data.slice(start, end);

  pageData.forEach(item => {
    const div = document.createElement('div');
    div.className = 'name-cell';
    const hasLink =
      typeof item.tree_link === 'string' &&
      item.tree_link.trim() !== '';

    const nomHtml = hasLink
      ? `<a class="nom link"
         href="msaken_tree.html?tree=${encodeURIComponent(item.tree_link)}">
         ${item.nom}
       </a>`
      : `<div class="nom">${item.nom}</div>`;

    let qsarsHtml = '';

    if (Array.isArray(item.qsars) && item.qsars.length > 0) {
      qsarsHtml = `
      <div class="qsars">
        ${item.qsars.map(qsar => {
        //const color = QSAR_COLORS[qsar] || '#999';
        const normalizedQsar = normalizeArabic(qsar);
        const color = QSAR_COLORS[normalizedQsar] || '#999';

        return `
            <span class="qsar"
                  style="background-color:${color}">
              ${qsar}
            </span>`;
      }).join('')}
      </div>
    `;
    }

    div.innerHTML = `
    ${nomHtml}
    <div class="number">${item.number}</div>
    ${qsarsHtml}
  `;

    container.appendChild(div);
  });

  const maxPage = Math.ceil(data.length / ITEMS_PER_PAGE);
  document.getElementById('pageInfo').textContent = `Page ${currentPage} / ${maxPage}`;
}
function updateUrl() {
  const url = new URL(window.location);
  url.searchParams.set('page', currentPage);
  window.history.replaceState(null, '', url);
}
function nextPage() {
  const ITEMS_PER_PAGE = ITEMS_PER_ROW * ROWS_PER_PAGE;
  const maxPage = Math.ceil(namesData.length / ITEMS_PER_PAGE);
  if (currentPage < maxPage) {
    currentPage++;
    renderPaginatedGrid(namesData, currentPage);
    updateUrl(); // ← mettre à jour l'URL
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderPaginatedGrid(namesData, currentPage);
    updateUrl(); // ← mettre à jour l'URL
  }
}

function getPageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const pageParam = parseInt(params.get('page'), 10);
  return (pageParam && pageParam > 0) ? pageParam : 1;
}

async function init() {
  try {
    namesData = await loadNamesData();
    currentPage = getPageFromUrl(); // prend la page depuis l'URL
    updateGridColumns();            // render initial
  } catch (err) {
    document.getElementById('error').textContent = err.message;
  }
}

window.addEventListener('resize', updateGridColumns);
document.addEventListener('DOMContentLoaded', init);
