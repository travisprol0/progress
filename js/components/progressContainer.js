export class ProgressContainer {
    constructor(index) {
      this.index = index;
      this.goalProgress = 0;
      this.probability = 0;
    }
  
    render() {
      return `
        <div id="progressContainer" class="progress-container">
          <label for="goalBar_${this.index}">Goal Progress:</label>
          <div class="goal-bar" id="goalBar_${this.index}" data-index="${this.index}">${this.goalProgress}%</div>
          
          <label for="probBar_${this.index}">Probability:</label>
          <div class="prob-bar" id="probBar_${this.index}" data-index="${this.index}">${this.probability}%</div>
        </div>
      `;
    }
  
    updateGoalProgress(progress) {
      this.goalProgress = progress;
      const goalBar = document.getElementById(`goalBar_${this.index}`);
      if (goalBar) {
        goalBar.textContent = `${this.goalProgress}%`;
      }
    }
  
    updateProbability(probability) {
      this.probability = probability;
      const probBar = document.getElementById(`probBar_${this.index}`);
      if (probBar) {
        probBar.textContent = `${this.probability}%`;
      }
    }
  }
  