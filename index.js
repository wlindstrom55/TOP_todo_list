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

if (storageAvailable('localStorage')) {
    // Yippee! We can use localStorage
    //iterateStorage()
  }
  else {
    // Too bad, no localStorage for us
    console.log("localStorage error");
  }

function iterateStorage() {
    //this method will run through our stored data, creating the appropriate todo objects
    //for each property of an object in our array....save as an object to local storage?
    //need to access object values, save?
    //would we also then need another method to "offload" and retrieve those saved values?
    //when should this run? probably in the conditional above that checks for localstorage.
}

const content = document.querySelector('.content');
const main = document.getElementById('main');
const complete = document.querySelector('.complete');
const todos = [];


function iterate() {
    let count = 1; //counter for purposes of ID names
    //This stuff at the beginning is to clear the table before printing the objects to the DOM
    let toDelete = document.querySelector('#content');
    toDelete.remove();
    //tbod.remove(); - would delete existing tbod from the DOM... can't have here tho, since the proceeding line 
    //has the same var name, it will throw error. Must select the DOM element w/ id like w/ toDelete
    let cont = document.createElement('div'); //then create new DOM element tbod for use below
    cont.classList.add('content'); //then assign the new tbod the right class
    cont.setAttribute('id', 'content');
    main.append(cont); //last, append it to the table.
    //the below for..of loop iterates through Books in myLibrary & creates the DOM elements for them
    //for..in doesn't work here, because it's meant to enumerate object properties, not objects themselves.
    for(let todo of todos) {
        const row = document.createElement('div');
            row.setAttribute('id', `row${count}`);
            row.classList.add('tododiv');
            cont.append(row);
        const todoTitle = document.createElement('div');
            todoTitle.setAttribute('id', `booktitles${count}`);
            todoTitle.classList.add('innerdiv');
            todoTitle.innerHTML = todo.title;
            row.append(todoTitle);
        const todoDesc = document.createElement('div');
            todoDesc.setAttribute('id', `desc${count}`);
            todoDesc.classList.add('innerdiv');
            todoDesc.innerHTML = todo.desc;
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
        const markButton = document.createElement('button');
            markButton.classList.add('innerdiv');
            markButton.innerHTML = 'Mark Complete';
            markButton.addEventListener('click', () => {
                //maybe a completed tasks section like Sam had
                //first remove task from content, then move to complete

                //Book.prototype.toggleRead(myLibrary[bookRow.rowIndex - 1]);
                //should access array for object based on its row number.
                //the - 1 is necessary to account for the zero-indexed array
            }) 
            row.append(markButton);
        const remButton = document.createElement('button');
            remButton.innerHTML = 'Remove';
            remButton.classList.add('rembutton');
            remButton.addEventListener('click', () => {
                removeBook(bookRow.rowIndex -1);
            })
            bookRow.append(remButton);
        count++;
    }
}




const toDo = function(title, desc, dueDate, priority) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.priority = priority;
    //any methods we want to add on to here? maybe not
    //or maybe we want some dom methods?
}

const test = new toDo("Wash Yo Ass", "Nice and clean", 09/01/2022, 1);
todos.push(test);

// function addToDo(todo) {
//     content.append(todo); //this doesn't work because it just prints the type of object, instead of its values
// }
// function deleteToDo(todo) {
//     content.removeChild(todo);
// }

// function webStorage() {
//     const ws = new Window.localStorage();
// }