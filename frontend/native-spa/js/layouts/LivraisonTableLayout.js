const LivraisonTableLayout = () => {
  return `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Expédition</th>
          <th>Prévue</th>
          <th>Montant</th>
          <th>Statut</th>
          <th>Nb Colis</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="livraisonTable"></tbody>
    </table>
    
    </table>
  `;
};

export default LivraisonTableLayout ;
