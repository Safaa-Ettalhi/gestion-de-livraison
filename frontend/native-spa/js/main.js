
import { renderColisTable } from './components/ColisTable.js';
import { renderExpediteurTable } from './components/ExpediteurTable.js';
import { showColisFormModal, showExpediteurFormModal, showLivraisonFormModal } from './components/hooks/showModals.js';
import { renderLivraisonTable } from './components/LivraisonTable.js';
import HomePageLayout from './layouts/HomePageLayout.js'

document.addEventListener('DOMContentLoaded', () => {
    const table = "livraison"
    init(table);
    renderLivraisonTable();

    const reloadBtn = document.getElementById('reloadBtn');
    reloadBtn.addEventListener('click', () => {
        renderLivraisonTable();
        console.log('Table reloaded');
        searchInput.value = '';
    });

    window.reloadTable = () => {
        renderLivraisonTable();
        console.log('Table reloaded');
        
    };

});


const setupTabNavigation = () => {
    const tabs = {
        livraisonTab: {
            table: 'livraison',
            render: renderLivraisonTable,
        },
        colisTab: {
            table: 'colis',
            render: renderColisTable,
        },
        expediteurTab: {
            table: 'expediteur',
            render: renderExpediteurTable,
        },
    };

    Object.entries(tabs).forEach(([tabId, { table, render }]) => {
        const tab = document.getElementById(tabId);
        if (tab) {
            tab.addEventListener('click', () => {
                window.reloadTable?.(); 
                init(table); 
                render();
            });
        }
    });
};

const setupAddButtons = () => {
    const buttons = {
        addLivraisonBtn: showLivraisonFormModal,
        addColisBtn: showColisFormModal,
        addExpediteurBtn: showExpediteurFormModal,
    };

    Object.entries(buttons).forEach(([btnId, handler]) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', handler);
        }
    });
};

const setupSearchInput = () => {
    const input = document.getElementById('searchInput');
    if (input) {
        input.addEventListener('input', () => {
            renderLivraisonTable(input.value); 
        });
    }
};

export const init = (table) => {
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = HomePageLayout(table);

    setupTabNavigation();
    setupAddButtons();
    setupSearchInput();

    switch (table) {
        case 'livraison':
            renderLivraisonTable();
            break;
        case 'colis':
            renderColisTable();
            break;
        case 'expediteur':
            renderExpediteurTable();
            break;
        default:
            console.warn(`Table inconnue : ${table}`);
    }
};
