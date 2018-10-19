// Weft uses a global EventBus
// Inspiration: https://alligator.io/vuejs/global-event-bus/
import Vue from 'vue';
export const EventBus = new Vue();
export const Events = {
    ENTRY_MOVED :  "ENTRY_MOVED",
    OPEN_EDITOR :  "OPEN_EDITOR",
    ENTRY_CHANGED : "ENTRY_CHANGED",
    ADD_NODE : "ADD_NODE",
    PLAY : "PLAY",
    EXPORT : "EXPORT",
    UPLOAD : "UPLOAD",
    SETTINGS : "SETTINGS",
    DELETE_SELECTED : "DELETE_SELECTED",
    SELECTION_CHANGED: "SELECTION_CHANGED",
    IMPORT_HTML_STRING : "IMPORT_HTML_STRING",
    ESC_PRESSED : "ESC_PRESSED"
};