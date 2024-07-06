import { renderProps, selectElement } from "./elements.js";
import { changeQueries } from "./mediaQueries.js";

export function changedRows(element){
    let countRow = window.getComputedStyle(element)['grid-template-rows'].split(' ').length;
    const elementData = window.elementsList.find(el => el.id === element.id);
    elementData.rowFixed = new Array(countRow).fill(false);
    showGrids(element);
}
export function changedCols(element){
    let countCol = window.getComputedStyle(element)['grid-template-columns'].split(' ').length;
    const elementData = window.elementsList.find(el => el.id === element.id);
    elementData.colFixed = new Array(countCol).fill(false);
    showGrids(element);
}
export function showGrids(element){
    if(element.style.display != 'grid'){alert('not a grid');return;}
    removeGrids(element);
    let strRow = window.getComputedStyle(element)['grid-template-rows'];
    let strCol = window.getComputedStyle(element)['grid-template-columns'];
    let countRow = count(strRow);
    let countCol = count(strCol);
    let c=1;
    for(let i=0;i<countRow;i++){
        for(let j=0;j<countCol;j++){
            const box = document.createElement('div');
            box.className = 'gridBox';
            box.style.gridColumnStart = j + 1;
            box.style.gridRowStart = i + 1;
            box.setAttribute('row',i+1);
            box.setAttribute('col',j+1);
            box.innerText = c++;
            element.appendChild(box);
        }
    }
    renderPointers(element);
}
export function renderPointers(element){
    if(element.style.display != 'grid'){alert('not a grid');return;}
    removePointers(element);
    const elementData = window.elementsList.find(el => el.id === element.id);
    let strRow = window.getComputedStyle(element)['grid-template-rows'].split(' ');
    let strCol = window.getComputedStyle(element)['grid-template-columns'].split(' ');
    let rowPointers = strRow.map(str => parseFloat(str.replace('px', '')));
    let colPointers = strCol.map(str => parseFloat(str.replace('px', '')));
    for(let i=1;i<rowPointers.length;i++)rowPointers[i] += rowPointers[i-1];
    for(let i=1;i<colPointers.length;i++)colPointers[i] += colPointers[i-1];
    
    let index = 0,prev=0;
    rowPointers.forEach(pointer => {
        if(index != rowPointers.length-1){
            const movable = document.createElement('div');
            movable.className = 'gridMove';
            movable.classList.add('gridMoveRow');
            movable.style.left = '-5px';
            movable.style.top = `${pointer-5}px`;
            movable.setAttribute('index',index);
            movable.addEventListener('mousedown',(e) => {
                e.preventDefault();
                e.stopPropagation();
                document.addEventListener('mousemove',resizeGrid);
                document.addEventListener('mouseup',stopResizeGrid);
            });
            function resizeGrid(e) {
                const elementRect = element.getBoundingClientRect();
                let newTop = e.clientY - elementRect.top;
                const ind = parseInt(movable.getAttribute('index'), 10);
                let minTop = (ind > 0)? rowPointers[ind - 1]:0;
                let maxTop = ind < rowPointers.length - 1 ? rowPointers[ind + 1] : elementRect.height;
                if (newTop < minTop) newTop = minTop;
                if (newTop > maxTop) newTop = maxTop;
                rowPointers[ind] = newTop;
                renderPointers(element);
                renderRowTemplates(rowPointers,element,elementData);
                changeQueries();
            }

            function stopResizeGrid(e){
                document.removeEventListener('mousemove',resizeGrid);
                document.removeEventListener('mouseup',stopResizeGrid);
            }
            element.appendChild(movable);
        }
        const fixedCheckBox = document.createElement('input');
        fixedCheckBox.type = 'checkbox';
        fixedCheckBox.className = 'gridCheckbox';
        fixedCheckBox.style.left = '-10px';
        fixedCheckBox.style.top = `${(pointer + prev)/2 - 5}px`;
        fixedCheckBox.setAttribute('index',index);
        if(elementData.rowFixed[index] === true)fixedCheckBox.checked = true;
        fixedCheckBox.addEventListener('click',(e)=>{
            const ind = fixedCheckBox.getAttribute('index');
            elementData.rowFixed[ind] = !elementData.rowFixed[ind];
            renderRowTemplates(rowPointers,element,elementData);
            changeQueries();
        });
        fixedCheckBox.addEventListener('mouseover',(e)=>{
            let fixedCheckBoxRect = fixedCheckBox.getBoundingClientRect();
            window.message.style.left = `${fixedCheckBoxRect.right}px`;
            window.message.style.top  = `${fixedCheckBoxRect.top-30}px`;
            window.message.style.display = 'block';
        });
        fixedCheckBox.addEventListener('mouseleave',(e)=>{
            window.message.style.display = 'none';
        });
        element.appendChild(fixedCheckBox);
        index++;prev = pointer;
    });

    index = 0;prev=0;
    colPointers.forEach(pointer => {
        if(index != colPointers.length-1){
            const movable = document.createElement('div');
            movable.className = 'gridMove';
            movable.classList.add('gridMoveCol');
            movable.style.top = '-5px';
            movable.style.left = `${pointer-5}px`;
            movable.setAttribute('index',index);
            movable.addEventListener('mousedown',(e) => {
                e.preventDefault();
                e.stopPropagation();
                document.addEventListener('mousemove',resizeGrid);
                document.addEventListener('mouseup',stopResizeGrid);
            });

            function resizeGrid(e) {
                const elementRect = element.getBoundingClientRect();
                let newLeft = e.clientX - elementRect.left;
                const ind = parseInt(movable.getAttribute('index'), 10);
                let minLeft = (ind > 0)?colPointers[ind - 1]:0;
                let maxLeft = ind < colPointers.length - 1 ? colPointers[ind + 1] : elementRect.width;
                if (newLeft < minLeft) newLeft = minLeft;
                if (newLeft > maxLeft) newLeft = maxLeft;
                colPointers[ind] = newLeft;
                renderPointers(element);
                renderColTemplates(colPointers,element,elementData);
                changeQueries();
            }

            function stopResizeGrid(e){
                document.removeEventListener('mousemove',resizeGrid);
                document.removeEventListener('mouseup',stopResizeGrid);
            }
            element.appendChild(movable);
        }
        const fixedCheckBox = document.createElement('input');
        fixedCheckBox.type = 'checkbox';
        fixedCheckBox.className = 'gridCheckbox';
        fixedCheckBox.style.top = '-10px';
        fixedCheckBox.style.left = `${(pointer + prev)/2 - 5}px`;
        fixedCheckBox.setAttribute('index',index);
        
        if(elementData.colFixed[index] === true)fixedCheckBox.checked = true;

        fixedCheckBox.addEventListener('click',(e)=>{
            const ind = fixedCheckBox.getAttribute('index');
            elementData.colFixed[ind] = !elementData.colFixed[ind];
            renderColTemplates(colPointers,element,elementData);
            changeQueries();
        });
        fixedCheckBox.addEventListener('mouseover',(e)=>{
            let fixedCheckBoxRect = fixedCheckBox.getBoundingClientRect();
            window.message.style.left = `${fixedCheckBoxRect.right}px`;
            window.message.style.top  = `${fixedCheckBoxRect.top-30}px`;
            window.message.style.display = 'block';
        });
        fixedCheckBox.addEventListener('mouseleave',(e)=>{
            window.message.style.display = 'none';
        });
        
        element.appendChild(fixedCheckBox);
        index++;prev = pointer;
    });
}

function renderRowTemplates(rowPointers,element,elementData){
    let total = 0;
    for(let i=0;i<rowPointers.length;i++){
        if(!elementData.rowFixed[i]){
            if(i>0)total += rowPointers[i]-rowPointers[i-1];
            else total += rowPointers[i];
        }
    }
    let str = "";
    for(let i=rowPointers.length-1;i>=0;i--){
        if(elementData.rowFixed[i]){
            if(i>0)str = `${rowPointers[i]-rowPointers[i-1]}px `+str;
            else str = `${rowPointers[i]}px `+str;
        }
        else {
            if(i>0)str = `${(rowPointers[i]-rowPointers[i-1])/total}fr `+str;
            else str = `${(rowPointers[i])/total}fr `+str;
        }
    }
    element.style['grid-template-rows'] = str;
    elementData.style['grid-template-rows'] = str;
}

function renderColTemplates(colPointers,element,elementData){
    let total = 0;
    for(let i=0;i<colPointers.length;i++){
        if(!elementData.colFixed[i]){
            if(i>0)total += colPointers[i]-colPointers[i-1];
            else total += colPointers[i];
        }
    }
    let str = "";
    for(let i=colPointers.length-1;i>=0;i--){
        if(elementData.colFixed[i]){
            if(i>0)str = `${colPointers[i]-colPointers[i-1]}px `+str;
            else str = `${colPointers[i]}px `+str;
        }
        else {
            if(i>0)str = `${(colPointers[i]-colPointers[i-1])/total}fr `+str;
            else str = `${(colPointers[i])/total}fr `+str;
        }
    }
    element.style['grid-template-columns'] = str;
    elementData.style['grid-template-columns'] = str;
}

export function removeGrids(element){
    element.querySelectorAll('.gridBox').forEach(box => {
        element.removeChild(box);
    });
    removePointers(element);
}

function removePointers(element){
    element.querySelectorAll('.gridMove').forEach(box => {
        element.removeChild(box);
    });
    element.querySelectorAll('.gridCheckbox').forEach(box => {
        element.removeChild(box);
    });
}

export function count(str){
    return str.split(' ').length;
}
function binarySearch(arr, value) {
    let low = 0;
    let high = arr.length - 1;
    let result = -1;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if(arr[mid] < value) {
            result = mid;
            low = mid + 1;
        } 
        else high = mid - 1;
    }
    return result + 2;
}
export function makeDraggableInGrid(element){
    const parentEl = element.parentElement;
    let strRow,strCol,rowPointers,colPointers,spanX,spanY,parentRect;
    element.addEventListener('click',(e)=>{
        e.stopPropagation();
        if (window.selectedElement !== element) {
            selectElement(element);
        }
    });
    element.addEventListener('mousedown',(e) =>{
        e.preventDefault();
        e.stopPropagation();
        parentRect = parentEl.getBoundingClientRect();
        strRow = window.getComputedStyle(parentEl)['grid-template-rows'].split(' ');
        strCol = window.getComputedStyle(parentEl)['grid-template-columns'].split(' ');
        rowPointers = strRow.map(str => parseFloat(str.replace('px', '')));
        colPointers = strCol.map(str => parseFloat(str.replace('px', '')));
        let elementStyle = window.getComputedStyle(element);
        spanX = elementStyle['grid-column-end'] - elementStyle['grid-column-start'];
        spanY = elementStyle['grid-row-end'] - elementStyle['grid-row-start'];
        for(let i=1;i<rowPointers.length;i++)rowPointers[i] += rowPointers[i-1];
        for(let i=1;i<colPointers.length;i++)colPointers[i] += colPointers[i-1];
        document.addEventListener('mousemove',moveInGrid);
        document.addEventListener('mouseup', stopMove);
    });
    function moveInGrid(e){
        e.preventDefault();
        e.stopPropagation();
        const elementData = window.elementsList.find(el => el.id === element.id);
        let newRowStart = binarySearch(rowPointers, e.clientY - parentRect.top) ;
        if(newRowStart + spanY > rowPointers.length + 1)newRowStart = rowPointers.length + 1 - spanY;
        element.style['grid-row-start'] = newRowStart;
        elementData.style['grid-row-start'] = newRowStart;
        element.style['grid-row-end'] = newRowStart + spanY;
        elementData.style['grid-row-end'] = newRowStart + spanY;

        let newColStart = binarySearch(colPointers, e.clientX - parentRect.left) ;
        if(newColStart + spanX>colPointers.length+1)newColStart = colPointers.length + 1 - spanX;
        element.style['grid-column-start'] = newColStart;
        elementData.style['grid-column-start'] = newColStart;
        element.style['grid-column-end'] = newColStart + spanX;
        elementData.style['grid-column-end'] = newColStart + spanX;
        window.resizer.style.left = `${element.getBoundingClientRect().right - 13}px`;
        window.resizer.style.top = `${element.getBoundingClientRect().bottom - 13}px`;
        changeQueries();
        renderProps(element);
    }
    function stopMove(e){
        document.removeEventListener('mousemove',moveInGrid);
        document.removeEventListener('mouseup', stopMove);
    }
}
export function makeResizableInGrid(element){
    const parentEl = element.parentElement;
    let strRow,strCol,rowPointers,colPointers,spanX,spanY,parentRect;
    window.resizer.addEventListener('mousedown',resizeInGridDown);
    function resizeInGridDown(e){
        if(window.selectedElement!=element||parentEl.style.display != 'grid')return;
        e.preventDefault();
        e.stopPropagation();
        parentRect = parentEl.getBoundingClientRect();
        strRow = window.getComputedStyle(parentEl)['grid-template-rows'].split(' ');
        strCol = window.getComputedStyle(parentEl)['grid-template-columns'].split(' ');
        rowPointers = strRow.map(str => parseFloat(str.replace('px', '')));
        colPointers = strCol.map(str => parseFloat(str.replace('px', '')));
        let elementStyle = window.getComputedStyle(element);
        spanX = elementStyle['grid-column-end'] - elementStyle['grid-column-start'];
        spanY = elementStyle['grid-row-end'] - elementStyle['grid-row-start'];
        for(let i=1;i<rowPointers.length;i++)rowPointers[i] += rowPointers[i-1];
        for(let i=1;i<colPointers.length;i++)colPointers[i] += colPointers[i-1];
        document.addEventListener('mousemove',resizeInGrid);
        document.addEventListener('mouseup', stopResize);
    }
    function resizeInGrid(e){
        e.preventDefault();
        e.stopPropagation();
        const elementData = window.elementsList.find(el => el.id === element.id);
        let newRowStart = binarySearch(rowPointers, e.clientY - parentRect.top) ;
        if(newRowStart > rowPointers.length)newRowStart = rowPointers.length;
        element.style['grid-row-end'] = newRowStart + 1;
        elementData.style['grid-row-end'] = newRowStart + 1;

        let newColStart = binarySearch(colPointers, e.clientX - parentRect.left) ;
        if(newColStart>colPointers.length)newColStart = colPointers.length;
        element.style['grid-column-end'] = newColStart + 1;
        elementData.style['grid-column-end'] = newColStart + 1;

        window.resizer.style.left = `${element.getBoundingClientRect().right - 13}px`;
        window.resizer.style.top = `${element.getBoundingClientRect().bottom - 13}px`;
        changeQueries();
        renderProps(element);
    }
    function stopResize(e){
        document.removeEventListener('mousemove',resizeInGrid);
        document.removeEventListener('mouseup', stopResize);
    }
}