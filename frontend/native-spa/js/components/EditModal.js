const EditLivraisonModal = ({ destinataire = '', adresse = '', dateLivraison = '', statut = '', onEdit }) => {
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'editLivraisonModal';
  modal.tabIndex = -1;
  modal.setAttribute('aria-hidden', 'true');

  modal.innerHTML = `
    <div class="modal-dialog">
      <form id="editLivraisonForm" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modifier Livraison</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="editLivraisonId" />
          
          <div class="mb-3">
            <label class="form-label">Destinataire</label>
            <input type="text" id="editDestinataire" class="form-control" value="${destinataire}" />
          </div>
          
          <div class="mb-3">
            <label class="form-label">Adresse</label>
            <input type="text" id="editAdresse" class="form-control" value="${adresse}" />
          </div>
          
          <div class="mb-3">
            <label class="form-label">Date de Livraison</label>
            <input type="date" id="editDateLivraison" class="form-control" value="${dateLivraison}" />
          </div>

          <div class="mb-3">
            <label class="form-label">Statut</label>
            <select id="editStatut" class="form-select">
              <option value="en attente" ${statut === 'en attente' ? 'selected' : ''}>En attente</option>
              <option value="en cours" ${statut === 'en cours' ? 'selected' : ''}>En cours</option>
              <option value="livrée" ${statut === 'livrée' ? 'selected' : ''}>Livrée</option>
              <option value="annulée" ${statut === 'annulée' ? 'selected' : ''}>Annulée</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" type="submit">Enregistrer</button>
        </div>
      </form>
    </div>
  `;

  modal.querySelector('#editLivraisonForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedLivraison = {
      destinataire: modal.querySelector('#editDestinataire').value,
      adresse: modal.querySelector('#editAdresse').value,
      dateLivraison: modal.querySelector('#editDateLivraison').value,
      statut: modal.querySelector('#editStatut').value
    };
    onEdit(updatedLivraison);
    const bsModal = bootstrap.Modal.getInstance(modal);
            window.reloadAllTables?.();
    bsModal.hide();
  });

  return modal;
};

export default EditLivraisonModal;
