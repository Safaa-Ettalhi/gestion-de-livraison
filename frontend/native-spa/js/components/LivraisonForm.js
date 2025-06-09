const LivraisonForm = ({ onSubmit }) => {
  const modalWrapper = document.createElement('div');
  modalWrapper.className = 'modal fade';
  modalWrapper.id = 'livraisonModal';
  modalWrapper.tabIndex = -1;
  modalWrapper.setAttribute('aria-labelledby', 'livraisonModalLabel');
  modalWrapper.setAttribute('aria-hidden', 'true');

  modalWrapper.innerHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <form id="livraisonForm">
          <div class="modal-header">
            <h5 class="modal-title" id="livraisonModalLabel">Ajouter une livraison</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div id="formErrors" class="alert alert-danger d-none"></div>

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
            <div id="colisContainer"></div>
            <button type="button" class="btn btn-sm btn-secondary mt-2" id="addColisBtn">+ Ajouter un colis</button>
          </div>

          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Initialisation des événements
  setTimeout(() => {
    const colisContainer = modalWrapper.querySelector('#colisContainer');
    const addColisBtn = modalWrapper.querySelector('#addColisBtn');

    const createColisFields = () => {
      const colisDiv = document.createElement('div');
      colisDiv.className = 'border rounded p-3 mb-3';
      colisDiv.innerHTML = `
        <div class="mb-2">
          <label class="form-label">Poids (kg)</label>
          <input type="number" class="form-control colis-poids" required />
        </div>
        <div class="mb-2">
          <label class="form-label">Dimensions</label>
          <input type="text" class="form-control colis-dimensions" required />
        </div>
        <div class="mb-2">
          <label class="form-label">Destination</label>
          <input type="text" class="form-control colis-destination" required />
        </div>
        <div class="mb-2">
          <label class="form-label">Tarif (€)</label>
          <input type="number" class="form-control colis-tarif" required />
        </div>
        <div class="mb-2">
          <label class="form-label">Type</label>
          <select class="form-select colis-type" required>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
          </select>
        </div>
        <div class="mb-2">
          <label class="form-label">Statut</label>
          <input type="text" class="form-control colis-statut" required />
        </div>
        <button type="button" class="btn btn-sm btn-danger removeColisBtn">Supprimer ce colis</button>
      `;

      colisDiv.querySelector('.removeColisBtn').addEventListener('click', () => {
        colisDiv.remove();
      });

      colisContainer.appendChild(colisDiv);
    };

    addColisBtn.addEventListener('click', createColisFields);
    createColisFields(); 

    modalWrapper.querySelector('#livraisonForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const livraison = {
        dateExpedition: modalWrapper.querySelector('#dateExpedition').value,
        dateLivraisonPrevue: modalWrapper.querySelector('#dateLivraisonPrevue').value,
        montantTotal: parseFloat(modalWrapper.querySelector('#montantTotal').value),
        statut: modalWrapper.querySelector('#statut').value,
        colisListe: []
      };

      const colisElements = colisContainer.querySelectorAll('.border');
      colisElements.forEach(el => {
        livraison.colisListe.push({
          poids: parseFloat(el.querySelector('.colis-poids').value),
          dimensions: el.querySelector('.colis-dimensions').value,
          destination: el.querySelector('.colis-destination').value,
          tarif: parseFloat(el.querySelector('.colis-tarif').value),
          type: el.querySelector('.colis-type').value,
          statut: el.querySelector('.colis-statut').value
        });
      });

      await onSubmit?.(livraison);
    });
  });

  return modalWrapper;
};

export default LivraisonForm;
