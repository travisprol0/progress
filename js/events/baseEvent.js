export class BaseEvent {
    constructor(league, type) {
      this.league = league;
      this.type = type;
    }
    // Renders the basic event card. Subclasses may add details via overriding renderGameControls().
    render(index) {
      let details = "";
      if (this.type === "team") {
        details = `
          <div id="details">
            <p>Team: ${this.teamName}</p>
            <p>Goal: ${this.goal}</p>
            <p><strong>Team Total</strong></p>
          </div>`;
      } else if (this.type === "game") {
        details = `
          <div id="details">
            <p>Teams: ${this.teamName1} vs ${this.teamName2}</p>
            <p>Goal: ${this.goal}</p>
            <p><strong>Game Total: </strong><span id="gameTotal">0</span></p>
          </div>`;
      } else {
        details = `
          <div id="details">
            <p>Details: ${this.details || "N/A"}</p>
          </div>`;
      }
      return `
        <div class="event" style="border:1px solid #ddd; padding:10px; margin-bottom:10px;">
          <p><strong>Event ${index + 1}</strong></p>
          <p>League: ${this.league}</p>
          ${details}
          <button class="delete" onclick="eventManager.deleteEvent(${index})"
            style="background:#e74c3c; color:#fff; border:none; padding:5px 10px; border-radius:3px;">
            Delete
          </button>
          <div id="inlineControls_${index}" style="margin-top:15px;"></div>
        </div>
      `;
    }
    
    // By default, no inline controls.
    renderGameControls(index) {
      return "";
    }
  }
  