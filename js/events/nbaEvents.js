import { BaseEvent } from "./baseEvent.js"; // Import BaseEvent from its file

export class NBATeamEvent extends BaseEvent {
    constructor(teamName, goal) {
        super("NBA", "Team Total");
        this.teamName = teamName;
        this.goal = goal;
    }

    renderGameControls(index) {
        return `
            <div class="game-controls">
                <label for="score_${index}">Score:</label>
                <input type="number" id="score_${index}" value="0" placeholder="Enter score">

                <label for="time_${index}">Time Remaining (MM:SS):</label>
                <input type="text" id="time_${index}" placeholder="e.g., 10:00">

                <div id="progressContainer_${index}" style="margin-top:10px;">
                    <div>Goal Progress: <span id="goalProg_${index}">0%</span></div>
                    <div style="background:#4CAF50; height:20px; width:0%;" id="goalBar_${index}"></div>
                </div>
            </div>
        `;
    }
}

export class NBAGameEvent extends BaseEvent {
    constructor(teamName1, teamName2, goal) {
        super("NBA", "Game Total");
        this.teamName1 = teamName1;
        this.teamName2 = teamName2;
        this.goal = goal;
    }

    renderGameControls(index) {
        return `
            <div class="game-controls">
                <label for="score1_${index}">Score - ${this.teamName1}:</label>
                <input type="number" id="score1_${index}" value="0" placeholder="Enter score">
                
                <label for="score2_${index}">Score - ${this.teamName2}:</label>
                <input type="number" id="score2_${index}" value="0" placeholder="Enter score">

                <label for="time_${index}">Time Remaining (MM:SS):</label>
                <input type="text" id="time_${index}" placeholder="e.g., 10:00">

                <div id="progressContainer_${index}" style="margin-top:10px;">
                    <div>Goal Progress: <span id="goalProg_${index}">0%</span></div>
                    <div style="background:#4CAF50; height:20px; width:0%;" id="goalBar_${index}"></div>
                </div>
            </div>
        `;
    }
}
