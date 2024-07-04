document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.querySelector('._canvas');
    const addDivButton = document.getElementById('_adddiv');
    const delDivButton = document.getElementById('_deldiv');
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
            if (selectedElement === element) {
                deselectElement();
            } else {
                selectElement(element);
            }
        });

        function dragMouseDown(e) {
            if (isResizing) return;
            e.preventDefault();
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

            const canvasRect = canvas.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            if (newTop < canvasRect.top) newTop = canvasRect.top;
            if (newLeft < canvasRect.left) newLeft = canvasRect.left;
            if (newTop + elementRect.height > canvasRect.bottom) newTop = canvasRect.bottom - elementRect.height;
            if (newLeft + elementRect.width > canvasRect.right) newLeft = canvasRect.right - elementRect.width;

            element.style.top = newTop - canvasRect.top + "px";
            element.style.left = newLeft - canvasRect.left + "px";
        }

        function closeDragElement() {
            document.removeEventListener('mousemove', dragElement);
            document.removeEventListener('mouseup', closeDragElement);
            isDragging = false;
        }

        function resizeMouseDown(e) {
            isResizing = true;
            e.preventDefault();
            document.addEventListener('mousemove', resizeElement);
            document.addEventListener('mouseup', closeResizeElement);
        }

        function resizeElement(e) {
            e.preventDefault();
            const canvasRect = canvas.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            let newWidth = e.clientX - elementRect.left;
            let newHeight = e.clientY - elementRect.top;

            if (elementRect.left + newWidth > canvasRect.right) newWidth = canvasRect.right - elementRect.left;
            if (elementRect.top + newHeight > canvasRect.bottom) newHeight = canvasRect.bottom - elementRect.top;

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

        canvas.appendChild(newDiv);
        makeDraggableResizable(newDiv);
    });

    delDivButton.addEventListener('click', () => {
        if (selectedElement) {
            selectedElement.remove();
            selectedElement = null;
            delDivButton.disabled = true;
        }
    });

    function deselectElement() {
        if (selectedElement) {
            selectedElement.style.border = '1px solid #ccc';
            selectedElement = null;
            delDivButton.disabled = true;
        }
    }

    function selectElement(element) {
        deselectElement();
        selectedElement = element;
        selectedElement.style.border = '2px dashed red';
        delDivButton.disabled = false;
    }

    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('draggable') && !e.target.classList.contains('resizer')) {
            deselectElement();
        }
    });

    delDivButton.disabled = true;
});
