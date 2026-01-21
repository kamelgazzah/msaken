// --------------------------------------
// Popup "About"
const about = () => {
    alert(`مشجّرة مساكن

هذا المشروع من إنجاز كمال القزّاح (Kamel El-GAZZAH) بهدف جمع شجرة عائلات مساكن في تونس. البيانات تم جمعها من أفراد العائلة و كتاب السّيّد محمود القزّاح ومصادر مختلفة.

يمكنك النقر على أي اسم في الشجرة لرؤية المزيد من التفاصيل حول الشخص، بما في ذلك والده وجدّه وصورته إن وجدت.

تم تطوير هذا المشروع باستخدام مكتبة Treant.js لعرض الشجرة بشكل تفاعلي.

للمزيد من المعلومات أو للمساهمة في توسيع الشجرة، يرجى التواصل معي عبر وسائل التواصل الاجتماعي المذكورة أعلاه.

شكراً لاهتمامكم!`);
};




function closePopup() {
    const overlay = document.getElementById('popup-overlay');
    const content = document.getElementById('popup-content');

    overlay.classList.remove('visible'); // animation fade-out
    setTimeout(() => {
        overlay.style.display = 'none';
        content.innerHTML = '';
    }, 150); // le temps de l'animation
}

window.openPopup =function (file) {
    const overlay = document.getElementById('popup-overlay');
    const content = document.getElementById('popup-content');

    // Affiche un loader pendant le fetch
    content.innerHTML =
        '<div class="popup-loader">⏳ تحميل…</div>';

    overlay.style.display = 'flex';

    fetch('popups/' + file)
        .then(res => {
            if (!res.ok) throw new Error("Fichier introuvable");
            return res.text();
        })
        .then(html => {
            content.innerHTML =
                '<button class="popup-close-btn" onclick="closePopup()">✖</button>' +
                html;

            // Animation d'apparition
            requestAnimationFrame(() => {
                overlay.classList.add('visible');
            });

            // fermer si clic extérieur
            const outsideClickHandler = (e) => {
                if (e.target === overlay) {
                    closePopup();
                }
            };

            overlay.addEventListener('click', outsideClickHandler, { once: true });

            // fermeture avec Escape
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === "Escape") {
                    closePopup();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        })
        .catch(err => {
            content.innerHTML =
                '<button class="popup-close-btn" onclick="closePopup()">✖</button>' +
                '<p style="color:red; font-weight:bold">Erreur : fichier introuvable.</p>';
        });
}

// --------------------------------------
// Gestion du popup
function closePopup2() {
    const old = document.querySelector('.popup-person');
    if (old) old.remove();
}
function showPersonPopup(person, event) {
    closePopup2(); // Ferme le popup actuel s'il existe déjà

    const popup = document.createElement('div');
    popup.className = 'popup-person';

    const pere = data.find(p => p.id === person.id_pere);
    const grandpere = pere ? data.find(p => p.id === pere.id_pere) : null;
    console.log('person:',person);
    popup.innerHTML = `<div style="direction: rtl; text-align: right; font-family: 'Amiri', 'Scheherazade', serif;">
        <div class="close-btn" onclick="closePopup2()">✖</div>
        <div>
        <h3>${person.nom}</h3>
        <div><strong>ID:</strong> ${person.id}</div>
        <div>${person.genre === 'M' ? 'رجل' : 'امرأة'}</div>
        <div><strong>الأب:</strong> ${pere ? pere.nom : ''}</div>
        <div><strong>الجدّ:</strong> ${grandpere ? grandpere.nom : ''}</div>
        <div>${person.comments}</div>
        ${person.photourl ? `<div style="margin-top:8px;"><img src="${person.photourl}" alt="${person.nom}" style="max-width:150px; border-radius:4px;"></div>` : ''}</div></div>`;

    document.body.appendChild(popup);

    /**  POSITIONNEMENT CORRIGÉ  **/
    const popupWidth  = 200;  // largeur popup estimée
    const popupHeight = 120;  // hauteur minimum

    // Position idéale en tenant compte du scroll horizontal ET vertical
    let left = event.clientX + window.scrollX + 10;
    let top  = event.clientY + window.scrollY + 10;

    // Empêcher le dépassement à droite
    left = Math.min(left, window.innerWidth + window.scrollX - popupWidth);

    // Empêcher le dépassement en bas
    top = Math.min(top, window.innerHeight + window.scrollY - popupHeight);

    // Empêcher dépassement à gauche
    left = Math.max(left, window.scrollX + 10);

    // Empêcher dépassement en haut
    top = Math.max(top, window.scrollY + 10);

    popup.style.left = left + "px";
    popup.style.top  = top  + "px";

    /**  FERMETURE SI CLIC A L'EXTÉRIEUR **/
    document.addEventListener(
        "click",
        function handler(e) {
            if (!popup.contains(e.target)) closePopup2();
        },
        { once: true }
    );
}


function showPersonPopup_2(person, event) {
    closePopup2();

    const popup = document.createElement("div");
    popup.className = "popup-person";

    const pere = data.find(p => p.id === person.id_pere);
    const grandpere = pere ? data.find(p => p.id === pere.id_pere) : null;

    popup.innerHTML = `
        <div class="close-btn" onclick="closePopup2()">✖</div>
        <h3>${person.nom}</h3>
        <div><strong>ID:</strong> ${person.id}</div>
        <div>${person.genre === "M" ? "رجل" : "امرأة"}</div>
        <div><strong>الأب:</strong> ${pere ? pere.nom : "محمّد الجدّ الجامع لأهل مساكن"}</div>
        <div><strong>الجدّ:</strong> ${grandpere ? grandpere.nom : "محمّد الجدّ الجامع لأهل مساكن"}</div>
        ${person.photourl ? `<div style="margin-top:8px;"><img src="${person.photourl}" alt="${person.nom}" style="max-width:150px; border-radius:4px;"></div>` : ''}
    `;

    document.body.appendChild(popup);

    // 🟡 NODE EXACT
    const nodeEl = document.getElementById("node-" + person.id);
    const rect = nodeEl.getBoundingClientRect();

    // 🟡 SCROLLS
    const tree = document.getElementById("tree");
    const treeScrollX = tree.scrollLeft;
    const treeScrollY = tree.scrollTop;

    // 🟡 SCROLL DE LA PAGE
    const pageScrollX = window.scrollX;
    const pageScrollY = window.scrollY;

    // ⭐ POSITION CORRECTE (formule finale)
    let left = rect.left + treeScrollX + pageScrollX + nodeEl.offsetWidth + 10;
    let top  = rect.top  + treeScrollY + pageScrollY;

    // ⚠ Protection bord droite
    if (left + popup.offsetWidth > window.innerWidth) {
        left = rect.left + treeScrollX + pageScrollX - popup.offsetWidth - 10;
    }

    popup.style.position = "absolute";
    popup.style.left = left + "px";
    popup.style.top  = top + "px";
    popup.style.zIndex = 99999;

    document.addEventListener("click", function handler(e) {
        if (!popup.contains(e.target)) closePopup2();
    }, { once: true });
}

function showPersonPopup_old(person, event) {
    closePopup2();
    const popup = document.createElement('div');
    popup.className = 'popup-person';
    const pere = data.find(p => p.id === person.id_pere);
    const grandpere = pere ? data.find(p => p.id === pere.id_pere) : null;

    popup.innerHTML = `
        <div class="close-btn" onclick="closePopup2()">✖</div>
        <h3>${person.nom}</h3>
        <div><strong>ID:</strong> ${person.id}</div>
        <div>${person.genre === 'M' ? 'رجل' : 'امرأة'}</div>
        <div><strong>الأب:</strong> ${pere ? pere.nom : 'محمّد الجدّ الجامع لأهل مساكن'}</div>
        <div><strong>الجدّ:</strong> ${grandpere ? grandpere.nom : 'محمّد الجدّ الجامع لأهل مساكن'}</div>
        ${person.photourl ? `<div style="margin-top:8px;"><img src="${person.photourl}" alt="${person.nom}" style="max-width:150px; border-radius:4px;"></div>` : ''}`;

    // Positionnement avec un décalage
    popup.style.left = Math.min(event.pageX + 10, window.innerWidth - 200) + 'px';
    popup.style.top = Math.min(event.pageY + 10, window.innerHeight - 100) + 'px';
    document.body.appendChild(popup);

    // Fermer le popup si clic en dehors
    document.addEventListener('click', function handler(e) {
        if (!popup.contains(e.target)) closePopup2();
    }, { once: true });
}
function initHiddenNodes(rootId) {
    // Récupère hiddenNodes depuis localStorage
    let hiddenNodes = new Set(JSON.parse(localStorage.getItem('hiddenNodes') || '[]'));

    if (hiddenNodes.size === 0) {
        // Ajouter tous les IDs sauf rootId
        data.forEach(p => {
            if (p.id !== rootId) hiddenNodes.add(p.id);
        });
        // Sauvegarder dans localStorage
        localStorage.setItem('hiddenNodes', JSON.stringify([...hiddenNodes]));
    }

    return hiddenNodes;
}


// --------------------------------------
// Gestion des nœuds cachés
function loadHiddenNodes() {
    try {
        const rootId = data.find(p => p.id_pere === null)?.id;
        let hiddenNodes = initHiddenNodes(rootId);
        return hiddenNodes;
    }
    catch { return new Set([-15]); }
}

function saveHiddenNodes() {
    localStorage.setItem('hiddenNodes', JSON.stringify([...hiddenNodes]));
}



const buildTree = (nodeId, parentHidden = false) => {
    const node = data.find(p => p.id === nodeId);
    if (!node) return null;

    const isHidden = hiddenNodes.has(nodeId) || parentHidden;

    const children = data
        .filter(p => p.id_pere === nodeId)
        .filter(c => !isHidden); // exclut tous les enfants si parent caché

    return {
        text: { name: node.nom },
        image: node.imageurl || null,
        HTMLclass: node.genre === "M" ? "node male" : "node female",
        HTMLid: "node-" + node.id,
        
        children: children.map(c => buildTree(c.id, isHidden))
    };
};

// --------------------------------------
// Fonction utilitaire pour créer le bouton toggle
function createToggleButton(el, nodeId) {
    // Vérifie si le nœud a des enfants
    if (!data.some(c => c.id_pere === nodeId)) return;

    const btn = document.createElement('button');
    btn.className = 'toggle-btn';           // applique la classe CSS
    btn.textContent = hiddenNodes.has(nodeId) ? '+' : '−';

    btn.addEventListener('click', e => {
        e.stopPropagation();
        if (hiddenNodes.has(nodeId)) hiddenNodes.delete(nodeId);
        else hiddenNodes.add(nodeId);

        saveHiddenNodes();
        drawTree(nodeId);                    // redraw + recentre
    });

    el.appendChild(btn);
}

// --------------------------------------
// Dessin de l'arbre
function drawTree(recenterId = null) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        showDataUnavailable();
        return;
    }
    document.getElementById('tree').innerHTML = '';
    const chart_config = {
        chart: {
            container: "#tree",
            nodeHTMLTemplate: "nodeTemplate",
            rootOrientation: "NORTH",
            connectors: { type: "step" },
            nodeAlign: "CENTER",
            levelSeparation: 25,
            siblingSeparation: 7,
            subTeeSeparation: 40,
            animateOnInit: false,
            callback: {
                onTreeLoaded: () => {
                    data.forEach(p => {
                        const el = document.getElementById("node-" + p.id);
                        if (!el) return;

                        // Appliquer style pour les nœuds dont les enfants sont cachés
                        if (hiddenNodes.has(p.id)) el.classList.add('has-hidden-children');
                        else el.classList.remove('has-hidden-children');

                        // Popup au clic
                        el.addEventListener('click', e => {
                            e.stopPropagation();
                            showPersonPopup(p, e);
                        });

                        // Bouton toggle
                        createToggleButton(el, p.id);
                    });

                    // Recentrage
                    if (recenterId) {
                        const targetNode = document.getElementById("node-" + recenterId);
                        if (targetNode) {
                            targetNode.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
                        }
                    }
                }
            }
        },
        nodeStructure: buildTree(rootId)
    };
    new Treant(chart_config);
}

// -------------------------
// Affiche un message Data unavailable
function showDataUnavailable() {
    const container = document.getElementById('tree');
    container.innerHTML = '<div style="padding:20px; text-align:center; color:red; font-weight:bold;">ستضاف لاحقا</div>';
}

// --------------------------------------
// Initialisation
let data = null;

async function loadData() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const treeName = urlParams.get("tree") || "msaken";
        console.log('treeName',treeName)
        const jsonFile = `data/${treeName}.json?id=3707`; // cache-buster
        console.log(`🔄 Chargement du fichier JSON : ${jsonFile}`);

        const response = await fetch(jsonFile);

        if (!response.ok) {
            console.error(`❌ Fichier JSON introuvable : ${jsonFile}`);
            showDataUnavailable();
            return null;
        }

        const json = await response.json().catch(err => {
            console.error("❌ JSON invalide", err);
            showDataUnavailable();
            return null;
        });

        if (!Array.isArray(json) || json.length === 0) {
            console.error("❌ JSON vide ou non conforme", json);
            showDataUnavailable();
            return null;
        }

        data = json;
        rootId = data.find(p => p.id_pere === null)?.id;

        if (!rootId) {
            console.error("❌ Impossible de trouver le rootId");
            showDataUnavailable();
            return null;
        }

        hiddenNodes = loadHiddenNodes();
        drawTree(rootId);
        return data;

    } catch (error) {
        console.error("❌ ERREUR loadData():", error);
        showDataUnavailable();
        return null;
    }
}

loadData();


