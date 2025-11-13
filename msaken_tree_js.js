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

// --------------------------------------
// Gestion du popup
function closePopup() {
    const old = document.querySelector('.popup-person');
    if (old) old.remove();
}

function showPersonPopup(person, event) {
    closePopup();
    const popup = document.createElement('div');
    popup.className = 'popup-person';
    const pere = data.find(p => p.id === person.id_pere);
    const grandpere = pere ? data.find(p => p.id === pere.id_pere) : null;

    popup.innerHTML = `
        <div class="close-btn" onclick="closePopup()">✖</div>
        <h3>${person.nom}</h3>
        <div><strong>ID:</strong> ${person.id}</div>
        <div>${person.genre === 'M' ? 'رجل' : 'امرأة'}</div>
        <div><strong>الأب:</strong> ${pere ? pere.nom : 'محمّد الجدّ الجامع لأهل مساكن'}</div>
        <div><strong>الجدّ:</strong> ${grandpere ? grandpere.nom : 'محمّد الجدّ الجامع لأهل مساكن'}</div>
        ${person.photourl ? `<div style="margin-top:8px;"><img src="${person.photourl}" alt="${person.nom}" style="max-width:150px; border-radius:4px;"></div>` : ''}
    `;

    // Positionnement avec un décalage
    popup.style.left = Math.min(event.pageX + 10, window.innerWidth - 200) + 'px';
    popup.style.top = Math.min(event.pageY + 10, window.innerHeight - 200) + 'px';
    document.body.appendChild(popup);

    // Fermer le popup si clic en dehors
    document.addEventListener('click', function handler(e) {
        if (!popup.contains(e.target)) closePopup();
    }, { once: true });
}

// --------------------------------------
// Gestion des nœuds cachés
function loadHiddenNodes() {
    try {
        return new Set(JSON.parse(localStorage.getItem('hiddenNodes') || '[-15]'));
    } catch {
        return new Set([-15]);
    }
}

function saveHiddenNodes() {
    localStorage.setItem('hiddenNodes', JSON.stringify([...hiddenNodes]));
}

let hiddenNodes = loadHiddenNodes();

// --------------------------------------
// Construction de l'arbre
const rootId = data.find(p => p.id_pere === null)?.id;

const buildTree = (rootId) => {
    const root = data.find(p => p.id === rootId);
    if (!root) return null;

    const children = data
        .filter(p => p.id_pere === root.id)
        .filter(c => !hiddenNodes.has(root.id)); // cacher si parent est caché

    return {
        text: { name: root.nom },
        HTMLclass: root.genre === "M" ? "node male" : "node female",
        HTMLid: "node-" + root.id,
        children: children.map(c => buildTree(c.id))
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
    document.getElementById('tree').innerHTML = '';
    const chart_config = {
        chart: {
            container: "#tree",
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

// --------------------------------------
// Initialisation
const targetId = -17;
drawTree(targetId);
