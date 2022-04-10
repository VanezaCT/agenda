const firebaseConfig = {
    apiKey: "AIzaSyCQh9GGARfqByNwhx7BcrOcBL7kpuEMq_k",
    authDomain: "agenda-4aeb1.firebaseapp.com",
    projectId: "agenda-4aeb1",
    storageBucket: "agenda-4aeb1.appspot.com",
    messagingSenderId: "299097051210",
    appId: "1:299097051210:web:e6a201a555a22e9a1796b3",
    measurementId: "G-ZHPFJ1BJGD",
    databaseURL: 'https://agenda-4aeb1-default-rtdb.firebaseio.com/'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var provider = new firebase.auth.GoogleAuthProvider();
const app=document.getElementById('app')
const userCont=document.getElementById('user')
let uid=null

const auth=()=>{
    firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    
    // ...
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error.message)
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

}

firebase.auth().onAuthStateChanged((user) => {
     const app=document.getElementById('app')
    const login=document.getElementById('login')
    const name=document.getElementById('name')
    const email=document.getElementById('email')
   
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      uid = user.uid;
      console.log(uid)
      img.src =user.photoURL
      name.textContent=user.displayName
      email.textContent=user.email
      
      console.log(user)
      app.classList.add('show')
      login.classList.remove('show')
      getOrderTask()
      // ...
    } else {
        app.classList.remove('show')
        login.classList.add('show')
    }
   
  });

  const logout=()=>{
    firebase.auth().signOut().then(() => {
        userCont.classList.remove('show')
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
      
  }

const taskContainer = document.getElementById('taskContainer');
const taskCount = document.getElementById('contar');
const ul = document.querySelector('ul')
const containerCount = document.querySelector('.empty')
const dateNumber = document.getElementById('dateNumber');
const dateText = document.getElementById('dateText');
const dateMonth = document.getElementById('dateMonth');
const dateYear = document.getElementById('dateYear');
let taskDrag = null;
let tasksIds = [];


const setDate = () => {
    const date = new Date();
    dateText.textContent = date.toLocaleString('es', { weekday: 'long' });
    dateNumber.textContent = date.toLocaleString('es', { day: 'numeric' });
    dateMonth.textContent = date.toLocaleString('es', { month: 'short' });
    dateYear.textContent = date.toLocaleString('es', { year: 'numeric' });
};

setDate();

const renderTask=(value,taskid,done,taskId)=>{
    
    const task = document.createElement('div');
    task.setAttribute('id',taskid)
    task.setAttribute('draggable', 'true');
    task.classList.add('task', 'cont');

    const iconDelete = document.createElement('i');
    iconDelete.innerHTML = '<svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><style>.cls-1{fill:none;}</style></defs><title>trash-can</title><rect x="12" y="12" width="2" height="12"/><rect x="18" y="12" width="2" height="12"/><path d="M4,6V8H6V28a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V8h2V6ZM8,28V8H24V28Z"/><rect x="12" y="2" width="8" height="2"/><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" /></svg>'
    iconDelete.addEventListener("click", () => {
        deleteTask(task.getAttribute('id'))
        taskContainer.removeChild(task);
        
    })
    const iconCheck = document.createElement('i');
    iconCheck.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 2C13.2311 2 10.5243 2.82109 8.22202 4.35943C5.91973 5.89777 4.12532 8.08427 3.06569 10.6424C2.00607 13.2006 1.72882 16.0155 2.26901 18.7313C2.80921 21.447 4.14258 23.9416 6.10051 25.8995C8.05845 27.8574 10.553 29.1908 13.2687 29.731C15.9845 30.2712 18.7994 29.9939 21.3576 28.9343C23.9157 27.8747 26.1022 26.0803 27.6406 23.778C29.1789 21.4757 30 18.7689 30 16C30 12.287 28.525 8.72601 25.8995 6.1005C23.274 3.475 19.713 2 16 2ZM16 28C13.6266 28 11.3066 27.2962 9.33316 25.9776C7.35977 24.6591 5.8217 22.7849 4.91345 20.5922C4.0052 18.3995 3.76756 15.9867 4.23058 13.6589C4.69361 11.3311 5.83649 9.19295 7.51472 7.51472C9.19296 5.83649 11.3312 4.6936 13.6589 4.23058C15.9867 3.76755 18.3995 4.00519 20.5922 4.91345C22.7849 5.8217 24.6591 7.35977 25.9776 9.33316C27.2962 11.3065 28 13.6266 28 16C28 19.1826 26.7357 22.2348 24.4853 24.4853C22.2348 26.7357 19.1826 28 16 28Z" fill="black"/></svg>'
    iconCheck.addEventListener("click", () => {
        console.log();
        changeTaskState(task);
        if (task.classList.contains('done')) {
            iconCheck.innerHTML = '<svg id="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><style>.cls-1 {fill: none;}</style></defs><path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2ZM14,21.5908l-5-5L10.5906,15,14,18.4092,21.41,11l1.5957,1.5859Z"/><polygon id="inner-path" class="cls-1" points="14 21.591 9 16.591 10.591 15 14 18.409 21.41 11 23.005 12.585 14 21.591"/><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"/></svg>'

        }
        else {
            iconCheck.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 2C13.2311 2 10.5243 2.82109 8.22202 4.35943C5.91973 5.89777 4.12532 8.08427 3.06569 10.6424C2.00607 13.2006 1.72882 16.0155 2.26901 18.7313C2.80921 21.447 4.14258 23.9416 6.10051 25.8995C8.05845 27.8574 10.553 29.1908 13.2687 29.731C15.9845 30.2712 18.7994 29.9939 21.3576 28.9343C23.9157 27.8747 26.1022 26.0803 27.6406 23.778C29.1789 21.4757 30 18.7689 30 16C30 12.287 28.525 8.72601 25.8995 6.1005C23.274 3.475 19.713 2 16 2ZM16 28C13.6266 28 11.3066 27.2962 9.33316 25.9776C7.35977 24.6591 5.8217 22.7849 4.91345 20.5922C4.0052 18.3995 3.76756 15.9867 4.23058 13.6589C4.69361 11.3311 5.83649 9.19295 7.51472 7.51472C9.19296 5.83649 11.3312 4.6936 13.6589 4.23058C15.9867 3.76755 18.3995 4.00519 20.5922 4.91345C22.7849 5.8217 24.6591 7.35977 25.9776 9.33316C27.2962 11.3065 28 13.6266 28 16C28 19.1826 26.7357 22.2348 24.4853 24.4853C22.2348 26.7357 19.1826 28 16 28Z" fill="black"/></svg>'
        }
    })
    const text = document.createElement('p');
    text.textContent = value;

    task.append(text);
    task.append(iconCheck);
    task.append(iconDelete);
    taskContainer.append(task);

    if (done) {
        iconCheck.innerHTML = '<svg id="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><style>.cls-1 {fill: none;}</style></defs><path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2ZM14,21.5908l-5-5L10.5906,15,14,18.4092,21.41,11l1.5957,1.5859Z"/><polygon id="inner-path" class="cls-1" points="14 21.591 9 16.591 10.591 15 14 18.409 21.41 11 23.005 12.585 14 21.591"/><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"/></svg>'
        task.classList.add('done')
    }
    else {
        iconCheck.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 2C13.2311 2 10.5243 2.82109 8.22202 4.35943C5.91973 5.89777 4.12532 8.08427 3.06569 10.6424C2.00607 13.2006 1.72882 16.0155 2.26901 18.7313C2.80921 21.447 4.14258 23.9416 6.10051 25.8995C8.05845 27.8574 10.553 29.1908 13.2687 29.731C15.9845 30.2712 18.7994 29.9939 21.3576 28.9343C23.9157 27.8747 26.1022 26.0803 27.6406 23.778C29.1789 21.4757 30 18.7689 30 16C30 12.287 28.525 8.72601 25.8995 6.1005C23.274 3.475 19.713 2 16 2ZM16 28C13.6266 28 11.3066 27.2962 9.33316 25.9776C7.35977 24.6591 5.8217 22.7849 4.91345 20.5922C4.0052 18.3995 3.76756 15.9867 4.23058 13.6589C4.69361 11.3311 5.83649 9.19295 7.51472 7.51472C9.19296 5.83649 11.3312 4.6936 13.6589 4.23058C15.9867 3.76755 18.3995 4.00519 20.5922 4.91345C22.7849 5.8217 24.6591 7.35977 25.9776 9.33316C27.2962 11.3065 28 13.6266 28 16C28 19.1826 26.7357 22.2348 24.4853 24.4853C22.2348 26.7357 19.1826 28 16 28Z" fill="black"/></svg>'
    }
}

const addNewTask = event => {
    event.preventDefault();
    const { value } = event.target.taskText;
    if (!value) return;
    event.target.reset();
    const taskId= `task${ID()}`
    registerTask(value, taskId)
    renderTask(value,taskId,false)
    
}

const changeTaskState = target => {
    updateTask(target.getAttribute('id'), !target.classList.contains('done'))
    target.classList.toggle('done');
    contar()
    //renderOrderTasks()
    
};

const order = () => {
    const done = [];
    const toDo = [];
    for (let i = 0; i < taskContainer.children.length; i++) {
        const el = taskContainer.children[i]
        el.classList.contains('done') ? done.push(el) : toDo.push(el)
    }

    return [...toDo, ...done];

}
const renderOrderTasks = () => {
    order().forEach(el => taskContainer.appendChild(el))
}

function contar(done) {
    const tasksDone = document.querySelectorAll('.task.done')
    console.log(tasksDone.length)
    taskCount.textContent = "(" + tasksDone.length + ")"
    if (!tasksDone.length) {
        containerCount.classList.add('noTask');
    }
    else {
        containerCount.classList.remove('noTask');
    }
}

document.addEventListener('drag', e => {
    e.target.classList.add('drag')
    taskDrag = e.target;
})

document.addEventListener('dragover', e => {
    e.preventDefault();
}, false)

const collectNewOrderIds = () => {
    tasksIds = []
    for (let i = 0; i < taskContainer.children.length; i++) {
        const el = taskContainer.children[i]
        tasksIds.push(el.getAttribute('id'))
    }
    console.log(tasksIds)
}

document.addEventListener('drop', e => {
    taskDrag.classList.remove('drag')
    e.preventDefault();
    const taskReplace = e.target;

    if (taskReplace.className.includes('task')) {
        taskDrag.parentNode.removeChild(taskDrag);
        e.target.parentNode.insertBefore(taskDrag, taskReplace.nextSibling);
    }
    collectNewOrderIds()
    updateOrderTasks()
})

const registerTask = async (task,taskId) => {

    //const firestore=firebase.firestore()
    const db = firebase.database().ref()
    const dbtask = db.child(`${uid}/tasks/${taskId}`)
    dbtask.set({
        name: task,
        completed: false,  
    })
    tasksIds.unshift(taskId)
    updateOrderTasks()
}

var ID = function () {

    return '_' + Math.random().toString(36).substr(2, 9);
};

const updateTask =(id,done)=>{
    const db = firebase.database().ref()
    const dbtask = db.child(`${uid}/tasks/${id}`)
      dbtask.update({
          completed:done
      })
      console.log('updateTask',done)
}


const getTasks = () => {
    const tasks = []
    const db = firebase.database().ref()
    const dbtasks = db.child(`${uid}/tasks`)
    dbtasks.once('value', (data) => {
        data.forEach(task =>{
            tasks.push({
                name: task.val().name,
                id: task.key,
                completed: task.val().completed
            })
        })
        tasksIds.forEach(id => {
            const taskFound = tasks.find(t => t.id == id)
            console.log(taskFound)
            if(taskFound){
            renderTask(taskFound.name,taskFound.id, taskFound.completed)
            }
        })
    })
}


const updateOrderTasks = () => {
    const db = firebase.database().ref()
    const dbtask = db.child(`${uid}/order`)
    dbtask.set(tasksIds)
}

const getOrderTask = async () => {
    const db = firebase.database().ref()
    const dborder = db.child(`${uid}/order`)
    await dborder.once('value', (data) => {
        tasksIds = data.val() ?? []        
    })
    getTasks()
}



const deleteTask= async(id)=>{
    const db = firebase.database().ref()
    const dbtask = db.child(`${uid}/tasks/${id}`)
    console.log(id)
    await dbtask.remove()
    collectNewOrderIds()
    updateOrderTasks()
}
