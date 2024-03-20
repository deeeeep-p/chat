const socket = io();
let username;

const form = document.getElementById("chat-form");
const input = form.querySelector('input[type="text"]');
const fileInput = form.querySelector('input[type="file"]');
const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const reader = new FileReader();
  const file = fileInput.files[0];

  if (!file && !input.value) {
    alert("pls enter msg");
    return;
  }

  if (file) {
    reader.readAsDataURL(file);
    reader.onload = () => {
      socket.emit("chat message", {
        author: username,
        content: input.value,
        image: reader.result,
      });
      input.value = "";
      fileInput.value = "";
    };
  } else {
    socket.emit("chat message", {
      author: username,
      content: input.value,
      image: null,
    });
    input.value = "";
    fileInput.value = "";
  }
});

if (localStorage.getItem("username")) {
  username = localStorage.getItem("username");
  socket.emit("username", username);
} else {
  Swal.fire({
    title: "Enter your username",
    input: "text",
    inputLabel: "Username",
    inputPlaceholder: "Enter your username",
    allowoutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return "You need to enter a username!";
      }
    },
    confirmButtonText: "Enter Chat",
    showLoaderOnConfirm: true,
    preConfirm: (username) => {},
  }).then((result) => {
    console.log(result);
    username = result.value;
    socket.emit("username", username);
    localStorage.setItem("username", username);
  });
}

function scrollToBottom() {
  const messageList = document.getElementById("messages");
  messageList.scrollTop = messageList.scrollHeight;
}

socket.on("user joined", (username) => {
  console.log(username);
  const item = document.createElement(`li`);
  let messages = document.getElementById("messages");
  item.classList.add(`chat-message`);
  item.innerHTML = `<span class="chat-username">${username} has joined</span>`;
  messages.appendChild(item);
  scrollToBottom();
});
socket.on("user left", (data) => {
  const item = document.createElement(`li`);
  let messages = document.getElementById("messages");
  item.classList.add(`chat-message`);
  item.innerHTML = `<span class="chat-username">${data} has left</span>`;
  messages.appendChild(item);
  scrollToBottom();
});

socket.on("chat message", (msg) => {
  const item = document.createElement(`li`);
  item.classList.add(`chat-message`);
  item.innerHTML = `<span class="chat-username">${msg.author} :${msg.content} </span>`;
  if (msg.image) {
    const img = document.createElement("img");
    img.src = msg.image;
    img.classList.add("image");
    item.appendChild(img);
  }

  messages.appendChild(item);
  scrollToBottom();
});

socket.on("load messages", (msg) => {
  msg.forEach((msg) => {
    const item = document.createElement(`li`);
    item.classList.add(`chat-message`);
    item.innerHTML = `<span class="chat-username">${msg.author} :${msg.content} </span>`;
    if (msg.image) {
      const img = document.createElement("img");
      img.src = msg.image;
      img.classList.add("image");
      item.appendChild(img);
    }

    messages.appendChild(item);
    scrollToBottom();
  });
});
