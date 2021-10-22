let list = $(".task-list");
let btn = $(".btn");
let inp = $(".name-input");
let fam = $(".family-input");
let nums = $(".number-input");
let modalName = $(".modalNameInput");
let modalFamily = $(".modalFamilyInput");
let modalNumber = $(".modalNumberInput");

btn.on("click", function () {
  if (!inp.val().trim() || !fam.val().trim() || !nums.val().trim()) {
    alert("Заполните все поля");
    return;
  }
  let contact = {
    name: inp.val(),
    fam: fam.val(),
    nums: nums.val(),
  };
  postNewContact(contact);
  inp.val("");
  fam.val("");
  nums.val("");
});

function postNewContact(contact) {
  fetch("http://localhost:8000/todos", {
    method: "POST",
    body: JSON.stringify(contact),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  }).then(() => render());
}

async function render() {
  let res = await fetch("http://localhost:8000/todos");
  let data = await res.json();

  list.html("");
  data.forEach((item) => {
    list.append(
      `<li id=${item.id}><b>Name:</b> ${item.name}<b> Family:</b> ${item.fam}<b> Phone Number:</b>${item.nums}<button class="btn-delete">Delete</button> <button class="btn-patch">  Patch</button></li>`
    );
  });
}

$("body").on("click", ".btn-delete", function (event) {
  let id = event.target.parentNode.id;
  fetch(`http://localhost:8000/todos/${id}`, {
    method: "DELETE",
  }).then(() => render());
});
$("body").on("click", ".btn-patch", function (event) {
  $(".main-modal").html(`<div class="close">
  <button class="btn-close">X</button>
</div>
<span>Name</span>
<input type="text" class="modalNameInput" />
<span>Family</span>
<input type="text" class="modalFamilyInput" />
<span>number</span>
<input type="text" class="modalNumberInput" />
<button id = ${event.target.parentNode.id} class = "modalEdit">Edit</button>`);
  $(".main-modal").css("display", "block");
  // let editButton = event.target.parentNode.id;

  // console.log(event.target.parentNode.id);
});
$("body").on("click", ".modalEdit", function (event) {
  $(".main-modal").css("display", "none");
  console.log($(".modalNameInput").val(), $(".modalFamilyInput").val());
  console.log(event.target.id);
  // let editButton=event.target.parentNode.id
  // console.log(event.target.parentNode.id)
  let obj = {
    name: $(".modalNameInput").val(),
    fam: $(".modalFamilyInput").val(),
    nums: $(".modalFamilyInput").val(),
  };
  fetch(`http://localhost:8000/todos/${event.target.id}`, {
    method: "PATCH",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => render());
});

$(".btn-close").on("click", function (event) {
  $(".main-modal").css("display", "none");
});

render();
