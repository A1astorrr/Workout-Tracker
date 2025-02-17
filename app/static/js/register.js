document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const [username, email, password] = ['username', 'email', 'password'].map(id => document.getElementById(id).value.trim());
    if (!username || !email || !password) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        if (response.ok) {
            window.location.href = '/pages/login';
        } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Ошибка регистрации');
        }
    } catch (error) {
        alert(error.message);
    }
});