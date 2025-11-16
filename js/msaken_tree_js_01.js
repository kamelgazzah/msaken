// === A propos ===
const about = () => {
    alert("مشجّرة مساكن\n\nهذا المشروع من إنجاز كمال القزّاح (Kamel El-GAZZAH) بهدف جمع شجرة عائلات مساكن في تونس. البيانات تم جمعها من أفراد العائلة و كتاب السّيّد محمود القزّاح ومصادر مختلفة.\n\nيمكنك النقر على أي اسم في الشجرة لرؤية المزيد من التفاصيل حول الشخص، بما في ذلك والده وجدّه وصورته إن وجدت.\n\nتم تطوير هذا المشروع باستخدام مكتبة Treant.js لعرض الشجرة بشكل تفاعلي.\n\nللمزيد من المعلومات أو للمساهمة في توسيع الشجرة، يرجى التواصل معي عبر وسائل التواصل الاجتماعي المذكورة أعلاه.\n\nشكراً لاهتمامكم!");
}

// === Popup personne ===
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
        ${person.photourl ? `<div style="margin-top:8px;"><img src="${person.photourl}" alt="${person.nom}" style="max-width:150px; border-radius:4px;"></div>` : ''}`;

    popup.style.left = (event.pageX + 10) + 'px';
    popup.style.top = (event.pageY + 10) + 'px';
    document.body.appendChild(popup);

    document.addEventListener('click', function handler(e) {
        if (!popup.contains(e.target)) {
            closePopup();
            document.removeEventListener('click', handler);
        }
    });
}

// === Root ===
const rootId = data.find(p => p.id_pere === null)?.id;

// === Stockage des nœuds cachés ===
let hiddenNodesDirect = new Set(JSON.parse(localStorage.getItem('hiddenNodesDirect') || '[-15]'));
let hiddenNodesDeep = new Set(JSON.parse(localStorage.getItem('hiddenNodesDeep') || '[]'));

function saveHiddenNodes() {
    localStorage.setItem('hiddenNodesDirect', JSON.stringify([...hiddenNodesDirect]));
    localStorage.setItem('hiddenNodesDeep', JSON.stringify([...hiddenNodesDeep]));
}

// === Build Tree ===
const buildTree = (nodeId, isDeepHidden = false) => {
    const root = data.find(p => p.id === nodeId);
    if (!root) return null;

    const children = data
        .filter(c => c.id_pere === root.id)
        .filter(c => !hiddenNodesDirect.has(root.id))   // cache enfants directs
        .filter(c => !isDeepHidden && !hiddenNodesDeep.has(root.id)); // cache tous descendants si deep

    return {
        text: { name: root.nom },
        HTMLclass: root.genre === "M" ? "node male" : "node female",
        HTMLid: "node-" + root.id,
        children: children.map(c => buildTree(c.id, hiddenNodesDeep.has(root.id)))
    };
}

// === Créer les boutons toggle ===
function createToggleButtons(el, nodeId) {
    // Vérifie s'il y a au moins un enfant
    if (!data.some(c => c.id_pere === nodeId)) return;

    const container = document.createElement('div');
    container.className = 'toggle-btn-container';

    // + / − → enfants directs
    const btn = document.createElement('button');
    btn.className = 'toggle-btn';
    btn.textContent = hiddenNodesDirect.has(nodeId) ? '+' : '−';
    btn.addEventListener('click', e => {
        e.stopPropagation();
        if (hiddenNodesDirect.has(nodeId)) hiddenNodesDirect.delete(nodeId);
        else hiddenNodesDirect.add(nodeId);
        saveHiddenNodes();
        drawTree(nodeId);
    });
    container.appendChild(btn);

    // ++ / −− → tous descendants
    const btnDeep = document.createElement('button');
    btnDeep.className = 'toggle-btn';
    btnDeep.textContent = hiddenNodesDeep.has(nodeId) ? '−−' : '++';
    btnDeep.addEventListener('click', e => {
        e.stopPropagation();
        if (hiddenNodesDeep.has(nodeId)) hiddenNodesDeep.delete(nodeId);
        else hiddenNodesDeep.add(nodeId);
        saveHiddenNodes();
        drawTree(nodeId);
    });
    container.appendChild(btnDeep);

    el.appendChild(container);
}

// === Draw Tree ===
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
                        if (el) {
                            // Style si enfants cachés
                            if (hiddenNodesDirect.has(p.id) || hiddenNodesDeep.has(p.id)) {
                                el.classList.add('has-hidden-children');
                            } else {
                                el.classList.remove('has-hidden-children');
                            }

                            // Popup
                            el.addEventListener('click', e => {
                                e.stopPropagation();
                                showPersonPopup(p, e);
                            });

                            // Boutons + et ++
                            createToggleButtons(el, p.id);
                        }
                    });

                    // Recentre
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

// === Initialisation ===
const targetId = -17;
drawTree(targetId);
