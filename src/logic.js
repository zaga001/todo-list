export const projects = [
    { name: 'default', todos: [] }
];

export function saveToLocalStorage() {
    localStorage.setItem('todoProjects', JSON.stringify(projects));
}

export function loadFromLocalStorage() {
    const savedProjects = localStorage.getItem('todoProjects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    }
}

export function createProject(projectName) {
    if (!projects.find(p => p.name === projectName)) {
        projects.push({ name: projectName, todos: [] });
        saveToLocalStorage();
    }
}

export function createTodo(title, description, dueDate, priority, projectName = 'default') {
    const project = projects.find(p => p.name === projectName);

    if (!project) {
        console.error('Project not found');
        return;
    }

    const todo = {
        title,
        description,
        dueDate,
        priority,
        completed: false
    };

    project.todos.push(todo);
    saveToLocalStorage();
}

export function completeTodo(projectName, todoTitle) {
    const project = projects.find(p => p.name === projectName);
    
    if (!project) {
        console.error('Project not found');
        return;
    }

    const todo = project.todos.find(t => t.title === todoTitle);
    
    if (!todo) {
        console.error('Todo not found');
        return;
    }

    todo.completed = true;
    saveToLocalStorage();
}

export function deleteTodo(projectName, todoTitle) {
    const project = projects.find(p => p.name === projectName);
    
    if (!project) {
        console.error('Project not found');
        return false;
    }
    
    const todoIndex = project.todos.findIndex(t => t.title === todoTitle);
    
    if (todoIndex === -1) {
        console.error('Todo not found');
        return false;
    }
    
    project.todos.splice(todoIndex, 1);
    saveToLocalStorage();
    return true;
}