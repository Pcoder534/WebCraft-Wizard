document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.querySelector('._canvas');
    const addDivButton = document.getElementById('_adddiv');
    const delDivButton = document.getElementById('_deldiv');
    const getCodeButton = document.getElementById('_code');
    const codeDisplay = document.querySelector('._code');
    const propsContainer = document.querySelector('._props');
    let selectedElement = null;
    let elementCounter = 0;
    delDivButton.disabled = true;

    const props = {
        div: {
            top: "input",
            left: "input",
            width: "input",
            height: "input",
            borderRadius: "slider-input",
            backgroundColor: "color input",
            color: "color input"
        }
    };

    const elementsTree = {
        id: 'canvas',
        parent: null,
        children: []
    };

    const elementsList = [];

    function renderElements() {
        canvas.innerHTML = '';
        function renderNode(node, parentEl) {
            if (node.id !== 'canvas') {
                const element = document.createElement('div');
                element.id = node.id;
                element.classList.add('draggable');
                const style = elementsList.find(el => el.id === node.id).style;
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

        renderNode(elementsTree, canvas);
    }

    function addElement() {
        let parentId;
        if (selectedElement === null) parentId = "canvas";
        else parentId = selectedElement.id;
        const newId = `element-${elementCounter++}`;
        const newElement = {
            id: newId,
            parent: parentId,
            children: []
        };

        const newElementStyle = {
            id: newId,
            style: {
                position: 'absolute',
                width: '100px',
                height: '100px',
                backgroundColor: 'blue',
                top: '10px',
                left: '10px',
                borderRadius: '0px'
            }
        };

        const parentNode = findNode(elementsTree, parentId);
        parentNode.children.push(newElement);
        elementsList.push(newElementStyle);

        renderElements();
        selectElement(document.getElementById(newId));
    }

    function deleteElement(id) {
        deselectElement();
        removeNode(elementsTree, id);
        const index = elementsList.findIndex(el => el.id === id);
        if (index !== -1) elementsList.splice(index, 1);
        renderElements();
    }

    function getCode() {
        let html = '';
        let css = '';
        function processNode(node) {
            if (node.id !== 'canvas') {
                const style = elementsList.find(el => el.id === node.id).style;
                css += `#${node.id} {
                    position: absolute;
                    width: ${parseFloat(style.width) * 1.5}px;
                    height: ${parseFloat(style.height) * 1.5}px;
                    top: ${parseFloat(style.top) * 1.5}px;
                    left: ${parseFloat(style.left) * 1.5}px;
                    background-color: ${style.backgroundColor};
                    border-radius: ${parseFloat(style.borderRadius || '0px') * 1.5}px;
                }\n`;

                html += `<div id="${node.id}">\n`;
            }

            node.children.forEach(childNode => {
                processNode(childNode);
            });

            if (node.id !== 'canvas') {
                html += `</div>\n`;
            }
        }

        processNode(elementsTree);

        codeDisplay.innerText = `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>Document</title>\n\t<style>\n${css}\n\t</style>\n</head>\n<body>\n${html}\n</body>\n</html>`;
    }

    function selectElement(element) {
        if (selectedElement) {
            selectedElement.style.border = '1px solid #ccc';
        }
        selectedElement = element;
        selectedElement.style.border = '2px solid red';
        delDivButton.disabled = false;
        renderProps(element);
    }

    function deselectElement() {
        if (selectedElement === null) return;
        selectedElement.style.border = '1px solid #ccc';
        selectedElement = null;
        delDivButton.disabled = true;
        propsContainer.innerHTML = '<p>Properties</p>';
    }

    function renderProps(element) {
        propsContainer.innerHTML = '';
        const elementType = element.tagName.toLowerCase();
        const elementProps = props[elementType];

        Object.keys(elementProps).forEach(prop => {
            const inputType = elementProps[prop];
            const propLabel = document.createElement('label');
            propLabel.innerText = prop;
            propLabel.htmlFor = prop;

            let propInput;
            if (inputType === 'input') {
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
                const elementData = elementsList.find(el => el.id === selectedElement.id);
                if (prop === 'borderRadius') {
                    elementData.style[prop] = `${e.target.value}px`;
                    selectedElement.style[prop] = `${e.target.value}px`;
                } else {
                    elementData.style[prop] = e.target.value;
                    selectedElement.style[prop] = e.target.value;
                }
            });

            propsContainer.appendChild(propLabel);
            propsContainer.appendChild(propInput);
        });
    }

    function rgbToHex(rgb) {
        const result = rgb.match(/\d+/g).map((x) => parseInt(x).toString(16).padStart(2, '0')).join('');
        return `#${result}`;
    }

    canvas.addEventListener('click', (e) => {
        if (e.target === canvas) {
            if (selectedElement) {
                selectedElement.style.border = '1px solid #ccc';
                selectedElement = null;
                delDivButton.disabled = true;
                propsContainer.innerHTML = '';
            }
        }
    });

    function makeDraggableResizable(element) {
        let offsetX = 0, offsetY = 0;

        const resizer = document.createElement('div');
        resizer.className = 'resizer';
        element.appendChild(resizer);

        element.addEventListener('mousedown', dragMouseDown);
        resizer.addEventListener('mousedown', resizeMouseDown);

        element.addEventListener('click', (e) => {
            e.stopPropagation();
            if (selectedElement !== element) {
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
            const elementData = elementsList.find(el => el.id === element.id);
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
            renderProps(element);
        }

        function closeDragElement() {
            document.removeEventListener('mousemove', dragElement);
            document.removeEventListener('mouseup', closeDragElement);
        }

        function resizeMouseDown(e) {
            e.preventDefault();
            e.stopPropagation();
            document.addEventListener('mousemove', resizeElement);
            document.addEventListener('mouseup', closeResizeElement);
        }

        function resizeElement(e) {
            e.preventDefault();
            const elementData = elementsList.find(el => el.id === element.id);
            const parentRect = element.parentElement.getBoundingClientRect();

            let newWidth = e.clientX - element.getBoundingClientRect().left + 3;
            let newHeight = e.clientY - element.getBoundingClientRect().top + 3;

            const maxWidth = parentRect.right - element.getBoundingClientRect().left;
            const maxHeight = parentRect.bottom - element.getBoundingClientRect().top;

            if (newWidth > maxWidth) newWidth = maxWidth;
            if (newHeight > maxHeight) newHeight = maxHeight;

            elementData.style.width = `${newWidth}px`;
            elementData.style.height = `${newHeight}px`;
            element.style.width = newWidth + "px";
            element.style.height = newHeight + "px";
            renderProps(element);
        }

        function closeResizeElement() {
            document.removeEventListener('mousemove', resizeElement);
            document.removeEventListener('mouseup', closeResizeElement);
        }
    }

    function findNode(tree, id) {
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

    function removeNode(tree, id) {
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

    addDivButton.addEventListener('click', addElement);
    delDivButton.addEventListener('click', () => deleteElement(selectedElement.id));
    getCodeButton.addEventListener('click', getCode);

    renderElements();
});
