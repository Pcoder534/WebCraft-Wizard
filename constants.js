export const elementsTree = {
    id: 'canvas',
    parent: null,
    children: []
};

export const elementsList = [];

export const userIdMap = new Map();

export const props = {
    div: {
        attr: {
            uid: {type: "text"},
            class: {type: "text"}
        },
        style: {
            position:{default:'absolute'},
            display: {type: "radio",default:'block',options: ['block','flex']},
            top: {type: "input",default: '10px'},
            left: {type: "input",default: '10px'},
            width: {type: "input",default: '100px'},
            height: {type: "input",default: '100px'},
            margin: {type: "input",default: '0px'},
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
        flexParent :{
            display: {type: "radio",default:'flex',options: ['block','flex']},
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
            'background-color': {type: "color input",default: 'blue'},
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
        flexParent :{
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
    // flex :{
    //     attr: {
    //         uid: {type: "text"},
    //         class: {type: "text"}
    //     },
    //     style: {
    //         // height: {type: "input", default: '100%'},
    //         // width: {type: "input", deafult: '100%'},
            // 'flex-direction': {type: "select",default:'row',options: ['row','column']},
            // 'justify-content': {type: "select",default:'flex-start',options: ['flex-start','flex-end','center','space-between','space-around']}
    //     }
    // }
    
};
// export const defaults={
//     src : 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?t=st=1719642263~exp=1719645863~hmac=f2c7714583e79f6091ccce8df29d27dc1722c03029406b2a506e77d95620e62c&w=740',
//     'input' : '100px',
//     'slider-input' : 0,
//     'color input' : 'blue'
//     //checkbox : false
// };