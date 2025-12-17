let namesData = [];
let currentPage = 1;

let ITEMS_PER_ROW = 5;  // initial, sera recalculé
const ROWS_PER_PAGE = 8; // fixe pour garder hauteur stable
const default_rows_per_page = 5;

async function loadNamesData() {
  try {
    const response = await fetch('/data/names.json');
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
    div.innerHTML = `<div class="nom">${item.nom}</div><div class="number">${item.number}</div>`;
    container.appendChild(div);
  });

  const maxPage = Math.ceil(data.length / ITEMS_PER_PAGE);
  document.getElementById('pageInfo').textContent = `Page ${currentPage} / ${maxPage}`;
}

function nextPage() {
  const ITEMS_PER_PAGE = ITEMS_PER_ROW * ROWS_PER_PAGE;
  const maxPage = Math.ceil(namesData.length / ITEMS_PER_PAGE);
  if (currentPage < maxPage) {
    currentPage++;
    renderPaginatedGrid(namesData, currentPage);
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderPaginatedGrid(namesData, currentPage);
  }
}

async function init() {
  try {
    namesData = await loadNamesData();
    updateGridColumns();
  } catch (err) {
    document.getElementById('error').textContent = err.message;
  }
}

window.addEventListener('resize', updateGridColumns);
document.addEventListener('DOMContentLoaded', init);
