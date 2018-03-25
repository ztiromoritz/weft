//import Inliner from 'inliner';
import axios from "axios";

export default class Generator {
    static createGame({templateUrl, lmnStory, internalData,styleSettings}){
        const lmn = JSON.stringify(lmnStory);
        const storyScript = `<script> var CHATTER_DIALOG = ${lmn}</script>`;

        return axios.get(templateUrl)
            .then(function (response) {
                return response.data
                    .replace("<!-- $DIALOG_PLACE_HOLDER$ -->", storyScript)
                    .replace("$WEFT_INTERNAL_DATA$", JSON.stringify(internalData));
            });
    }


    static restoreGameFromHTML(html){
        const DATA_REGEX = / <!-- \$INTERNAL_DATA_START\$ (.*) \$INTERNAL_DATA_END\$ -->/g;
        const match = DATA_REGEX.exec(html);
        return JSON.parse(match[1]);

    }

    static toDataUrl(html){
        return "data:text/html;charset=utf-8,"+html;
    };
}