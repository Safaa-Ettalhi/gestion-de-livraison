
import { renderColisTable } from './components/ColisTable.js';
import { renderExpediteurTable } from './components/ExpediteurTable.js';
import { showColisFormModal, showExpediteurFormModal, showLivraisonFormModal } from './components/hooks/showModals.js';
import { renderLivraisonTable } from './components/LivraisonTable.js';
import HomePageLayout from './layouts/HomePageLayout.js'

document.addEventListener('DOMContentLoaded', () => {
    const table = "livraison"
    init(table);
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

const setupRefrech = () => {
    const reloadBtn = document.getElementById('reloadBtn');
    reloadBtn.addEventListener('click', () => {
        window.reloadAllTables?.();
        searchInput.value = '';
    });

    window.reloadTable = () => {
        renderLivraisonTable();
        console.log('Table reloaded');
    };


    window.reloadAllTables = () => {
        const page = window.currentPage || 'livraison';
        if (page === 'livraison') return renderLivraisonTable();
        if (page === 'colis') return renderColisTable();
        if (page === 'expediteur') return renderExpediteurTable();
        console.log('Table reloaded');
    };
}

export const init = (table) => {
    window.currentPage = table
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = HomePageLayout(table);

    setupTabNavigation();
    setupAddButtons();
    setupSearchInput();
    setupRefrech();

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
