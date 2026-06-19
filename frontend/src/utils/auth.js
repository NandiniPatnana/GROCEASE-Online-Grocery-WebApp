// Authentication utility functions

export const getToken = () => {
    return sessionStorage.getItem('token');
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const removeToken = () => {
    sessionStorage.removeItem('token');
};

// Function to add auth token to axios requests
export const setAuthHeader = (axios) => {
    const token = getToken();
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};
