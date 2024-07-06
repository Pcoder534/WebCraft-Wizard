import { elementsList } from './constants.js';
import { makeDraggableResizable, selectElement, deselectElement } from './elements.js';
import { changeQueries, deepCopy, findKeyJustLessThan } from './mediaQueries.js';
import { rgbToHex, percentageToPixel, pixelToPercentage } from './utils.js';
let elementCounter = 0;

export function renderElements() {
    const canvas = window.canvas;
    canvas.innerHTML = '';

    function renderNode(node, parentEl) {
        if (node.id !== 'canvas') {
            const element = document.createElement(node.type);
            element.id = node.id;
            element.className = 'draggable';
            let elementData = window.elementsList.find(el => el.id === node.id);
            if(!elementData) {
                element.style.display ='none';
                elementData = {
                    id: node.id,
                    style: {
                        display : 'none'
                    }
                };
                elementsList.push(elementData);
                parentEl.appendChild(element);
            }
            const attr = node.attr;
            Object.keys(attr).forEach(prop => {
                element.setAttribute(prop, attr[prop]);
            });
            const style = elementData.style;
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
    //changeQueries();
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
        attr: {
            uid : newId
        },
        parent: parentId,
        children: []
    };
    const parentNode = findNode(window.elementsTree, parentId);
    parentNode.children.push(newElement);

    const newElementStyle = {
        id: newId,
        style: {}
    };

    const propAttr = window.props[type].attr;
    let propStyle = window.props[type].style;
    Object.keys(propAttr).forEach(prop => {
        if(propAttr[prop].default)newElement.attr[prop] = propAttr[prop].default;
    });
    if(parentId != 'canvas' && window.selectedElement.style.display === 'flex'){
        propStyle = window.props[type].flexChild;
    }
    else if(parentId != 'canvas' && window.selectedElement.style.display === 'grid'){
        propStyle = window.props[type].gridChild;
        newElementStyle.rowFixed = new Array(1).fill(false);
        newElementStyle.colFixed = new Array(1).fill(false);
    }
    Object.keys(propStyle).forEach(prop => {
        if(prop === 'showgrids')newElement.attr[prop] = propStyle[prop].default;
        if(propStyle[prop].default)newElementStyle.style[prop] = propStyle[prop].default;
    });

    window.elementsList.push(newElementStyle);
    window.userIdMap.set(newId, newId);

    renderElements();
    changeQueries();
    selectElement(document.getElementById(newId));
}

export function deleteElement(id) {
    if(!selectedElement)return;
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
    window.codeOuter.style.display = 'grid';
    makeResponsive();
    let elementIds = [];
    function processNode(node) {
        if (node.id !== 'canvas') {
            const attr = node.attr;
            elementIds.push([node.id,attr.uid]);
            html += `<${node.type} id="${attr.uid}" `;
            Object.keys(attr).forEach(prop => {
                if(prop != 'uid')html+=`${prop}= '${attr[prop]}' `;
            });
            html+=`>\n`;
        }
        node.children.forEach(childNode => {
            processNode(childNode);
        });

        if (node.id !== 'canvas') {
            if(node.type != 'img')html += `</${node.type}>\n`;
        }
    }
    processNode(window.elementsTree);
    //-----------------------------------------------------------------------
    css += `body {\n\tbackground-color : ${window.getComputedStyle(window.canvas).backgroundColor}\n}\n`;
    for (let key of window.mediaMap.keys()){
        if(key != 0){
            css += `@media screen and (min-width: ${key * 1.5}px){\n`;
        }
        let List = window.mediaQueries[mediaMap.get(key)];
        elementIds.forEach(id => {
            const element = List.find(el => el.id === id[0]);
            if(!element){
                css += `#${id[1]} {\n\tdisplay: none;\n}`;
            }
            const style = element.style;
            css += `#${id[1]} {\n`;
            const node = findNode(window.elementsTree,element.id);
            Object.keys(style).forEach(prop => {
                const value = style[prop];
                if(prop === 'left' || prop === 'width')css+=`\t${prop}: ${parseFloat(value)}%;\n`;
                else if(prop === 'grid-template-rows' || prop === 'grid-template-columns'){
                    let str = element.style[prop].split(/\s+/);
                    let newstr = '';
                    str.forEach(st =>{
                        if(st[st.length-1] === 'x'){
                            newstr += `${parseFloat(st.replace('px', ''))* 1.5}px `;
                        }
                        else newstr += `${st} `;
                    });
                    css+=`\t${prop}: ${newstr};\n`;
                }
                else if(prop === 'height' || prop === 'margin')css+=`\t${prop}: ${parseFloat(value.replace('px', '')) * 1.5}px;\n`;
                else css+=`\t${prop}: ${value};\n`;
            });
            css+='}\n';
        });
        if(key != 0)css+='}\n';
    }
//-----------------------------------------------------------------------
    percentageToPixel();
    window.codeDisplay.innerText = `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>Document</title>\n\t<style>\n${css}\n\t</style>\n</head>\n<body>\n${html}\n</body>\n</html>`;
}

export function copyCode(){
    const text = window.codeDisplay.innerText;

    navigator.clipboard.writeText(text).then(function() {
        showCopiedMessage();
    }).catch(function(error) {
        console.error('Could not copy text: ', error);
    });
}
function showCopiedMessage() {
    const copiedMessage = document.getElementById('copiedMessage');
    copiedMessage.style.display = 'block';
    copiedMessage.classList.remove('fade-out');
    
    setTimeout(function() {
        copiedMessage.classList.add('fade-out');
    }, 500);
    setTimeout(function() {
        copiedMessage.style.display = 'none';
    }, 1500);
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
            propInput.classList.add('_colorInput');
            propInput.value = rgbToHex(window.getComputedStyle(document.body)[prop]);
        }

        propInput.id = prop;
        propInput.classList.add('_input');
        propInput.addEventListener('input', (e) => {
            window.canvas.style[prop] = e.target.value;
        });
        let propDiv = document.createElement('div');
        propDiv.className = 'propDiv';
        propDiv.appendChild(propLabel);
        propDiv.appendChild(propInput);
        propsContainer.appendChild(propDiv);
    });
}
export function makeResponsive(){
    deselectElement();
    pixelToPercentage();
    renderElements();
}

export function makeCanvasResizable(){
    const workAreaRect = window.workArea.getBoundingClientRect();
    const canvasResizerColor = document.getElementById('canvas-resizer-green');
    window.canvasResizer.addEventListener('mousedown', resizeCanvasMouseDown);
    window.canvasResizer.addEventListener('mouseover',makeColorVisible);
    window.canvasResizer.addEventListener('mouseleave',makeColorInvisible);
    let mediaIndex; 
    function resizeCanvasMouseDown(e){
        e.preventDefault();
        e.stopPropagation();
        makeResponsive();
        mediaIndex = findKeyJustLessThan(window.mediaMap,window.canvas.getBoundingClientRect().width);
        document.addEventListener('mousemove', resizeCanvas);
        document.addEventListener('mouseup',stopResizeCanvas);
    }
    function resizeCanvas(e){
        e.stopPropagation();
        let diff = workAreaRect.right - 10 - e.clientX;
        if(diff < 0 )diff = 0;
        if(diff > ((workAreaRect.width - 10 -250)/2))diff = ((workAreaRect.width - 10 - 250)/2);
        window.canvas.style.left = `${diff}px`;
        let newWidth = (e.clientX - workAreaRect.left - diff);
        if(newWidth<250)newWidth = 250;
        let newLeft = (diff + newWidth);
        if(newLeft > workAreaRect.width - 8)newLeft = workAreaRect.width -8;
        if(newWidth > workAreaRect.width-10)newWidth = workAreaRect.width-10;
        window.canvas.style.width = `${newWidth}px`;
        window.canvasResizer.style.left = `${newLeft}px`;
        let newIndex = findKeyJustLessThan(window.mediaMap,window.canvas.getBoundingClientRect().width);
        if(newIndex != mediaIndex){
            window.elementsList = deepCopy(window.mediaQueries[window.mediaMap.get(newIndex)]);
            renderElements();
            makeResponsive();
            mediaIndex = newIndex;
        }
    }
    function stopResizeCanvas(){
        percentageToPixel();
        document.removeEventListener('mousemove', resizeCanvas);
        document.removeEventListener('mouseup', stopResizeCanvas);
    }
    function makeColorVisible(){
        canvasResizerColor.style.display = 'block';
    }
    function makeColorInvisible(){
        canvasResizerColor.style.display = 'none';
    }
}
export function removeProps(){
    const propsContainer = window.propsContainer;
    propsContainer.innerHTML = '';
}