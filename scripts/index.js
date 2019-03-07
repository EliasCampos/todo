function run() {
    let inputNode = document.getElementById("task-input");
    let taskListNode = document.getElementById("task-list");

    const theModel = new Model();
    const theView = new View(inputNode, taskListNode);
    const theController = new Controller(theModel, theView);

    theController.run();
}

document.addEventListener('DOMContentLoaded', run);