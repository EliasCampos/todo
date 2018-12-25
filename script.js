/* Executive part: */
//
const taskNodes = document.getElementById('tasks');
const input = document.querySelector("#input-panel textarea");
addEventListener("load", storageHandler);
input.addEventListener("keydown", createTask);
//

class Task {
    constructor(text, id, date) {
        this.id = id;
        this.text = text;
        this.date = date;
    }
    createTaskNode(parent) {
        /* A new task DOM-structure:
        .task
            li.text
            span.date
            button
        */
        const tags = [
            'div',
            'p',
            'span',
            'button'
        ];
        const classes = [
            'task',
            'text',
            'date',
            ''
        ];
        const texts = [
            this.text,
            `Posted at ${this.date}.`,
            "REMOVE"
        ];
        const nodes = tags.map((tag, indx) => {
            const node = document.createElement(tag);
            node.className = classes[indx];
            return node;
        });
        nodes[0].id = this.id;
        nodes[3].addEventListener('click', removeTask);
        nodes.slice(1)
            .forEach((node, indx) => {
                node.textContent = texts[indx];
                nodes[0].appendChild(node)});

        if (parent) {
            parent.insertBefore(nodes[0], parent.firstChild);
        }
        return nodes[0];
    }
    
}

function presentDate() {
    const date = new Date();
    const pattern = /\d{2}-\d{2}T\d{2}:\d{2}/;
    const found = pattern.exec(date.toISOString());
    return {
        msec:(""+date.getTime()),
        pretty:found[0]
    };
}

function removeTask(click) {
    this.removeEventListener('click', removeTask);
    const task = click
        .currentTarget
        .parentNode;

    localStorage.removeItem(task.id);
    taskNodes.removeChild(task);
    console.log("The task was removed.");
}
function createTask(press) {
    const form = press.currentTarget; 
    if (form.value && press.key === 'Enter') {
        const date = presentDate();
        const task = new Task(form.value, date.msec, date.pretty);
        const taskJSON = JSON.stringify(task);

        form.value = "";
        localStorage.setItem(task.id, taskJSON);
        task.createTaskNode(taskNodes);
        console.log("The task was saved.");
		press.preventDefault();
    };
    if (form.value == "" && press.key === 'Enter') press.preventDefault();
}
function storageHandler() {
    console.log("The window was loaded.");
    const size = localStorage.length;
    let key, item, task;

    for (let i = 0; i < size; i++) {
        key = localStorage.key(i);
        item = JSON.parse(localStorage.getItem(key));
        task = new Task(item.text, item.id, item.date);
        task.createTaskNode(taskNodes);
    }
}