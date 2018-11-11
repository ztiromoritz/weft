export const removeClass = function (el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
};

export const addClass = function (el, className) {
    if (el.classList){
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
};