//import { compareAsc, format } from 'date-fns'
//import { remove } from 'lodash';

//const { isToday } = require("date-fns");
//¡¡¡¡¡¡¡¡¡¡ inverted exclamation

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

// if (storageAvailable('localStorage')) {
//     // Yippee! We can use localStorage
//     getStorage(); //clears out old array, uses saved.
//   }
//   else {
//     // Too bad, no localStorage for us
//     console.log("localStorage error");
//   }

function setStorage() { 
    localStorage.clear();
    let stringObjArr = JSON.stringify(projects); //then stringify the entire projects array 
    localStorage.setItem('savedProjects', stringObjArr);
    //then maybe some kind of a check to see if there is saved info on browser, and an alert if successful or not
    window.alert("¡Saved to your browser!");
    //might be able to put in some type of behavior on window close? should check
}

function getStorage() {
    try {
        let newArr = JSON.parse(localStorage.getItem('savedProjects') || []); //if getItem returns null, provides a default empty array
        projects.splice(0, projects.length); 
        for(let savedProject of newArr) { 
            projects.push(savedProject);
        } 
        projectIndex = 0; //reset current project
        window.alert('localStorage retrieved');
    } catch (err) {
        //unexpected end of JSON input if there is nothing to parse
        window.alert('¡ERROR! ¡There was nothing saved to localStorage!');
    }
   iterate();
}

function clearStorage() {
    //should clear out all of local Storage on button press?
    //if exists, delete, plug into the button, or does it matter if it exists?
    //localStorage.removeItem('savedTodos');
    localStorage.clear();
    window.alert("¡Browser storage clear!");
}

const content = document.querySelector('.content');
const container = document.querySelector('.cont')
const main = document.getElementById('main');
const completed = document.querySelector('.complete');
const completedSection = document.querySelector('.complete-section')
const nav = document.getElementById('nav');
const tabDisplay = document.getElementById('tabdisplay')
// const tabs = document.querySelectorAll('.tab'); //all tabs

//const todos = [];
const projects = [];
let projectIndex = 0; //this value determines which project is being displayed

function createTab() {
    let input = document.getElementById('ptitle');
    let newTab = document.createElement('div');
    newTab.classList.add('tab');

    if(projects.length === 0) { //if no projects
        newTab.setAttribute('id', `tab1`);
        tabDisplay.append(newTab);
        newTab.innerHTML = 'My Project';
        let myProject = new Project('My Project', [new ToDo('Mark this as complete, or delete!', 'You should see this upon page refresh. You can edit this notes div!!', new Date(), 3, false)]);
        projects.push(myProject);
        console.log('default object created!');
        return false;
    } else if(projects.length > 0) { //if project is being created
        newTab.setAttribute('id', `tab${projects.length + 1}`);
        tabDisplay.append(newTab);
        newTab.innerHTML = input.value;
        let newTitle = input.value;
        let newProject = new Project(newTitle, [new ToDo('This should appear on newly created tabs', 'Try to delete this', new Date(), 3, true)]);
        projects.push(newProject);
        input.value = ""; //use this in the todo form as well!
        iterate();
        return false;
    }
    iterate();
}

function tabSwitch(id) {
    let num = id.match(/\d/g);
    projectIndex = num - 1; //-1 for 0-index array here instead of in iterate() like others
    iterate();
    //logic of when you click on a tab here. The event listener for the tab buttons themselves should call this
}

function tabActive(id) { //this handles the styling for the tabs when clicked
    let active = document.getElementById(`${id}`);
    let reset = document.querySelectorAll('.tab');
    reset.forEach((tab) => { //set back to default colors
        tab.style.backgroundColor = 'lightslategrey';
        tab.style.color = 'lightgrey';
    });
    active.style.backgroundColor = 'darkgrey';
    active.style.color = 'white';
    iterate(); //hover pseudoclass gets messed up if iterate() isn't invoked here
}

function removeTab() {
    //to be called upon clicking not yet made delete button
    projects.splice(projectIndex, 1);
    projectIndex = 0; //reset current project
    iterate();
}

function removeToDo(index) { //updated
    let currentProj = projects[projectIndex];
    currentProj.todosArray.splice(index, 1);
    let domToRemove = document.getElementById(`row${index + 1}`);
    domToRemove.remove();
    iterate();
}

function addToDo() {
    //should construct a new object based on inputs, put that object into the array, and then iterate.
    let title = document.getElementById('title').value;
    let desc = document.getElementById('description').value;
    let dueDate = document.getElementById('duedate').value;
    let priority = document.getElementById('priority').value;
    
    let newTodo = new ToDo(title, desc, dueDate, priority, false); //task is not complete by default
    projects[projectIndex].todosArray.push(newTodo); //push new ToDo to current Project.todosArray

    //clear out the inputs:
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('duedate').value = '';
    document.getElementById('priority').value = '';

    iterate();
}

function toggleComplete(index) {
    let proj = projects[projectIndex];
    let deleteEl = document.getElementById(`row${index + 1}`);
    //just delete the old DOM element, mark object the other value, then iterate
    if(proj.todosArray[index].complete === true) {
        deleteEl.remove();
        proj.todosArray[index].complete = false;

    } else if(proj.todosArray[index].complete === false) {
        //content.removeChild(deleteEl);
        deleteEl.remove();
        proj.todosArray[index].complete = true;
    }
    iterate();
}

function deadlineCheck(date) { //needs work
    const now = new Date();
    //this line sets the hour of the current date to midnight so the comparison only returns 'true'
    //if the passed in date is at least yesterday
    //today.setHours(0,0,0,0);
    let bool = date < now; //boolean true if arg date is less than current
    if(bool === false) { //if arg date is greater than current
        //apply special css here?
        //maybe need to plug in todo object as arg instead...
    }
}

function iterate() {
    let count = 1; //counter for element ids

    let toDelete = document.querySelector('.complete');
    toDelete.remove();
    let toDelete2 = document.querySelector('.content');
    toDelete2.remove();
    let toDelete3 = document.querySelector('#tabdisplay');
    toDelete3.remove();
    //delete existing content divs for every refresh
    //then recreate them:
    let tabDisp = document.createElement('div');
    tabDisp.setAttribute('id', 'tabdisplay');
    nav.append(tabDisp);

    let comp = document.createElement('div');
    comp.classList.add('complete');
    completedSection.append(comp);

    let cont = document.createElement('div'); 
    cont.classList.add('content');
    cont.setAttribute('id', 'content');
    container.append(cont); 

    for(let proj of projects) { //create the DOM tab elements for each 'project' in array
        const newTab = document.createElement('div');
        newTab.classList.add('tab');
        if(proj == projects[projectIndex]) { //if current project, apply 'selected' styling
            newTab.style.backgroundColor = 'darkgrey';
            newTab.style.color = 'black';
            newTab.style.fontSize = '20px';
            newTab.style.fontFamily = 'Verdana';
        }
        newTab.setAttribute('id', `tab${projects.indexOf(proj) + 1}`);
        newTab.innerHTML = proj.title;
        tabDisp.append(newTab);
    }

    let countComplete = 0; //counter for # of todos in list marked complete
    let count1 = 0;

    for(let todo of projects[projectIndex].todosArray) { //for the active project, display its todos.
        if(todo.complete == true) {
            countComplete++;
        }
        if(count1 == 0) { //for our first row(todo), we want a header row which labels our columns
            let headRow = document.createElement('div');
            headRow.setAttribute('class', 'headrow');
            cont.append(headRow); //could rework this to also display under complete
            let headTitle = document.createElement('div');
                headTitle.classList.add('headdiv');
                headTitle.innerHTML = 'Title'
                headRow.append(headTitle);
            let headNotes = document.createElement('div');
                headNotes.classList.add('headdiv');
                headNotes.innerHTML = 'Notes'
                headRow.append(headNotes);
            let headDate = document.createElement('div')
                headDate.classList.add('headdiv');
                headDate.innerHTML = 'Due Date';
                headRow.append(headDate);
            let headPriority = document.createElement('div');
                headPriority.classList.add('headdiv')
                headPriority.innerHTML = 'Priority';
                headRow.append(headPriority);
            let headButts = document.createElement('div');
                headButts.classList.add('headdiv');
                headButts.innerHTML = 'Options';
                headRow.append(headButts);
        }
        count1++;

        const row = document.createElement('div');
            row.setAttribute('id', `row${count}`);
            row.classList.add('tododiv');
            let intPriority = parseInt(todo.priority);
                if(intPriority === 3) {
                    //default style at the moment.
                } else if (intPriority === 2) {
                    row.style.backgroundColor = 'orange';
                } else {
                    row.style.backgroundColor = 'red';
                    row.style.color = 'white';
                }    

                if(todo.complete === true) {
                    comp.append(row);
                    row.style.backgroundColor = 'gray';
                    row.style.color = 'orange';
                } else if(todo.complete === false) {
                    cont.append(row);
                }

        const todoTitle = document.createElement('div');
            todoTitle.setAttribute('id', `title${count}`);
            todoTitle.classList.add('innerdiv');
            todoTitle.innerHTML = todo.title;
            //todoTitle.setAttribute('contenteditable', 'true');
            row.append(todoTitle);
        const todoDesc = document.createElement('div');
            todoDesc.setAttribute('id', `desc${count}`);
            todoDesc.setAttribute('name', 'editdesc');
            todoDesc.classList.add('innerdiv');
            todoDesc.innerHTML = todo.desc;
            todoDesc.setAttribute('contenteditable', 'true');
            row.append(todoDesc);
        const dueDate = document.createElement('div');
            dueDate.setAttribute('id', `duedate${count}`);
            dueDate.innerHTML = todo.dueDate;
            dueDate.classList.add('innerdiv');
            row.append(dueDate);
        const priority = document.createElement('td');
            priority.setAttribute('id', `priority${count}`);
            priority.classList.add('innerdiv');
            priority.innerHTML = todo.priority;
            row.append(priority);
        const buttonDiv = document.createElement('div');
            buttonDiv.classList.add('bdiv');
            row.append(buttonDiv);
        const markButton = document.createElement('button');
            markButton.classList.add('divbc');
            markButton.setAttribute('id', `mb${count}`)
            markButton.innerHTML = 'Complete';
            markButton.addEventListener('click', (e) => {
                let idString = e.target.id.toString(); //get String of the elements id
                let index = idString.match(/\d/g); //pull the number off the string
                toggleComplete(index - 1);
                //the - 1 is for the zero-indexed array
                //toggle as complete, then iterate
            }) 
            buttonDiv.append(markButton);
        const remButton = document.createElement('button');
            remButton.innerHTML = 'Remove';
            remButton.setAttribute('id', `rembutton${count}`);
            remButton.classList.add('divbd');
            remButton.addEventListener('click', (e) => {
                let idString = e.target.id.toString();
                let index = idString.match(/\d/g); //pulls any (compound) # from idString
                removeToDo(index - 1);
            })
            buttonDiv.append(remButton);

        
        count++;
        } //end of large for..of

        document.getElementsByName('editdesc').forEach((descEl) => { //event listeners for editable elements!
            descEl.addEventListener('input', (e) => {
                let id = e.target.id.toString();
                let index = id.match(/\d/g);
                //this should set the desc value within a given todo after editing?
                projects[projectIndex].todosArray[index - 1].desc = e.target.innerHTML;
            });
        });

        //if the chosen array is empty, or all of its elements are marked complete, add in a reminder to create new tasks
        if((!projects[projectIndex].todosArray.length) || (projects[projectIndex].todosArray.length === countComplete)) {
            let advice = document.createElement('div');
            advice.classList.add('advice');
            advice.innerHTML = 'Currently there is nothing to do, add a task!';
            cont.append(advice);
        }

        //here, adding the event listeners for each of the tabs (each project)
        document.querySelectorAll('.tab').forEach((tab) => {
            tab.addEventListener('click', (e) => {
                let id = e.target.id.toString();
                tabSwitch(id);
                tabActive(id);
            });
        });
} //end iterate()

const ToDo = function(title, desc, dueDate, priority, complete) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.priority = priority;
    this.complete = complete;
}

const Project = function(title, todosArray) {
    this.title = title;
    this.todosArray = todosArray;
}

createTab();
iterate();
