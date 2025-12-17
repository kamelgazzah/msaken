let namesData = [];
let currentPage = 1;

const ITEMS_PER_ROW = 10;
const ROWS_PER_PAGE = 20;
const ITEMS_PER_PAGE = ITEMS_PER_ROW * ROWS_PER_PAGE;

async function loadNamesData() {
  try {
    const response = await fetch('/data/names.json');

    if (!response.ok) {
      throw new Error('Erreur : fichier names.json introuvable');
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Erreur : le JSON doit être un tableau');
    }

    for (const item of data) {
      if (
        typeof item !== 'object' ||
        typeof item.nom !== 'string' ||
        typeof item.number !== 'number'
      ) {
        throw new Error('Erreur : structure des données invalide');
      }
    }

    return data;

  } catch (err) {
    throw err;
  }
}

function renderPaginatedTable(data, page) {
  const table = document.getElementById('namesTable');
  table.innerHTML = '';

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageData = data.slice(start, end);

  let row;

  pageData.forEach((item, index) => {
    if (index % ITEMS_PER_ROW === 0) {
      row = table.insertRow();
    }

    const cell = row.insertCell();
    cell.innerHTML = `
      <div class="name-cell">
        <div class="nom">${item.nom}</div>
        <div class="number">${item.number}</div>
      </div>
    `;
  });

  document.getElementById('pageInfo').textContent =
    `Page ${currentPage} / ${Math.ceil(data.length / ITEMS_PER_PAGE)}`;
}

function nextPage() {
  const maxPage = Math.ceil(namesData.length / ITEMS_PER_PAGE);
  if (currentPage < maxPage) {
    currentPage++;
    renderPaginatedTable(namesData, currentPage);
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderPaginatedTable(namesData, currentPage);
  }
}

async function init() {
  try {
    namesData = await loadNamesData();
    renderPaginatedTable(namesData, currentPage);
  } catch (err) {
    document.getElementById('error').textContent = err.message;
  }
}

document.addEventListener('DOMContentLoaded', init);
