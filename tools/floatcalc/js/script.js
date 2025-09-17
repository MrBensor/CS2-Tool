// FloatCalc Hauptlogik
import { applyFilters, resetFilters } from './filter.js';
import { skins, getSkinByName } from './skins.js';
import { translations, setLanguage } from './lang.js';

// DOM Elements
const floatInputs = document.querySelectorAll('input.float-value');
const avgResult = document.getElementById('avgResult');
const finalFloatResult = document.getElementById('finalFloatResult');
const maxAvgResult = document.getElementById('maxAvgResult');
const skinSearch = document.getElementById('skinSearch');
const selectedSkinImg = document.getElementById('selectedSkinImg');

// Event Handlers
document.getElementById('calculateBtn').addEventListener('click', () => {
    const values = Array.from(floatInputs).map(input => parseFloat(input.value) || 0);
    const avg = values.reduce((a,b) => a+b, 0) / values.length;
    avgResult.textContent = `Avg: ${avg.toFixed(4)}`;
    finalFloatResult.textContent = `Final: ${Math.min(...values).toFixed(4)}`;
    maxAvgResult.textContent = `Max Avg: ${Math.max(...values).toFixed(4)}`;
});

// Language Switch
document.getElementById('langSelect').addEventListener('change', e => {
    setLanguage(e.target.value);
});

// Skin Search
skinSearch.addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    const results = skins.filter(s => s.name.toLowerCase().includes(query));
    displaySkinSuggestions(results);
});

function displaySkinSuggestions(suggestions) {
    const container = document.getElementById('skinSuggestions');
    container.innerHTML = '';
    suggestions.forEach(s => {
        const div = document.createElement('div');
        div.classList.add('suggestion');
        div.innerHTML = `
            <img src="${s.img}" class="skin-img">
            <div class="skin-info">
                <span class="skin-name">${s.name}</span>
                <span class="skin-float">${s.float.toFixed(4)}</span>
            </div>
        `;
        div.addEventListener('click', () => selectSkin(s));
        container.appendChild(div);
    });
    container.style.display = suggestions.length ? 'block' : 'none';
}

function selectSkin(skin) {
    selectedSkinImg.src = skin.img;
    selectedSkinImg.style.display = 'block';
    document.getElementById('skinSuggestions').style.display = 'none';
}
