import chatter from './chatter.js';
import lmn from '../lib/lmn.js';


const Type = lmn.Step.Type;
const dialogStore = new lmn.DialogStore();

export const run = () => {
    if (typeof CHATTER_DIALOG !== 'undefined') {

        dialogStore.addDialog("default", CHATTER_DIALOG);
        var dialog = dialogStore.startDialog("default");

        var wait = function (timeout) {
            return new Promise(function (resolve) {
                setTimeout(resolve, timeout);
            });
        };

        var nextStep = function (index) {
            var step = dialog.next(index);
            switch (step.getType()) {
                case Type.MESSAGE:
                    var command = step.getContent(); // TODO: step.getCommand()
                    // TODO: assert that every command is :msg for now
                    if (command.name != 'msg')
                        throw new Error("Command not supported", command.name)
                    var msg = {
                        user: command.args[0],
                        content: command.args[1],
                        typing: 1500
                    };
                    chatter.addMessage(msg, CHATTER_DIALOG.data.users)
                        .then(wait(1500))
                        .then(nextStep);
                    break;
                case Type.QUESTION:
                    chatter.showOptions(step.getAvailableOptions())
                        .then(nextStep);
                    break;
                case Type.END:
                case Type.UNFINISHED_DIALOG:
                default:
            }
        };
        try {
            dialog.selectStepByLabel('Start');
            nextStep();
        } catch (e) {
            chatter.showErrorMessage(e.message);
            //error Message
            console.error(e);
        }
    }
};