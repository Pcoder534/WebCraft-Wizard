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
            uid: "text",
            class: "text"
        },
        style: {
            top: "input",
            left: "input",
            width: "input",
            height: "input",
            'border-radius': "slider-input",
            'background-color': "color input",
            color: "color input"
        }
    },
    img: {
        attr: {
            src: "src",
            alt: "text",
            uid: "text",
            class: "text"
        },
        style: {
            top: "input",
            left: "input",
            width: "input",
            height: "input",
            'border-radius': "slider-input"
        }
    },
    p: {
        attr: {
            uid: "text",
            class: "text"
        },
        style: {
            top: "input",
            left: "input",
            width: "input",
            height: "input",
            'border-radius': "slider-input"
        }
    }
};
export const defaults={
    src : 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?t=st=1719642263~exp=1719645863~hmac=f2c7714583e79f6091ccce8df29d27dc1722c03029406b2a506e77d95620e62c&w=740',
    'input' : '100px',
    'slider-input' : 0,
    'color input' : 'blue'
};