
import { renderElements, addElement, deleteElement, getCode, renderBodyProps} from './canvas.js';
import { deselectElement } from './elements.js';
import { userIdMap, elementsTree, elementsList, props, defaults} from './constants.js';


window.addEventListener('DOMContentLoaded', (event) => {
    window.canvas = document.querySelector('._canvas');
    window.propsContainer = document.querySelector('._props');
    window.codeDisplay = document.querySelector('._code');
    window.selectedElement = null;
    window.resizer = document.getElementById('_resizer');
    window.userIdMap = userIdMap;
    window.elementsTree = elementsTree;
    window.elementsList = elementsList;
    window.props = props;
    window.defaults = defaults;


    const addDivButton = document.getElementById('_adddiv');
    const delDivButton = document.getElementById('_deldiv');
    const getCodeButton = document.getElementById('_code');
    const addImgButton = document.getElementById('_addimg');
    const addPButton = document.getElementById('_addp');
    delDivButton.disabled = true;
    window.delDivButton = delDivButton;

    addDivButton.addEventListener('click', addDiv);
    addImgButton.addEventListener('click', addImg);
    addPButton.addEventListener('click', addP);
    delDivButton.addEventListener('click', () => {
        if (window.selectedElement) {
            deleteElement(window.selectedElement.id);
        }
    });
    getCodeButton.addEventListener('click', getCode);
    function addDiv(){addElement('div');}
    function addImg(){addElement('img');}
    function addP(){addElement('p');}
    
    renderElements();
    renderBodyProps();

    window.canvas.addEventListener('click', (e) => {
        if (e.target === window.canvas) {
            deselectElement();
            renderBodyProps();
        }
    });
});
