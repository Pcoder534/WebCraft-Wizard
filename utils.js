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
        if(parentEl.style.display === 'flex')return;
        node.children.forEach(childNode => {
            changeStyle(childNode, element);
        });
        if (node.id !== 'canvas'&& parentEl.style.display!='flex') {
            const style = window.elementsList.find(el => el.id === node.id).style;
            const parentRect = parentEl.getBoundingClientRect();

            if(style.left&&style.left.charAt(style.left.length-1)!='%')style.left = `${(parseFloat(style.left)/parseFloat(parentRect.width))*100}%`;
            if(style.width&&style.width.charAt(style.width.length-1)!='%')style.width =  `${(parseFloat(style.width)/parseFloat(parentRect.width))*100}%`;
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
            if(style.left&&style.left.charAt(style.left.length-1)==='%')style.left = `${(parseFloat(style.left)/100)*parseFloat(parentRect.width)}px`;
            if(style.width&&style.width.charAt(style.width.length-1)==='%')style.width =  `${(parseFloat(style.width)/100)*parseFloat(parentRect.width)}px`;
        }
    }
    changeStyle(window.elementsTree,window.canvas);
}