const baseUrl = 'http://localhost:8000';

export const getExpediteurs = async () => {
    const response = await fetch(`${baseUrl}/api/v1/expediteurs`);
    return response.json();
};