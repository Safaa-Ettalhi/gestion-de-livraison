import showModalLivraison, { showNewModalLivraison } from '../ShowLivraisonModal.js';
import { showNewModalExpediteur } from '../ShowExpediteurModal.js';
import { showNewModalColis } from '../showColisModal.js';


export const showLivraisonFormModal = () => {
    window.currentPage = 'livraison'
    const existing = document.getElementById('livraisonFormModal');
    if (existing) existing.remove();

    const modal = showNewModalLivraison({
        onSubmit: async (livraison) => {
            console.log('Livraison submitted:', livraison);
        }
    });

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

export const showExpediteurFormModal = () => {
    const existing = document.getElementById('expediteurFormModal');
    if (existing) existing.remove();
    const modal = showNewModalExpediteur({
        onSubmit: async (expediteur) => {
            console.log('Expéditeur submitted:', expediteur);
        }
    });
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

}

export const showColisFormModal = () => {
    window.currentPage = 'colis'
    const existing = document.getElementById('colisFormModal');
    if (existing) existing.remove();
    const modal = showNewModalColis({
        onSubmit: async (colis) => {
            console.log('Colis submitted:', colis);
        }
    });
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}


export const showExpeditorModal = () => {
    const existing = document.getElementById('expediteurShowModal');
    if (existing) existing.remove();
    const modal = showNewModalExpediteur();
    document.body.appendChild(modal);

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

export const showLivraisonModal = (livraison) => {
    const modal = showModalLivraison({
        id: livraison.id,
        dateExpedition: livraison.dateExpedition,
        dateLivraisonPrevue: livraison.dateLivraisonPrevue,
        montantTotal: livraison.montantTotal,
        statut: livraison.statut,
        colisListe: livraison.colisListe || [],
        onEdit: (liv) => {
            console.log('Edit Livraison:', liv);
        },
        onDelete: (id) => {
            console.log('Delete Livraison ID:', id);
            alert('yesssssss')
        }
    });    
    document.body.appendChild(modal);
    document.querySelector("body > div:nth-child(14)")?.remove()
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

export const showColisModal = (colisListe) => {
    const existing = document.getElementById('colisShowModal');
    if (existing) existing.remove();

    const modal = ShowModal({
        title: 'Liste des Colis',
        content: colisListe.map(colis => `
            <div class="colis-item">
                <p><strong>ID:</strong> ${colis.id}</p>
                <p><strong>Poids:</strong> ${colis.poids} kg</p>
                <p><strong>Dimensions:</strong> ${colis.dimensions}</p>
            </div>
        `).join('')
    });

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

