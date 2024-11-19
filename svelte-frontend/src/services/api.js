const API_URL = "http://localhost/api"; // Replace with your backend API URL

// Get all users
export async function getUsers() {
    const response = await fetch(`${API_URL}/auth/users`);
    return await response.json();
}

export async function getProducts() {
    const response = await fetch(`${API_URL}/products/get-products`);
    return await response.json();
}

// Add a new product
export async function addProduct(product) {
    const response = await fetch(`${API_URL}/products/add-product`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });
    return await response.json();
}

// Register a new user
export async function registerUser(username, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });
    return await response.json();
}

// Update user details
export async function updateUser(id, username, password) {
    const response = await fetch(`${API_URL}/auth/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });
    return await response.json();
}

// Delete user
export async function deleteUser(id) {
    const response = await fetch(`${API_URL}/auth/users/${id}`, {
        method: "DELETE",
    });
    return response.ok;
}
