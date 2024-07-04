export function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g).map(num => {
        const hex = parseInt(num).toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    });
    return `#${result.join('')}`;
}
export function pixelToPercentage(){
    function changeStyle(node, parentEl) {
        let element = document.getElementById(node.id);
        if(node.id === 'canvas') element = window.canvas;
        node.children.forEach(childNode => {
            changeStyle(childNode, element);
        });
        if (node.id !== 'canvas') {
            const style = window.elementsList.find(el => el.id === node.id).style;
            const parentRect = parentEl.getBoundingClientRect();
            style.left = `${(parseFloat(style.left)/parseFloat(parentRect.width))*100}%`;
            style.width =  `${(parseFloat(style.width)/parseFloat(parentRect.width))*100}%`;
        }
    }
    changeStyle(window.elementsTree,window.canvas);
}
export function percentageToPixel(){
    function changeStyle(node, parentEl) {
        let element = document.getElementById(node.id);
        if(node.id === 'canvas') element = window.canvas;
        node.children.forEach(childNode => {
            changeStyle(childNode, element);
        });
        if (node.id !== 'canvas') {
            const style = window.elementsList.find(el => el.id === node.id).style;
            const parentRect = parentEl.getBoundingClientRect();
            style.left = `${(parseFloat(style.left)/100)*parseFloat(parentRect.width)}px`;
            style.width =  `${(parseFloat(style.width)/100)*parseFloat(parentRect.width)}px`;
        }
    }
    changeStyle(window.elementsTree,window.canvas);
}