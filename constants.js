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
            //display: {type: "radio",options: ['block','flex']},
            top: {type: "input",default: '10px'},
            left: {type: "input",default: '10px'},
            width: {type: "input",default: '100px'},
            height: {type: "input",default: '100px'},
            'border-radius': {type: "slider-input",default: 10},
            'background-color': {type: "color input",default: 'blue'},
            color: {type:"color input",default: 'white'}
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
            'border-radius': {type: "slider-input",default: 10}
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
            'border-radius': {type: "slider-input",default: 10}
        }
    }
};
// export const defaults={
//     src : 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?t=st=1719642263~exp=1719645863~hmac=f2c7714583e79f6091ccce8df29d27dc1722c03029406b2a506e77d95620e62c&w=740',
//     'input' : '100px',
//     'slider-input' : 0,
//     'color input' : 'blue'
//     //checkbox : false
// };