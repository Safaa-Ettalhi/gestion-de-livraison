import { deleteColis, getColis, updateColis } from '../api/colisService.js';
import { showToast } from './Toast.js';

let editColisBootstrapModal;
let editForm; 
let editTypeSelect; 
let editColisStandardFields; 
let editColisExpressFields; 
let editStatutSelect; 

document.addEventListener('DOMContentLoaded', () => {
    const modalHTML = `
    <div id="editModal2" class="modal fade" tabindex="-1" aria-labelledby="editModal2Label" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form id="editColisForm">
            <div class="modal-header">
              <h5 class="modal-title" id="editModal2Label">Modifier Colis</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <input type="hidden" id="editColisId" name="id" />
              <div class="mb-3">
                  <label for="editPoids" class="form-label">Poids (kg):</label>
                  <input type="number" step="0.01" id="editPoids" name="poids" class="form-control" required />
              </div>
              <div class="mb-3">
                  <label for="editDimensions" class="form-label">Dimensions (LxWxH cm):</label>
                  <input type="text" id="editDimensions" name="dimensions" class="form-control" placeholder="ex: 10x20x5" required />
              </div>
              <div class="mb-3">
                  <label for="editDestination" class="form-label">Destination:</label>
                  <input type="text" id="editDestination" name="destination" class="form-control" required />
              </div>
              <div class="mb-3">
                  <label for="editTarif" class="form-label">Tarif (€):</label>
                  <input type="number" step="0.01" id="editTarif" name="tarif" class="form-control" required />
              </div>
              <div class="mb-3">
                  <label for="editType" class="form-label">Type:</label>
                  <select id="editType" name="type" class="form-select" required>
                      <option value="standard">Standard</option>
                      <option value="express">Express</option>
                  </select>
              </div>

              <!-- Specific fields for ColisStandard -->
              <div class="mb-3 edit-colis-standard-fields">
                  <label for="editDelaiLivraison" class="form-label">Délai Livraison (jours):</label>
                  <input type="text" id="editDelaiLivraison" name="delaiLivraison" class="form-control" placeholder="ex: 3-5 jours"/>
              </div>
              <div class="mb-3 form-check edit-colis-standard-fields">
                  <input type="checkbox" class="form-check-input" id="editAssuranceIncluse" name="assuranceIncluse">
                  <label class="form-check-label" for="editAssuranceIncluse">Assurance Incluse</label>
              </div>

              <!-- Specific fields for ColisExpress -->
              <div class="mb-3 edit-colis-express-fields d-none">
                  <label for="editPriorite" class="form-label">Priorité:</label>
                  <select id="editPriorite" name="priorite" class="form-select">
                      <option value="haute">Haute</option>
                      <option value="moyenne">Moyenne</option>
                      <option value="basse">Basse</option>
                  </select>
              </div>
              <div class="mb-3 form-check edit-colis-express-fields d-none">
                  <input type="checkbox" class="form-check-input" id="editLivraisonUrgente" name="livraisonUrgente">
                  <label class="form-check-label" for="editLivraisonUrgente">Livraison Urgente</label>
              </div>

              <div class="mb-3">
                  <label for="editStatut" class="form-label">Statut:</label>
                  <select id="editStatut" name="statut" class="form-select" required>
                      <option value="en attente">En attente</option>
                      <option value="en transit">En transit</option>
                      <option value="livre">Livré</option>
                      <option value="annule">Annulé</option>
                  </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">Mettre à jour</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalElement = document.getElementById('editModal2');
    if (modalElement) {
        editColisBootstrapModal = new bootstrap.Modal(modalElement);
        editForm = document.getElementById('editColisForm');
        editTypeSelect = document.getElementById('editType');
        editColisStandardFields = document.querySelectorAll('.edit-colis-standard-fields');
        editColisExpressFields = document.querySelectorAll('.edit-colis-express-fields');
        editStatutSelect = document.getElementById('editStatut'); 

        editTypeSelect.addEventListener('change', toggleEditColisTypeFields);
    }
});

const toggleEditColisTypeFields = () => {
    const selectedType = editTypeSelect.value;

    editColisStandardFields.forEach(field => {
        if (selectedType === 'standard') {
            field.classList.remove('d-none');
            field.querySelectorAll('input, select').forEach(input => input.removeAttribute('disabled'));
        } else {
            field.classList.add('d-none');
            field.querySelectorAll('input, select').forEach(input => input.setAttribute('disabled', 'true'));
        }
    });

    editColisExpressFields.forEach(field => {
        if (selectedType === 'express') {
            field.classList.remove('d-none');
            field.querySelectorAll('input, select').forEach(input => input.removeAttribute('disabled'));
        } else {
            field.classList.add('d-none');
            field.querySelectorAll('input, select').forEach(input => input.setAttribute('disabled', 'true'));
        }
    });
};

const handleEditColis = (colis) => {
    if (!editColisBootstrapModal || !editForm || !editTypeSelect || !editStatutSelect) {
        console.error('Bootstrap Modal or form elements for colis are not initialized.');
        showToast('Erreur: Impossible d\'ouvrir le formulaire d\'édition.', 'error');
        return;
    }

    document.getElementById('editColisId').value = colis.id || '';
    document.getElementById('editPoids').value = colis.poids || '';
    document.getElementById('editDimensions').value = colis.dimensions || '';
    document.getElementById('editDestination').value = colis.destination || '';
    document.getElementById('editTarif').value = colis.tarif || '';

   
    if (colis.priorite !== undefined && colis.priorite !== null) {
        editTypeSelect.value = 'express';
    } else {
        editTypeSelect.value = 'standard';
    }

    if (editTypeSelect.value === 'standard') {
        document.getElementById('editDelaiLivraison').value = colis.delaiLivraison || '';
        document.getElementById('editAssuranceIncluse').checked = colis.assuranceIncluse || false;

        document.getElementById('editPriorite').value = 'haute';
        document.getElementById('editLivraisonUrgente').checked = false;
    } else if (editTypeSelect.value === 'express') {
        document.getElementById('editPriorite').value = colis.priorite || 'haute';
        document.getElementById('editLivraisonUrgente').checked = colis.livraisonUrgente || false;
       
        document.getElementById('editDelaiLivraison').value = '';
        document.getElementById('editAssuranceIncluse').checked = false;
    }

    editStatutSelect.value = colis.statut || 'en attente'; 

    toggleEditColisTypeFields();

    editColisBootstrapModal.show();

    editForm.onsubmit = null;
    editForm.onsubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(editForm);
        const updatedData = Object.fromEntries(formData.entries());

        updatedData.poids = parseFloat(updatedData.poids);
        updatedData.tarif = parseFloat(updatedData.tarif);

        const currentColisType = editTypeSelect.value;
        updatedData.type = currentColisType;

        if (currentColisType === 'standard') {
            updatedData.assuranceIncluse = updatedData.assuranceIncluse === 'on';
          
            delete updatedData.priorite;
            delete updatedData.livraisonUrgente;
        } else if (currentColisType === 'express') {
            updatedData.livraisonUrgente = updatedData.livraisonUrgente === 'on';
         
            delete updatedData.delaiLivraison;
            delete updatedData.assuranceIncluse;
        }


        try {
            await updateColis(colis.id, updatedData);
            showToast('Colis mis à jour avec succès');
            editColisBootstrapModal.hide();
            if (window.renderColisTable) {
                window.renderColisTable();
            } else {
                console.warn("window.renderColisTable is not defined. Table may not refresh.");
            }
        } catch (err) {
            showToast(err.message || 'Erreur lors de la mise à jour du colis.', 'error');
            console.error('Error updating colis:', err);
        }
    };
};

export const renderColisTable = async (filter = '') => {
    window.currentPage = "colis"

    const tbody = document.getElementById('colisTable');
    if (!tbody) {
        console.warn('Le conteneur #colisTable est introuvable.');
        return;
    }

    tbody.innerHTML = '';
    try {
        const colisList = await getColis();
        const filtered = colisList.filter((colis) =>
            colis.statut?.toLowerCase().includes(filter.toLowerCase()),
        );

        if (filtered.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 10;
            td.textContent = 'Aucun colis trouvé.';
            td.className = 'text-center text-muted';
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        filtered.forEach((colis) => {
            const tr = document.createElement('tr');
            tr.dataset.colisId = colis.id;

            const createTd = (text) => {
                const td = document.createElement('td');
                td.textContent = text;
                return td;
            };

            console.log(colis)

            tr.append(
                createTd(colis.id),
                createTd(colis.poids !== undefined ? colis.poids + ' kg' : ''),
                createTd(colis.dimensions || ''),
                createTd(colis.destination || ''),
                createTd(colis.tarif !== undefined ? `${colis.tarif} €` : ''),
                createTd(colis.type || ''),
            );

            let typeSpecificDetails = '';
            if (colis.type === 'standard') {
                typeSpecificDetails = `Délai: ${colis.delaiLivraison || 'N/A'}, Assurance: ${colis.assuranceIncluse ? 'Oui' : 'Non'}`;
            } else if (colis.type === 'express') {
                typeSpecificDetails = `Priorité: ${colis.priorite || 'N/A'}, Urgente: ${colis.livraisonUrgente ? 'Oui' : 'Non'}`;
            } else {
                typeSpecificDetails = 'N/A'; 
            }
            tr.appendChild(createTd(typeSpecificDetails));

            tr.append(
                createTd(colis.expediteur?.nom || colis.expediteur || 'N/A'),
                createTd(colis.statut || ''),
            );

            const actionTd = document.createElement('td');
            actionTd.style.minWidth = 150

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-warning me-2';



            editBtn.textContent = 'Modifier';
            editBtn.setAttribute('aria-label', `Modifier le colis ${colis.id}`);
            editBtn.onclick = () => handleEditColis(colis);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-danger';
            deleteBtn.textContent = 'Supprimer';
            deleteBtn.setAttribute('aria-label', `Supprimer le colis ${colis.id}`);
            deleteBtn.onclick = async () => {
                if (confirm('Voulez-vous vraiment supprimer ce colis ?')) {
                    try {
                        await deleteColis(colis.id);
                        showToast('Colis supprimé avec succès');
                        renderColisTable(filter);
                    } catch (err) {
                        showToast(err.message, 'error');
                        console.error('Error deleting colis:', err);
                    }
                }
            };

            actionTd.appendChild(editBtn);
            actionTd.appendChild(deleteBtn);
            tr.appendChild(actionTd);

            tbody.appendChild(tr);
        });
    } catch (error) {
        showToast('Erreur lors du chargement des colis', 'error');
        console.error('Error in renderColisTable:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderColisTable();
});