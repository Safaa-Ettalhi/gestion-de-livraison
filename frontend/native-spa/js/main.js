
import { renderColisTable } from './components/ColisTable.js';
import { renderExpediteurTable } from './components/ExpediteurTable.js';
import { showColisFormModal, showExpediteurFormModal, showLivraisonFormModal } from './components/hooks/showModals.js';
import { renderLivraisonTable } from './components/LivraisonTable.js';
import HomePageLayout from './layouts/HomePageLayout.js'
document.addEventListener("DOMContentLoaded", () => {
    const parseHash = () => {
        const [path, queryString] = window.location.hash.replace('#/', '').split('?');
        const params = new URLSearchParams(queryString);
        return {
            page: path || 'livraison',
            query: Object.fromEntries(params.entries()),
        };
    };

    const closeAllModals = () => {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach((modal) => {
            const instance = bootstrap.Modal.getInstance(modal);
            if (instance) {
                instance.hide();
            }
        });
    };

    const { page, query } = parseHash();
    init(page, query);

    window.addEventListener('hashchange', () => {
        closeAllModals();
        const { page, query } = parseHash();
        init(page, query);
    });
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
                location.href = `/#/${table}`
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

const setupSearchInput = (query) => {
    const input = document.getElementById('searchInput');
    if (input) {
        input.addEventListener('input', () => {
            renderLivraisonTable(input.value);
        });
        input.defaultValue=query || ""

    }
};
const setupSearchInputColis = (query) => {
    const input = document.getElementById('searchInputColis');
    if (input) {
        input.addEventListener('input', () => {
            renderColisTable(input.value);
        });
        input.defaultValue=query || ""

    }
};

const setupSearchInputExpediteur = (query) => {
    const input = document.getElementById('searchInputExpediteur');
    if (input) {
        input.addEventListener('input', () => {
            renderExpediteurTable(input.value);
        });
        input.defaultValue=query || ""
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

export const init = (table, query = {}) => {
    window.currentPage = table;
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = HomePageLayout(table);

    setupTabNavigation();
    setupAddButtons();
    setupSearchInput(query.id);
    setupSearchInputColis(query.id);
    setupSearchInputExpediteur(query.search);
    setupRefrech();

    switch (table) {
        case 'livraison':
            renderLivraisonTable(query.id || '');
            break;
        case 'colis':
            renderColisTable(query.id || '');
            break;
        case 'expediteur':
            renderExpediteurTable(query.search || '');
            break;
        default:
            console.warn(`Table inconnue : ${table}`);
            location.href = "404.html";
    }
};
