const flatten = arr => arr.reduce((acc, val) => acc.concat(val), []);


const randomId = () => {
    return Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
};


function commandTokens(str = "") {
    const COMMAND_TOKEN_REGEX = /<<[^<>]*>>/g;
    return str.match(COMMAND_TOKEN_REGEX) || [];
}

//syntactic sugar
function messageShortform(str=""){
    const MESSAGE = /<<([^:\s]*) (.*)>>/;
    const result = str.match(MESSAGE);
    if(!result)
        return str; //keep it like it is
    return `<<:msg "${result[1]}" ${result[2]}>>`;
}

function parseCommand(str="") {
    str = messageShortform(str);
    const COMMAND = /<<:([^\s]*) (.*)>>/;
    const SPLIT_ARGS = /"[^"]*"/g
    const result = str.match(COMMAND);

    if(!result)
        return null;
    const name = result[1];
    const args = result[2]
        .trim()
        .match(SPLIT_ARGS)
        .map(arg=>arg.slice(1, -1));


    return {
        name,
        args
    };
}

function handleInvalid(str) {
    return (!!str);
}


/**
 *  Transforms the story representation used in the weft-UI
 *  to a "program" which can be run by the lmn state machine,
 *  which is included in the template.
 */
export default class Transformer {
    /**
     *  Parse commands like:
     *   <<:foo "arg1" "arg2" "arg3">>
     *
     *  Shortform:
     *    <<me "Hello!">>
     *  ... will be transformed to
     *    <<:message "me" "Hello!">>
     */
    static parseCommandsOld(str) {
        const MESSAGE_REGEX = /<<([^\s]*) "([^"]*)">>/g;
        const messages = [];
        let match;
        while ((match = MESSAGE_REGEX.exec(str)) != null) {
            messages.push({
                user: match[1].toLowerCase() === 'me' ? "me" : match[1],
                content: match[2],
                original: match[0]
            });
        }
        return messages;
    }


    static parseCommands(str) {
        const commandsToken = commandTokens(str);
        return commandsToken
            .map(parseCommand)
            //.filter(handleInvalid);
    }


    /**
     *
     */
    static parseOptions(str) {
        //matching [link] and [title|link]
        const OPTION_REGEX = /\[\[([^|\]]*)\|?((?:[^\]]*))\]\]/g;
        const options = [];
        let match;
        while ((match = OPTION_REGEX.exec(str)) != null) {
            options.push({
                content: match[1],
                link: (match[2].length > 0) ? match[2] : match[1],
                original: match[0]
            });
        }
        return options;
    }

    /**
     * TODO: example
     */
    static replaceLink(str, from, to) {
        return str.replace(/\[\[([^|\]]*)\|?((?:[^\]]*))\]\]/g, (match, g1, g2) => {
            let link = (g2.length > 0) ? g2 : g1;
            if (link === from) {
                link = to;
            }
            if (g2.length > 0) {
                return `[[${g1}|${link}]]`;
            } else {
                return `[[${link}]]`;
            }
        });
    }

    static storyToTwee(story) {
        console.log("Story", story);
        return story.entries.map(_ => `::${_.id}\n${_.data.content}\n`).join("\n");
    }



    static storyToLmn(story) {
        const lmnDialog = story.entries.map(_ => {
            return {
                id: _.id,
                messages: Transformer.parseCommands(_.data.content),
                options: Transformer.parseOptions(_.data.content),
            }
        }).map(_ => {

            // Create LMN Steps
            let result = [];
            result = result.concat(_.messages.map( m => [m]));
            if (_.options.length > 0) {
                const EMPTY_MESSAGE = {
                    // this will be ignored in interpreter
                    name: 'msg',
                    args: ['','']
                };
                result.push([EMPTY_MESSAGE, _.options.map(o => [o.content, o.link])]);
            }

            if (result.length === 0) {
                result.push([{
                    name: 'msg',
                    args: ['no message found', 'no message found']
                }]);
            }

            // Prepend labels
            const endsWithMessages = (_.options.length === 0);
            const first = 0;
            const last = result.length - 1;
            if (result.length > 0) {
                result[first].unshift(_.id);
                if (first !== last && endsWithMessages) {
                    result[last].unshift(randomId());
                }
                result[last].push('???') // <-- stop fall trough.
            }
            return result;
        }).reduce((acc, val) => acc.concat(val), []); //flatten 1-level

        return {
            data: story.settings,
            dialog: lmnDialog
        };

    }

}
