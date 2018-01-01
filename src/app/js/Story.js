const STORAGE_KEY = "_chatter_graph";

export default class Story {

    static toLocalStorage(story) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(story));
    }

    static fromLocalStorage() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));

    }

};