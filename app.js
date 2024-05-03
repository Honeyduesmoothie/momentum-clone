const loginForm = document.querySelector(".login-form");
const loginInput = document.querySelector("#login-input");
const greetingMessage = document.querySelector(".greetings__message")
const formContainer = document.querySelector(".login-form-container");
const todoRow = document.querySelector(".todo-row")
const USERNAME = "username"

// login

window.addEventListener("DOMContentLoaded",()=>{
    randomBg();
    loadPage();
})

loginForm.addEventListener("submit", handleLoginSubmit)

function randomBg(){
    const randomNumber = Math.floor(Math.random()*8)+1;
    const body = document.body
    body.style.backgroundImage = `url(images/${randomNumber}.jpeg)`
    body.style.backgroundSize = 'cover'
    body.style.backgroundRepeat = "no-repeat"
}

function handleLoginSubmit(e){
    e.preventDefault();
    const username = loginInput.value;
    localStorage.setItem(USERNAME, username);
    submitUsername(username);
}

function loadPage(){
    const savedName = localStorage.getItem(USERNAME)
    if(savedName){
        showGreetings(savedName);
        showClock();
        keepClockWorking();
        todoRow.style.opacity = 1;
    } else {
        formContainer.classList.remove("hidden")
        greetingMessage.classList.add("hidden")
    }
}

function submitUsername(name){
    formContainer.style.opacity = 0;
    setTimeout(()=>{
        showGreetings(name);
        showClock();
        keepClockWorking();
        todoRow.style.opacity = 1;
    }, 500)
}

function showGreetings(name){
    formContainer.classList.add("hidden")
        greetingMessage.classList.remove("hidden")
        greetingMessage.style.opacity = 1;
        greetingMessage.textContent = `Greetings, ${name}`
}

// Clock
function showClock(){
    const curTime = new Date();
    const hours = String(curTime.getHours()).padStart(2,"0");
    const minutes = String(curTime.getMinutes()).padStart(2,"0");
    const clock = document.querySelector(".clock");
    clock.textContent = `${hours}:${minutes}`
    clock.classList.remove("hidden")
}

function keepClockWorking(){
    setInterval(showClock,1000);
}

// Todo list
const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector("#todo-input");
const ul = document.querySelector(".todo-list");

let db=[]
const TODO_KEY = "todos"

todoForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const todo = todoInput.value;
    const curTime = new Date().getTime();
    const newObj = {
            content: todo,
            id: curTime,
        }
    db.push(newObj);
    paintTodoList(newObj);
    saveTodoList();
    todoInput.value = ""
})

function paintTodoList(obj){
    const li = document.createElement("li");
    const span = document.createElement("span");
    const removeBtn = document.createElement("button");
    const todoCheck = document.createElement("input")
    todoCheck.type = "checkbox";
    span.textContent = obj.content;
    removeBtn.textContent = "X";
    li.id = obj.id;
    li.appendChild(todoCheck)
    li.appendChild(span);
    li.appendChild(removeBtn);
    ul.appendChild(li);
    removeBtn.addEventListener("click", deleteList)
    todoCheck.addEventListener("click", taskCompleted)
}

function saveTodoList(){
    const jsonDb = JSON.stringify(db)
    localStorage.setItem(TODO_KEY, jsonDb)
}

function deleteList(e){
    e.preventDefault();
    list = e.target.parentElement;
    db = db.filter(obj => 
        obj.id !== Number(list.id)
    )
    saveTodoList();
    list.remove();
}

const savedTodos = localStorage.getItem(TODO_KEY);

if (savedTodos) {
    db = JSON.parse(savedTodos);
    db.forEach(obj => {
        paintTodoList(obj);
    })
}

function taskCompleted(e){
    const list = e.target.nextSibling;
    list.classList.toggle("completed")
}

// weather API

navigator.geolocation.getCurrentPosition(onSuccess,onError);

const API_KEY = "cff9be77a7e7a27901b229714e32702d"

function onSuccess(position){
    const weather = document.querySelector(".weather")
    const location = document.querySelector(".location")
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    fetch(url)
        .then((response)=>{
            if (!response) {
                throw new Error(`HTTP error: ${response.status}`)
            }
            console.log(response)
            return response.json();
        })
        .then((json) => {
            console.log(json)
            weather.textContent = ` ${json.weather[0].main} ${Math.round(json.main.temp)}°C`
            location.textContent = `${json.name}`
        })
}

function onError(){
    alert("Can't get your GPS info")
}