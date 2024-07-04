import { makeDraggableResizable, selectElement, deselectElement } from './elements.js';
import { rgbToHex } from './utils.js';


let elementCounter = 0;

export function renderElements() {
    const canvas = window.canvas;
    canvas.innerHTML = '';

    function renderNode(node, parentEl) {
        if (node.id !== 'canvas') {
            const element = document.createElement(node.type);
            element.id = node.id;
            element.className = 'draggable';
            const attr = window.elementsList.find(el => el.id === node.id).attr;
            Object.keys(attr).forEach(prop => {
                element.setAttribute(prop, attr[prop]);
            });
            element.style.position = 'absolute';
            const style = window.elementsList.find(el => el.id === node.id).style;
            Object.keys(style).forEach(prop => {
                element.style[prop] = style[prop];
            });

            parentEl.appendChild(element);
            makeDraggableResizable(element);
            parentEl = element;
        }

        node.children.forEach(childNode => {
            renderNode(childNode, parentEl);
        });
    }

    renderNode(window.elementsTree, canvas);
}

export function findNode(tree, id) {
    if (tree.id === id) {
        return tree;
    }
    for (let i = 0; i < tree.children.length; i++) {
        const result = findNode(tree.children[i], id);
        if (result) {
            return result;
        }
    }
    return null;
}

export function removeNode(tree, id) {
    for (let i = 0; i < tree.children.length; i++) {
        if (tree.children[i].id === id) {
            tree.children.splice(i, 1);
            return true;
        } else {
            const result = removeNode(tree.children[i], id);
            if (result) {
                return result;
            }
        }
    }
    return false;
}

export function addElement(type) {
    let parentId;
    if (!window.selectedElement) parentId = "canvas";
    else {
        if(window.selectedElement.tagName === 'IMG'){
            alert('cannot place an element inside an img!');
            return;
        }
        parentId = window.selectedElement.id;
    }
    const newId = `element-${elementCounter++}`;
    const newElement = {
        id: newId,
        type: type,
        parent: parentId,
        children: []
    };

    const newElementStyle = {
        id: newId,
        attr: {
            uid : newId
        },
        style: {}
    };
    const propAttr = window.props[type].attr;
    const propStyle = window.props[type].style;

    Object.keys(propAttr).forEach(prop => {
        if(propAttr[prop]!='text')newElementStyle.attr[prop] = window.defaults[propAttr[prop]];
    });
    Object.keys(propStyle).forEach(prop => {
        newElementStyle.style[prop] = window.defaults[propStyle[prop]];
    });

    const parentNode = findNode(window.elementsTree, parentId);
    parentNode.children.push(newElement);
    window.elementsList.push(newElementStyle);
    window.userIdMap.set(newId, newId);

    renderElements();
    selectElement(document.getElementById(newId));
}

export function deleteElement(id) {
    deselectElement();
    removeNode(window.elementsTree, id);
    const index = window.elementsList.findIndex(el => el.id === id);
    if (index !== -1) {
        window.userIdMap.delete(window.elementsList[index].uid);
        window.elementsList.splice(index, 1);
    }
    renderElements();
}

export function getCode() {
    let html = '';
    let css = '';
    function processNode(node) {
        if (node.id !== 'canvas') {
            const element = window.elementsList.find(el => el.id === node.id);
            const style = element.style;
            const attr = element.attr;
            css += `#${element.attr.uid} {\n\tposition: absolute;\n`;
            Object.keys(style).forEach(prop => {
                const value = style[prop];
                const inputType = window.props[node.type].style[prop];
                if(inputType === 'input')css+=`\t${prop}: ${parseFloat(value) * 1.5}px;\n`;
                else if(inputType === 'color input')css+=`\t${prop}: ${value};\n`;
                else css+=`\t${prop}: ${value};\n`;
            });
            css+='}\n';

            html += `<${node.type} id="${element.attr.uid}" `;
            Object.keys(attr).forEach(prop => {
                if(prop != 'uid')html+=`${prop}= '${attr[prop]}' `;
            });
            html+=`>\n`;
        }
        else {
            css += `body {\n\tbackground-color: ${window.getComputedStyle(window.canvas).backgroundColor};\n\tcolor: ${window.getComputedStyle(window.canvas).color};\n}\n`;

        }
        node.children.forEach(childNode => {
            processNode(childNode);
        });

        if (node.id !== 'canvas') {
            if(node.type != 'img')html += `</${node.type}>\n`;
        }
    }

    processNode(window.elementsTree);

    window.codeDisplay.innerText = `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>Document</title>\n\t<style>\n${css}\n\t</style>\n</head>\n<body>\n${html}\n</body>\n</html>`;
}

export function renderBodyProps() {
    const bodyProps = {
        backgroundColor: "color input",
        color: "color input"
    };
    const propsContainer = window.propsContainer;
    propsContainer.innerHTML='';

    Object.keys(bodyProps).forEach(prop => {
        const inputType = bodyProps[prop];
        const propLabel = document.createElement('label');
        propLabel.innerText = prop;
        propLabel.htmlFor = prop;

        let propInput;
        if (inputType === 'color input') {
            propInput = document.createElement('input');
            propInput.type = 'color';
            propInput.value = rgbToHex(window.getComputedStyle(document.body)[prop]);
        }

        propInput.id = prop;
        propInput.className = '_input';
        propInput.addEventListener('input', (e) => {
            window.canvas.style[prop] = e.target.value;
        });

        propsContainer.appendChild(propLabel);
        propsContainer.appendChild(propInput);
    });
}
