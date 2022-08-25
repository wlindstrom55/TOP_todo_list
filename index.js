//import { compareAsc, format } from 'date-fns'
//import { remove } from 'lodash';

//const { isToday } = require("date-fns");

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
    //let count = 1;
    //setting:
    // for(let todo of todos) {
    //     let jsonObj = JSON.stringify(todo); //stringify the object
    //     localStorage.setItem('todoobj', jsonObj); //save stringified obj as todoobj
    // }
    //I want to stringify the entire todo array 
    let stringObjArr = JSON.stringify(todos);
    localStorage.setItem('savedTodos', stringObjArr);

    //this method will run through our stored data, creating the appropriate todo objects
    //first check for existing data, if so, retrieve..also add to array so they iterate right
    //for each property of an object in our array....save as an object to local storage?
    //need to access object values, save?
    //would we also then need another method to "offload" and retrieve those saved values?
    //when should this run? probably in the conditional above that checks for localstorage.
}

function getStorage() {
//    if(localStorage.getItem("todoobj")) {
//     var savedTodos = JSON.parse(localStorage.getItem("todoobj"));
//     todos.push(savedTodos);
//    }
//     todos.push()
    let savedJSON = localStorage.getItem('savedTodos');
    let newArr = JSON.parse(savedJSON);
    //this piece checks for obj in new array, skips it if it's already there.
    // for(let obj in newArr) {
    //     if(todos.contains(obj)) {
    //         continue;
    //     } else {
    //         todos.push(obj);
    //     }
    // }
   todos.splice(0, todos.length); //cut out the whole array
   todos = newArr;
}

function clearStorage() {
    //should clear out all of local Storage?
    //if exists, delete, plug into the button
}

const content = document.querySelector('.content');
const container = document.querySelector('.cont')
const main = document.getElementById('main');
const complete = document.querySelector('.complete');
const todos = [];

function removeToDo(index) {
    todos.splice(index, 1);
    iterate();
}

function addToDo() {
    //should construct a new object based on inputs, put that object into the array, and then iterate.
    let title = document.getElementById('title').value;
    let desc = document.getElementById('description').value;
    let dueDate = document.getElementById('duedate').value;
    let priority = document.getElementById('priority').value;
    let newTodo = new toDo(title, desc, dueDate, priority, false); //task is not complete by default
    todos.push(newTodo);
    iterate();
}

function moveComplete(index) {
    let current = document.querySelector(`#row${index + 1}`); //does this work?
    let complete = document.querySelector('.complete');
    if(todos[index].complete === true) {
        //change to false
        //todos[index].complete = false;
        current.remove();
        complete.appendChild(current);
    }
    // if(todos[index] === false) {
    //     //change to true
    //     //todos[index] = true;
        
    // }
    
    iterate();
    //maybe in iterate, there is some logic to switch the element itself based on val of complete
    //maybe a completed tasks section like Sam had
    //first remove task from content, then move to complete
}
function deadlineCheck(date) {
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

    let toDelete = document.querySelector('.content');
    toDelete.remove();
    //delete existing content div for every refresh
    let cont = document.createElement('div'); //then create new DOM element
    cont.classList.add('content');
    cont.setAttribute('id', 'content');
    container.append(cont); 

    for(let todo of todos) {
        const row = document.createElement('div');
            row.setAttribute('id', `row${count}`);
            row.classList.add('tododiv');
            cont.append(row);
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
            dueDate.innerHTML = "Due Date: " + todo.dueDate.toString();
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
                moveComplete(index - 1);
                
                
                //Book.prototype.toggleRead(myLibrary[bookRow.rowIndex - 1]);
                //should access array for object based on its row number.
                //the - 1 is necessary to account for the zero-indexed array
            }) 
            row.append(markButton);
        const remButton = document.createElement('button');
            remButton.innerHTML = 'Remove';
            remButton.setAttribute('id', `rembutton${count}`);
            remButton.classList.add('innerdiv');
            remButton.addEventListener('click', (e) => {
                let idString = e.target.id.toString();
                let index = idString.match(/\d/g); //pulls any (compound) # from idString
                //match is a string method that you guessed it, matches against a regex and retrieves that
                removeToDo(index - 1);  
                //get id of parent row, take that number that it is somehow, -1 for index, pass that into removebook
            })
            row.append(remButton);
        count++;
        //perhaps there should be something here at the end to call iterateStorage and save content!
    }
    console.log(todos); //test
}

//let count = 1
const toDo = function(title, desc, dueDate, priority, complete) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.priority = priority;
    this.complete = complete;
}

const test = new toDo("Run", "Run two miles before this date", new Date('09/01/2023'), 3, true);
//new Date() returns a Date object. Date() itself without new returns  string representation of the
//current date and time, exactly as new Date().toString() does.
todos.push(test);

const test2 = new toDo("finish this project", 'Make sure it works like you want', new Date('09/01/2025'), 1, false);
todos.push(test2);

iterate();
//setStorage();
// console.log(todos);
//need to test getStorage();