import { eventManager } from "./eventManager.js";
import { showAddEventForm } from "./eventCreationFlow.js";


document.addEventListener("DOMContentLoaded", () => {
  eventManager.render();
  document.getElementById("addEventButton").addEventListener("click", showAddEventForm);
});
