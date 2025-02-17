// 메시지 배열
const messages = [
  "집사 짱😻",
  "집사 최고😺",
  "잘했냥ㅋ😽",
  "굿잡이라냥😻",
  "멋지다냥😺",
  "perfect😽",
];

// 카테고리 배열
const categories = [
  { value: "all", text: "전체" },
  { value: "work", text: "업무" },
  { value: "study", text: "공부" },
];

// DOM 요소 선택
const todoInput = document.querySelector("input");
const addBtn = document.querySelector("button");
const listContainer = document.querySelector(".list-container");
const header = document.querySelector("h1");

// 상태 표시 요소
const totalCountElem = document.getElementById("total-count");
const doneCountElem = document.getElementById("done-count");
const todoCountElem = document.getElementById("undone-count");

// 할 일 항목 배열
let todos = [];

// 진행률 업데이트 함수
function updateCounts() {
  const totalCount = todos.length;
  const doneCount = todos.filter((todo) => todo.done).length;
  const todoCount = totalCount - doneCount;

  totalCountElem.innerText = totalCount;
  doneCountElem.innerText = doneCount;
  todoCountElem.innerText = todoCount;
}

// 메시지 업데이트 함수
function updateMessage() {
  const emptyMessage = document.querySelector(".empty-message");
  if (listContainer.children.length === 1) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
}

// 카테고리 항목 필터링 함수
function filterTodos(selectedCategory) {
  todos.forEach((todo) => {
    if (selectedCategory === "all" || todo.category === selectedCategory) {
      todo.element.style.display = "flex";
    } else {
      todo.element.style.display = "none";
    }
  });
}

// 할 일 추가 함수
function addTodo() {
  // 입력된 값 없으면 저장 안 함
  const todo = todoInput.value.trim();
  if (todo === "") return;

  // 투두 입력 창 구성
  const todoItem = document.createElement("div");
  todoItem.classList.add("todo-item");
  const todoText = document.createElement("span");
  todoText.innerText = todo;
  todoText.classList.add("todo-text");
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  // 카테고리(드롭다운) 표시
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
    todos = todos.filter((todo) => todo.element !== todoItem); // 배열에서 삭제
    updateCounts();
    updateMessage();
  });

  // 완료 버튼
  const doneBtn = document.createElement("Input");
  doneBtn.type = "checkbox";
  doneBtn.classList.add("status");
  doneBtn.setAttribute("data-tooltip", "완료했냥?");

  doneBtn.addEventListener("click", () => {
    const todoData = todos.find((todo) => todo.element === todoItem);
    todoData.done = doneBtn.checked; // 완료 여부 업데이트

    if (doneBtn.checked) {
      todoText.style.textDecoration = "line-through";
      todoItem.style.backgroundColor = "#F0EBE3";
      alert(messages[Math.floor(Math.random() * messages.length)]);
      listContainer.appendChild(todoItem); // 완료된 항목은 맨 아래로 이동
    } else {
      todoText.style.textDecoration = "none";
      todoItem.style.backgroundColor = "";
    }

    updateCounts();
  });

  // todo 아이템을 배열에 저장
  const todoData = {
    done: false, // 완료 여부
    element: todoItem,
    category: "전체",
  };

  todos.push(todoData);

  // 요소 추가
  listContainer.prepend(todoItem);
  todoItem.appendChild(categoryText);
  todoItem.appendChild(todoText);
  todoItem.appendChild(buttonContainer);
  buttonContainer.appendChild(doneBtn);
  buttonContainer.appendChild(deleteBtn);

  todoInput.value = ""; // 입력 필드 초기화
  updateCounts();
  updateMessage(); // 메시지 업데이트
}

// 카테고리 선택(드롭다운) 함수
function categoryDropdown(categoryText) {
  // 열려있는 카테고리 드롭다운이 있으면 닫음
  const exisitingDropdown = document.querySelector(".category-dropdown");
  if (exisitingDropdown) {
    document.body.removeChild(exisitingDropdown);
  }

  const dropdown = document.createElement("ul");
  dropdown.classList.add("category-dropdown");

  categories.forEach((category) => {
    // 카테고리 배열 순회하면서 항목 생성
    const item = document.createElement("li");
    item.innerText = category.text;

    if (category.value === categoryText.getAttribute("data-category")) {
      item.style.color = "black"; // 현재 선택된 항목은 검정색
    } else {
      item.style.color = ""; // 다른 항목은 기본 색상
    }

    item.addEventListener("click", () => {
      // categoryText 요소의 텍스트를 클릭한 카테고리의 text로 변경
      categoryText.innerText = category.text;

      // 현재 선택한 카테고리를 data-category 속성에 저장.
      categoryText.setAttribute("data-category", category.value);

      const todoData = todos.find(
        (todo) => todo.element === categoryText.closest(".todo-item")
      );

      // 찾은 할 일의 카테고리 업데이트
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
const categoryFilters = document.querySelectorAll(
  ".category-container input[type='radio']"
);
categoryFilters.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    filterTodos(event.target.value);
  });
});

// 드롭다운 바깥을 클릭하면 닫히도록 처리
document.addEventListener("click", (event) => {
  if (!event.target.classList.contains("category-text")) {
    const existingDropdown = document.querySelector(".category-dropdown");
    if (existingDropdown) {
      document.body.removeChild(existingDropdown);
    }
  }
});

header.addEventListener("click", () => {
  location.reload(); // 페이지 새로고침
});

// 할 일 추가 버튼
addBtn.addEventListener("click", addTodo);

// 엔터키로 할 일 추가
todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});
