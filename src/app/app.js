/*global TEMPLATE_URL*/
import './css/styles.css';
import '../common/css/chat.css';
import 'spectre.css';
import 'spectre.css/dist/spectre-icons.css';
import GraphUI from './js/graph/GraphUI.js';
import Story from './js/Story.js';
import editor from './js/editor/Editor.js';
import menu from './js/menu/Menu.js';
import confirmDialog from './js/menu/ConfirmDialog.js';
import DialogResult from './js/menu/DialogResult.js';
import settings from './js/settings/Settings.js';
import preview from './js/preview/Preview.js';
import upload from './js/import/Upload.js';
import Util from './js/Util.js';
import Generator from './js/Generator.js';
import {EventBus, Events} from './js/EventBus.js';

Story.fromStorage().then((story) => {


    const $graphElement = document.getElementById('graph');
    const $graphWrapper = document.getElementById('graph-wrapper');

    function getChildren(options) {
        options = options || [];
        return options.map(option => option.link);
    }

    console.log("TEMPLATE_URL", TEMPLATE_URL);
    const templateUrl = TEMPLATE_URL || "./template.html";


    const ui = new GraphUI($graphElement, $graphWrapper);

    EventBus.$on(Events.ENTRY_MOVED, (detail) => {
        story.entries.forEach((entry) => {
            if (entry.id === detail.id) {
                entry.pos.x = detail.x;
                entry.pos.y = detail.y;
            }
        });
        Story.toStorage(story);
    });


    EventBus.$on(Events.ENTRY_CHANGED, (detail) => {
        console.log("Detail", detail);
        let updatedEntry;
        let targetId = detail.id;

        //Avoid collision
        if (targetId !== detail.originalId) {
            targetId = Util.nonCollidingId(targetId, story);
        }


        story.entries.forEach((entry) => {
            // Update changed entry
            if (entry.id === detail.originalId) {
                updatedEntry = entry;
                entry.id = targetId;
                entry.data.content = detail.content;
                entry.children = getChildren(detail.options);
                ui.updateEntry(entry, detail.originalId);
            }

            // Update links to changed entry
            if (targetId !== detail.originalId) {
                entry.data.content = Util.replaceLink(entry.data.content, detail.originalId, targetId);
                entry.children = getChildren(Util.parseOptions(entry.data.content));
                ui.updateEntry(entry);
            }
        });

        // Create new possible Children
        if (updatedEntry) {
            updatedEntry.children.forEach((possible) => {
                const existing = story.entries.find(entry => entry.id === possible);
                if (!existing) {
                    const newEntry = {
                        id: possible,
                        pos: {
                            x: Number.parseFloat(updatedEntry.pos.x) + 100,
                            y: Number.parseFloat(updatedEntry.pos.y)
                        },
                        data: {content: ""},
                        children: []
                    };
                    story.entries.push(newEntry);
                    ui.updateEntry(newEntry);
                }
            });
        }


        ui.recalculateConnections();
        Story.toStorage(story);
    });

    EventBus.$on(Events.OPEN_EDITOR, (detail) => {
        const entry = story.entries.find((item) => item.id === detail.id);
        if (entry) {
            editor.showEditor(entry, story.settings.users || {});
        }
    });


    EventBus.$on(Events.ADD_NODE, () => {
        const pos = ui.getFreePosition();
        const id = Util.nonCollidingId('Unknown', story);
        const newEntry = {
            id,
            pos,
            data: {content: ""},
            children: []
        };
        story.entries.push(newEntry);
        ui.updateEntry(newEntry);
    });


    EventBus.$on(Events.DELETE_SELECTED, () => {
        const selected = ui.getSelectedIds();
        console.log("delete received", selected);
        const message = `Do you really want to delete ${selected.length} element(s)?`;
        confirmDialog.showDialog(message).then((result) => {
            if (result === DialogResult.OKAY) {
                selected.forEach((entryId) => {
                    ui.removeEntry(entryId);
                    story.entries = story.entries.filter(entry => entry.id !== entryId);
                    console.log(story.entries);
                });
                ui.recalculateConnections();
                Story.toStorage(story);
            }
        });
    });

    EventBus.$on(Events.PLAY, () => {
        Generator.createGame({
                templateUrl: templateUrl,
                lmnStory: Util.storyToLmn(story)
            }
        ).then(Generator.toDataUrl
        ).then((dataUrl) => {
            preview.showPreview(dataUrl);
        });
    });

    EventBus.$on(Events.EXPORT, () => {
        Generator.createGame({
            templateUrl: templateUrl,
            lmnStory: Util.storyToLmn(story),
            internalData: story
        })
            .then(Generator.toDataUrl)
            .then((dataUrl) => {

                const element = document.createElement('a');
                element.setAttribute('href', dataUrl);
                element.setAttribute('download', "game.html"); //TODO: story title here
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);

            });
        console.log(JSON.stringify(Util.storyToLmn(story), null, 2));
    });

    EventBus.$on(Events.SETTINGS, () => {
        settings.showSettings(story.settings || {}).then((settings) => {
            story.settings = settings;
            Story.toStorage(story);
        });
    });

    EventBus.$on(Events.UPLOAD, () => {
        upload.showUpload();
    });

    EventBus.$on(Events.IMPORT_HTML_STRING, (detail) => {
        const newStory = Generator.restoreGameFromHTML(detail.html);
        Story.toStorage(newStory).then(() => {
            document.location.reload(true);
        });
    });

    window.addEventListener('keyup', (e)=>{
        if(e.key === 'Escape'){
            EventBus.$emit(Events.ESC_PRESSED);
        }
    });

    if (story && story.entries) {
        ui.addEntries(story.entries);
    }

    //DEBUG
    window.restoreInitialStory = function () {
        const initialStory = {
            entries: [
                {id: "A", pos: {x: 30, y: 30}, data: {content: '<<MO "Hello">> [[B]] [[C]]'}, children: ['B', 'C']},
                {id: "B", pos: {x: 200, y: 20}, data: {content: 'foo '}, children: []},
                {id: "C", pos: {x: 120, y: 200}, data: {content: 'foo'}, children: []},
            ]
        };
        Story.toStorage(initialStory);
        //ui.addEntries(initialStory.entries);
    };

    window.debugRestore = function (story) {
        Story.toStorage(story);
    };


    window.showEditor = () => {
        editor.active = true;
    };

    window.hideEditor = () => {
        editor.active = false;
    };

    window.clearConnections = () => {
        ui.clearConnections();
    };

});



