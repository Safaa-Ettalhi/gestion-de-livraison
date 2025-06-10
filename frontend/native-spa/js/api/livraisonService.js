const baseUrl = 'http://localhost:8000';

export const getLivraisons = async () => {
    const response = await fetch(`${baseUrl}/api/v1/livraisons`);
    return response.json();
};

export const getColis = async () => {
    const response = await fetch(`${baseUrl}/api/v1/colis`);
    return response.json();
};

export const getLivraison = async (id) => {
    const response = await fetch(`${baseUrl}/api/v1/livraisons/${id}`);
    if (!response.ok) {
        throw new Error(`Error fetching livraison with id ${id}: ${response.statusText}`);
    }
    return response.json();
};  



export const deleteLivraison = async (id) => {
    const response = await fetch(`${baseUrl}/api/v1/livraisons/${id}`, {
        method: 'DELETE',
    });
    return response.ok;
};


export const updateLivraison = async (id, data) => {
    const response = await fetch(`${baseUrl}/api/v1/livraisons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.ok;
};

export const addLivraison = async (formData) => {
    const response = await fetch(`${baseUrl}/api/v1/livraisons`, {
        method: 'POST',
        body: formData,
    });
    return response.ok;
};

export const getFile = (path) => `${baseUrl}/files/v1?path=${path}`;