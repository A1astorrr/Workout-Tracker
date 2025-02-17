function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .workout-card {
            background: #87CEFA;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 16px;
            transition: transform 0.2s;
        }
            
        .workout-card:hover {
            transform: translateY(-5px);
        }
        .status {
            font-weight: 700;
            margin-top: 8px;
            font-size: 1.25rem;
            line-height: 1.75rem;
        }
        .status.completed {
            color: #1CAC78;
        }
        .status.not-completed {
            color: #8B0000;
        }
        .action-buttons button {
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.2s;
            margin: 0 4px;
        }
        .complete-btn {
            background: #28a745 !important;
        }
        .edit-btn {
            background: #007bff !important;
        }
        .delete-btn {
            background: #dc3545 !important;
        }
        .action-buttons button:hover {
            filter: brightness(0.9);
        }
        #burgerButton {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            cursor: pointer;
            z-index: 1001;
        }
        #mobileMenu {
            position: fixed;
            top: 60px; /* Start below the header */
            right: -100%; /* Hidden to the right by default */
            width: 100%;
            height: calc(100% - 60px); /* Full height minus header height */
            color: white;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            padding: 20px;
            gap: 20px;
            transition: right 0.3s ease;
        }
        #mobileMenu.open {
            right: 0; /* Show from the right */
        }
        #mobileMenu a, #mobileMenu button {
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            width: 100%;
            color: white;
            font-size: 1.1rem;
        }
        #mobileMenu a {
            background-color: #339fe2;
        }
        #mobileMenu button {
            background-color: #dc3545;
        }
        @media (max-width: 1024px) {
            #burgerButton {
                display: flex;
            }
            #authButtons {
                display: none;
            }
        }
        @media (min-width: 1025px) {
            #burgerButton {
                display: none;
            }
            #authButtons {
                display: flex;
            }
        }
    `;
    document.head.appendChild(style);
}

function updateAuthState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const auth = document.getElementById('authButtons');
    const mobileMenu = document.getElementById('mobileMenu');
    const user = document.getElementById('userContent');
    const guest = document.getElementById('guestContent');

    if (isLoggedIn) {
        const username = localStorage.getItem('username');
        const authContent = `
            <span class="text-gray-700 dark:text-white text-xl font-title">Привет, ${username}</span>
            <button onclick="logout()" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-title">Выйти</button>
        `;
        auth.innerHTML = authContent;
        mobileMenu.innerHTML = `
            <span class="text-gray-700 dark:text-white text-xl font-title">Привет, ${username}</span>
            <button onclick="logout()" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-title">Выйти</button>
        `;
        user.classList.remove('hidden');
        guest.classList.add('hidden');
        fetchWorkouts();
    } else {
        const authContent = `
            <a href="/pages/login" class="text-black dark:text-white hover:text-[#169eb6] font-title">Вход</a>
            <a href="/pages/register" class="bg-[#0a7e92] text-white px-4 py-2 rounded hover:bg-[#169eb6] font-title">Регистрация</a>
        `;
        auth.innerHTML = authContent;
        mobileMenu.innerHTML = authContent;
        user.classList.add('hidden');
        guest.classList.remove('hidden');
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('open');
}

function logout() {
    localStorage.clear();
    location.href = '/pages';
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        addStyles();
        updateAuthState();
        document.getElementById('burgerButton').addEventListener('click', toggleMobileMenu);
        console.log("Приложение инициализировано.");
    } catch (error) {
        console.error("Ошибка инициализации:", error);
    }
});

document.getElementById('workoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('type').value.trim();
    const duration = document.getElementById('duration').value.trim();

    if (!type || !duration) return alert('Заполните все поля');

    try {
        const response = await fetch('/api/workouts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ type, duration, completed: false })
        });

        if (!response.ok) throw new Error('Ошибка добавления');

        const workout = await response.json();
        displayWorkout(workout);
        document.getElementById('workoutForm').reset();
        fetchWorkouts();
    } catch (error) {
        alert(error.message || 'Ошибка добавления');
    }
});

function displayWorkout(workout) {
    const div = document.createElement('div');
    div.className = 'workout-card';
    div.dataset.id = workout.id;
    div.innerHTML = `
        <h3 class="text-2xl text-slate-900 font-title">${workout.type}</h3>
        <p class="text-sm text-slate-900 font-title">Продолжительность: ${workout.duration} мин</p>
        <p class="status ${workout.completed ? 'completed' : 'not-completed'}">${workout.completed ? 'Выполнено' : 'Не выполнено'}</p>
        <div class="action-buttons mt-4 flex justify-center gap-2">
            <button class="complete-btn text-white">Завершить</button>
            <button class="edit-btn text-white">Редактировать</button>
            <button class="delete-btn text-white">Удалить</button>
        </div>
    `;

    div.querySelector('.complete-btn').addEventListener('click', () => toggleCompletion(workout.id));
    div.querySelector('.edit-btn').addEventListener('click', () => editWorkout(workout));
    div.querySelector('.delete-btn').addEventListener('click', () => deleteWorkout(workout.id));

    document.getElementById('workoutsList').appendChild(div);
}

async function toggleCompletion(id) {
    try {
        const response = await fetch(`/api/workouts/${id}/toggle`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) throw new Error('Ошибка изменения статуса');

        const workout = await response.json();
        updateStatus(workout);
    } catch (error) {
        alert(error.message || 'Ошибка изменения статуса');
    }
}

function updateStatus(workout) {
    const card = document.querySelector(`[data-id="${workout.id}"]`);
    if (card) {
        const statusElement = card.querySelector('.status');
        statusElement.textContent = workout.completed ? 'Выполнено' : 'Не выполнено';
        statusElement.className = `status ${workout.completed ? 'completed' : 'not-completed'}`;
    }
}

function editWorkout(workout) {
    document.getElementById('type').value = workout.type;
    document.getElementById('duration').value = workout.duration;
    deleteWorkout(workout.id);
}

async function deleteWorkout(id) {
    try {
        await fetch(`/api/workouts/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        fetchWorkouts();
    } catch (error) {
        alert('Ошибка удаления');
    }
}

async function fetchWorkouts() {
    try {
        const response = await fetch('/api/workouts', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.status === 401) {
            handleUnauthorized();
            return;
        }

        if (!response.ok) throw new Error('Ошибка загрузки данных');

        const workouts = await response.json();
        document.getElementById('workoutsList').innerHTML = '';
        workouts.forEach(displayWorkout);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}

function handleUnauthorized() {
    localStorage.clear();
    location.href = '/pages/login';
}
