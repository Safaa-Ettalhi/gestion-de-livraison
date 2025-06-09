
const baseUrl = 'http://localhost:8000';

const showModalLivraison = (livraison, onEdit, onDelete) => {
    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal fade';
    modalWrapper.id = 'livraisonShowModal';
    modalWrapper.tabIndex = -1;
    modalWrapper.setAttribute('aria-hidden', 'true');

    const colisHtml = livraison.colisListe
        .map(
            colis => `
        <div class="border rounded p-2 mb-2 text-start">
          <p><strong>ID:</strong> ${colis.id}</p>
          <p><strong>Poids:</strong> ${colis.poids} kg</p>
          <p><strong>Dimensions:</strong> ${colis.dimensions}</p>
          <p><strong>Destination:</strong> ${colis.destination}</p>
          <p><strong>Tarif:</strong> ${colis.tarif} €</p>
          <p><strong>Statut:</strong> ${colis.statut}</p>
          <p><strong>Type:</strong> ${colis.type}</p>
          ${colis.delaiLivraison ? `<p><strong>Délai:</strong> ${colis.delaiLivraison}</p>` : ''}
          ${colis.assuranceIncluse !== undefined ? `<p><strong>Assurance incluse:</strong> ${colis.assuranceIncluse ? 'Oui' : 'Non'}</p>` : ''}
          ${colis.priorite ? `<p><strong>Priorité:</strong> ${colis.priorite}</p>` : ''}
          ${colis.livraisonUrgente ? `<p><strong>Livraison urgente:</strong> Oui</p>` : ''}
        </div>
      `
        )
        .join('');

    modalWrapper.innerHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Livraison #${livraison.id}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
        </div>

        <div class="modal-body text-start">
          <p><strong>Date d’expédition:</strong> ${livraison.dateExpedition}</p>
          <p><strong>Date de livraison prévue:</strong> ${livraison.dateLivraisonPrevue}</p>
          <p><strong>Montant total:</strong> ${livraison.montantTotal} €</p>
          <p><strong>Statut:</strong> ${livraison.statut}</p>
          <hr />
          <h6>Colis :</h6>
          ${colisHtml}
        </div>

        <div class="modal-footer">
          <button class="btn btn-warning" id="editLivraisonBtn">Modifier</button>
          <button class="btn btn-danger" id="deleteLivraisonBtn">Supprimer</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
        </div>

      </div>
    </div>
  `;

    document.body.appendChild(modalWrapper);
    const modal = new bootstrap.Modal(modalWrapper);
    modal.show();
    modalWrapper.querySelector('#editLivraisonBtn')?.addEventListener('click', () => {
        modal.hide();
        onEdit?.(livraison);
    });

    modalWrapper.querySelector('#deleteLivraisonBtn')?.addEventListener('click', () => {
        if (confirm(`Supprimer la livraison #${livraison.id} ?`)) {
            modal.hide();
            onDelete?.(livraison.id);
        }
    });

    return modalWrapper;
};

export default showModalLivraison;


export const showNewModalLivraison = async () => {

    const response = await fetch(`${baseUrl}/api/v1/colis`);
    const colis = await response.json();
    console.log('Colis fetched:', colis);

    const existing = document.getElementById('livraisonNewModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'livraisonNewModal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Nouvelle Livraison</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="livraisonForm">
                        <div class="mb-3">
                            <label for="dateExpedition" class="form-label">Date d'expédition</label>
                            <input type="date" class="form-control" id="dateExpedition" required />
                        </div>
                        <div class="mb-3">
                            <label for="dateLivraisonPrevue" class="form-label">Date de livraison prévue</label>
                            <input type="date" class="form-control" id="dateLivraisonPrevue" required />
                        </div>
                        <div class="mb-3">
                            <label for="statut" class="form-label">Statut</label>
                            <select class="form-select" id="statut" required>
                                <option value="EN_COURS">En cours</option>
                                <option value="LIVREE">Livrée</option>
                                <option value="ANNULEE">Annulée</option>
                            </select>
                        </div>
                        <hr/>
                        <h6>Colis</h6>
                        <p>Veuillez sélectionner les colis à inclure dans cette livraison :</p>
                        <div class="mb-3">
                            <label for="searchColis" class="form-label">Rechercher des colis par ID</label>
                            <input type="text" class="form-control" id="searchColis" placeholder="Entrez les IDs des colis séparés par des virgules" />
                        </div>
                        <div class="form-check">
                        <label class="form-check-label">
                            <input type="checkbox" class="form-check-input" id="selectAllColis">
                            Sélectionner tous les colis
                        </label>
                        </div>
                        <div id="colisContainer">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary" id="saveLivraisonBtn">Enregistrer</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    setTimeout(() => {
        document.getElementById('livraisonForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
        });
    });

    modal.querySelector('#colisContainer').innerHTML = colis.map(colis => `
        <div class="border rounded p-2 mb-2">
            <div class="form-check">
                <input type="checkbox" class="form-check-input" id="colis-${colis.id}" value="${colis.id}">
                <label class="form-check-label" for="colis-${colis.id}">ID: ${colis.id} - Poids: ${colis.poids} kg - Dimensions: ${colis.dimensions} - Destination: ${colis.destination} - Tarif: ${colis.tarif} €</label>
            </div>
            <div class="collapse mt-2" id="details-${colis.id}">
                <p><strong>Statut:</strong> ${colis.statut}</p>
                <p><strong>Type:</strong> ${colis.type}</p>
                <p><strong>Priorité:</strong> ${colis.priorite}</p>
                <p><strong>Livraison urgente:</strong> ${colis.livraisonUrgente ? 'Oui' : 'Non'}</p>
            </div>
            <button type="button" class="btn btn-link p-0" data-bs-toggle="collapse" data-bs-target="#details-${colis.id}" aria-expanded="false" aria-controls="details-${colis.id}">Voir détails</button>
        </div>
    `).join('');

    modal.querySelector('#selectAllColis').addEventListener('change', (e) => {
        const checkboxes = modal.querySelectorAll('#colisContainer input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });
    modal.querySelector('#searchColis').addEventListener('input', (e) => {
        const searchValue = e.target.value.trim();
        const colisContainer = modal.querySelector('#colisContainer');
        const checkboxes = colisContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const colisId = checkbox.value;
            const colisDiv = checkbox.closest('div');
            if (colisId.includes(searchValue)) {
                colisDiv.style.display = '';
            } else {
                colisDiv.style.display = 'none';
            }
        });
    });

    modal.querySelectorAll('.collapse').forEach(collapse => {
        collapse.addEventListener('show.bs.collapse', () => {
            const button = collapse.previousElementSibling;
            button.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
        });
        collapse.addEventListener('hide.bs.collapse', () => {
            const button = collapse.previousElementSibling;
            button.classList.remove('active');
            button.setAttribute('aria-expanded', 'false');
        });
    });

   modal.querySelector('#saveLivraisonBtn').addEventListener('click', (e) => {
        e.preventDefault();

        const form = modal.querySelector('#livraisonForm');
        if (true) {
            const livraison = {
                colisListe: Array.from(modal.querySelectorAll('#colisContainer input[type="checkbox"]:checked'))
                    .map(checkbox => {
                        const colisId = checkbox.value;
                        return +colisId;
                    }),
                dateExpedition: form.querySelector('#dateExpedition').value,
                dateLivraisonPrevue: form.querySelector('#dateLivraisonPrevue').value,
                statut: form.querySelector('#statut').value
            };
            fetch(`${baseUrl}/api/v1/livraisons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(livraison)
            })

                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    return response.json();

                })
                .then(data => {
                    console.log('Livraison created successfully:', data);
               
                    setTimeout(() => {
                        window.reloadTable();
                    }, 2000);


                })

            console.log('Livraison data:', livraison);

            bsModal.hide();
        } else {
            form.reportValidity();
        }
    });

    return modal;
};

