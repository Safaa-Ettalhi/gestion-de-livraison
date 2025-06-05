// //modification de baseurl pour quil sera compatible avec port backend
// const baseUrl = 'http://localhost:8000';

// // AuthService.js

// export const login = async (username, password) => {
//     const response = await fetch(`${baseUrl}/api/v1/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//     });
    
//     if (!response.ok) {
//         throw new Error('Login failed');
//     }
    
//     return response.json();
// }

// export const register = async (formData) => {
//     const response = await fetch(`${baseUrl}/api/v1/register`, {
//         method: 'POST',
//         body: formData,
//     });
    
//     if (!response.ok) {
//         throw new Error('Registration failed');
//     }
    
//     return response.json();
// }

// export const logout = async () => {
//     const response = await fetch(`${baseUrl}/api/v1/logout`, {
//         method: 'POST',
//     });
//     return response.ok;
// }