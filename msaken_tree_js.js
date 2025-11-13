const about = () => {
    alert("مشجّرة مساكن\n\nهذا المشروع من إنجاز كامل القزّاح (Kamel El-GAZZAH) بهدف جمع شجرة عائلة مساكن في تونس. البيانات تم جمعها من أفراد العائلة و كتاب السّيّد محمود القزّاح ومصادر مختلفة.\n\nيمكنك النقر على أي اسم في الشجرة لرؤية المزيد من التفاصيل حول الشخص، بما في ذلك والده وجدّه وصورته إن وجدت.\n\nتم تطوير هذا المشروع باستخدام مكتبة Treant.js لعرض الشجرة بشكل تفاعلي.\n\nللمزيد من المعلومات أو للمساهمة في توسيع الشجرة، يرجى التواصل معي عبر وسائل التواصل الاجتماعي المذكورة أعلاه.\n\nشكراً لاهتمامكم!");
}


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

const rootId = data.find(p => p.id_pere === null)?.id;

// Récupère la liste des nœuds à cacher depuis localStorage
let hiddenNodes = new Set(JSON.parse(localStorage.getItem('hiddenNodes') || '[]'));

function buildTree(rootId) {
    const root = data.find(p => p.id === rootId);
    if (!root) return null;
    const children = data.filter(p => p.id_pere === root.id);

    return {
        text: { name: root.nom },
        HTMLclass: root.genre === "M" ? "node male" : "node female",
        HTMLid: "node-" + root.id,
        children: hiddenNodes.has(root.id) ? [] : children.map(c => buildTree(c.id))
    };
}

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
                            // ✅ Appliquer le style si le nœud a des enfants cachés
                            if (hiddenNodes.has(p.id)) {
                                el.classList.add('has-hidden-children');
                            } else {
                                el.classList.remove('has-hidden-children');
                            }
                            el.addEventListener('click', e => {
                                e.stopPropagation();
                                showPersonPopup(p, e);
                            });

                            // Ajouter le bouton ±
                            const btn = document.createElement('button');
                            btn.className = 'toggle-btn';
                            btn.textContent = hiddenNodes.has(p.id) ? '+' : '−';

                            btn.addEventListener('click', e => {
                                e.stopPropagation();
                                const nodeId = p.id;

                                // Vérifier si le nœud a des enfants
                                if (!data.some(c => c.id_pere === nodeId)) return;

                                // Toggle et mise à jour du Set
                                if (hiddenNodes.has(nodeId)) {
                                    hiddenNodes.delete(nodeId);
                                } else {
                                    hiddenNodes.add(nodeId);
                                }

                                // Stocker dans localStorage
                                localStorage.setItem('hiddenNodes', JSON.stringify([...hiddenNodes]));

                                drawTree(nodeId); // redraw + recentre
                            });

                            el.appendChild(btn);
                        }
                    });

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





// ✅ au premier chargement : recentrage sur un id spécifique
const targetId = -17;
drawTree(targetId);