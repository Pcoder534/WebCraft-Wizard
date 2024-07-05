
import { renderElements, addElement, deleteElement, getCode, renderBodyProps, makeCanvasResizable} from './canvas.js';
import { deselectElement, focusDefocus, selectElement } from './elements.js';
import { userIdMap, elementsTree, elementsList, props, mediaQueries, mediaMap} from './constants.js';
import { deepCopy, saveQuery } from './mediaQueries.js';


window.addEventListener('DOMContentLoaded', (event) => {
    window.canvas = document.querySelector('._canvas');
    window.propsContainer = document.querySelector('._props');
    window.codeDisplay = document.getElementById('_codeOutput');
    window.selectedElement = null;
    window.resizer = document.getElementById('_resizer');
    window.canvasResizer = document.getElementById('canvas-resizer');
    window.workArea = document.getElementById('work-area');
    window.userIdMap = userIdMap;
    window.elementsTree = elementsTree;
    window.elementsList = elementsList;
    window.props = props;
    window.mediaQueries = mediaQueries;
    window.mediaMap = mediaMap;
    window.isFocused = false;
    
    window.mediaQueries.push(deepCopy(elementsList));
    window.mediaMap.set(0,0);

    const addDivButton = document.getElementById('_adddiv');
    const delDivButton = document.getElementById('_deldiv');
    const getCodeButton = document.getElementById('_code');
    ///const addImgButton = document.getElementById('_addimg');
    const focusButton = document.getElementById('_focus');
    //const addPButton = document.getElementById('_addp');
    const selectParentButton = document.getElementById('_selparent');
    const saveQueryButton = document.getElementById('_savequery');
    delDivButton.disabled = true;
    window.delDivButton = delDivButton;
    window.focusButton = focusButton;
    addDivButton.addEventListener('click', addDiv);
    //addImgButton.addEventListener('click', addImg);
    focusButton.addEventListener('click',focusDefocus);
    //addPButton.addEventListener('click', addP);
    delDivButton.addEventListener('click', () => {
        if (window.selectedElement) {
            deleteElement(window.selectedElement.id);
        }
    });
    saveQueryButton.addEventListener('click', saveQuery);
    getCodeButton.addEventListener('click', getCode);
    selectParentButton.addEventListener('click',selectParent);
    function addDiv(){addElement('div');}
    //function addImg(){addElement('img');}
    //function addP(){addElement('p');}
    function selectParent(){
        if(window.selectedElement){
            if(window.selectedElement.parentElement!=window.canvas){
                selectElement(window.selectedElement.parentElement);
            }
            else deselectElement();
        }
    }
    
    renderElements();
    renderBodyProps();
    makeCanvasResizable();
    
    window.canvas.addEventListener('click', (e) => {
        if (e.target === window.canvas) {
            deselectElement();
        }
    });
});
