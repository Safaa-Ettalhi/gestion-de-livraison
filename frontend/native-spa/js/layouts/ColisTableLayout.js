
import LivraisonTableLayout from './LivraisonTableLayout.js';


const LivraisonPageLayout = () => {

  return `
    <h1 class="text-center">Gestion des Livraisons</h1>

    <!-- Add Livraison Button -->
    <div class="d-flex justify-content-between mb-3 w-100">
    <div class="d-flex gap-2 mb-3 w-100">
    <button
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#livraisonModal"
      id="addLivraisonBtn"
    >
      Ajouter Livraison
    </button>
    <button
      
      class="btn btn-secondary"
      data-bs-toggle="modal"
      data-bs-target="#colisModal"
      id="addColisBtn"
    >
      Ajouter Colis
    </button>
    <button
    style="background-color: #ff4d4d; color: white;"
      class="btn btn-secondary bg-red"
      data-bs-toggle="modal"
      data-bs-target="#expediteurModal"
      id="addExpediteurBtn"
    >
      Ajouter Expediteur
    </button>

    </div>
    <button class="btn btn-secondary"
      data-bs-toggle="modal"
    
    id="reloadBtn">Recharger</button>

    </div>
    <!-- Toast Notification -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
      <div
        id="liveToast"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header">
          <strong class="me-auto">Notification</strong>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body"></div>
      </div>
    </div>

    <div class="d-flex gap-2 p-2 bg-gray" id="">
    <button
      class="btn btn-secondary" 
      id="livraisonTab"
      >
      Livraisons
      </button>
    <button
      class="btn btn-secondary" 
      id="colisTab"
      >
      Colis
      </button>
    <button
      class="btn btn-secondary" 
      id="expediteurTab"
      >
      Expéditeurs
      </button>
    </div>

    <!-- Search Input -->
    <div class="my-3">
      <input
        type="text"
        id="searchInput"
        class="form-control"
        placeholder="Rechercher une livraison par statut (ex: EN_COURS)"
      />
    </div>
    <div id="livraisonModal" ></div>

    ${LivraisonTableLayout()}
  `;

    


};

export default LivraisonPageLayout;
