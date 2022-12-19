document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

/**
 * Task form
 */
const taskForm = document.querySelector("#taskForm");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskForm["title"].value;
  const description = taskForm["description"].value;
  const price = taskForm["price"].value;
  App.createTask(title, description, price);
});