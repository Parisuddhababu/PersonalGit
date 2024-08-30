let events = ["contextmenu"];
let contextMenu = document.getElementById("context-menu");
events.forEach((eventType) => {
  document.addEventListener(eventType, (e) => {
    e.preventDefault();
    let mouseX = e.clientX;
    let mouseY = e.clientY;
    let menuHeight = contextMenu.getBoundingClientRect().height;
    let menuWidth = contextMenu.getBoundingClientRect().width;
    let width = window.innerWidth;
    let height = window.innerHeight;
    if (width - mouseX <= 200) {
      contextMenu.style.borderRadius = "5px";
      contextMenu.style.left = width - menuWidth + "px";
      contextMenu.style.top = mouseY + "px";
      if (height - mouseY <= 200) {
        contextMenu.style.top = mouseY - menuHeight + "px";
        contextMenu.style.borderRadius = "5px 5px 0 5px";
      }
    } else {
      contextMenu.style.borderRadius = "5px";
      contextMenu.style.left = mouseX + "px";
      contextMenu.style.top = mouseY + "px";
      if (height - mouseY <= 200) {
        contextMenu.style.top = mouseY - menuHeight + "px";
        contextMenu.style.borderRadius = "5px";
      }
    }
    contextMenu.style.visibility = "visible";
  });
});

document.addEventListener("click", function (e) {
  if (contextMenu.contains(e.target) || !contextMenu.contains(e.target)) {
    contextMenu.style.visibility = "hidden";
  }
});

const textFieldEl = document.getElementById("textField");
const regex = /[.,!?\s]/g;

textFieldEl.addEventListener("mousedown", function () {
  let selectedInputText = "";
  if (window.getSelection) {
    selectedInputText = window.getSelection();
  } else if (document.getSelection) {
    selectedInputText = document.getSelection();
  } else return;

  inputEl.value = selectedInputText
    .toString()
    .replace(regex, "")
    .substring(0, 20);
});

const textAreaFieldEl = document.getElementById("textAreaField");
let selectedText = "";
textAreaFieldEl.addEventListener("mousedown", function () {
  if (window.getSelection) {
    selectedText += window.getSelection();
  } else if (document.getSelection) {
    selectedText += document.getSelection();
  } else return;
  textAreaEl.value = selectedText.toString();
});

const imgEl = document.getElementById("image");

const inputEl = document.getElementById("text");
const textAreaEl = document.getElementById("textarea");
const imageEl = document.getElementById("image1");

const formEl = document.getElementById("myForm");
formEl.addEventListener("click", function () {
  if (inputEl.value !== "" && textAreaEl.value !== "") {
    formEl.submit();
    alert("Form Submitted");
  }
});

const imagesList = document.getElementById("imagesList");

let imageUrl;
let imageId;
document.addEventListener("dblclick", function (e) {
  if (e.target.src) {
    imageUrl = e.target.src;
    imageId = e.target.id;
    const node = document.createElement("img");
    node.src = imageUrl;
    node.id = imageId;
    imagesList.appendChild(node);
  } else return;
});
