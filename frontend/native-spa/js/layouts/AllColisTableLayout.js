const ColisTableLayout = () => {
  return `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Poids</th>
          <th>Dimensions</th>
          <th>Destination</th>
          <th>Tarif</th>
          <th>Type</th>
          <th>Délai de Livraison</th>
          <th>Assurance Incluse</th>
          <th>Expéditeur</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody id="colisTable"></tbody>
    </table>
  `;
};

export default ColisTableLayout;