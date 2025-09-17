// skins.js - Reine Skin-Daten Logik
let skins = [];

// Funktion zum Laden der Skins
function fetchSkins(language) {
    return fetch(`https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/${language}/skins.json`)
        .then(res => res.json())
        .then(data => {
            skins = data;
            return skins;
        })
        .catch(error => {
            console.error('Error loading skins:', error);
            return [];
        });
}

// Funktion zum Abrufen von Skin-Daten
function getSkinData(skinName) {
    return skins.find(skin => skin.name === skinName);
}

// Funktion zum Abrufen aller Waffen
function getAllWeapons() {
    const weapons = new Set();
    skins.forEach(skin => {
        if (skin.weapon && skin.weapon.name) {
            weapons.add(skin.weapon.name);
        }
    });
    return Array.from(weapons).sort();
}

// Funktion zum Filtern von Skins nach Waffe
function getSkinsByWeapon(weaponName) {
    return skins.filter(skin => skin.weapon && skin.weapon.name === weaponName);
}

// Funktion zum Abrufen aller Rarities
function getAllRarities() {
    const rarities = new Set();
    skins.forEach(skin => {
        if (skin.rarity && skin.rarity.name) {
            rarities.add(skin.rarity.name);
        }
    });
    return Array.from(rarities);
}

// Funktion zum Abrufen aller Collections
function getAllCollections() {
    const collections = new Set();
    skins.forEach(skin => {
        if (skin.collections && skin.collections.length > 0) {
            skin.collections.forEach(collection => {
                if (collection.name) {
                    collections.add(collection.name);
                }
            });
        }
    });
    return Array.from(collections);
}
