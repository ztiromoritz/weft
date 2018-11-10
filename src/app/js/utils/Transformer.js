const flatten = arr => arr.reduce((acc, val) => acc.concat(val), []);


const randomId = () => {
    return Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
};


/**
 *  Transforms the story representation used in the weft-UI
 *  to a "program" which can be run by the lmn state machine,
 *  which is included in the template.
 */
export default class Transformer {
    /**
     *  Parse commands like:
     *    <<:foo "arg1" "arg2" "arg3">>
     *
     *  Shortform:
     *    <<me "Hello!">>
     *  ... will be transformed to
     *    <<:message "me" "Hello!">>
     */
    static parseCommands(str) {
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
                messages: Util.parseCommands(_.data.content),
                options: Util.parseOptions(_.data.content),
            }
        }).map(_ => {
            let result = [];
            result = result.concat(_.messages.map((m) => {
                return [m.original];
            }));
            if (_.options.length > 0) {
                const EMPTY_MESSAGE = '';
                result.push([EMPTY_MESSAGE, _.options.map(o => [o.content, o.link])]);
            }

            if (result.length === 0) {
                result.push(['<<Message "NO MESSAGE FOUND">>']);
            }
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
