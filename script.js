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

function filterTodos(selectedCategory) {
    todos.forEach(todo => {
        if (selectedCategory === "all" || todo.category === selectedCategory) {  
            todo.element.style.display = "flex";
        } else {
            todo.element.style.display = "none";
        }
    });
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

    // 카테고리 표시
    const categoryText = document.createElement("span");
    categoryText.innerText = "전체";
    categoryText.setAttribute("data-category", "all");
    categoryText.classList.add("category-text");
    categoryText.addEventListener("click", (event) => {
        const dropdown = categoryDropdown(categoryText);
        dropdown.style.position = "absolute";
        dropdown.style.left = `${event.pageX}px`;
        dropdown.style.top = `${event.pageY}px`;
        document.body.appendChild(dropdown);
    });

    // 삭제 버튼
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "삭제";
    deleteBtn.addEventListener("click", () => {
        listContainer.removeChild(todoItem);
        todos = todos.filter(todo => todo.element !== todoItem); // 배열에서 삭제
        updateCounts();
        updateMessage();
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
            todoItem.style.backgroundColor = "#F0EBE3";
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
        element: todoItem,
        category: "전체"
    };
    todos.push(todoData);

    // 요소 추가
    listContainer.appendChild(todoItem);
    todoItem.appendChild(categoryText);
    todoItem.appendChild(todoText);
    todoItem.appendChild(buttonContainer);
    buttonContainer.appendChild(doneBtn);
    buttonContainer.appendChild(deleteBtn);

    todoInput.value = ""; // 입력 필드 초기화
    updateCounts(); // 카운트 업데이트
    updateMessage(); // 메시지 업데이트
}

function categoryDropdown(categoryText) {
    const exisitingDropdown = document.querySelector(".category-dropdown");
    if (exisitingDropdown) {
        document.body.removeChild(exisitingDropdown);
    }

    const dropdown = document.createElement("ul");
    dropdown.classList.add("category-dropdown");

    const categories = [
        { value: "all", text: "전체" },
        { value: "work", text: "업무"},
        { value: "study", text: "공부"},
    ]

    categories.forEach(category => {
        const item = document.createElement("li");
        item.innerText = category.text;
        
        if (category.value === categoryText.getAttribute("data-category")) {
            item.style.color = "black";  // 현재 선택된 항목은 검정색
        } else {
            item.style.color = "";  // 다른 항목은 기본 색상
        }
        
        item.addEventListener("click", () => {
            categoryText.innerText = category.text;
            categoryText.setAttribute("data-category", category.value);
            
            const todoData = todos.find(todo => todo.element === categoryText.closest('.list-item'));
            if (todoData) {
                todoData.category = category.value;
            }

            document.body.removeChild(dropdown);
        });
        dropdown.appendChild(item);

    });

    return dropdown;
}

// 카테고리 필터 버튼
const categoryFilters = document.querySelectorAll(".category-container input[type='radio']");
categoryFilters.forEach(radio => {
    radio.addEventListener("change", (event) => {
        filterTodos(event.target.value);
    });
});

addBtn.addEventListener("click", addTodo);

// 드롭다운 바깥을 클릭하면 닫히도록 처리
document.addEventListener("click", (event) => {
    if (!event.target.classList.contains("category-text")) {
        const existingDropdown = document.querySelector(".category-dropdown");
        if (existingDropdown) {
            document.body.removeChild(existingDropdown);
        }
    }
});

updateMessage();
