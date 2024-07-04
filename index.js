document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.querySelector('._canvas');
    const addDivButton = document.getElementById('_adddiv');

    function makeDraggable(element) {
        let offsetX = 0, offsetY = 0, initialX = 0, initialY = 0;

        element.addEventListener('mousedown', dragMouseDown);

        function dragMouseDown(e) {
            e.preventDefault();
            initialX = e.clientX;
            initialY = e.clientY;
            document.addEventListener('mousemove', dragElement);
            document.addEventListener('mouseup', closeDragElement);
        }

        function dragElement(e) {
            e.preventDefault();
            offsetX = initialX - e.clientX;
            offsetY = initialY - e.clientY;
            initialX = e.clientX;
            initialY = e.clientY;

            // Calculate the new position
            let newTop = element.offsetTop - offsetY;
            let newLeft = element.offsetLeft - offsetX;

            // Get the boundaries of the canvas
            const canvasRect = canvas.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            if (newTop < 0) newTop = 0;
            if (newLeft < 0) newLeft = 0;
            if (newTop + elementRect.height > canvasRect.height) newTop = canvasRect.height - elementRect.height;
            if (newLeft + elementRect.width > canvasRect.width) newLeft = canvasRect.width - elementRect.width;

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        }

        function closeDragElement() {
            document.removeEventListener('mousemove', dragElement);
            document.removeEventListener('mouseup', closeDragElement);
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
        makeDraggable(newDiv);
    });
});
