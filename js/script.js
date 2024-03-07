// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");
let oldInputValue;

// Funções 
const saveTodo = (text, done = 0, save = 1) => {
    const todo = document.createElement('div')
    todo.classList.add('todo')
    todo.innerHTML = `
          <h3>${text}</h3>
          <button class="finish-todo">
            <i class="fa-solid fa-check"></i>
          </button>
          <button class="edit-todo">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="remove-todo">
            <i class="fa-solid fa-xmark"></i>
          </button>
    `
    todoList.appendChild(todo)

    // Utilizando dados da localStorage
    if (done) {
        todo.classList.add('done')
    }

    if (save) {//save criado somente para criar condição
        saveTodoLocalStorage({text, done: 0})
    }

    todoInput.value = ''
}

const toggleForms = () => {
    editForm.classList.toggle('hide')
    todoForm.classList.toggle('hide')
    todoList.classList.toggle('hide')
}

const updateTodo = (text) => {
    const todos = document.querySelectorAll('.todo')
    
    todos.forEach((todo) => {
        let todoTitle = todo.querySelector('h3')
        
        if (todoTitle.innerText === oldInputValue) {//valor atual é igual anterior?
            todoTitle.innerText = text //recebe valor atual

            // Utilizando dados da localStorage
            updateTodoLocalStorage(oldInputValue, text)
        }
    })
}

const getSearchedTodos = (search) => {
    const todos = document.querySelectorAll('.todo')

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector('h3').innerText.toLowerCase()
        
        todo.style.display = 'flex'

        if (!todoTitle.includes(search)){
            todo.style.display = 'none'
        }
    })
}

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll('.todo')

    switch (filterValue){
        case 'all':
            todos.forEach((todo) => (todo.style.display = 'flex')) //flex para aparecer as divs
            break

        case 'done':
            todos.forEach((todo) => {
                todo.classList.contains('done') 
                ? (todo.style.display = 'flex') //flex só para aparecer a div,não interfere nos dados, definida css
                : (todo.style.display = 'none') // esconder a div
            })
            break
        
        case 'todo':
            todos.forEach((todo) => {
                !todo.classList.contains('done')
                ? (todo.style.display = 'flex') //flex só para aparecer a div,não interfere nos dados, definida css
                : (todo.style.display = 'none') // esconder a div
            })
            break

            default:
            break
    }
}

// Eventos
todoForm.addEventListener('submit' ,(e) => {/* o submit são para formulários, posso pegar o id direto do form e não do input, 
o input já entende que o click é do botão.*/
    e.preventDefault()//bloqueia o envio de dados para backend, desta forma permite pegar valores do input

    const inputValue = todoInput.value;
    
    if (inputValue) {
        saveTodo(inputValue)
    }
})

document.addEventListener('click', (e) => {
    const targetEl = e.target
    const parentEl = targetEl.closest('div')//pega div mais próxima do elemento tergetEl
    let todoTitle
    
    if (parentEl && parentEl.querySelector('h3')){
        todoTitle = parentEl.querySelector('h3').innerText || ''
    }
    
    if (targetEl.classList.contains('finish-todo')){
        parentEl.classList.toggle('done')

        updateTodoStatusLocalStorage(todoTitle)
    }

    if (targetEl.classList.contains('remove-todo')){
        parentEl.remove()

        // Utilizando dados da localStorage
        removeTodoLocalStorage(todoTitle)
    }

    if (targetEl.classList.contains('edit-todo')){
        toggleForms()

        editInput.value = todoTitle
        oldInputValue = todoTitle
    }
})

cancelEditBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleForms()
})

editForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const editInputValue = editInput.value

    if (editInputValue) {
        updateTodo(editInputValue)
    }

    toggleForms()
})

searchInput.addEventListener('keyup', (e) => {
    const search = e.target.value//valores digitados

    getSearchedTodos(search)
})

eraseBtn.addEventListener('click', (e) => {
    e.preventDefault()

    searchInput.value = searchInput.value.slice(0, -1)

    searchInput.dispatchEvent(new Event('keyup'))
})

filterBtn.addEventListener('change', (e) => {//quando mudar
    const filterValue = e.target.value//valor informado no value do option html
    
    filterTodos(filterValue)
})

// Local Storage
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem('todos')) || []

    return todos 
}

const saveTodoLocalStorage = (todo) => {
    // o objeto esta sendo recebido no 'todo'
    const todos = getTodosLocalStorage()

    todos.push(todo)//adicionando o objeto na array vazia

    localStorage.setItem('todos',JSON.stringify(todos))
}

const loadTodos = () => {
    // enviando os valores para tela 
    const todos = getTodosLocalStorage()

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0)
    })
}

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage()

    const filteredTodos = todos.filter((todo) => todo.text != todoText)//filtra todos elementos do localStorage e se o titulo da div for diferente do titulo dela mesmo, retorne todos valores diferentes

    localStorage.setItem('todos',JSON.stringify(filteredTodos))
}

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage()

    todos.map((todo) => {
        todo.text === todoText ? (todo.done = !todo.done) : null
    })

    localStorage.setItem('todos', JSON.stringify(todos))
}

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage()

    todos.map((todo) => {
        todo.text === todoOldText ? (todo.text = todoNewText) : null
    })

    localStorage.setItem('todos', JSON.stringify(todos))
}

loadTodos()
