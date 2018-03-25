import Dexie from 'dexie';

const db = new Dexie("weft-database");
db.version(1).stores({stories: "name"});

db.open().catch(function (e) {
    console.error("Open failed: " + e.stack);
});

export default class Storage {

    static storeStory(name, story) {
        return db.stories.put({story,name});
    };

    static getStory(name) {
        return db.stories.where("name").equals(name);
    };

};


