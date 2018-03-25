import Storage from './project/Storage.js';

const STORAGE_KEY = "_chatter_graph";
const INITIAL_STORY = {
    entries: [
        {id: "Start", pos: {x: 30, y: 30}, data: {content: '<<MO "Hello">> \n [[A]] \n[[B]]'}, children: ['A', 'B']},
    ]
};


export default class Story {


    /**
     * return {Promise}
     */
    static fromStorage() {
        const result = Storage.getStory(STORAGE_KEY)
        return result.first().then((result)=>{
            console.log(result);
            if(!result){
                return INITIAL_STORY;
            }
            return result.story;
        });
    }

    /**
     * return {Promise}
     */
    static toStorage(story) {
        return Storage.storeStory(STORAGE_KEY, story).then(() => story);
    }


    static toLocalStorage(story) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(story));
    }

    static fromLocalStorage() {
        let story = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (!story) {
            story = INITIAL_STORY;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(story));
        }

        return story;

    }

};