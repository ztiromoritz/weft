const MIME_TYPES = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png'
};


const FILE_REGEX = /^.*\/(.*)\.(.*)$/g;

export default class FileTools {

    static createDataUrl(filename, content) {
        const mime = FileTools.getMimeType(filename);

    }

    static getFilename(filename){
        FILE_REGEX.exec(filename);
        return match[1];
    }

    static getExtension(filename) {
        FILE_REGEX.exec(filename);
        return match[2];
    }

    static getMimeType(filename){
        const extension = FileTools.getExtension(filename);
        return MIME_TYPES[extension];
    }
}