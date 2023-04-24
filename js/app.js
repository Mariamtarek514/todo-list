let img = document.querySelector(".todo_header img");
let inputTask = document.getElementById("input");
let todoArray = [];

let todoFooter = document.querySelector(".todo_footer");
let itemLeft = document.querySelector(".todo_footer .item_left");

img.addEventListener("click", (e) => {
    toggleTheme(e.target);
});
function toggleTheme(e) {
    let ar = e.src.split("/");
    if (ar.includes("icon-moon.svg")) {
        enableDark();
    } else {
        e.src;
        disableDark();
    }
}

function enableDark() {
    localStorage.setItem("theme", "enable");
    document.body.classList.add("darkTheme");
    img.src = "images/icon-sun.svg";
    document.querySelector("header").style.cssText =
        "Background-image:url('images/bg-desktop-dark.jpg');background-repeat: no-repeat;background-size: cover;";
}
window.onresize = function () {
    changeBg();
};
window.onload = changeBg;
function changeBg() {
    if (innerWidth > 570) {
        if (localStorage.getItem("theme") == "enable") {
            document.querySelector("header").style.cssText =
                "Background-image:url('images/bg-desktop-dark.jpg');background-repeat: no-repeat;background-size: cover;";
        } else {
            document.querySelector("header").style.cssText =
                "Background-image:url('images/bg-desktop-light.jpg');background-repeat: no-repeat;background-size: cover;";
        }
    } else {
        if (localStorage.getItem("theme") == "enable") {
            document.querySelector("header").style.cssText =
                "Background-image:url('images/bg-mobile-dark.jpg');background-repeat: no-repeat;background-size: cover;";
        } else {
            document.querySelector("header").style.cssText =
                "Background-image:url('images/bg-mobile-light.jpg');background-repeat: no-repeat;background-size: cover;";
        }
    }
}
function disableDark() {
    localStorage.setItem("theme", null);
    img.src = "images/icon-moon.svg";
    document.querySelector("header").style.cssText =
        "Background-image:url('images/bg-desktop-light.jpg');background-repeat: no-repeat;background-size: cover;";
    document.body.classList.remove("darkTheme");
}
if (localStorage.getItem("theme") == "enable") {
    enableDark();
} else {
    disableDark();
}

if (localStorage.getItem("task")) {
    todoArray = JSON.parse(localStorage.getItem("task"));
}
let todoContainer = document.querySelector(".todo_content .tasksDiv");
loadData();
inputTask.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && inputTask.value != "") {
        //create task
        createToDo(inputTask.value);
        input.value = "";
        itemNumber();
    }
});

function itemNumber() {
    let counter = 0;
    todoArray.forEach((e) => {
        if (e.complete == false) {
            counter++;
        }
    });
    if (counter >= 0) {
        todoFooter.style.display = "flex";
        itemLeft.innerHTML = `${counter} items left`;
    } else {
        todoFooter.style.display = "none";
    }
}
todoContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-list")) {
        e.target.parentElement.remove();
        //remove it from local
        removeItemFromLocal(e.target.parentElement.id);
    }
    //complete task
    if (
        e.target.classList.contains("check-list") ||
        e.target.classList.contains("check-image")
    ) {
        if (e.target.classList.contains("active")) {
            toggleTask(e.target.parentElement.dataset.id);
        } else {
            toggleTask(e.target.dataset.id);
        }
        e.target.parentElement.classList.toggle("active");
        e.target.classList.toggle("active");
        itemNumber();
    }
});
function createToDo(value) {
    let task = {
        id: new Date().getTime(),
        title: value,
        complete: false,
    };
    //add to page
    todoArray.push(task);
    addtodoToPage(todoArray);
    //add to localstorage
    loadToLocalStorage(todoArray);
}
function addtodoToPage(arrayOfTask) {
    todoContainer.innerHTML = "";
    arrayOfTask.forEach((task) => {
        let todoLi = document.createElement("li");
        let textContainer = document.createElement("p");
        let text = document.createTextNode(task.title);
        textContainer.append(text);
        todoLi.classList = "list-item";
        todoLi.id = task.id;

        let deleteTodo = document.createElement("img");
        deleteTodo.setAttribute("src", "images/icon-cross.svg");
        deleteTodo.setAttribute("alt", "delete");
        deleteTodo.classList = "remove-list";

        let checkTodoContainer = document.createElement("span");
        let checkTodo = document.createElement("img");
        checkTodo.setAttribute("src", "images/icon-check.svg");
        checkTodoContainer.append(checkTodo);
        checkTodoContainer.classList = "check-list";
        checkTodo.classList = "check-image";
        checkTodo.setAttribute("data-id", task.id);
        checkTodoContainer.setAttribute("data-id", task.id);
        if (task.complete) {
            checkTodoContainer.classList.add("active");
        }
        todoLi.append(checkTodoContainer);
        todoLi.append(textContainer);
        todoLi.append(deleteTodo);
        todoContainer.prepend(todoLi);
    });
}
function loadToLocalStorage(arrayOfTask) {
    localStorage.setItem("task", JSON.stringify(arrayOfTask));
}
function loadData() {
    if (localStorage.getItem("task")) {
        let loacalArray = JSON.parse(localStorage.getItem("task"));
        addtodoToPage(loacalArray);
        itemNumber();
    }
}
function removeItemFromLocal(id) {
    todoArray = todoArray.filter((e) => e.id != id);
    loadToLocalStorage(todoArray);
    itemNumber();
}
function toggleTask(taskId) {
    todoArray.forEach((task) => {
        if (task.id == taskId) {
            task.complete == false
                ? (task.complete = true)
                : (task.complete = false);
        }
    });
    loadToLocalStorage(todoArray);
}
function clearComplete() {
    todoArray = todoArray.filter((e) => e.complete == false);

    loadToLocalStorage(todoArray);
    itemNumber();
    location.reload();
}

function allItem() {
    addtodoToPage(todoArray);
}
let list = document.querySelectorAll(".list li");
list.forEach((li) => {
    li.addEventListener("click", () => {
        document.querySelectorAll(".list .active").forEach((e) => {
            e.classList.remove("active");
        });
        li.classList.add("active");
    });
});
function active() {
    let x = todoArray.filter((e) => e.complete == false);
    itemLeft.innerHTML = `${x.length} items left`;
    addtodoToPage(x);
}
function complete() {
    let x = todoArray.filter((e) => e.complete == true);
    itemLeft.innerHTML = `${x.length} items left`;
    addtodoToPage(x);
}
