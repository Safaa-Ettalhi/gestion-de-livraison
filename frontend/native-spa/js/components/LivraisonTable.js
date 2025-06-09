import { getLivraisons } from '../api/livraisonService.js';
import { showToast } from './Toast.js';
import { showLivraisonModal, showColisModal } from './hooks/showModals.js';

export const renderLivraisonTable = async (filter = '') => {
    const tbody = document.getElementById('livraisonTable');
    tbody.innerHTML = '';

    const livraisons = await getLivraisons();
    const filtered = livraisons.filter(liv =>
        liv.statut?.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(liv => {
        const tr = document.createElement('tr');
        const idTd = document.createElement('td');
        idTd.textContent = liv.id;
        const expeditionTd = document.createElement('td');
        expeditionTd.textContent = liv.dateExpedition;

        const livraisonTd = document.createElement('td');
        livraisonTd.textContent = liv.dateLivraisonPrevue;

        const montantTd = document.createElement('td');
        montantTd.textContent = `${liv.montantTotal} €`;

        const statutTd = document.createElement('td');
        statutTd.textContent = liv.statut;

        const colisCountTd = document.createElement('td');
        colisCountTd.textContent = liv?.colisListe?.length || 0;

        const actionTd = document.createElement('td');

        const showBtn = document.createElement('button');
        showBtn.className = 'btn btn-info btn-sm me-1';
        showBtn.textContent = 'Voir';
        showBtn.addEventListener('click', () => showLivraisonModal(liv));

        const colisBtn = document.createElement('button');
        colisBtn.className = 'btn btn-secondary btn-sm';
        colisBtn.textContent = 'Voir Colis';
        colisBtn.addEventListener('click', () => showColisModal(liv.colisListe || []));

        actionTd.append(showBtn, colisBtn);
        tr.append(idTd, expeditionTd, livraisonTd, montantTd, statutTd, colisCountTd, actionTd);
        tbody.appendChild(tr);
    });
};
