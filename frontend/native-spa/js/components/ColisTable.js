import { deleteColis, getColis, updateColis } from '../api/colisService.js';
import {  showToast } from './Toast.js';

let editColisBootstrapModal;

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
                  <input type="text" id="editType" name="type" class="form-control" required />
              </div>
              <div class="mb-3">
                  <label for="editDelaiLivraison" class="form-label">Délai Livraison (jours):</label>
                  <input type="number" id="editDelaiLivraison" name="delaiLivraison" class="form-control" required />
              </div>
              <div class="mb-3">
                  <label for="editAssuranceIncluse" class="form-label">Assurance Incluse:</label>
                  <select id="editAssuranceIncluse" name="assuranceIncluse" class="form-select" required>
                      <option value="true">Oui</option>
                      <option value="false">Non</option>
                  </select>
              </div>
              <div class="mb-3">
                  <label for="editStatut" class="form-label">Statut:</label>
                  <input type="text" id="editStatut" name="statut" class="form-control" required />
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
  }
});

const handleEditColis = (colis) => {
  if (!editColisBootstrapModal) {
    console.error('Bootstrap Modal for colis is not initialized.');
    showToast('Erreur: Impossible d\'ouvrir le formulaire d\'édition.', 'error');
    return;
  }

  document.getElementById('editColisId').value = colis.id || '';
  document.getElementById('editPoids').value = colis.poids || '';
  document.getElementById('editDimensions').value = colis.dimensions || '';
  document.getElementById('editDestination').value = colis.destination || '';
  document.getElementById('editTarif').value = colis.tarif || '';
  document.getElementById('editType').value = colis.type || '';
  document.getElementById('editDelaiLivraison').value =
    colis.delaiLivraison || '';
  document.getElementById('editAssuranceIncluse').value = colis.assuranceIncluse ?
    'true' :
    'false';
  document.getElementById('editStatut').value = colis.statut || '';

  editColisBootstrapModal.show(); 

  const form = document.getElementById('editColisForm');
  form.onsubmit = null;
  form.onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const updatedData = Object.fromEntries(formData.entries());

    updatedData.assuranceIncluse = updatedData.assuranceIncluse === 'true';
    updatedData.poids = parseFloat(updatedData.poids);
    updatedData.delaiLivraison = parseInt(updatedData.delaiLivraison);
    updatedData.tarif = parseFloat(updatedData.tarif);

    try {
      await updateColis(colis.id, updatedData);
      showToast('Colis mis à jour avec succès');
      editColisBootstrapModal.hide(); 
      renderColisTable(); 
    } catch (err) {
      showToast(err.message, 'error');
      console.error('Error updating colis:', err);
    }
  };
};

export const renderColisTable = async (filter = '') => {
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

      tr.append(
        createTd(colis.id),
        createTd(colis.poids !== undefined ? colis.poids + ' kg' : ''),
        createTd(colis.dimensions || ''),
        createTd(colis.destination || ''),
        createTd(colis.tarif !== undefined ? `${colis.tarif} €` : ''),
        createTd(colis.type || ''),
        createTd(
          colis.delaiLivraison !== undefined ? colis.delaiLivraison + ' j' : '',
        ),
        createTd(colis.assuranceIncluse ? 'Oui' : 'Non'),
        createTd(colis.expediteur?.nom || colis.expediteur || 'N/A'),
        createTd(colis.statut || ''),
      );

      const actionTd = document.createElement('td');

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