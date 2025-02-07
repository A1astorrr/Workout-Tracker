function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .workout-card {
            background: #fff;
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
        }
        .status.completed {
            color: green;
        }
        .status.not-completed {
            color: red;
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
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        addStyles();
        updateAuthState(); 
        console.log("Приложение инициализировано.");
    } catch (error) {
        console.error("Ошибка инициализации:", error);
    }
});

const updateAuthState=()=>{
    const isLoggedIn=localStorage.getItem('isLoggedIn')==='true',
          auth=document.getElementById('authButtons'),
          user=document.getElementById('userContent'),
          guest=document.getElementById('guestContent')
    if(isLoggedIn){
        const u=localStorage.getItem('username')
        auth.innerHTML=`<span class="text-gray-700">Привет, ${u}</span>
            <button onclick="logout()" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Выйти</button>`
        user.classList.remove('hidden')
        guest.classList.add('hidden')
        fetchWorkouts()
    }else{
        auth.innerHTML=`<a href="/pages/login" class="text-gray-600 hover:text-indigo-600">Вход</a>
            <a href="/pages/register" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Регистрация</a>`
        user.classList.add('hidden')
        guest.classList.remove('hidden')
    }
}

const logout=()=>{
    localStorage.clear()
    location.href='/pages'
}

document.getElementById('workoutForm').addEventListener('submit',async e=>{
    e.preventDefault()
    const t=document.getElementById('type').value.trim(),
          d=document.getElementById('duration').value.trim()
    if(!t||!d) return alert('Заполните все поля')
    try{
        const r=await fetch('/api/workouts',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${localStorage.getItem('token')}`
            },
            body:JSON.stringify({type:t,duration:d,completed:false})
        })
        if(!r.ok) throw new Error()
        displayWorkout(await r.json())
        document.getElementById('workoutForm').reset()
        fetchWorkouts()
    }catch{alert('Ошибка добавления')}
})

const displayWorkout=w=>{
    const div=document.createElement('div')
    div.className='workout-card'
    div.dataset.id=w.id
    div.innerHTML=`
        <h3 class="text-lg font-semibold">${w.type}</h3>
        <p>Продолжительность: ${w.duration} мин</p>
        <p class="status ${w.completed?'completed':'not-completed'}">${w.completed?'Выполнено':'Не выполнено'}</p>
        <div class="action-buttons mt-4 flex justify-center gap-2">
            <button class="complete-btn text-white">Завершить</button>
            <button class="edit-btn text-white">Редактировать</button>
            <button class="delete-btn text-white">Удалить</button>
        </div>`
    div.querySelector('.complete-btn').addEventListener('click',()=>toggleCompletion(w.id))
    div.querySelector('.edit-btn').addEventListener('click',()=>editWorkout(w))
    div.querySelector('.delete-btn').addEventListener('click',()=>deleteWorkout(w.id))
    workoutsList.appendChild(div)
}

const toggleCompletion=async id=>{
    try{
        const r=await fetch(`/api/workouts/${id}/toggle`,{
            method:'PUT',
            headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}
        })
        if(!r.ok) throw new Error()
        updateStatus(await r.json())
    }catch{alert('Ошибка изменения статуса')}
}

const updateStatus=w=>{
    const card=document.querySelector(`[data-id="${w.id}"]`)
    if(card){
        const s=card.querySelector('.status')
        s.textContent=w.completed?'Выполнено':'Не выполнено'
        s.className=`status ${w.completed?'completed':'not-completed'}`
    }
}

const editWorkout=w=>{
    document.getElementById('type').value=w.type
    document.getElementById('duration').value=w.duration
    deleteWorkout(w.id)
}

const deleteWorkout=async id=>{
    try{
        await fetch(`/api/workouts/${id}`,{
            method:'DELETE',
            headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}
        })
        fetchWorkouts()
    }catch{alert('Ошибка удаления')}
}

const fetchWorkouts=async()=>{
    try{
        const r=await fetch('/api/workouts',{
            headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}
        })
        document.getElementById('workoutsList').innerHTML=''
        if(r.ok) (await r.json()).forEach(w=>displayWorkout(w))
    }catch{alert('Ошибка загрузки')}
}

document.addEventListener('DOMContentLoaded',updateAuthState)