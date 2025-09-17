// --- GLOBALE VARIABLEN ---
let currentLang = 'en'; // Standardsprache ist Englisch
let avgFloat = null;

// --- TAB LOGIC ---
const tabFloat = document.getElementById('tabFloat');
const tabAvg = document.getElementById('tabAvg');
const tabContentFloat = document.getElementById('tabContentFloat');
const tabContentAvg = document.getElementById('tabContentAvg');

tabFloat.addEventListener('click', () => {
    tabContentFloat.style.display = '';
    tabContentAvg.style.display = 'none';
    tabFloat.classList.add('active');
    tabAvg.classList.remove('active');
});

tabAvg.addEventListener('click', () => {
    tabContentFloat.style.display = 'none';
    tabContentAvg.style.display = '';
    tabAvg.classList.add('active');
    tabFloat.classList.remove('active');
});

// --- FLOAT INPUTS & WEAR LABELS ---
const floatInputsDiv = document.getElementById('floatInputs');

// Nutze Übersetzungen aus lang.js
function getWearRatingShort(floatVal) {
    const wear = translations[currentLang].wearShort;
    if (floatVal < 0.07) return wear[0];
    if (floatVal < 0.15) return wear[1];
    if (floatVal < 0.38) return wear[2];
    if (floatVal < 0.45) return wear[3];
    if (floatVal <= 1.0) return wear[4];
    return '';
}

function getWearRating(floatVal) {
    const wear = translations[currentLang].wearFull;
    if (floatVal >= 0 && floatVal < 0.07) return wear[0];
    if (floatVal >= 0.07 && floatVal < 0.15) return wear[1];
    if (floatVal >= 0.15 && floatVal < 0.38) return wear[2];
    if (floatVal >= 0.38 && floatVal < 0.45) return wear[3];
    if (floatVal >= 0.45 && floatVal <= 1.0) return wear[4];
    return '';
}

// Generate float inputs with labels
function createFloatInputs() {
    floatInputsDiv.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '8px';

        const input = document.createElement('input');
        input.type = 'number';
        input.step = 'any';
        input.id = `float${i}`;
        input.name = `float${i}`;
        input.placeholder = `${i}.`;
        input.style.flex = '1';

        const label = document.createElement('span');
        label.id = `wearLabel${i}`;
        label.style.minWidth = '38px';
        label.style.fontWeight = 'bold';
        label.style.color = '#43b581';

        input.addEventListener('input', () => {
            const val = parseFloat(input.value);
            label.textContent = !isNaN(val) ? '= ' + getWearRatingShort(val) : '';
        });

        wrapper.appendChild(input);
        wrapper.appendChild(label);
        floatInputsDiv.appendChild(wrapper);
    }
}

// --- CALCULATE AVERAGE ---
document.getElementById('calcAvgBtn').addEventListener('click', () => {
    let sum = 0, count = 0;
    for (let i = 1; i <= 10; i++) {
        const val = parseFloat(document.getElementById(`float${i}`).value);
        if (!isNaN(val)) { sum += val; count++; }
    }
    if (count === 10) {
        avgFloat = sum / 10;
        document.getElementById('avgResult').textContent = `${translations[currentLang].avgResultText} ${avgFloat.toFixed(6)}`;
    } else {
        avgFloat = null;
        document.getElementById('avgResult').textContent = translations[currentLang].avgErrorText;
    }
});

// --- MAX/MIN CAP CALCULATION ---
document.getElementById('calcFloatBtn').addEventListener('click', () => {
    const maxCap = parseFloat(document.getElementById('maxCap').value);
    const minCap = parseFloat(document.getElementById('minCap').value);
    if (isNaN(maxCap) || isNaN(minCap)) {
        document.getElementById('finalFloatResult').textContent = translations[currentLang].capErrorText;
        return;
    }
    if (avgFloat === null) {
        document.getElementById('finalFloatResult').textContent = translations[currentLang].avgFirstErrorText;
        return;
    }
    const resultFloat = (maxCap - minCap) * avgFloat + minCap;
    document.getElementById('finalFloatResult').textContent = `${translations[currentLang].finalResultText} ${resultFloat.toFixed(6)} (${getWearRating(resultFloat)})`;
});

// --- LANGUAGE ---
const langSelect = document.getElementById('langSelect');

// Sprache ändern
langSelect.addEventListener('change', function() {
    currentLang = this.value;
    setLang(currentLang);
    applyTranslations(currentLang);
    fetchSkins(currentLang).then(() => {
        updateFilterOptions();
    });

    // Update all current floats to show correct =FN / etc. in new language
    for (let i = 1; i <= 10; i++) {
        const val = parseFloat(document.getElementById(`float${i}`).value);
        document.getElementById(`wearLabel${i}`).textContent = !isNaN(val) ? '= ' + getWearRatingShort(val) : '';
    }

    // Update result texts if they exist
    if (document.getElementById('avgResult').textContent) {
        document.getElementById('calcAvgBtn').click();
    }
    if (document.getElementById('finalFloatResult').textContent) {
        document.getElementById('calcFloatBtn').click();
    }
});

// Funktion zum Berechnen des maximalen Durchschnitts-Floats
function calculateMaxAvgFloat() {
    const targetFloat = parseFloat(document.getElementById('targetFloat').value);
    const maxCap2Val = parseFloat(document.getElementById('maxCap2').value);
    const minCap2Val = parseFloat(document.getElementById('minCap2').value);

    if (isNaN(targetFloat) || isNaN(maxCap2Val) || isNaN(minCap2Val)) {
        document.getElementById('maxAvgResult').textContent = translations[currentLang].skinSelectErrorText;
        return;
    }

    let wearName = '';
    // Compare exact values, do not round
    if (targetFloat === 0.0699999) wearName = translations[currentLang].wearFull[0];
    else if (targetFloat === 0.1499999) wearName = translations[currentLang].wearFull[1];
    else if (targetFloat === 0.3799999) wearName = translations[currentLang].wearFull[2];
    else if (targetFloat === 0.4499999) wearName = translations[currentLang].wearFull[3];
    else if (targetFloat === 1.00) wearName = translations[currentLang].wearFull[4];

    const maxAvg = (targetFloat - minCap2Val) / (maxCap2Val - minCap2Val);
    document.getElementById('maxAvgResult').textContent = `${translations[currentLang].maxAvgResultText} ${wearName} (${targetFloat}): ${maxAvg.toFixed(6)}`;
}

// Sprache aus URL oder localStorage holen
function getLang() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lang') || localStorage.getItem('lang') || 'en'; // Standard ist Englisch
}

function setLang(lang) {
    localStorage.setItem('lang', lang);
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
}

function applyTranslations(lang) {
    const t = translations[lang];
    document.title = t.titleTag;
    document.getElementById('titleTag').textContent = t.titleTag;
    document.getElementById('mainTitle').textContent = t.mainTitle;
    document.getElementById('langLabel').textContent = t.langLabel;
    document.getElementById('tabFloat').textContent = t.tabFloat;
    document.getElementById('tabAvg').textContent = t.tabAvg;
    document.getElementById('floatStep1').textContent = t.floatStep1;
    document.getElementById('calcAvgBtn').textContent = t.calcAvgBtn;
    document.getElementById('floatStep2').textContent = t.floatStep2;
    document.getElementById('maxCapLabel').textContent = t.maxCapLabel;
    document.getElementById('minCapLabel').textContent = t.minCapLabel;
    document.getElementById('calcFloatBtn').textContent = t.calcFloatBtn;
    document.getElementById('avgStep2').textContent = t.avgStep2;
    document.getElementById('skinSearchLabel').textContent = t.skinSearchLabel;
    document.getElementById('skinSearch').placeholder = t.skinSearchPlaceholder;
    document.getElementById('targetFloatLabel').textContent = t.targetFloatLabel;
    document.getElementById('optFactoryNew').textContent = t.optFactoryNew;
    document.getElementById('optMinimalWear').textContent = t.optMinimalWear;
    document.getElementById('optFieldTested').textContent = t.optFieldTested;
    document.getElementById('optWellWorn').textContent = t.optWellWorn;
    document.getElementById('optBattleScarred').textContent = t.optBattleScarred;
    document.getElementById('maxCap2Label').textContent = t.maxCap2Label;
    document.getElementById('minCap2Label').textContent = t.minCap2Label;
    document.getElementById('calcMaxAvgBtn').textContent = t.calcMaxAvgBtn;
    document.getElementById('langSelect').value = lang;
    
    // Filter-Übersetzungen anwenden
    applyFilterTranslations(lang);
}

// Filter-Übersetzungen anwenden
function applyFilterTranslations(lang) {
    const t = translations[lang];
    document.getElementById('filterButton').textContent = t.filterButtonText;
    document.getElementById('filterPopupTitle').textContent = t.filterPopupTitle;
    document.getElementById('rarityFilterLabel').textContent = t.rarityFilterLabel;
    document.getElementById('collectionFilterLabel').textContent = t.collectionFilterLabel;
    document.getElementById('applyFilters').textContent = t.applyFiltersText;
    document.getElementById('resetFilters').textContent = t.resetFiltersText;
    document.getElementById('closeFilterPopup').textContent = t.closeFilterPopupText;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    currentLang = getLang();
    applyTranslations(currentLang);
    createFloatInputs();
    
    fetchSkins(currentLang).then(() => {
        initSkinSearch();
        updateFilterOptions();
    });
    
    document.getElementById('langSelect').value = currentLang;

    // Event-Listener für den Calculate-Max-Avg-Button
    document.getElementById('calcMaxAvgBtn').addEventListener('click', calculateMaxAvgFloat);
});
