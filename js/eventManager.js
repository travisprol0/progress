import { attachUpdateHandlers } from "./handlers/updateHandlers.js";

export class EventManagerClass {
    constructor() {
        this.events = [];
    }

    addEvent(ev) {
        this.events.push(ev);
        this.render();
    }

    deleteEvent(index) {
        this.events.splice(index, 1);
        this.render();
    }

    render() {
        const appDiv = document.getElementById("app");
        appDiv.innerHTML = "";

        if (this.events.length === 0) {
            appDiv.innerHTML = "<p>No events yet. Add one above!</p>";
            return;
        }

        this.events.forEach((ev, i) => {
            appDiv.innerHTML += ev.render(i); // Render event structure
        });

        // Now render controls and attach listeners
        this.events.forEach((ev, i) => {
            const container = document.getElementById(`inlineControls_${i}`);
            if (container) {
                container.innerHTML = ev.renderGameControls(i, ev.goal, ev.type); // Add inline controls
                attachUpdateHandlers(i, ev); // Attach event listeners AFTER rendering
            }
        });
    }
}

export const eventManager = new EventManagerClass();
