import {
  getExpediteurs
} from '../api/expediteurService.js';
import {
  showToast
} from './Toast.js';
document.addEventListener('DOMContentLoaded', () => {
  const modalHTML = `
    <div id="editModal" class="modal fade" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form id="editForm">
            <div class="modal-header">
              <h5 class="modal-title" id="editModalLabel">Modifier Expéditeur</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <input type="hidden" id="editId" />
              <div class="mb-3">
                <label for="editNom" class="form-label">Nom</label>
                <input type="text" id="editNom" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="editEmail" class="form-label">Email</label>
                <input type="email" id="editEmail" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="editPhone" class="form-label">Téléphone</label>
                <input type="text" id="editPhone" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="editAdresse" class="form-label">Adresse</label>
                <input type="text" id="editAdresse" class="form-control" required />
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">Enregistrer</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
});

let editModal;
document.addEventListener('DOMContentLoaded', () => {
  const modalElement = document.getElementById('editModal');
  if (modalElement) {
    editModal = new bootstrap.Modal(modalElement);
  }
});

const getExpediteurById = async (id) => {
  const all = await getExpediteurs();
  return all.find((e) => e.id === id);
};

export const handleEdit = async (expediteurId) => {
  const exp = await getExpediteurById(expediteurId);
  if (!exp) {
    showToast('Expéditeur introuvable', 'error');
    return;
  }

  document.getElementById('editId').value = exp.id;
  document.getElementById('editNom').value = exp.nom;
  document.getElementById('editEmail').value = exp.email;
  document.getElementById('editPhone').value = exp.phone;
  document.getElementById('editAdresse').value = exp.adresse;

  editModal.show();
};

document.addEventListener('submit', async (e) => {
  if (e.target.id === 'editForm') {
    e.preventDefault();

    const id = document.getElementById('editId').value;
    const updatedExp = {
      nom: document.getElementById('editNom').value,
      email: document.getElementById('editEmail').value,
      phone: document.getElementById('editPhone').value,
      adresse: document.getElementById('editAdresse').value,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/v1/expediteurs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExp),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la mise à jour');
      }

      showToast(`Expéditeur ID ${id} mis à jour avec succès`, 'success');
      editModal.hide();
      renderExpediteurTable();
    } catch (error) {
      console.error('Erreur de mise à jour :', error);
      showToast(`Erreur lors de la mise à jour : ${error.message}`, 'error');
    }
  }
});


const handleDelete = async (expediteurId) => {
  console.log(`Suppression demandée pour l’expéditeur ID: ${expediteurId}`);

  if (confirm(`Êtes-vous sûr de vouloir supprimer l’expéditeur ID: ${expediteurId} ?`)) {
    showToast(`Suppression de l’expéditeur ID: ${expediteurId}...`, 'warning');

    try {
      const response = await fetch(`http://localhost:8000/api/v1/expediteurs/${expediteurId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la suppression');
      }

      showToast(`Expéditeur ID: ${expediteurId} supprimé avec succès`, 'success');
      renderExpediteurTable(); 

    } catch (error) {
      console.error(`Erreur lors de la suppression de l’expéditeur ID: ${expediteurId}`, error);
      showToast(`Erreur : ${error.message}`, 'error');
    }
  } else {
    console.log(`Suppression annulée pour l’expéditeur ID: ${expediteurId}`);
    showToast(`Suppression annulée pour l’expéditeur ID: ${expediteurId}`, 'info');
  }
};

export const renderExpediteurTable = async (filter = '') => {
    window.currentPage = "expediteur"
  const tbody = document.getElementById('expediteurTable');
  if (!tbody) {
    console.warn('Le conteneur #expediteurTable est introuvable.');
    return;
  }
  tbody.innerHTML = ''; 

  try {
    const expediteurs = await getExpediteurs();
    const filtered = expediteurs.filter(
      (e) =>
      e.nom?.toLowerCase().includes(filter.toLowerCase()) ||
      e.email?.toLowerCase().includes(filter.toLowerCase()),
    );

    if (filtered.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 6; 
      td.textContent = 'Aucun expéditeur trouvé.';
      td.className = 'text-center text-muted';
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    filtered.forEach((exp) => {
      const tr = document.createElement('tr');
      tr.dataset.expediteurId = exp.id; 
      const createAndAppendTd = (text) => {
        const td = document.createElement('td');
        td.textContent = text;
        tr.appendChild(td);
      };

      createAndAppendTd(exp.id);
      createAndAppendTd(exp.nom);
      createAndAppendTd(exp.email);
      createAndAppendTd(exp.phone);
      createAndAppendTd(exp.adresse);

      const actionTd = document.createElement('td');

      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-sm btn-primary me-2';
      editBtn.textContent = 'Modifier';
      editBtn.setAttribute('aria-label', `Modifier ${exp.nom}`);
      editBtn.addEventListener('click', () => handleEdit(exp.id));
      actionTd.appendChild(editBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-sm btn-danger';
      deleteBtn.textContent = 'Supprimer';
      deleteBtn.setAttribute('aria-label', `Supprimer ${exp.nom}`);
      deleteBtn.addEventListener('click', () => handleDelete(exp.id));
      actionTd.appendChild(deleteBtn);

      tr.appendChild(actionTd);
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error fetching or rendering expediteurs:', err);
    showToast('Erreur lors du chargement des expéditeurs', 'error');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  renderExpediteurTable();
});