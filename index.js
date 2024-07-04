document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.querySelector('._canvas');
    const addDivButton = document.getElementById('_adddiv');
    const delDivButton = document.getElementById('_deldiv');
    const getCodeButton = document.getElementById('_code');
    const codeDisplay = document.querySelector('._code');
    const colorInput = document.getElementById('_color');
    const roundnessInput = document.getElementById('_roundness');
    let selectedElement = null;
    let isDragging = false;
    let isResizing = false;

    function makeDraggableResizable(element) {
        let offsetX = 0, offsetY = 0, initialX = 0, initialY = 0;

        const resizer = document.createElement('div');
        resizer.className = 'resizer';
        element.appendChild(resizer);

        element.addEventListener('mousedown', dragMouseDown);
        resizer.addEventListener('mousedown', resizeMouseDown);

        element.addEventListener('click', (e) => {
            if (isDragging || isResizing) return;
            e.stopPropagation();
            if (selectedElement !== element) {
                selectElement(element);
            }
        });

        function dragMouseDown(e) {
            if (isResizing) return;
            e.preventDefault();
            e.stopPropagation();
            initialX = e.clientX;
            initialY = e.clientY;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            isDragging = true;
            document.addEventListener('mousemove', dragElement);
            document.addEventListener('mouseup', closeDragElement);
        }

        function dragElement(e) {
            e.preventDefault();
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            const parentRect = element.parentElement.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            if (newTop < parentRect.top) newTop = parentRect.top;
            if (newLeft < parentRect.left) newLeft = parentRect.left;
            if (newTop + elementRect.height > parentRect.bottom) newTop = parentRect.bottom - elementRect.height;
            if (newLeft + elementRect.width > parentRect.right) newLeft = parentRect.right - elementRect.width;

            element.style.top = newTop - parentRect.top + "px";
            element.style.left = newLeft - parentRect.left + "px";
        }

        function closeDragElement() {
            document.removeEventListener('mousemove', dragElement);
            document.removeEventListener('mouseup', closeDragElement);
            isDragging = false;
        }

        function resizeMouseDown(e) {
            isResizing = true;
            e.preventDefault();
            e.stopPropagation();
            document.addEventListener('mousemove', resizeElement);
            document.addEventListener('mouseup', closeResizeElement);
        }

        function resizeElement(e) {
            e.preventDefault();
            const parentRect = element.parentElement.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            let newWidth = e.clientX - elementRect.left;
            let newHeight = e.clientY - elementRect.top;

            if (elementRect.left + newWidth > parentRect.right) newWidth = parentRect.right - elementRect.left;
            if (elementRect.top + newHeight > parentRect.bottom) newHeight = parentRect.bottom - elementRect.top;

            element.style.width = newWidth + "px";
            element.style.height = newHeight + "px";
        }

        function closeResizeElement() {
            document.removeEventListener('mousemove', resizeElement);
            document.removeEventListener('mouseup', closeResizeElement);
            isResizing = false;
        }
    }

    addDivButton.addEventListener('click', () => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('draggable');
        newDiv.style.position = 'absolute';
        newDiv.style.width = '100px';
        newDiv.style.height = '100px';
        newDiv.style.backgroundColor = 'blue';
        newDiv.style.top = '10px';
        newDiv.style.left = '10px';

        if (selectedElement) {
            selectedElement.appendChild(newDiv);
        } else {
            canvas.appendChild(newDiv);
        }

        selectElement(newDiv);
        makeDraggableResizable(newDiv);
    });

    delDivButton.addEventListener('click', () => {
        if (selectedElement) {
            selectedElement.remove();
            selectedElement = null;
            delDivButton.disabled = true;
        }
    });

    getCodeButton.addEventListener('click', () => {
        let html = '';
        let css = '';
        const elements = Array.from(canvas.children);
        let index = 0;
        function processElement(el) {
            const rect = el.getBoundingClientRect();
            css += `.draggable-${index} {
                position: absolute;
                width: ${rect.width * 1.5}px;
                height: ${rect.height * 1.5}px;
                top: ${(rect.top - canvas.getBoundingClientRect().top) * 1.5}px;
                left: ${(rect.left - canvas.getBoundingClientRect().left) * 1.5}px;
                background-color: ${el.style.backgroundColor};
                border-radius: ${el.style.borderRadius || '0px'};
            }\n`;
            html+=`<div class="draggable-${index}">\n`;
            index++;
            Array.from(el.children).forEach(child => {
                if(!child.classList.contains("resizer")){
                    processElement(child);
                }
            });
            html+= `</div>\n`;
        }

        elements.forEach(el => {
                if(!el.classList.contains("resizer"))processElement(el);
        });
        codeDisplay.innerText = `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>Document</title>\n\t<style>\n${css}\n\t</style>\n</head>\n<body>\n${html}\n</body>\n</html>`;
    });

    function selectElement(element) {
        if (selectedElement) {
            selectedElement.style.border = '1px solid #ccc';
        }
        selectedElement = element;
        selectedElement.style.border = '2px solid red';
        delDivButton.disabled = false;
        colorInput.value = rgbToHex(window.getComputedStyle(element).backgroundColor);
        roundnessInput.value = parseInt(window.getComputedStyle(element).borderRadius) || 0;
    }

    function rgbToHex(rgb) {
        const result = rgb.match(/\d+/g).map((x) => parseInt(x).toString(16).padStart(2, '0')).join('');
        return `#${result}`;
    }

    colorInput.addEventListener('input', (e) => {
        if (selectedElement) {
            selectedElement.style.backgroundColor = e.target.value;
        }
    });

    roundnessInput.addEventListener('input', (e) => {
        if (selectedElement) {
            selectedElement.style.borderRadius = `${e.target.value}px`;
        }
    });

    canvas.addEventListener('click', (e) => {
        if (e.target === canvas) {
            if (selectedElement) {
                selectedElement.style.border = '1px solid #ccc';
                selectedElement = null;
                delDivButton.disabled = true;
            }
        }
    });
});
