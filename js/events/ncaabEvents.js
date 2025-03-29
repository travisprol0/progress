import { BaseEvent } from "./baseEvent.js";
import { ProgressContainer } from "../components/progressContainer.js";
import { updateNCAABGameControl } from "../handlers/ncaabHandlers.js";

let timers = {}; // Store intervals for each timer

function updateTimeField(index, type, goalValue) {
  const timeField = document.getElementById(`time_${index}`);
  if (!timeField) {
    console.error(`Time field for index ${index} not found.`);
    return;
  }

  console.log(`Time updated for index ${index}, type: ${type}`);
  if (type === "game") {
    updateNCAABGameControl(index, goalValue); // Call your existing update logic for game
  } else if (type === "team") {
    updateNCAABTeamControl(index, goalValue); // Call your existing update logic for team
  }
}

function onStartClick(index, type, goalValue) {
  const timeField = document.getElementById(`time_${index}`);
  if (!timeField) {
    console.error(`Time field for index ${index} not found.`);
    return;
  }

  const [minutes, seconds] = timeField.value.split(":").map(Number);
  if (isNaN(minutes) || isNaN(seconds)) {
    alert("Please enter a valid time in MM:SS format.");
    return;
  }

  let totalSeconds = minutes * 60 + seconds;

  if (timers[index]) {
    clearInterval(timers[index]); // Clear any existing timer
  }

  timers[index] = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timers[index]);
      alert("Time is up!");
      showStartButton(index); // Show "Start" button when time is up
      return;
    }

    totalSeconds--;

    const newMinutes = Math.floor(totalSeconds / 60);
    const newSeconds = totalSeconds % 60;

    timeField.value = `${newMinutes}:${newSeconds < 10 ? "0" : ""}${newSeconds}`;

    // Update progress dynamically
    updateTimeField(index, type, goalValue);
  }, 1000);

  // Switch to "Pause" button
  showPauseButton(index);
}

function onPauseClick(index) {
  if (timers[index]) {
    clearInterval(timers[index]); // Stop the timer
    timers[index] = null; // Reset the interval reference
  }

  // Switch to "Start" button
  showStartButton(index);
}

function showStartButton(index) {
  const controls = document.getElementById(`timerControls_${index}`);
  controls.innerHTML = `<button id="startButton_${index}">Start</button>`;
  setTimeout(() => {
    document.getElementById(`startButton_${index}`).addEventListener("click", () => onStartClick(index));
  }, 0);
}

function showPauseButton(index) {
  const controls = document.getElementById(`timerControls_${index}`);
  controls.innerHTML = `<button id="pauseButton_${index}">Pause</button>`;
  setTimeout(() => {
    document.getElementById(`pauseButton_${index}`).addEventListener("click", () => onPauseClick(index));
  }, 0);
}


// NCAAB Team Total Event
export class NCAABTeamEvent extends BaseEvent {
  constructor(teamName, goal, type) {
    super("NCAAB", "Team Total");
    this.teamName = teamName;
    this.goal = goal;
    this.type = type;
  }

  renderGameControls(index, goalValue, type) {
    const progressContainer = new ProgressContainer(index);
    const html = `
      <div class="game-controls" data-index="${index}" data-type="${type}">
        <label for="teamName_${index}">Team:</label>
        <span id="teamName_${index}">${this.teamName}</span>
        <label for="score_${index}">Score:</label>
        <input type="number" id="score_${index}" value="0" placeholder="Enter score">
  
        <label for="halfSelect_${index}">Half:</label>
        <select id="halfSelect_${index}">
          <option value="" disabled selected>Select Half</option>
          <option value="1st">1st</option>
          <option value="2nd">2nd</option>
        </select>
  
        <label for="time_${index}">Time Remaining (MM:SS):</label>
        <input type="text" id="time_${index}" placeholder="e.g., 10:00">
  
      <div id="timerControls_${index}">
        <button id="startButton_${index}">Start</button>
      </div>

  
        ${progressContainer.render()}
      </div>
    `;
  
    // Bind buttons programmatically
    setTimeout(() => {
      document.getElementById(`startButton_${index}`).addEventListener("click", () => onStartClick(index, type, goalValue));
      document.getElementById(`pauseButton_${index}`).addEventListener("click", () => onPauseClick(index));
    }, 0);
  
    return html;
  }  
}

// NCAAB Game Total Event
export class NCAABGameEvent extends BaseEvent {
  constructor(teamName1, teamName2, goal, type) {
    super("NCAAB", "Game Total");
    this.teamName1 = teamName1;
    this.teamName2 = teamName2;
    this.goal = goal;
    this.type = type;
  }

  renderGameControls(index, goalValue, type) {
    const progressContainer = new ProgressContainer(index);
    const html = `
      <div class="game-controls" data-index="${index}" data-type="game">
        <div id="team1">
        <label for="teamName1_${index}">Team 1:</label>
          <span id="teamName1_${index}">${this.teamName1}</span>
          <label for="score1_${index}">Score:</label>
          <input type="number" id="score1_${index}" value="0" placeholder="Enter score">

          <button id="freeThrow1">☝</button>
          <button id="twoPoints1">✌</button>
          <button id="threePoints1">👌</button>
        </div>  
        
        <div id="team2">
          <label for="teamName2_${index}">Team 2:</label>
          <span id="teamName2_${index}">${this.teamName2}</span>
          <label for="score2_${index}">Score:</label>
          <input type="number" id="score2_${index}" value="0" placeholder="Enter score">

          <button id="freeThrow2">☝</button>
          <button id="twoPoints2">✌</button>
          <button id="threePoints2">👌</button>
        </div>

        <label for="halfSelect_${index}">Half:</label>
        <select id="halfSelect_${index}">
          <option value="" disabled selected>Select Half</option>
          <option value="1st">1st</option>
          <option value="2nd">2nd</option>
        </select>
    
        <label for="time_${index}">Time Remaining (MM:SS):</label>
        <input type="text" id="time_${index}" placeholder="e.g., 10:00">

        <div id="timerControls_${index}">
          <button id="startButton_${index}">Start</button>
        </div>

        ${progressContainer.render()}
      </div>
    `;
  
    // Bind start and pause button event listeners
    setTimeout(() => {
      document.getElementById(`startButton_${index}`).addEventListener("click", () => onStartClick(index, type, goalValue));
      //document.getElementById(`pauseButton_${index}`).addEventListener("click", () => onPauseClick(index));
      document.getElementById("freeThrow1").addEventListener("click", () => this.addPoints(1,1));
      document.getElementById("twoPoints1").addEventListener("click", () => this.addPoints(1,2));
      document.getElementById("threePoints1").addEventListener("click", () => this.addPoints(1,3));
      document.getElementById("freeThrow2").addEventListener("click", () => this.addPoints(2,1));
      document.getElementById("twoPoints2").addEventListener("click", () => this.addPoints(2,2));
      document.getElementById("threePoints2").addEventListener("click", () => this.addPoints(2,3));

    }, 0);
  
    return html;
  }

  addPoints(team, points) {
    const input = document.querySelector(`#team${team} input`);

    if (input) {
      const currentValue = parseInt(input.value) || 0;
      input.value = currentValue + points
      input.dispatchEvent(new Event("change")); // Dispatch a 'change' event
    }
  }
  
}
