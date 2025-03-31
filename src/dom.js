import { projects, createTodo, completeTodo, createProject, deleteTodo, loadFromLocalStorage } from "./logic";

export function dom() {
    loadFromLocalStorage();
    renderProjects();
    renderTodos();
    
    const dialog = document.querySelector('#dialog');
    document.querySelector('#task').addEventListener('click', () => dialog.showModal());
    document.querySelector('#cancel').addEventListener('click', () => dialog.close());

    document.querySelector('#date').valueAsDate = new Date();

    const form = document.querySelector("#task-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
    
        const title = document.querySelector('#task-name').value;
        const description = document.querySelector('#description').value;
        const dueDate = document.querySelector('#date').value;
        const priority = document.querySelector('#priority').value;
        const project = document.querySelector('#project').value;

        createTodo(title, description, dueDate, priority, project);

        renderTodos();

        form.reset();
        dialog.close();
        document.querySelector('#date').valueAsDate = new Date();
    });

    function getPriorityClass(priority) {
        if (priority === "low") return "low-priority";
        if (priority === "medium") return "medium-priority";
        if (priority === "high") return "high-priority";
        return "";
    }

    function renderProjects() {
        const sideElement = document.querySelector('.side');
        const projectButtons = Array.from(sideElement.querySelectorAll('button[data-project]'));
        projectButtons.forEach(button => {
            const br = button.nextElementSibling;
            if (br) br.remove();
            button.remove();
        });
        
        const projectSelect = document.querySelector('#project');
        projectSelect.innerHTML = '';
        
        projects.forEach(project => {
            sideElement.innerHTML += `
            <button type="button" data-project="${project.name}">${project.name}</button><br>`;
            
            projectSelect.innerHTML += `
            <option value="${project.name}">${project.name}</option>`;
        });
        
        addProjectFilterListeners();
    }
    
    function renderTodos() {
        const rowsElement = document.querySelector('.rows');
        rowsElement.innerHTML = '';
        
        projects.forEach(project => {
            project.todos.forEach(todo => {
                const priorityClass = getPriorityClass(todo.priority);
                const completedStyle = todo.completed ? 'style="text-decoration: line-through; opacity: 0.5;"' : '';
                
                rowsElement.innerHTML += `
                <div class="todo" data-project="${project.name}" data-title="${todo.title}" data-due="${todo.dueDate}" ${completedStyle}>
                    <button type="button" class="complete ${priorityClass}">Complete</button>
                    <p>${todo.title}</p>
                    <p class="due-date">${todo.dueDate}</p>
                    <button type="button" class="delete">Delete</button>
                </div>
                <hr>`;
            });
        });
        
        addTaskListeners();
        addCompleteListeners();
        addDeleteListeners();
    }

    function addTaskListeners() {
        const taskDialog = document.querySelector('#task-info');
    
        document.querySelectorAll('.todo').forEach(element => {
            element.addEventListener('click', () => {
                const projectName = element.getAttribute('data-project');
                const taskTitle = element.getAttribute('data-title');
    
                const project = projects.find(p => p.name === projectName);
                if (!project) return;
                
                const task = project.todos.find(t => t.title === taskTitle);
                if (!task) return;
    
                taskDialog.innerHTML = `
                    <h2>${task.title}</h2>
                    <p><strong>Description:</strong> ${task.description}</p>
                    <p><strong>Due Date:</strong> ${task.dueDate}</p>
                    <p><strong>Priority:</strong> ${task.priority}</p>
                    <p><strong>Project:</strong> ${project.name}</p>
                    <button id="close">Close</button>
                `;
    
                document.querySelector('#close').addEventListener('click', () => taskDialog.close());
    
                taskDialog.showModal();
            });
        });
    }

    function addCompleteListeners() {
        document.querySelectorAll('.complete').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();

                const todoElement = button.parentElement
                const projectName = todoElement.getAttribute('data-project');
                const todoTitle = todoElement.getAttribute('data-title');

                completeTodo(projectName, todoTitle);

                todoElement.style.textDecoration = "line-through"; 
                todoElement.style.opacity = "0.5";
            })
        })
    }
    
    function addDeleteListeners() {
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();

                const todoElement = button.parentElement;
                const projectName = todoElement.getAttribute('data-project');
                const todoTitle = todoElement.getAttribute('data-title');
                
                deleteTodo(projectName, todoTitle);
                
                const hrElement = todoElement.nextElementSibling;
                if (hrElement) {
                    hrElement.remove();
                }
                todoElement.remove();
            });
        });
    }

    function addProjectFilterListeners() {
        document.querySelector('#all-projects').addEventListener('click', () => {
            document.querySelectorAll('.rows .todo').forEach(todo => {
                todo.style.display = 'flex';
                const todoHr = todo.nextElementSibling;
                if (todoHr) todoHr.style.display = 'block';
            });
            document.querySelector('h1').textContent = 'Todo List - All Projects';
        })

        document.querySelectorAll('.side button[data-project]').forEach(button => {
            button.addEventListener('click', () => {
                const selectedProject = button.getAttribute('data-project');
                
                document.querySelector('h1').textContent = `Todo List - ${selectedProject}`;
                
                document.querySelectorAll('.rows .todo').forEach(todo => {
                    const todoProject = todo.getAttribute('data-project');
                    const todoHr = todo.nextElementSibling;
                    
                    if (todoProject === selectedProject) {
                        todo.style.display = 'flex';
                        if (todoHr) todoHr.style.display = 'block';
                    } else {
                        todo.style.display = 'none';
                        if (todoHr) todoHr.style.display = 'none';
                    }
                });
            });
        });
    }
    
    const projectDialog = document.querySelector('#project-dialog');
    function addProjectListener() {
        document.querySelector('#project-btn').addEventListener('click', () => projectDialog.showModal());
        document.querySelector('#project-cancel').addEventListener('click', () => projectDialog.close());
    }

    const projectForm = document.querySelector('#project-form');
    projectForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.querySelector('#project-name').value;
        createProject(name);
        
        renderProjects();

        projectForm.reset();
        projectDialog.close();
        addProjectListener();
    });

    addProjectListener();
}