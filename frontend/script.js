const userForm = document.getElementById('userForm');
const usernameInput = document.getElementById('username');
const ageInput = document.getElementById('age');
const userTableBody = document.getElementById('userTableBody');
const paginationContainer = document.getElementById('pagination');

const API_BASE_URL = 'http://127.0.0.1:4000';
const USERS_PER_PAGE = 5;
let currentPage = 1;
let allUsers = [];

// Helper function to fetch all users from the backend
const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getData`);
        allUsers = response.data.userData;
        renderTable();
        renderPagination();
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users. Please check the backend server.');
    }
};

// Function to render the user table for the current page
const renderTable = () => {
    userTableBody.innerHTML = '';
    const start = (currentPage - 1) * USERS_PER_PAGE;
    const end = start + USERS_PER_PAGE;
    const usersToDisplay = allUsers.slice(start, end);

    if (usersToDisplay.length === 0) {
        const row = userTableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 3;
        cell.textContent = 'No users found.';
        cell.style.textAlign = 'center';
        return;
    }

    usersToDisplay.forEach(user => {
        const row = userTableBody.insertRow();
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.age}</td>
            <td class="actions-cell">
                <button class="edit-btn" data-id="${user._id}">Edit</button>
                <button class="delete-btn" data-id="${user._id}">Delete</button>
            </td>
        `;
    });
};

// Function to render the pagination controls
const renderPagination = () => {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(allUsers.length / USERS_PER_PAGE);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('page-btn');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            renderTable();
            // Update active class
            document.querySelectorAll('.page-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
        paginationContainer.appendChild(button);
    }
};

// Handle form submission for adding or updating a user
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const age = parseInt(ageInput.value, 10);

    if (!username || isNaN(age)) {
        alert('Please enter a valid username and age.');
        return;
    }

    const userId = userForm.dataset.editingId;

    if (userId) {
        // Update user
        if (confirm(`Are you sure you want to update user ${username}?`)) {
            await updateUser(userId, username);
        }
    } else {
        // Add new user
        await addUser(username, age);
    }

    // Clear the form and reset button
    userForm.reset();
    delete userForm.dataset.editingId;
    document.getElementById('submitBtn').textContent = 'Add User';
});

// Add a new user
const addUser = async (username, age) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/sendData`, { username, age });
        if (response.status === 200) {
            alert(`User '${response.data.newUser.username}' added successfully.`);
            fetchUsers(); // Refresh the table
        } else {
            alert(response.data.message || 'Failed to add user.');
        }
    } catch (error) {
        console.error('Error adding user:', error);
        alert(error.response?.data?.message || 'Failed to add user. Check server connection.');
    }
};

// Update an existing user
const updateUser = async (id, username) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/updateData/${id}`, { username });
        if (response.status === 200) {
            alert(response.data.message);
            fetchUsers(); // Refresh the table
        } else {
            alert(response.data.message || 'Failed to update user.');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        alert(error.response?.data?.message || 'Failed to update user. Check server connection.');
    }
};

// Event listener for table actions (edit and delete)
userTableBody.addEventListener('click', async (e) => {
    const target = e.target;
    if (target.classList.contains('edit-btn')) {
        const userId = target.dataset.id;
        const user = allUsers.find(u => u._id === userId);
        if (user) {
            usernameInput.value = user.username;
            ageInput.value = user.age;
            userForm.dataset.editingId = userId;
            document.getElementById('submitBtn').textContent = 'Update User';
        }
    } else if (target.classList.contains('delete-btn')) {
        const userId = target.dataset.id;
        if (confirm('Are you sure you want to delete this user?')) {
            await deleteUser(userId);
        }
    }
});

// Delete a user
const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/deleteData/${id}`);
        if (response.status === 200) {
            alert(response.data.message);
            fetchUsers(); // Refresh the table
        } else {
            alert(response.data.message || 'Failed to delete user.');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.response?.data?.message || 'Failed to delete user. Check server connection.');
    }
};

// Initial data fetch on page load
document.addEventListener('DOMContentLoaded', fetchUsers);