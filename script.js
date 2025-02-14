const messages = ["잘했다 집사야", "집사 최고", "잘했냥ㅋ", "굿잡이라냥"];

const todoInput = document.querySelector("input");
const addBtn = document.querySelector("button");
const listContainer = document.querySelector(".list-container");
const emptyMessage = document.querySelector(".empty-message");

// 상태 표시 요소
const totalCountElem = document.getElementById("total-count");
const doneCountElem = document.getElementById("done-count");
const todoCountElem = document.getElementById("undone-count");

let todos = []; // 할 일 항목 배열

function updateCounts() {
    // 전체, 완료, 미완료 항목 수 업데이트
    const totalCount = todos.length;
    const doneCount = todos.filter(todo => todo.done).length;
    const todoCount = totalCount - doneCount;

    totalCountElem.innerText = totalCount;
    doneCountElem.innerText = doneCount;
    todoCountElem.innerText = todoCount;
}

function updateMessage() {
    if (listContainer.children.length === 1){
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}

function addTodo() {
    const todo = todoInput.value.trim();
    if (todo === "") return;

    const todoItem = document.createElement("div");
    todoItem.classList.add("list-item");

    const todoText = document.createElement("span");
    todoText.innerText = todo;
    todoItem.classList.add("todo-text");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    // 삭제 버튼
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "삭제";
    deleteBtn.addEventListener("click", () => {
        listContainer.removeChild(todoItem);
        todos = todos.filter(todo => todo.element !== todoItem); // 배열에서 삭제
        updateCounts(); // 카운트 업데이트
        updateMessage(); // 메시지 업데이트
    });

    // 완료 버튼 
    const doneBtn = document.createElement("Input");
    doneBtn.type = "checkbox";
    doneBtn.classList.add("status");    
    doneBtn.setAttribute("data-tooltip", "완료했냥?");

    doneBtn.addEventListener("click", () => {
        const todoData = todos.find(todo => todo.element === todoItem);
        todoData.done = doneBtn.checked; // 완료 여부 업데이트

        if (doneBtn.checked){
            todoText.style.textDecoration = "line-through";
            todoItem.style.backgroundColor = "#a9a9a9";
            alert(messages[Math.floor((Math.random()*messages.length))]);
        } else {
            todoText.style.textDecoration = "none";
            todoItem.style.backgroundColor = "";
        }

        updateCounts(); // 카운트 업데이트
    });

    // todo 아이템을 배열에 저장
    const todoData = {
        done: false, // 완료 여부
        element: todoItem
    };
    todos.push(todoData);

    // 요소 추가
    listContainer.appendChild(todoItem);
    todoItem.appendChild(todoText);
    todoItem.appendChild(buttonContainer);
    buttonContainer.appendChild(doneBtn);
    buttonContainer.appendChild(deleteBtn);

    todoInput.value = ""; // 입력 필드 초기화
    updateCounts(); // 카운트 업데이트
    updateMessage(); // 메시지 업데이트
}

addBtn.addEventListener("click", addTodo);

updateMessage();
