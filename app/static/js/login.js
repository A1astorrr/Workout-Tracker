function showAlert(message) {
    alert(message);
}

async function handleLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!email || !password) {
        showAlert('Пожалуйста, заполните все поля');
        return;
    }

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', data.username);
            window.location.href = '/pages/';
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка авторизации');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        showAlert(`Ошибка авторизации: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
});