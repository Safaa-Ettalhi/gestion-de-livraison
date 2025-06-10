import ColisTableLayout from './AllColisTableLayout.js';
import ExpediteurTableLayout from './ExpediteurTableLayout.js';
import LivraisonTableLayout from './LivraisonTableLayout.js';

const LivraisonPageLayout = (table) => {
  return `
    <div class="d-flex min-vh-100">
      <!-- Sidebar -->
      <div class="bg-light border-end p-3" style="width: 250px;">
        <h4 class="mb-4">Navigation</h4>
        <div class="nav flex-column gap-2">
          <button class="btn btn-outline-primary w-100 d-flex align-items-center gap-2" id="livraisonTab">
            <i class="bi bi-truck"></i> Livraisons
          </button>
          <button class="btn btn-outline-primary w-100 d-flex align-items-center gap-2" id="colisTab">
            <i class="bi bi-box-seam"></i> Colis
          </button>
          <button class="btn btn-outline-primary w-100 d-flex align-items-center gap-2" id="expediteurTab">
            <i class="bi bi-person-lines-fill"></i> Expéditeurs
          </button>
        </div>
      </div>

      <!-- Main content -->
      <div class="flex-grow-1 p-4">
        <h1 class="text-center mb-4">Gestion des ${table === 'colis' ? "colis" : table}s</h1>

        <!-- Buttons -->
        <div class="d-flex justify-content-between mb-3 flex-wrap gap-2">
          <div class="d-flex gap-2 flex-wrap">
          ${
            table === "livraison"
              ? '<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#livraisonModal" id="addLivraisonBtn"><i class="bi bi-plus-circle"></i> Ajouter Livraison</button>'
              : table === "colis"
              ? '<button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#colisModal" id="addColisBtn"><i class="bi bi-box"></i> Ajouter Colis</button>'
              : ' <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#expediteurModal" id="addExpediteurBtn"><i class="bi bi-person-plus-fill"></i> Ajouter Expéditeur</button>'
          }
            
            
           
          </div>
          <button class="btn btn-outline-secondary" id="reloadBtn">
            <i class="bi bi-arrow-clockwise"></i> Recharger
          </button>
        </div>

        <!-- Search -->
        <div class="mb-4">
          <input type="text" id="searchInput" class="form-control" placeholder="Rechercher une livraison par statut (ex: EN_COURS)" />
        </div>

        <!-- Table Content -->
        <div>
          ${
            table === "livraison"
              ? LivraisonTableLayout()
              : table === "colis"
              ? ColisTableLayout()
              : ExpediteurTableLayout()
          }
        </div>
      </div>

      <!-- Toast Notification -->
      <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
        <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <strong class="me-auto">Notification</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body"></div>
        </div>
      </div>
    </div>
  `;
};

export default LivraisonPageLayout;