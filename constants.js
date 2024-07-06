export const elementsTree = {
    id: 'canvas',
    parent: null,
    children: []
};

export let elementsList = [];

export const mediaMap = new Map();

export const mediaQueries = [];

export const userIdMap = new Map();

export const props = {
    div: {
        attr: {
            uid: {type: "text"},
            class: {type: "text"}
        },
        style: {
            position:{default:'absolute'},
            display: {type: "radio",default:'block',options: ['block','flex','grid','none']},
            top: {type: "input",default: '10px'},
            left: {type: "input",default: '10px'},
            width: {type: "input",default: '100px'},
            height: {type: "input",default: '100px'},
            margin: {type: "input",default: '0px'},
            'padding-top': {type:"input"},
            'border-radius': {type: "slider-input",default: 10},
            'background-color': {type: "color input",default: 'blue'},
            color: {type:"color input",default: 'white'},
            visibility:{type:"radio",default:'visible',options: ['visible','hidden']}
        },
        flex: {
            'flex-direction': {type: "select",default:'row',options: ['row','column','row-reverse','column-reverse']},
            'justify-content': {type: "select",default:'flex-start',options: ['flex-start','flex-end','center','space-between','space-around']},
            'align-items': {type:"select",default:'flex-start',options:['flex-start','flex-end','center','baseline','stretch']},
            'flex-wrap' : {type:"select",default:'no-wrap',options:['wrap','nowrap','wrap-reverse']}
        },
        grid:{
            'showgrids': {type: "checkbox",default:'true'},
            rows :{type: "number",default:1},
            cols:{type: "number",default:1},
            'grid-template-rows' :{default:'auto'},
            'grid-template-columns': {default:'auto'},
        },
        flexChild :{
            display: {type: "radio",default:'flex',options: ['block','flex','grid','none']},
            order: {type:'number',default:0},
            margin: {type: "input",default: '0px'},
            'padding-top': {type:"input"},
            'flex-basis': {type: "input",default: '0px'},
            'flex-grow': {type: "number",default: 1},
            'flex-shrink': {type: "number",default: 1},
            'min-width': {type: "input",default:'0px'},
            'max-width': {type: "input",default:'100%'},
            'min-height': {type:"input",default:'0px'},
            'max-height': {type: "input",default:'100%'},
            'width': {type:"input",default:'100px'},
            'height': {type: "input",default:'100px'},
            'border-radius': {type: "slider-input",default: 10},
            'background-color': {type: "color input",default: 'green'},
            color: {type:"color input",default: 'white'},
            visibility:{type:"radio",default:'visible',options: ['visible','hidden']}
        },
        gridChild :{
            display: {type: "radio",default:'grid',options: ['block','flex','grid','none']},
            'grid-row-start': {type:"number", default:'1'},
            'grid-column-start':{type:"number", default:'1'},
            'grid-row-end':{type:"number", default:'2'},
            'grid-column-end':{type: "number", default:'2'},
            order: {type:'number',default:0},
            margin: {type: "input",default: '0px'},
            'padding-top': {type:"input"},
            'border-radius': {type: "slider-input",default: 10},
            'background-color': {type: "color input",default: 'red'},
            color: {type:"color input",default: 'white'},
            visibility:{type:"radio",default:'visible',options: ['visible','hidden']}
        }
    },
    img: {
        attr: {
            src: {type: "src",default: 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?t=st=1719642263~exp=1719645863~hmac=f2c7714583e79f6091ccce8df29d27dc1722c03029406b2a506e77d95620e62c&w=740'},
            alt: {type: "text"},
            uid: {type: "text"},
            class: {type: "text"}
        },
        style: {
            top: {type: "input",default: '10px'},
            left: {type: "input",default: '10px'},
            width: {type: "input",default: '100px'},
            height: {type: "input",default: '100px'},
            'border-radius': {type: "slider-input",default: 10},
            visibility:{type:"radio",default:'visible',options: ['visible','hidden']}
        },
        flexChild :{
            order: {type:'number',default:0},
            margin: {type: "input",default: '0px'},
            'flex-basis': {type: "input",default: '0px'},
            'flex-grow': {type: "number",default: 1},
            'flex-shrink': {type: "number",default: 1},
            'min-width': {type: "input",default:'0px'},
            'max-width': {type: "input",default:'100%'},
            'min-height': {type:"input",default:'0px'},
            'max-height': {type: "input",default:'100%'},
            'width': {type:"input",default:'100px'},
            'height': {type: "input",default:'100px'},
            'border-radius': {type: "slider-input",default: 10},
            visibility:{type:"radio",default:'visible',options: ['visible','hidden']}
        },
        gridChild :{
            'grid-row-start': {type:"number", default:'1'},
            'grid-column-start':{type:"number", default:'1'},
            'grid-row-end':{type:"number", default:'2'},
            'grid-column-end':{type: "number", default:'2'},
            order: {type:'number',default:0},
            margin: {type: "input",default: '0px'},
            'border-radius': {type: "slider-input",default: 10},
            visibility:{type:"radio",default:'visible',options: ['visible','hidden']}
        }
    },
    p: {
        attr: {
            uid: {type: "text"},
            class: {type: "text"}
        },
        style: {
            top: {type: "input",default: '10px'},
            left: {type: "input",default: '10px'},
            width: {type: "input",default: '100px'},
            height: {type: "input",default: '100px'},
            'border-radius': {type: "slider-input",default: 10},
            visibility:{type:"radio",default:'visible',options: ['visible','hidden']}
        }
    },
};