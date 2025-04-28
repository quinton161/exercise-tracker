document.addEventListener('DOMContentLoaded', () => {
    const newUserForm = document.getElementById('new-user-form');
    const exerciseForm = document.getElementById('exercise-form');
    const logForm = document.getElementById('log-form');
    const resultContainer = document.getElementById('result');
    const resultJson = document.getElementById('result-json');

    // Function to display API response
    const displayResult = (data) => {
        resultContainer.classList.remove('hidden');
        resultJson.textContent = JSON.stringify(data, null, 2);

        // Scroll to the result section
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle new user form submission
    newUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData(newUserForm);
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(formData)
            });

            const data = await response.json();
            displayResult(data);

            // Clear the form
            newUserForm.reset();
        } catch (error) {
            console.error('Error creating user:', error);
            displayResult({ error: 'Failed to create user' });
        }
    });

    // Handle exercise form submission
    exerciseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData(exerciseForm);
            const userId = formData.get('_id');

            // Keep _id in the URL but remove it from the form data that's sent
            const formDataToSend = new FormData();
            for (const [key, value] of formData.entries()) {
                if (key !== '_id') {
                    formDataToSend.append(key, value);
                }
            }

            const response = await fetch(`/api/users/${userId}/exercises`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(formDataToSend)
            });

            const data = await response.json();
            displayResult(data);

            // Clear form fields except userId
            document.getElementById('description').value = '';
            document.getElementById('duration').value = '';
            document.getElementById('date').value = '';
        } catch (error) {
            console.error('Error adding exercise:', error);
            displayResult({ error: 'Failed to add exercise' });
        }
    });

    // Handle log form submission
    logForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const userId = document.getElementById('logUserId').value;
            const from = document.getElementById('from').value;
            const to = document.getElementById('to').value;
            const limit = document.getElementById('limit').value;

            // Build query string
            let url = `/api/users/${userId}/logs`;
            const params = new URLSearchParams();

            if (from) params.append('from', from);
            if (to) params.append('to', to);
            if (limit) params.append('limit', limit);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            displayResult(data);
        } catch (error) {
            console.error('Error fetching logs:', error);
            displayResult({ error: 'Failed to fetch logs' });
        }
    });

    // Fetch and display all users
    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const users = await response.json();

            if (users.length > 0) {
                displayResult(users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Fetch users on page load
    fetchUsers();
}); 