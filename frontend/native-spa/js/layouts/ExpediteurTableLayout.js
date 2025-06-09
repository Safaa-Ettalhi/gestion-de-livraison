const ExpediteurTableLayout = () => {
  return `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Email</th>
          <th>Téléphone</th>
          <th>Adresse</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="expediteurTable"></tbody>
    </table>
  `;
};

export default ExpediteurTableLayout;
