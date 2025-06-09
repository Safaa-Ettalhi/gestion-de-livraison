const baseUrl = 'http://localhost:8000';

export const showNewModalColis = () => {
    const existing = document.getElementById('colisNewModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'colisNewModal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">Ajouter un Colis</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <form id="colisForm">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Poids (kg)</label>
                                <input type="number" class="form-control" id="poids" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Dimensions</label>
                                <input type="text" class="form-control" id="dimensions" placeholder="ex: 30x20x10" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Destination</label>
                                <input type="text" class="form-control" id="destination" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Tarif (€)</label>
                                <input type="number" class="form-control" id="tarif" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Type</label>
                                <select class="form-select" id="type" required>
                                    <option value="standard">Standard</option>
                                    <option value="express">Express</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Délai de Livraison</label>
                                <input type="text" class="form-control" id="delaiLivraison" required>
                            </div>
                            <div class="col-12 mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="assuranceIncluse">
                                <label class="form-check-label" for="assuranceIncluse">Assurance incluse</label>
                            </div>

                            <hr>

                            <div class="col-12 mb-2">
                                <label class="form-label">Rechercher un Expéditeur</label>
                                <input type="text" class="form-control" id="searchExpediteur" placeholder="Nom, Email ou Téléphone">
                            </div>
                            <div class="col-12 mb-3" id="expediteurList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc; border-radius: 5px; padding: 10px;">
                                <div>Chargement des expéditeurs...</div>
                            </div>
                        </div>
                    </form>
                    <div id="colisError" class="text-danger d-none mt-2"></div>
                </div>

                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary" id="saveColisBtn">Enregistrer</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                </div>

            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    const searchInput = modal.querySelector('#searchExpediteur');
    const expediteurList = modal.querySelector('#expediteurList');
    let allExpediteurs = [];
    const loadExpediteurs = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/v1/expediteurs`);
            const expediteurs = await response.json();
            allExpediteurs = expediteurs;
            renderExpediteurs(expediteurs);
        } catch (err) {
            expediteurList.innerHTML = `<div class="text-danger">Erreur lors du chargement des expéditeurs.</div>`;
        }
    };
    const renderExpediteurs = (list) => {
        if (list.length === 0) {
            expediteurList.innerHTML = `<div>Aucun expéditeur trouvé.</div>`;
            return;
        }

        expediteurList.innerHTML = list.map(exp => `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="expediteurId" id="exp-${exp.id}" value="${exp.id}">
                <label class="form-check-label" for="exp-${exp.id}">
                    <strong>${exp.nom}</strong> | ${exp.email} | ${exp.phone}
                </label>
            </div>
        `).join('');
    };

    searchInput.addEventListener('input', () => {
        const keyword = searchInput.value.trim().toLowerCase();
        const filtered = allExpediteurs.filter(exp =>
            exp.nom.toLowerCase().includes(keyword) ||
            exp.email.toLowerCase().includes(keyword) ||
            exp.phone.includes(keyword)
        );
        renderExpediteurs(filtered);
    });

    modal.querySelector('#saveColisBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        const form = modal.querySelector('#colisForm');
        const errorContainer = modal.querySelector('#colisError');
        errorContainer.classList.add('d-none');
        errorContainer.textContent = '';

        const expediteurId = form.querySelector('input[name="expediteurId"]:checked')?.value;
        if (!expediteurId) {
            errorContainer.classList.remove('d-none');
            errorContainer.textContent = 'Veuillez sélectionner un expéditeur.';
            return;
        }

        const data = {
            poids: parseFloat(form.poids.value),
            dimensions: form.dimensions.value.trim(),
            destination: form.destination.value.trim(),
            tarif: parseFloat(form.tarif.value),
            type: form.type.value,
            delaiLivraison: form.delaiLivraison.value.trim(),
            assuranceIncluse: form.assuranceIncluse.checked,
            expediteur: parseInt(expediteurId),
            statut: 'en attente'
        };

        try {
            const response = await fetch(`${baseUrl}/api/v1/colis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                errorContainer.classList.remove('d-none');
                errorContainer.textContent = error.message || 'Erreur lors de l’ajout du colis.';
                return;
            }

            const result = await response.json();
            console.log('Colis ajouté avec succès:', result);
            window.reloadTable();
            bsModal.hide();

        } catch (err) {
            errorContainer.classList.remove('d-none');
            errorContainer.textContent = 'Une erreur s’est produite lors de l’ajout du colis.';
            console.log(err);
        }
    });

    loadExpediteurs();
};
