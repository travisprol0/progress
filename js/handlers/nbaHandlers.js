export function attachNBAHandlers(index, ev) {
    const scoreInput1 = document.getElementById(`score1_${index}`);
    const scoreInput2 = document.getElementById(`score2_${index}`);

    if (scoreInput1 && scoreInput2) {
        const updateScore = () => {
            const score1 = parseFloat(scoreInput1.value) || 0;
            const score2 = parseFloat(scoreInput2.value) || 0;
            updateNBAGameControl(index, ev.goal, score1 + score2);
        };

        scoreInput1.addEventListener("blur", updateScore);
        scoreInput2.addEventListener("blur", updateScore);
    }
}

function updateNBAGameControl(index, goalValue, totalScore) {
    const goalProgressBarElem = document.getElementById(`goalBar_${index}`);
    const probabilityProgressBarElem = document.getElementById(`probBar_${index}`);

    // Calculate goal progress
    const goalProgress = Math.min((totalScore / goalValue) * 100, 100);
    goalProgressBarElem.style.width = goalProgress + "%";
    goalProgressBarElem.textContent = Math.round(goalProgress) + "%";

    // Calculate probability
    const totalTime = 12 * 60 * 4; // Assume total game time is 48 minutes
    const scoringRate = totalScore / totalTime;
    const projectedTotal = totalScore + scoringRate * totalTime;
    let probability = Math.max(0, Math.min((projectedTotal / goalValue) * 100, 100));
    probabilityProgressBarElem.style.width = probability + "%";
    probabilityProgressBarElem.textContent = Math.round(probability) + "%";
}
