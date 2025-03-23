//import { updateNCAABGameControl, updateNCAABTeamControl } from "./ncaabHandlers.js";


export function attachNCAABHandlers(index, goalValue, type) {
    const container = document.querySelector(`.game-controls[data-index="${index}"]`);

    if (container) {
        // Attach listeners for half selection
        container.addEventListener("change", (event) => {
            if (event.target.id === `halfSelect_${index}`) {
                console.log(`Half selected for index ${index}, type: ${type}`);
                if (type === "game") {
                    updateNCAABGameControl(index, goalValue);
                } else if (type === "team") {
                    updateNCAABTeamControl(index, goalValue);
                }
            }
        });

        // Attach listeners for time and score inputs
        container.addEventListener("change", (event) => {
            const id = event.target.id;

            if (type === "game" &&
                (id === `time_${index}` || id === `score1_${index}` || id === `score2_${index}`)) {
                console.log(`Input updated for game index ${index}: ${id}`);

                const score1 = parseInt(document.getElementById(`score1_${index}`).value) || 0;
                const score2 = parseInt(document.getElementById(`score2_${index}`).value) || 0;
                const gameTotal = score1 + score2;

                const totalSpan = document.getElementById('gameTotal');
                if (totalSpan) {
                    totalSpan.textContent = `${gameTotal}`;
                }

                updateNCAABGameControl(index, goalValue);
            }

            if (type === "team" &&
                (id === `time_${index}` || id === `score_${index}`)) {
                console.log(`Input updated for team index ${index}: ${id}`);
                updateNCAABTeamControl(index, goalValue);
            }
        }, true); // Use capturing phase for blur
    }
}

// Update goal progress and probability for NCAAB Game Total
export function updateNCAABGameControl(index, goalValue) {
    const halfSelect = document.getElementById(`halfSelect_${index}`);
    const timeInput = document.getElementById(`time_${index}`);
    const score1 = parseFloat(document.getElementById(`score1_${index}`).value) || 0;
    const score2 = parseFloat(document.getElementById(`score2_${index}`).value) || 0;

    // Skip calculation if any necessary values are 0
    if (halfSelect.selectedIndex === 0 || timeInput.value.length === 0 || score1 === 0 || score2 === 0) {
        console.log("Skipping calculation: Missing or incomplete input values.");
        return;
    }

    const totalScore = score1 + score2;

    const goalBarElem = document.querySelector(`.goal-bar[data-index="${index}"]`);
    const probBarElem = document.querySelector(`.prob-bar[data-index="${index}"]`);
    if (!goalBarElem || !probBarElem) {
        console.error("Required elements (goalBar or probBar) not found.");
        return;
    }

    const timeInputValue = timeInput.value.trim();
    if (!/^\d{1,2}:\d{2}$/.test(timeInputValue)) {
        console.error(`Invalid time format for index ${index}. Expected format: mm:ss`);
        alert("Please enter the time in the correct format: mm:ss");
        return;
    }

    const [mins, secs] = timeInputValue.split(":").map(Number);
    const totalGameDuration = 2400; // Full game = 40 minutes in seconds
    let adjustedTimeLeft;

    if (halfSelect.value === "1st") {
        const timeLeft = (mins * 60) + secs;
        adjustedTimeLeft = totalGameDuration - (1200 - timeLeft);
    } else {
        adjustedTimeLeft = (mins * 60) + secs;
    }

    // Progress Calculation
    const goalProgress = Math.min((totalScore / goalValue) * 100, 100);
    goalBarElem.style.width = `${goalProgress}%`;
    goalBarElem.textContent = `${goalProgress.toFixed(2)}%`;

    // Simplified Probability Calculation
    const timeElapsed = totalGameDuration - adjustedTimeLeft;
    const timeRemaining = adjustedTimeLeft / 60; // Convert to minutes
    const pointsRemaining = goalValue - totalScore;

    const scoringRate = totalScore / (timeElapsed / 60); // Points per minute based on elapsed time
    const requiredRate = pointsRemaining / timeRemaining;

    let probability;
    if (totalScore >= goalValue) {
        probability = 100; // Goal is met or exceeded
    } else {
        probability = (scoringRate >= requiredRate) 
            ? 100 
            : (scoringRate / requiredRate) * 100;
    }

    // Cap probability
    probability = Math.min(Math.max(probability, 0), 100);

    probBarElem.style.width = `${probability}%`;
    probBarElem.textContent = `${Math.round(probability)}%`;
}


// Update goal progress and probability for NCAAB Team Total
export function updateNCAABTeamControl(index, goalValue) {
    const halfSelect = document.getElementById(`halfSelect_${index}`);
    const timeInput = document.getElementById(`time_${index}`);
    const scoreInput = document.getElementById(`score_${index}`);

    // Skip calculation if any necessary values are missing or zero
    if (!halfSelect || !timeInput || !scoreInput || parseFloat(scoreInput.value) === 0) {
        console.log("Skipping calculation: Missing or incomplete input values.");
        return;
    }

    const score = parseFloat(scoreInput.value) || 0;

    const goalBarElem = document.querySelector(`.goal-bar[data-index="${index}"]`);
    const probBarElem = document.querySelector(`.prob-bar[data-index="${index}"]`);
    if (!goalBarElem || !probBarElem) {
        console.error("Required elements (goalBar or probBar) not found.");
        return;
    }

    const timeInputValue = timeInput.value.trim();
    if (!/^\d{1,2}:\d{2}$/.test(timeInputValue)) {
        console.error(`Invalid time format for index ${index}. Expected format: mm:ss`);
        alert("Please enter the time in the correct format: mm:ss");
        return;
    }

    const [mins, secs] = timeInputValue.split(":").map(Number);
    const totalGameDuration = 2400; // Full game = 40 minutes in seconds
    let adjustedTimeLeft;

    if (halfSelect.value === "1st") {
        const timeLeft = (mins * 60) + (secs || 0);
        adjustedTimeLeft = totalGameDuration - (1200 - timeLeft);
    } else {
        adjustedTimeLeft = (mins * 60) + (secs || 0);
    }

    const elapsedTime = totalGameDuration - adjustedTimeLeft;

    // Skip calculation if elapsedTime is 0
    if (elapsedTime === 0) {
        console.log("Skipping calculation: Elapsed time is zero.");
        return;
    }

    const scoringRate = score / elapsedTime;
    const adjustedScoringRate = halfSelect.value === "2nd"
        ? scoringRate * 1.1
        : scoringRate;
    const projectedTotal = score + adjustedScoringRate * adjustedTimeLeft;

    const goalProgress = Math.min((score / goalValue) * 100, 100);
    goalBarElem.style.width = `${goalProgress}%`;
    goalBarElem.textContent = `${Math.round(goalProgress)}%`;

    const timeFactor = Math.sqrt(adjustedTimeLeft / totalGameDuration);
    let probability = (projectedTotal / goalValue) * 100 * timeFactor;

    if (projectedTotal >= goalValue) {
        probability += 10;
    }

    probability = Math.max(probability, 5);
    probability = Math.min(probability, 100);

    probBarElem.style.width = `${probability}%`;
    probBarElem.textContent = `${Math.round(probability)}%`;
}
