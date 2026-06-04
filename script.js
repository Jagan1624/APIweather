/* =========================
   TODO APP
========================= */

const todoInput =
    document.getElementById(
        "todo-input"
    );

const addBtn =
    document.getElementById(
        "add-btn"
    );

const todoList =
    document.getElementById(
        "todo-list"
    );

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );

if (
    todoInput &&
    addBtn &&
    todoList
) {

    let todos = JSON.parse(
        localStorage.getItem("todos")
    ) || [];

    let currentFilter = "all";

    function saveTodos() {

        localStorage.setItem(
            "todos",
            JSON.stringify(todos)
        );
    }

    function renderTodos() {

        todoList.innerHTML = "";

        let filteredTodos = todos;

        if (
            currentFilter === "active"
        ) {

            filteredTodos =
                todos.filter(
                    todo => !todo.completed
                );
        }

        if (
            currentFilter === "completed"
        ) {

            filteredTodos =
                todos.filter(
                    todo => todo.completed
                );
        }

        filteredTodos.forEach(todo => {

            const li =
                document.createElement("li");

            li.classList.add(
                "todo-item"
            );

            if (todo.completed) {

                li.classList.add(
                    "completed"
                );
            }

            li.dataset.id = todo.id;

            li.innerHTML = `
                <span>${todo.text}</span>

                <div class="actions">

                    <button class="complete-btn">
                        ✓
                    </button>

                    <button class="edit-btn">
                        Edit
                    </button>

                    <button class="delete-btn">
                        Delete
                    </button>

                </div>
            `;

            todoList.appendChild(li);
        });

        saveTodos();
    }

    function addTodo() {

        const text =
            todoInput.value.trim();

        if (text === "") return;

        todos.push({

            id: Date.now(),

            text: text,

            completed: false
        });

        todoInput.value = "";

        renderTodos();
    }

    function deleteTodo(id) {

        todos = todos.filter(
            todo => todo.id !== id
        );

        renderTodos();
    }

    function toggleComplete(id) {

        todos = todos.map(todo => {

            if (todo.id === id) {

                todo.completed =
                    !todo.completed;
            }

            return todo;
        });

        renderTodos();
    }

    function editTodo(id) {

        const todo =
            todos.find(
                todo => todo.id === id
            );

        const updatedText =
            prompt(
                "Edit Task:",
                todo.text
            );

        if (
            updatedText === null ||
            updatedText.trim() === ""
        ) {

            return;
        }

        todo.text = updatedText;

        renderTodos();
    }

    addBtn.addEventListener(
        "click",
        addTodo
    );

    todoInput.addEventListener(
        "keypress",
        event => {

            if (event.key === "Enter") {

                addTodo();
            }
        }
    );

    todoList.addEventListener(
        "click",
        event => {

            const li =
                event.target.closest(
                    ".todo-item"
                );

            if (!li) return;

            const id =
                Number(li.dataset.id);

            if (
                event.target.classList.contains(
                    "delete-btn"
                )
            ) {

                deleteTodo(id);
            }

            if (
                event.target.classList.contains(
                    "complete-btn"
                )
            ) {

                toggleComplete(id);
            }

            if (
                event.target.classList.contains(
                    "edit-btn"
                )
            ) {

                editTodo(id);
            }
        }
    );

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );
                });

                button.classList.add(
                    "active"
                );

                currentFilter =
                    button.dataset.filter;

                renderTodos();
            }
        );
    });

    renderTodos();
}

/* =========================
   WEATHER DASHBOARD
========================= */

const cityInput =
    document.getElementById(
        "city-input"
    );

const searchBtn =
    document.getElementById(
        "search-btn"
    );

const weatherCard =
    document.getElementById(
        "weather-card"
    );

/*
   Your OpenWeather API Key
*/

const API_KEY =
    "646b6734830fdee665690623370d3fd6";

async function fetchWeather(city) {

    try {

        weatherCard.innerHTML = `
            <h3>Loading...</h3>
        `;

        const response =
            await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );

        if (!response.ok) {

            throw new Error(
                "City not found"
            );
        }

        const data =
            await response.json();

        renderWeather(data);

    } catch (error) {

        weatherCard.innerHTML = `
            <p class="error">
                ${error.message}
            </p>
        `;
    }
}

function renderWeather(data) {

    const {

        name,

        main,

        weather,

        wind,

        sys
    } = data;

    weatherCard.innerHTML = `

        <h3>
            ${name},
            ${sys.country}
        </h3>

        <p>
            ${weather[0].main}
        </p>

        <div class="weather-info">

            <div class="weather-item">

                🌡 Temperature:
                ${main.temp} °C

            </div>

            <div class="weather-item">

                💧 Humidity:
                ${main.humidity}%

            </div>

            <div class="weather-item">

                🌬 Wind Speed:
                ${wind.speed} m/s

            </div>

            <div class="weather-item">

                🤒 Feels Like:
                ${main.feels_like} °C

            </div>

        </div>
    `;
}

if (
    cityInput &&
    searchBtn &&
    weatherCard
) {

    searchBtn.addEventListener(
        "click",
        () => {

            const city =
                cityInput.value.trim();

            if (city !== "") {

                fetchWeather(city);
            }
        }
    );

    cityInput.addEventListener(
        "keypress",
        event => {

            if (event.key === "Enter") {

                const city =
                    cityInput.value.trim();

                if (city !== "") {

                    fetchWeather(city);
                }
            }
        }
    );
}