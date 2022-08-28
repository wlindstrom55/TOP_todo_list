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

function setStorage() { //works great!
    localStorage.clear();
    let stringObjArr = JSON.stringify(projects); //then stringify the entire projects array 
    localStorage.setItem('savedProjects', stringObjArr);
    //then maybe some kind of a check to see if there is saved info on browser, and an alert if successful or not
    window.alert("¡Saved to your browser!");
    //might be able to put in some type of behavior on window close? should check
    //first check for existing data, if so, retrieve..also add to array so they iterate right
    //for each property of an object in our array....save as an object to local storage?
    //need to access object values, save?
    //would we also then need another method to "offload" and retrieve those saved values?
    //when should this run? probably in the conditional above that checks for localstorage.
}

function getStorage() { //works!
    //Project thoughts - pass in an index for Project to switch todos to save and load?
    try {
        let newArr = JSON.parse(localStorage.getItem('savedProjects') || []); //if getItem returns null, provides a default empty array
       // projects[projectIndex].todosArray.splice(0, projects[projectIndex].todosArray.length); //cut out the whole current array!
       projects.splice(0, projects.length); 
       for(let savedProject of newArr) { //again must use for of to loop over objects themselves
            projects.push(savedProject);
        } 
        projectIndex = 0; //reset current project
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
//let countTab = 2; //starts at 2 because of default tab //gonna need to change this to deal with tab creation in iterate()
let currentTab = 0; //counter for projects //maybe delete?
let projectIndex = 0; //this needs to be changed by tab switching logic to currect Project 

// function iterateProjects() {
//     projectIndex = 0; //set back to first project
//     for(let proj of projects) {
//         //just needs to render divs as tabs?

//     }
// }
function createTab() { //maybe this should just push the created project object to projects array?
    let input = document.getElementById('ptitle');
    let newTab = document.createElement('div');
    newTab.classList.add('tab');

    if(projects.length === 0) { //if no projects, add in sample Project
        newTab.setAttribute('id', `tab1`);
        tabDisplay.append(newTab);
        newTab.innerHTML = 'My Project';
        let myProject = new Project('My Project', [new ToDo('This one is created in createTab()', 'test', '04/10/1992', 3, false)]);
        projects.push(myProject);
        console.log('default object created!');
        return false;
    } else if(projects.length > 0) {
        newTab.setAttribute('id', `tab${projects.length + 1}`); //was previously countTab
        tabDisplay.append(newTab);
        newTab.innerHTML = input.value;
        //countTab += 1;
    //maybe here it should call the constructor while checking title //create a whole new array.
        let newTitle = input.value;
        let newProject = new Project(newTitle, [new ToDo('This should appear on new tabs', 'test', new Date(), 3, true)]);
        projects.push(newProject);
        input.value = ""; //move this to the todo form as well!
        iterate();
        return false;
    }
    //tab switches, and you reiterate but with a different array of todos!
    //should projects(tabs) have their own constructor, which has its own array of todos? This seems logical
        //this way, you have some logic for switching tabs that then plugs in the appropriate todos array?
    //of course, you would have to modify the saving system too to save that specific  Project's array (under different name)
}

function tabSwitch(id) {
    let num = id.match(/\d/g);
    projectIndex = num - 1; //-1 for 0-index array here instead of in iterate() like others
    iterate();
    //logic of when you click on a tab here. The event listener for the tab buttons themselves should call this
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

function addToDo() { //updated
    //should construct a new object based on inputs, put that object into the array, and then iterate.
    let title = document.getElementById('title').value;
    let desc = document.getElementById('description').value;
    let dueDate = document.getElementById('duedate').value;
    let priority = document.getElementById('priority').value;
    let newTodo = new ToDo(title, desc, dueDate, priority, false); //task is not complete by default
    projects[projectIndex].todosArray.push(newTodo); //push new ToDo to current Project.todosArray
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

    for(let proj of projects) { //create the DOM elements for each project
        const newTab = document.createElement('div');
        newTab.classList.add('tab');
        newTab.setAttribute('id', `tab${projects.indexOf(proj) + 1}`);
        newTab.innerHTML = proj.title;
        tabDisp.append(newTab);
    }

    console.log(projectIndex + " - This is the current project!");

    for(let todo of projects[projectIndex].todosArray) { //note: could have something that reads obj trait and puts it in the right section,
        //like if it's complete, or depending on priority!
        const row = document.createElement('div');
            row.setAttribute('id', `row${count}`);
            row.classList.add('tododiv');
            //cont.append(row);
            if(todo.complete === true) {
                comp.append(row);
            } else if(todo.complete === false) {
                cont.append(row);
            }
        const todoTitle = document.createElement('div');
            todoTitle.setAttribute('id', `title${count}`);
            todoTitle.classList.add('innerdiv');
            todoTitle.innerHTML = "Title: " + todo.title;
            row.append(todoTitle);
        const todoDesc = document.createElement('div');
            todoDesc.setAttribute('id', `desc${count}`);
            todoDesc.classList.add('innerdiv');
            todoDesc.innerHTML = "Description: " + todo.desc;
            row.append(todoDesc);
        const dueDate = document.createElement('div');
            dueDate.setAttribute('id', `duedate${count}`);
            dueDate.innerHTML = "Due Date: " + todo.dueDate; //.toString()
            dueDate.classList.add('innerdiv');
            row.append(dueDate);
        const priority = document.createElement('td');
            priority.setAttribute('id', `priority${count}`);
            priority.classList.add('innerdiv');
            priority.innerHTML = "Priority Level: " + todo.priority;
            row.append(priority);
        const markButton = document.createElement('button');
            markButton.classList.add('innerdiv');
            markButton.setAttribute('id', `mb${count}`)
            markButton.innerHTML = 'Mark Complete';
            markButton.addEventListener('click', (e) => {
                let idString = e.target.id.toString(); //get String of the elements id
                let index = idString.match(/\d/g); //pull the number off the string
                toggleComplete(index - 1);
                //the - 1 is for the zero-indexed array
                //toggle as complete, then iterate
            }) 
            row.append(markButton);
        const remButton = document.createElement('button');
            remButton.innerHTML = 'Remove';
            remButton.setAttribute('id', `rembutton${count}`);
            remButton.classList.add('innerdiv');
            remButton.addEventListener('click', (e) => {
                let idString = e.target.id.toString();
                let index = idString.match(/\d/g); //pulls any (compound) # from idString
                removeToDo(index - 1);
            })
            row.append(remButton);

        document.querySelectorAll('.tab').forEach((tab) => { //event listener for tabs!
            tab.addEventListener('click', (e) => {
                let id = e.target.id.toString();
                console.log('Event Listener is working!' + id);
                tabSwitch(id); 
            });
        });

        count++;
        }
    //test console logs for showing current project todos and all projects arrays
    // console.log(projects[projectIndex].todosArray);
    // console.log(projects);
}

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

// const test = new ToDo("Run", "Run two miles before this date", new Date('09/01/2023'), 3, false);
// //new Date() returns a Date object. Date() itself without new returns  string representation of the
// //current date and time, exactly as new Date().toString() does.
// todos.push(test);

// const test2 = new ToDo("finish this Project", 'Make sure it works like you want', new Date('09/01/2025'), 1, false);
// todos.push(test2);

// const test3 = new ToDo('Take a look at the Project', 'This is a test', '09/01/2025', 1, true)
// todos.push(test3);
createTab();
iterate();

//console.log(projects);