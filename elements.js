import { rgbToHex } from './utils.js';

export function selectElement(element) {
    if (window.selectedElement) {
        window.selectedElement.style.border = '1px solid #ccc';
    }
    window.selectedElement = element;
    window.selectedElement.style.border = '2px dashed red';
    window.delDivButton.disabled = false;
    renderProps(element); 
    window.resizer.style.display = 'block';
    const rect = element.getBoundingClientRect();
    const parentRect = element.parentElement.getBoundingClientRect();
    window.resizer.style.left = `${rect.right - 13}px`;
    window.resizer.style.top = `${rect.bottom - 13}px`;
    window.resizer.addEventListener('mousedown',resizeMouseDown);
}

export function deselectElement() {
    if (window.selectedElement === null) return;
    window.selectedElement.style.border = '1px solid #ccc';
    window.selectedElement = null;
    window.delDivButton.disabled = true;
    window.propsContainer.innerHTML = '<p>Properties</p>';
    window.resizer.style.display = 'none';
}

export function makeDraggableResizable(element) {
    let offsetX = 0, offsetY = 0;

    element.addEventListener('mousedown', dragMouseDown);

    element.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.selectedElement !== element) {
            selectElement(element);
        }
    });

    function dragMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        document.addEventListener('mousemove', dragElement);
        document.addEventListener('mouseup', closeDragElement);
    }

    function dragElement(e) {
        e.preventDefault();
        const elementData = window.elementsList.find(el => el.id === element.id);
        const parentRect = element.parentElement.getBoundingClientRect();

        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        const elementRect = element.getBoundingClientRect();
        if (newTop < parentRect.top) newTop = parentRect.top;
        if (newLeft < parentRect.left) newLeft = parentRect.left;
        if (newTop + elementRect.height > parentRect.bottom) newTop = parentRect.bottom - elementRect.height;
        if (newLeft + elementRect.width > parentRect.right) newLeft = parentRect.right - elementRect.width;

        elementData.style.left = `${newLeft - parentRect.left}px`;
        elementData.style.top = `${newTop - parentRect.top}px`;
        element.style.top = newTop - parentRect.top + "px";
        element.style.left = newLeft - parentRect.left + "px";

        window.resizer.style.left = `${ newLeft + elementRect.width - 13}px`;
        window.resizer.style.top = `${ newTop + elementRect.height - 13}px`;

        renderProps(element);
    }

    function closeDragElement() {
        document.removeEventListener('mousemove', dragElement);
        document.removeEventListener('mouseup', closeDragElement);
    }
}
function resizeMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    document.addEventListener('mousemove', resizeElement);
    document.addEventListener('mouseup', closeResizeElement);
}

function resizeElement(e) {
    e.preventDefault();
    const elementData = window.elementsList.find(el => el.id === window.selectedElement.id);
    const parentRect = window.selectedElement.parentElement.getBoundingClientRect();
    const elementRect = window.selectedElement.getBoundingClientRect();

    let newWidth = e.clientX - elementRect.left + 3;
    let newHeight = e.clientY - elementRect.top + 3;

    const maxWidth = parentRect.right - elementRect.left;
    const maxHeight = parentRect.bottom - elementRect.top;

    if (newWidth > maxWidth) newWidth = maxWidth;
    if (newHeight > maxHeight) newHeight = maxHeight;

    elementData.style.width = `${newWidth}px`;
    elementData.style.height = `${newHeight}px`;
    window.selectedElement.style.width = newWidth + "px";
    window.selectedElement.style.height = newHeight + "px";

    window.resizer.style.left = `${elementRect.left + newWidth  - 13}px`;
    window.resizer.style.top = `${elementRect.top + newHeight - 13}px`;

    renderProps(window.selectedElement);
}

function closeResizeElement() {
    document.removeEventListener('mousemove', resizeElement);
    document.removeEventListener('mouseup', closeResizeElement);
}
export function renderProps(element) {
    const propsContainer = window.propsContainer;
    propsContainer.innerHTML = '';
    const elementType = element.tagName.toLowerCase();
    const props = window.props;
    const elementAttr = props[elementType].attr;
    const elementStyle = props[elementType].style;
    const elementProps=null;

    Object.keys(elementAttr).forEach(prop => {
        const inputType = elementAttr[prop];
        const propLabel = document.createElement('label');
        propLabel.innerText = prop;
        propLabel.htmlFor = prop;
        
        let propInput;
        propInput = document.createElement('input');
        propInput.type = 'text';
        propInput.value = element.getAttribute(prop);

        propInput.id = prop;
        propInput.className = '_input';
        propInput.addEventListener('input', (e) => {
            const elementData = window.elementsList.find(el => el.id === window.selectedElement.id);
            if (prop === 'uid') {
                if (window.userIdMap.has(e.target.value)) {
                    alert('This ID is already in use. Please choose a different one.');
                    propInput.value = elementData.attr[prop];
                    return;
                }
                window.userIdMap.delete(elementData.attr[prop]);
                window.userIdMap.set(e.target.value, elementData.id);
            }
            elementData.attr[prop] = e.target.value;
            window.selectedElement.setAttribute(prop,e.target.value);
        });
        
        propsContainer.appendChild(propLabel);
        propsContainer.appendChild(propInput);
    });

    Object.keys(elementStyle).forEach(prop => {
        const inputType = elementStyle[prop];
        const propLabel = document.createElement('label');
        propLabel.innerText = prop;
        propLabel.htmlFor = prop;

        let propInput;
        if (inputType === 'input' || inputType === 'text') {
            propInput = document.createElement('input');
            propInput.type = 'text';
            propInput.value = window.getComputedStyle(element)[prop];
        } else if (inputType === 'slider-input') {
            propInput = document.createElement('input');
            propInput.type = 'range';
            propInput.value = parseInt(window.getComputedStyle(element)[prop]) || 0;
        } else if (inputType === 'color input') {
            propInput = document.createElement('input');
            propInput.type = 'color';
            propInput.value = rgbToHex(window.getComputedStyle(element)[prop]);
        }

        propInput.id = prop;
        propInput.className = '_input';
        propInput.addEventListener('input', (e) => {
            const elementData = window.elementsList.find(el => el.id === window.selectedElement.id);
            //elementData[prop] = e.target.value;
            if(inputType === 'slider-input') {
                elementData.style[prop] = `${e.target.value}px`;
                window.selectedElement.style[prop] = `${e.target.value}px`;
            } else {
                elementData.style[prop] = e.target.value;
                window.selectedElement.style[prop] = e.target.value;
            }
            
        });

        propsContainer.appendChild(propLabel);
        propsContainer.appendChild(propInput);
    });
}