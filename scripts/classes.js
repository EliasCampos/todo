class Model {
    /* 
    Wrapps browsers' local storage
    and get methods for managing users' tasks.
    Users' task represents in JSON format.
    */

    constructor() {}

    addTask(text) {
        /* 
        The method will add a new storage item, where its key
        is an task id, and value is an JSON string, contains
        storages' date and text
        */
        let id = Model.generateRandomID(8);
        let date = Model.date();

        let data = JSON.stringify({text, date});
        localStorage.setItem(id, data);

        this.lastInsertedID = id;
    }
    removeTask(taskID) {
        localStorage.removeItem(taskID);
    }
    getTask(id = this.lastInsertedID) {
        /* 
        Returns an object in format: {id, date, text}
        */
        let data = JSON.parse(localStorage.getItem(id));
        data.id = id;

        return data;
    }
    getAllTasks() {
        let tasks = [], size = localStorage.length;

        for (let i = 0; i < size; i++) {
            let key = localStorage.key(i);
            let item = localStorage.getItem(key);
            let taskData = JSON.parse(item);
            taskData.id = key;
            tasks.push(taskData);
        }

        return tasks;
    }

    static date() {
        /* 
        Create date string in format "dd-mm-yyyy hh-xx-ss"
        (d, m, y, h, n, s - corresponding: day, month, year, hour, minute, second)
        */
        let dateISOformat = (new Date()).toISOString();
        let match = Model.datePattern.exec(dateISOformat);

        let date = match[1].split("-").reverse().join("-");
        let time = match[2];

        return date + " " + time;
    }
    static compareDates(firstDate, secondDate) {
        /*
        Dates in arguments should be in format, described above.
        */
        const pattern = /\d{2}-\d{2}-\d{4}/;
        const replacement = found => found.split("-").reverse().join("-");
        firstDate.replace(pattern, replacement);
        secondDate.replace(pattern, replacement);

        let difference = Date.parse(firstDate) - Date.parse(secondDate);

        if (difference < 0) return -1;
        if (difference === 0) return 0;
        return 1;
    }
    static generateRandomID(bytesLength) {
        let hexQuant = bytesLength * 2; // 1 byte can contain two hex digit
        let id = "";

        for (let i = 0; i < hexQuant; i++) {
            let randIndx = Math.floor(Math.random() * 16);
            id += Model.hexDigits[randIndx];
        }

        return id;
    }
}
Model.datePattern = /(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/;
Model.hexDigits = "0123456789abcdef";

class View {
    /* 
    Operates DOM elements, responsible for
    visual representation of users' tasks on the web-page. 
    */
    constructor(inputNode, taskListNode) {
        this.inputDOMNode = inputNode;
        this.taskListDOMNode = taskListNode;
    }

    renderTask(id, text, date) {
        let taskNode =  
        elt('div', {id, className: "task"}, 
            elt('span', {className: "text"}, text),
            elt('span', {className: "date"}, date),
            elt('button', {className: "remove-button"}, "Remove")
        );

        this.taskListDOMNode.appendChild(taskNode);
    }
    eraseTask(taskNode) {
        this.taskListDOMNode.removeChild(taskNode);
    }
}

class Controller {
    /* 
    Puts together users' data and visual representation.
    Handle users' input via events and manages adding, removing tasks.
    */
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    run() {
        this.uploadTasks();
        this.view.inputDOMNode
            .addEventListener('keydown', this.handleNewTask.bind(this));
        this.view.taskListDOMNode
            .addEventListener('click', this.handleRemoveQuery.bind(this));
    }

    uploadTasks() {
        /* 
        Tasks are sorted by date ascending (Olders come first)
        */
        this.model
            .getAllTasks()
            .sort((prev, next) => Model.compareDates(prev.date, next.date))
            .forEach(task => this.view.renderTask(task.id, task.text, task.date));
    }
    handleNewTask(event) {
        /* 
        For adding a new task, 'Enter' button should be pressed
        */
        let taskText = event.target.value; 
        if (event.key !== 'Enter' || !taskText) return;
        event.preventDefault();
        event.target.value = "";
        this.model.addTask(taskText);
        let {id, text, date} = this.model.getTask();
        this.view.renderTask(id, text, date);
    }
    handleRemoveQuery(event) {
        /* 
        Listens for click by DOM element with 
        class attribute marked as "remove-buttton"
        */
        if (event.target.className !== "remove-button") return;

        let taskNode = event.target.parentNode;
        let id = taskNode.id;

        this.model.removeTask(id);
        this.view.eraseTask(taskNode);
    }
}