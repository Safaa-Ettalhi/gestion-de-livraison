export default async function addLivraison(formData) {
    
        const form = modal.querySelector('#livraisonForm');
        if (form.checkValidity()) {
            const livraison = {
                dateExpedition: form.querySelector('#dateExpedition').value,
                dateLivraisonPrevue: form.querySelector('#dateLivraisonPrevue').value,
                montantTotal: parseFloat(form.querySelector('#montantTotal').value),
                statut: form.querySelector('#statut').value,
                colisListe: Array.from(modal.querySelectorAll('#colisContainer > div')).map(colisDiv => ({
                    poids: parseFloat(colisDiv.querySelector('input[type="number"]').value),
                    dimensions: colisDiv.querySelector('input[type="text"]').value,
                    destination: colisDiv.querySelector('input[type="text"]').value,
                    tarif: parseFloat(colisDiv.querySelector('input[type="number"]').value),
                    type: colisDiv.querySelector('select').value,
                    remarques: colisDiv.querySelector('textarea')?.value || ''
                }))
            };

            fetch(`${baseUrl}/api/v1/livraisons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(livraison)
            })

            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return response.json();

            })
            .then(data => {
                console.log('Livraison created successfully:', data);
            })

            console.log('Livraison data:', livraison);
            window.reloadAllTables?.();

            bsModal.hide();
        } else {
            form.reportValidity();
        }
    }
    