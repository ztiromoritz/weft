import './css/styles.css';
import '../common/css/chat.css';
import 'spectre.css';
import 'spectre.css/dist/spectre-icons.css';
import GraphUI from './js/GraphUI.js';
import Story from './js/Story.js';
import Events from './js/Events.js';
import editor from './js/Editor.js';

const story = Story.fromLocalStorage();

const $graphElement = document.getElementById('graph');

function getChildren(options){
    options = options ||[];
    return options.map(option=>option.link);
}


if ($graphElement) {
    $graphElement.addEventListener(Events.CHATTER_ENTRY_MOVED, (e) => {
        const detail = e.detail;
        story.entries.forEach((entry) => {
            if (entry.id === detail.id) {
                entry.pos.x = detail.x;
                entry.pos.y = detail.y;
            }
        });
        Story.toLocalStorage(story);
    });


    $graphElement.addEventListener(Events.CHATTER_ENTRY_CHANGED, (e) => {
        const detail = e.detail;
        console.log(detail);
        story.entries.forEach((entry) => {

            if (entry.id === detail.id) {
                console.log (detail.content,detail.options, getChildren(detail.options));
                entry.id = detail.id
                entry.data.content = detail.content;
                entry.children = getChildren(detail.options);
            }
            //createReferencedElements(story, [listOfReferences]); //TODO:
            //updateGraphConnections(story); //TODO:
        });
        Story.toLocalStorage(story);
    });

    $graphElement.addEventListener(Events.CHATTER_OPEN_EDITOR, (e)=>{
        const detail = e.detail;
        const entry =  story.entries.find((item)=>item.id===detail.id);
        if(entry){
            editor.showEditor(entry, $graphElement);
        }
    });

    const ui = new GraphUI($graphElement);
    if (story && story.entries) {
        ui.addEntries(story.entries);
    }
}


//DEBUG
window.restoreInitialStory = function () {
    const initialStory = {
        entries: [
            {id: "A", pos: {x: 30, y: 30}, data: {content: 'foo'}, children: ['B', 'C']},
            {id: "B", pos: {x: 100, y: 30}, data: {content: 'foo'}, children: []},
            {id: "C", pos: {x: 120, y: 100}, data: {content: 'foo'}, children: []},
        ]
    };
    Story.toLocalStorage(initialStory);
};


window.showEditor = () => {
    editor.active = true;
};

window.hideEditor = () => {
    editor.active = false;
};
