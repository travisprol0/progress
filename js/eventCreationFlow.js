// Import event classes and event manager
import { eventManager } from "./eventManager.js";
import { NCAABTeamEvent, NCAABGameEvent } from "./events/ncaabEvents.js";
import { NBATeamEvent, NBAGameEvent } from "./events/nbaEvents.js";
import { ProgressContainer } from "./components/progressContainer.js";

const progressInstances = new Map();

// Function to show the "Add Event" form
export function showAddEventForm() {
    const leagueSelect = document.getElementById("leagueSelect");
    const selectedLeague = leagueSelect.value;

    if (!selectedLeague) {
        alert("Please select a league before adding an event!");
        return;
    }

    const dynamicFields = document.getElementById("dynamicFields");
    dynamicFields.innerHTML = ""; // Clear previous content

    // Check the selected league
    if (selectedLeague === "NCAAB" || selectedLeague === "NBA") {
        dynamicFields.innerHTML = `
        <label for="totalSelect">Total Type</label>
        <select id="totalSelect">
          <option value="" disabled selected>Select Total Type</option>
          <option value="Team Total">Team Total</option>
          <option value="Game Total">Game Total</option>
        </select>
        <div id="additionalFields"></div>
      `;

        // Attach event listener for "Total Type" selection
        const totalSelect = document.getElementById("totalSelect");
        totalSelect.addEventListener("change", handleTotalTypeChange);
    } else {
        // For other leagues, create a basic event
        const newEvent = new BaseEvent(selectedLeague, "General");
        eventManager.addEvent(newEvent);
        dynamicFields.innerHTML = ""; // Clear the form
    }
}

// Function to handle the selection of total type
export function handleTotalTypeChange() {
    const totalType = document.getElementById("totalSelect").value;
    const additionalFields = document.getElementById("additionalFields");

    if (totalType === "Team Total") {
        additionalFields.innerHTML = `
            <label for="teamName">Team Name</label>
            <input type="text" id="teamName" placeholder="e.g., Lakers">

            <label for="goal">Goal</label>
            <input type="number" id="goal" step="0.1" placeholder="Enter goal (e.g., 100.5)">

            <button id="saveEventButton">Save Event</button>
        `;
        document.getElementById("saveEventButton").addEventListener("click", () => {
            saveEvent("Team Total");
        });
    } else if (totalType === "Game Total") {
        additionalFields.innerHTML = `
            <label for="teamName1">Team 1 Name</label>
            <input type="text" id="teamName1" placeholder="e.g., Lakers">

            <label for="teamName2">Team 2 Name</label>
            <input type="text" id="teamName2" placeholder="e.g., Celtics">

            <label for="goal">Point Goal</label>
            <input type="number" id="goal" step="0.1" placeholder="Enter goal (e.g., 215)">

            <button id="saveEventButton">Save Event</button>
        `;
        document.getElementById("saveEventButton").addEventListener("click", () => {
            saveEvent("Game Total");
        });
    }
}

// Function to save the event based on user input
export function saveEvent(totalType) {
    const leagueSelect = document.getElementById("leagueSelect");
    const selectedLeague = leagueSelect.value;

    let newEvent;
    let eventIndex = Date.now();

    if (totalType === "Team Total") {
        const teamName = document.getElementById("teamName").value.trim();
        const goalValue = parseFloat(document.getElementById("goal").value);

        if (!teamName || isNaN(goalValue)) {
            alert("Please fill in all fields for Team Total!");
            return;
        }

        if (selectedLeague === "NCAAB") {
            newEvent = new NCAABTeamEvent(teamName, goalValue, "team");
        } else if (selectedLeague === "NBA") {
            newEvent = new NBATeamEvent(teamName, goalValue);
        }

        eventManager.addEvent(newEvent); // Add the event to the manager
    } else if (totalType === "Game Total") {
        const teamName1 = document.getElementById("teamName1").value.trim();
        const teamName2 = document.getElementById("teamName2").value.trim();
        const goalValue = parseFloat(document.getElementById("goal").value);

        if (!teamName1 || !teamName2 || isNaN(goalValue)) {
            alert("Please fill in all fields for Game Total!");
            return;
        }
        
        if (selectedLeague === "NCAAB") {
            newEvent = new NCAABGameEvent(teamName1, teamName2, goalValue, "game");
        } else if (selectedLeague === "NBA") {
            newEvent = new NBAGameEvent(teamName1, teamName2, goalValue);
        }

        eventManager.addEvent(newEvent); // Add the event to the manager
    }

    const progressContainer = new ProgressContainer(eventIndex);
    progressInstances.set(eventIndex, progressContainer);

    const dynamicFields = document.getElementById("dynamicFields");
    dynamicFields.innerHTML = progressContainer.render();

    document.getElementById("dynamicFields").innerHTML = ""; // Clear the form after saving
}

export function updateProgress(eventIndex, goalProgress, probability) {
    const progressContainer = progressInstances.get(eventIndex);
    if (progressContainer) {
        progressContainer.updateGoalProgress(goalProgress);
        progressContainer.updateGoalProbability(probability);
    }
}

