const baseUrl = 'http://localhost:8000';

export const getColis = async () => {
    const response = await fetch(`${baseUrl}/api/v1/colis`);
    return response.json();
};

export const updateColis = async (id, data) => {
  try {
    const response = await fetch(`${baseUrl}/api/v1/colis/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `HTTP error! status: ${response.status} - ${
          errorData.message || 'Erreur inconnue lors de la mise à jour'
        }`,
      );
    }
  } catch (error) {
    console.error(`Failed to update colis ID ${id}:`, error);
    throw new Error('Erreur lors de la mise à jour');
  }
};

export const deleteColis = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/v1/colis/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `HTTP error! status: ${response.status} - ${
          errorData.message || 'Erreur inconnue lors de la suppression'
        }`,
      );
    }
  } catch (error) {
    console.error(`Failed to delete colis ID ${id}:`, error);
    throw new Error('Erreur lors de la suppression');
  }
};