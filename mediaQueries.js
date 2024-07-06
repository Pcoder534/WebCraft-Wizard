import { mediaMap } from "./constants.js";
import { percentageToPixel, pixelToPercentage } from "./utils.js";

let mediaCount = 1;
export function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        let copy = [];
        for (let i = 0; i < obj.length; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }
    let copy = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepCopy(obj[key]);
        }
    }
    return copy;
}
function sortMapByKey(map) {
    let mapArray = Array.from(map);
    mapArray.sort((a, b) => a[0] - b[0]);
    return new Map(mapArray);
}
function changeKey(map, oldKey, newKey) {
    if (map.has(oldKey)) {
        if(map.has(newKey)){return false;}
        const value = map.get(oldKey); 
        map.delete(oldKey);
        map.set(newKey, value); 
        return true;
    }
    return false;
}
function removeKey(map,key){
    if(map.has(key)){
        map.delete(key);
    }
}

export function saveQuery(){
    pixelToPercentage();
    const canvasRect = window.canvas.getBoundingClientRect();
    window.mediaMap.set(Math.floor(canvasRect.width),mediaCount++);
    window.mediaMap = sortMapByKey(window.mediaMap);
    window.mediaQueries.push(deepCopy(window.elementsList));
    let mediaPointer = document.createElement('div');
    mediaPointer.className = 'mediaPointer';
    mediaPointer.setAttribute('key',Math.floor(canvasRect.width));
    mediaPointer.style.left = window.canvasResizer.style.left;
    const mediaMessage = document.createElement('div');
    mediaMessage.className = 'message';
    const mediaRemove = document.createElement('div')
    mediaRemove.className = 'removeButton';
    mediaRemove.innerText = 'x';
    
    mediaRemove.style.display = 'none';
    mediaMessage.style.display = 'none';

    mediaRemove.addEventListener('click',(e)=>{
        e.preventDefault();
        e.stopPropagation();
        removeKey(window.mediaMap,parseInt(mediaPointer.getAttribute('key')));
        window.workArea.removeChild(mediaPointer);
        console.log(window.mediaMap);
    });
    mediaPointer.addEventListener('mousedown',(e)=>{
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener('mousemove',moveMediaPointer);
        document.addEventListener('mouseup',stopMediaPointer);
    });
    function moveMediaPointer(e){
        e.stopPropagation();
        let newLeft = e.clientX - 15;
        if(newLeft > 1130)newLeft = 1130;
        if(newLeft < 1130/2+250/2)newLeft = 1130/2+250/2;
        let key = mediaPointer.getAttribute('key');
        if(changeKey(window.mediaMap,parseInt(key),Math.floor(newLeft*2-1130))){
            mediaPointer.setAttribute('key',Math.floor(newLeft*2-1130));
            mediaPointer.style.left=`${Math.floor(newLeft)}px`;
            window.mediaMap = sortMapByKey(window.mediaMap);
        }
    }
    function stopMediaPointer(e){
        document.removeEventListener('mousemove',moveMediaPointer);
        document.removeEventListener('mouseup',stopMediaPointer);
    }
    mediaPointer.addEventListener('mouseover',showMessage);
    mediaPointer.addEventListener('mouseleave',hideMessage);
    function showMessage(){
        mediaMessage.innerText = `min-width\n(${mediaPointer.getAttribute('key')}px)`;
        mediaMessage.style.display = 'block';
        mediaRemove.style.display = 'block';
    }
    function hideMessage(){
        mediaRemove.style.display = 'none';
        mediaMessage.style.display = 'none';
    }
    mediaPointer.appendChild(mediaRemove);
    mediaPointer.appendChild(mediaMessage);
    window.workArea.appendChild(mediaPointer);
    percentageToPixel();
}
export function changeQueries(){
    pixelToPercentage();
    let key = findKeyJustLessThan(window.mediaMap,window.canvas.getBoundingClientRect().width);
    window.mediaQueries[window.mediaMap.get(key)] = deepCopy(window.elementsList);
    percentageToPixel();
}
export function findKeyJustLessThan(map, value) {
    let mapArray = Array.from(map);
    mapArray.sort((a, b) => a[0] - b[0]);
    let closestKey = null;
    let closestDifference = Infinity;
    for (let i = 0; i < mapArray.length; i++) {
        let key = mapArray[i][0];
        if (key < value && (value - key) < closestDifference) {
            closestKey = key;
            closestDifference = value - key;
        }
    }
    return closestKey;
}