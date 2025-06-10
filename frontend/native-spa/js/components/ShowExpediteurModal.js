const baseUrl = 'http://localhost:8000';

export const showNewModalExpediteur = () => {
    const existing = document.getElementById('expediteurNewModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'expediteurNewModal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">Nouvel Expéditeur</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <form id="expediteurForm">
                        <div class="mb-3">
                            <label for="nom" class="form-label">Nom</label>
                            <input type="text" class="form-control" id="nom" required>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" required>
                        </div>
                        <div class="mb-3">
                            <label for="phone" class="form-label">Téléphone</label>
                            <input type="text" class="form-control" id="phone" required>
                        </div>
                        <div class="mb-3">
                            <label for="adresse" class="form-label">Adresse</label>
                            <input type="text" class="form-control" id="adresse" required>
                        </div>
                    </form>
                    <div id="expediteurError" class="text-danger d-none mt-2"></div>
                </div>

                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary" id="saveExpediteurBtn">Enregistrer</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                </div>

            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    modal.querySelector('#saveExpediteurBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        const form = modal.querySelector('#expediteurForm');
        const errorContainer = modal.querySelector('#expediteurError');
        errorContainer.classList.add('d-none');
        errorContainer.textContent = '';

        const data = {
            nom: form.nom.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            adresse: form.adresse.value.trim()
        };

        try {
            const response = await fetch(`${baseUrl}/api/v1/expediteurs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                errorContainer.classList.remove('d-none');
                errorContainer.textContent = error.message || 'Erreur lors de la création de l’expéditeur.';
                return;
            }

            const result = await response.json();
            console.log('Expéditeur créé avec succès:', result);
                        window.reloadAllTables?.();

            bsModal.hide();

        } catch (err) {
            errorContainer.classList.remove('d-none');
            errorContainer.textContent = 'Une erreur s’est produite lors de la création de l’expéditeur.';
            console.log(err);
        }
    });
};
