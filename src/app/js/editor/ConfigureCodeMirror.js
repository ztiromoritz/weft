import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/theme/base16-dark.css';
import '../../css/editor-style.css';
import 'codemirror/addon/mode/simple';
import 'codemirror/addon/hint/show-hint';
import CodeMirror from 'codemirror';

CodeMirror.defineSimpleMode("weft",{
    start: [
        {regex: /<</, token: "command-start", next: "commandStart"},
        {regex: /\[\[/, token: "option-start", next: "option"}
    ],
    commandStart: [
        {regex: /:[^\s]+\s+/, token: "commandName", next: "commandArgs"},
        {regex: /\w+\s+/, token: "userName", next: "commandArgs"}
    ],
    commandArgs: [
        {regex: /"[^\"]*"\s*/, token: "string"},
        {regex: />>/, token: "command-end", next: "start"}
    ],
    option : [
        {regex: /[^\]]*/, token: "option", next: "optionEnd"}
    ],
    optionEnd : [
        {regex: /\]\]\s*/, token: "option-end", next: "start"}
    ]
})