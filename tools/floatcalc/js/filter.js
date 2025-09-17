// Filter-Logik
export function applyFilters() {
    const selected = Array.from(document.querySelectorAll('.filter-option input:checked'))
        .map(input => input.value);
    // Filter-Anwendung auf die Skin-Liste oder Tabelle
    console.log('Applying filters:', selected);
}

export function resetFilters() {
    document.querySelectorAll('.filter-option input').forEach(input => input.checked = false);
    console.log('Filters reset');
}

// Filter Popup
export function openFilterPopup() {
    document.querySelector('.filter-popup').style.display = 'block';
}

export function closeFilterPopup() {
    document.querySelector('.filter-popup').style.display = 'none';
}
