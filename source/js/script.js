window.onload = function() {
  const messagesContainer = document.querySelector(".js-messages-container"),
    messagesList = messagesContainer.querySelector(".js-messages-list"),
    instance = OverlayScrollbars(messagesContainer, {}),
    textarea = document.querySelector(".js-textarea"),
    submitBtn = document.querySelector(".js-submit-btn");

  scrollWindow();

  submitBtn.addEventListener("click", function(e) {
    e.preventDefault();
    if (textarea.value.trim()) {
      const dateTime = getCurrentDateTime(),
        newMessage = createMessage(dateTime);

      textarea.value = "";
      scrollWindow();
      newMessage.classList.remove("chat__messages-item--just-sent");
    }
  });

  textarea.addEventListener("input", function() {
    if (this.scrollHeight > this.clientHeight) this.rows = 10;
  });

  function scrollWindow() {
    instance.scroll([0, messagesList.scrollHeight], 200);
  }

  function getCurrentDateTime() {
    const date = new Date(),
      dateTime = {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      };

    return dateTime;
  }

  function createMessage(dateTime) {
    const newMessage = document.createElement("li");
    newMessage.className = "chat__messages-item chat__messages-item chat__messages-item--user chat__messages-item--just-sent";
    newMessage.innerHTML = `
        <img class="chat__photo chat__photo--messages" src="img/user.png" alt="Фото пользователя">
        <p class="chat__messages-text text">${ textarea.value }</p>
        <time class="chat__date-time" datetime="${ dateTime.year }-${ dateTime.month }-${ dateTime.day }T${ dateTime.hours }:${ dateTime.minutes }"><span>сегодня </span>в<span> ${ dateTime.hours }.${ dateTime.minutes }</span></time>`;
    messagesList.appendChild(newMessage);

    return newMessage;
  }
};
