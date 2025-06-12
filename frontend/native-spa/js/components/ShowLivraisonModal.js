import { updateLivraison } from '../api/livraisonService.js'; 
import { showToast } from './Toast.js'; 

const baseUrl = 'http://localhost:8000';

export const showModalLivraison = (livraison, onEdit, onDelete) => {
    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal fade';
    modalWrapper.id = 'livraisonShowModal';
    modalWrapper.tabIndex = -1;
    modalWrapper.setAttribute('aria-hidden', 'true');
    const existingColisIds = new Set(livraison.colisListe.map(c => c.id));

    const colisHtml = livraison.colisListe
        .map(
            colis => `
        <div class="border rounded p-2 mb-2 text-start">
          <p><strong>ID:</strong> <a href="http://127.0.0.1:3000/#/colis?id=${colis.id}">${colis.id}</a></p>
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
        showEditModalLivraison(livraison);
    });

    modalWrapper.querySelector('#deleteLivraisonBtn')?.addEventListener('click', async () => {
        if (confirm(`Supprimer la livraison #${livraison.id} ?`)) {

            try {
                const response = await fetch(`${baseUrl}/api/v1/livraisons/${livraison.id}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) throw new Error('Erreur serveur');

                modal.hide();
                setTimeout(() => {
                    document.querySelector("body > div:nth-child(14)").remove()
                    document.querySelectorAll('.modal-backdrop.fade.show').forEach(backdrop => {
                        backdrop.remove();
                    });
                    window.reloadAllTables()

                }, 10)

                showToast('Colis supprimée avec succès');

            } catch (err) {
                document.getElementById('livraisonError').textContent = err.message;
                document.getElementById('livraisonError').classList.remove('d-none');
            }

            onDelete?.(livraison.id);
        }
    });

    return modalWrapper;
};

let livraisonModalInstance;
let livraisonForm, dateExpeditionInput, dateLivraisonPrevueInput, statutSelect;
let searchColisInput, selectAllColisCheckbox, colisContainer, errorContainer;

document.addEventListener('DOMContentLoaded', () => {
    const livraisonModalHTML = `
    <div id="livraisonNewModal" class="modal fade" tabindex="-1" aria-labelledby="livraisonNewModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form id="livraisonForm">
            <div class="modal-header">
              <h5 class="modal-title" id="livraisonNewModalLabel">Nouvelle Livraison</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="dateExpedition" class="form-label">Date d'expédition</label>
                <input type="date" class="form-control" id="dateExpedition" name="dateExpedition" required />
              </div>
              <div class="mb-3">
                <label for="dateLivraisonPrevue" class="form-label">Date de livraison prévue</label>
                <input type="date" class="form-control" id="dateLivraisonPrevue" name="dateLivraisonPrevue" required />
              </div>
              <div class="mb-3">
                <label for="statut" class="form-label">Statut</label>
                <select class="form-select" id="statut" name="statut" required>
                  <option value="EN_COURS">En cours</option>
                  <option value="LIVREE">Livrée</option>
                  <option value="ANNULEE">Annulée</option>
                </select>
              </div>
              <hr/>
              <h6>Colis disponibles</h6>
              <p>Veuillez sélectionner les colis à inclure dans cette livraison :</p>
              <div class="mb-3">
                <label for="searchColis" class="form-label">Rechercher des colis par ID</label>
                <input type="text" class="form-control" id="searchColis" name="searchColis" placeholder="Entrez les IDs des colis séparés par des virgules" />
              </div>
              <div class="form-check mb-3">
                <input type="checkbox" class="form-check-input" id="selectAllColis" name="selectAllColis">
                <label class="form-check-label" for="selectAllColis">Sélectionner tous les colis</label>
              </div>
              <div id="colisContainer" style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 5px;"></div>
              <div id="livraisonError" class="text-danger d-none mt-2"></div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary" id="saveLivraisonBtn">Enregistrer</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

    const existingModal = document.getElementById('livraisonNewModal');
    if (existingModal) existingModal.remove();
    document.body.insertAdjacentHTML('beforeend', livraisonModalHTML);


});


export const showNewModalLivraison = async () => {
    const response = await fetch(`${baseUrl}/api/v1/colis?unique=true&skip=""`);
    const allColis = await response.json(); 


    const modalElement = document.getElementById('livraisonNewModal');
    if (modalElement) {
        livraisonModalInstance = new bootstrap.Modal(modalElement);
        livraisonForm = document.getElementById('livraisonForm');
        dateExpeditionInput = document.getElementById('dateExpedition');
        dateLivraisonPrevueInput = document.getElementById('dateLivraisonPrevue');
        statutSelect = document.getElementById('statut');
        searchColisInput = document.getElementById('searchColis');
        selectAllColisCheckbox = document.getElementById('selectAllColis');
        colisContainer = document.getElementById('colisContainer');
        errorContainer = document.getElementById('livraisonError');

        livraisonModalInstance.show();
    }

    const renderColisCheckboxes = (colisList, selectedColisIds = new Set()) => {
        if (colisList.length === 0) {
            colisContainer.innerHTML = `<p class="text-muted">Aucun colis disponible.</p>`;
            return;
        }
        colisContainer.innerHTML = colisList.map(colis => `
            <div class="border rounded p-2 mb-2">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="colis-${colis.id}" value="${colis.id}" ${selectedColisIds.has(colis.id) ? 'checked' : ''}>
                    <label class="form-check-label" for="colis-${colis.id}">ID: ${colis.id} - Poids: ${colis.poids} kg - Dest: ${colis.destination} - Type: ${colis.type} - Statut: ${colis.statut}</label>
                </div>
                <div class="collapse mt-2" id="details-${colis.id}">
                    <p><strong>Dimensions:</strong> ${colis.dimensions}</p>
                    <p><strong>Tarif:</strong> ${colis.tarif} €</p>
                    ${colis.delaiLivraison ? `<p><strong>Délai:</strong> ${colis.delaiLivraison}</p>` : ''}
                    ${colis.assuranceIncluse !== undefined ? `<p><strong>Assurance incluse:</strong> ${colis.assuranceIncluse ? 'Oui' : 'Non'}</p>` : ''}
                    ${colis.priorite ? `<p><strong>Priorité:</strong> ${colis.priorite}</p>` : ''}
                    ${colis.livraisonUrgente ? `<p><strong>Livraison urgente:</strong> Oui</p>` : ''}
                    <p><strong>Expéditeur:</strong> ${colis.expediteur?.nom || 'N/A'}</p>
                </div>
                <button type="button" class="btn btn-link p-0" data-bs-toggle="collapse" data-bs-target="#details-${colis.id}" aria-expanded="false" aria-controls="details-${colis.id}">Voir détails</button>
            </div>
        `).join('');
    };

    renderColisCheckboxes(allColis); 

    selectAllColisCheckbox.addEventListener('change', (e) => {
        const checkboxes = colisContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });

    searchColisInput.addEventListener('input', () => {
        const searchValue = searchColisInput.value.trim().toLowerCase();
        const filteredColis = allColis.filter(colis =>
            String(colis.id).includes(searchValue) ||
            colis.destination.toLowerCase().includes(searchValue) ||
            colis.statut.toLowerCase().includes(searchValue) ||
            colis.type.toLowerCase().includes(searchValue)
        );
        renderColisCheckboxes(filteredColis);
    });

    modalElement.querySelectorAll('.collapse').forEach(collapse => {
        collapse.addEventListener('show.bs.collapse', (event) => {
            const button = event.target.previousElementSibling;
            if (button && button.classList.contains('btn-link')) {
                button.textContent = 'Masquer détails';
            }
        });
        collapse.addEventListener('hide.bs.collapse', (event) => {
            const button = event.target.previousElementSibling;
            if (button && button.classList.contains('btn-link')) {
                button.textContent = 'Voir détails';
            }
        });
    });

    modalElement.querySelector('#saveLivraisonBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('yess');
        errorContainer.classList.add('d-none');
        errorContainer.textContent = '';

        if (!livraisonForm.checkValidity()) {
            livraisonForm.reportValidity();
            return;
        }

        const selectedColisIds = Array.from(colisContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => +checkbox.value);

        if (selectedColisIds.length === 0) {
            errorContainer.classList.remove('d-none');
            errorContainer.textContent = 'Veuillez sélectionner au moins un colis.';
            return;
        }

        const livraisonData = {
            colisListe: selectedColisIds,
            dateExpedition: livraisonForm.querySelector('#dateExpedition').value,
            dateLivraisonPrevue: livraisonForm.querySelector('#dateLivraisonPrevue').value,
            statut: livraisonForm.querySelector('#statut').value
        };

        try {
            const response = await fetch(`${baseUrl}/api/v1/livraisons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(livraisonData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de l’ajout de la livraison.');
            }

            const result = await response.json();
            console.log('Livraison created successfully:', result);
            showToast('Livraison ajoutée avec succès!');
            const livraisonModalInstance = bootstrap.Modal.getInstance(document.getElementById('livraisonNewModal'));
            livraisonModalInstance.hide();

            document.querySelectorAll('.modal-backdrop.fade.show').forEach(backdrop => {
                backdrop.remove();
            });


            if (window.reloadAllTables) {
                window.reloadAllTables();
            }

        } catch (err) {
            errorContainer.classList.remove('d-none');
            errorContainer.textContent = err.message || 'Une erreur s’est produite lors de l’ajout de la livraison.';
            console.error('Error creating livraison:', err);
        }
    });


    return modalElement;
};

export const showEditModalLivraison = async (livraisonToEdit) => {
     const modals = document.querySelectorAll('.modal.show');
        modals.forEach((modal) => {
            const instance = bootstrap.Modal.getInstance(modal);
            if (instance) {
                instance.hide();
            }
        });
    const existingNew = document.getElementById('livraisonNewModal');
    if (existingNew) existingNew.remove();
    const existingEdit = document.getElementById('livraisonEditModal');
    if (existingEdit) existingEdit.remove();

    const response = await fetch(`${baseUrl}/api/v1/colis?unique=true&skip=${livraisonToEdit?.id}`);
    const allColis = await response.json(); 
    const existingColisIds = new Set(livraisonToEdit.colisListe.map(c => c.id));

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'livraisonEditModal'; 
    modal.tabIndex = -1;
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modifier Livraison #${livraisonToEdit.id}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="editLivraisonForm">
                        <input type="hidden" id="livraisonId" value="${livraisonToEdit.id}" />
                        <div class="mb-3">
                            <label for="editDateExpedition" class="form-label">Date d'expédition</label>
                            <input type="date" class="form-control" id="editDateExpedition" required />
                        </div>
                        <div class="mb-3">
                            <label for="editDateLivraisonPrevue" class="form-label">Date de livraison prévue</label>
                            <input type="date" class="form-control" id="editDateLivraisonPrevue" required />
                        </div>
                        <div class="mb-3">
                            <label for="editStatut" class="form-label">Statut</label>
                            <select class="form-select" id="editStatut" required>
                                <option value="EN_COURS">En cours</option>
                                <option value="LIVREE">Livrée</option>
                                <option value="ANNULEE">Annulée</option>
                            </select>
                        </div>
                        <hr/>
                        <h6>Colis associés</h6>
                        <p>Sélectionnez les colis à inclure dans cette livraison :</p>
                        <div class="mb-3">
                            <label for="searchEditColis" class="form-label">Rechercher des colis par ID</label>
                            <input type="text" class="form-control" id="searchEditColis" placeholder="Entrez les IDs des colis séparés par des virgules" />
                        </div>
                        <div class="form-check">
                            <label class="form-check-label">
                                <input type="checkbox" class="form-check-input" id="selectAllEditColis">
                                Sélectionner/Désélectionner tout
                            </label>
                        </div>
                        <div id="editColisContainer" style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
                        </div>
                        <div id="editLivraisonError" class="text-danger d-none mt-2"></div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary" id="updateLivraisonBtn">Mettre à jour</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    const editLivraisonForm = modal.querySelector('#editLivraisonForm');
    const editDateExpedition = modal.querySelector('#editDateExpedition');
    const editDateLivraisonPrevue = modal.querySelector('#editDateLivraisonPrevue');
    const editStatut = modal.querySelector('#editStatut');
    const editColisContainer = modal.querySelector('#editColisContainer');
    const searchEditColisInput = modal.querySelector('#searchEditColis');
    const selectAllEditColisCheckbox = modal.querySelector('#selectAllEditColis');
    const updateLivraisonBtn = modal.querySelector('#updateLivraisonBtn');
    const editErrorContainer = modal.querySelector('#editLivraisonError');

    editDateExpedition.value = livraisonToEdit.dateExpedition || '';
    editDateLivraisonPrevue.value = livraisonToEdit.dateLivraisonPrevue || '';
    editStatut.value = livraisonToEdit.statut || 'EN_COURS';

    const renderEditColisCheckboxes = (colisList, currentSelectedColisIds) => {
        if (colisList.length === 0) {
            editColisContainer.innerHTML = `<p class="text-muted">Aucun colis disponible.</p>`;
            return;
        }
        editColisContainer.innerHTML = colisList.map(colis => `
            <div class="border rounded p-2 mb-2">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="edit-colis-${colis.id}" value="${colis.id}" ${currentSelectedColisIds.has(colis.id) ? 'checked' : ''}>
                    <label class="form-check-label" for="edit-colis-${colis.id}">ID: ${colis.id} - Poids: ${colis.poids} kg - Dest: ${colis.destination} - Type: ${colis.type} - Statut: ${colis.statut}</label>
                </div>
                <div class="collapse mt-2" id="edit-details-${colis.id}">
                    <p><strong>Dimensions:</strong> ${colis.dimensions}</p>
                    <p><strong>Tarif:</strong> ${colis.tarif} €</p>
                    ${colis.delaiLivraison ? `<p><strong>Délai:</strong> ${colis.delaiLivraison}</p>` : ''}
                    ${colis.assuranceIncluse !== undefined ? `<p><strong>Assurance incluse:</strong> ${colis.assuranceIncluse ? 'Oui' : 'Non'}</p>` : ''}
                    ${colis.priorite ? `<p><strong>Priorité:</strong> ${colis.priorite}</p>` : ''}
                    ${colis.livraisonUrgente ? `<p><strong>Livraison urgente:</strong> Oui</p>` : ''}
                    <p><strong>Expéditeur:</strong> ${colis.expediteur?.nom || 'N/A'}</p>
                </div>
                <button type="button" class="btn btn-link p-0" data-bs-toggle="collapse" data-bs-target="#edit-details-${colis.id}" aria-expanded="false" aria-controls="edit-details-${colis.id}">Voir détails</button>
            </div>
        `).join('');
    };

    renderEditColisCheckboxes(allColis, existingColisIds);

    selectAllEditColisCheckbox.addEventListener('change', (e) => {
        const checkboxes = editColisContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });

    searchEditColisInput.addEventListener('input', () => {
        const searchValue = searchEditColisInput.value.trim().toLowerCase();
        const filteredColis = allColis.filter(colis =>
            String(colis.id).includes(searchValue) ||
            colis.destination.toLowerCase().includes(searchValue) ||
            colis.statut.toLowerCase().includes(searchValue) ||
            colis.type.toLowerCase().includes(searchValue)
        );
        renderEditColisCheckboxes(filteredColis, existingColisIds);
    });

    modal.querySelectorAll('.collapse').forEach(collapse => {
        collapse.addEventListener('show.bs.collapse', (event) => {
            const button = event.target.previousElementSibling;
            if (button && button.classList.contains('btn-link')) {
                button.textContent = 'Masquer détails';
            }
        });
        collapse.addEventListener('hide.bs.collapse', (event) => {
            const button = event.target.previousElementSibling;
            if (button && button.classList.contains('btn-link')) {
                button.textContent = 'Voir détails';
            }
        });
    });


    updateLivraisonBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        editErrorContainer.classList.add('d-none');
        editErrorContainer.textContent = '';

        if (!editLivraisonForm.checkValidity()) {
            editLivraisonForm.reportValidity();
            return;
        }

        const selectedColisIds = Array.from(editColisContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => +checkbox.value); 

        if (selectedColisIds.length === 0) {
            editErrorContainer.classList.remove('d-none');
            editErrorContainer.textContent = 'Veuillez sélectionner au moins un colis.';
            return;
        }

        const updatedLivraisonData = {
            colisListe: selectedColisIds, 
            dateExpedition: editDateExpedition.value,
            dateLivraisonPrevue: editDateLivraisonPrevue.value,
            statut: editStatut.value
        };

        try {
            await updateLivraison(livraisonToEdit.id, updatedLivraisonData);
            console.log('Livraison updated successfully:', updatedLivraisonData);
            showToast('Livraison mise à jour avec succès!');
            const modals = document.querySelectorAll('.modal.show');
        modals.forEach((modal) => {
            const instance = bootstrap.Modal.getInstance(modal);
            if (instance) {
                instance.hide();
            }
        });


            if (window.reloadAllTables) {
                window.reloadAllTables()
                location.reload()
            }
        } catch (err) {
            editErrorContainer.classList.remove('d-none');
            editErrorContainer.textContent = err.message || 'Une erreur s’est produite lors de la mise à jour de la livraison.';
            console.error('Error updating livraison:', err);
        }
    });

    return modal;
};

export default showModalLivraison