let list = $(".task-list");
let btn = $(".btn");
let inp = $(".name-input");
let fam = $(".family-input");
let nums = $(".number-input");
let modalName = $(".modalNameInput");
let modalFamily = $(".modalFamilyInput");
let modalNumber = $(".modalNumberInput");
let weekKpi = $(".week-kpi");
let monthKpi = $(".month-kpi");
let idclick = 0;
let pag = 1;
//проверка на заполненность полей
//работа Чингиза
btn.on("click", function () {
  if (
    !inp.val().trim() ||
    !fam.val().trim() ||
    !nums.val().trim() ||
    !weekKpi.val().trim() ||
    !monthKpi.val().trim()
  ) {
    alert("Заполните все поля");
    return;
  }
  let contact = {
    name: inp.val(),
    fam: fam.val(),
    nums: nums.val(),
    weekKpi: weekKpi.val(),
    monthKpi: monthKpi.val(),
  };
  postNewContact(contact);
  inp.val("");
  fam.val("");
  nums.val("");
  weekKpi.val("");
  monthKpi.val("");
});
//работа Чингиза
function postNewContact(contact) {
  fetch("http://localhost:8000/todos", {
    method: "POST",
    body: JSON.stringify(contact),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  }).then(() => render());
}
//рендер
fetch("http://localhost:8000/todos?_limit=10&_page=1")
  .then((res) => res.json())
  .then((data) => console.log(data));
//работа Чингиза
async function render(num) {
  let res = await fetch(`http://localhost:8000/todos?_limit=10&_page=${num}`);
  let data = await res.json();

  list.html("");
  data.forEach((item) => {
    list.append(
      `<li id=${item.id}>Name:<b> ${item.name}</b> Family: <b> ${item.fam}</b> Number: <b>${item.nums}</b> Week Kpi:<b> ${item.weekKpi}</b> MonthKpi:<b> ${item.monthKpi}</b><button class="btn-delete">Delete</button>  <button id = "${item.id}" class="btn-patch"> edit  </button></li><hr>`
    );
  });
  $(".searchCont").html("");
  students();
}
//кнопка удаления
//работа Чингиза
$("body").on("click", ".btn-delete", function (event) {
  let id = event.target.parentNode.id;
  fetch(`http://localhost:8000/todos/${event.target.parentNode.id}`, {
    method: "DELETE",
  }).then(() => render());
});
//работа Эрлана
//количество студентов
function students() {
  fetch("http://localhost:8000/todos")
    .then((res) => res.json())
    .then((data) => {
      $(".amount").html(`Students amount: ${data.length}`);
    });
}

//кнопка изменения
$("body").on("click", ".btn-patch", function (event) {
  idclick = event.target.id;
  $(".main-modal").html(`<div class="close">
  <button class="btn-close">X</button>
</div>
<span class="spanText">Name: </span>
<input type="text" class="modalNameInput" /><br />
<span class="spanText">Family: </span>
<input type="text" class="modalFamilyInput" /><br />
<span class="spanText">Number: </span>
<input type="text" class="modalNumberInput" /><br />
<span class="spanText">Week kpi: </span>
<input type="text" class="modalKpi" /><br />
<span class="spanText">Month kpi: </span>
<input type="text" class="monthModalKpi" /><br />
<button id = ${event.target.parentNode.id} class = "modalEdit">Edit</button>`);
  $(".main-modal").css("display", "block");
  $(".bg").css("display", "block");
  $(".btn-close").on("click", function () {
    $(".main-modal").css("display", "none");
    $(".bg").css("display", "none");
  });

  changeContact();
});
//работа Эрлана
//функция для изменений контактов
function changeContact() {
  fetch(`http://localhost:8000/todos/${idclick}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      $(".modalNameInput").val(`${data.name}`);
      $(".modalFamilyInput").val(`${data.fam}`);
      $(".modalNumberInput").val(`${data.nums}`);
      $(".modalKpi").val(`${data.weekKpi}`);
      $(".monthModalKpi").val(`${data.monthKpi}`);
    });
}
//кнопка эдиты
//работа Чингиза и Эрлана
$("body").on("click", ".modalEdit", function (event) {
  $(".main-modal").css("display", "none");

  console.log(event.target.id);

  let obj = {
    name: $(".modalNameInput").val(),
    fam: $(".modalFamilyInput").val(),
    nums: $(".modalNumberInput").val(),
    weekKpi: $(".modalKpi").val(),
    monthKpi: $(".monthModalKpi").val(),
  };
  fetch(`http://localhost:8000/todos/${event.target.id}`, {
    method: "PATCH",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => render());
});
//поиск
//работа Эрлана
$("#searchInp").on("input", function () {
  if (!$("#searchInp").val()) {
    $(".searchCont").html("");
  }
  fetch("http://localhost:8000/todos")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      data.map((elem) => {
        if (
          elem.name.toUpperCase() === $("#searchInp").val().toUpperCase() ||
          elem.fam.toUpperCase() === $("#searchInp").val().toUpperCase() ||
          elem.number === $("#searchInp").val()
        ) {
          $(".searchCont").html(
            `<li id=${elem.id}>Name:<b> ${elem.name}</b> Family: <b> ${elem.fam}</b> Number: <b>${elem.nums}</b> Week Kpi:<b> ${elem.weekKpi}</b> MonthKpi:<b> ${elem.monthKpi}</b><button class="btn-delete">Delete</button>  <button id = "${elem.id}" class="btn-patch"> edit  </button></li><hr>`
          );
        }
      });
    });
});
//кнопка некст
$(".next").on("click", function () {
  render(pag + 1);
});
//кнопка назад
$(".prev").on("click", function () {
  // if (pag <= 1) return;
  render(pag - 1);
});
render();
