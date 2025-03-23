import { attachNCAABHandlers } from "./ncaabHandlers.js";
import { attachNBAHandlers } from "./nbaHandlers.js";

export function attachUpdateHandlers(index, ev) {
    if (ev.league === "NCAAB") {
        // Pass the event type (e.g., "team" or "game") into the NCAAB handler
        attachNCAABHandlers(index, ev.goal, ev.type); // Conditional handling within
    } else if (ev.league === "NBA") {
        attachNBAHandlers(index, ev); // Delegate to NBA-specific logic
    } else {
        console.error(`No handler found for league: ${ev.league}`);
    }
}