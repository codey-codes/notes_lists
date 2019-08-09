const noteContainer = document.querySelector('.take-note');
const noteBox = document.querySelector('.note-itself');
const noteText = document.querySelector('.note-text');
const listBox = document.querySelector('.list-itself');
const listText = document.querySelector('.list-text');
const listTextItems = document.querySelectorAll('.list-text');
const noteTitle = document.querySelector('.note-title');
const title = [], note = [], list= {};
let notesCounter = 0, storedNoteColor = '#fff', listToggle = false, noteToggle = false, itemNumber = 1;

function putTheBoxesBack() {        // this function brings back the note-taking box to its default state
    noteContainer.style.transform = 'scale(0)';
    listBox.style.display = 'none';
    noteBox.style.display = 'none';
    let listItems = document.querySelector('.list');     // to remove the <input> elements from the list box
    for (let i = 1; i < itemNumber; i++) listItems.removeChild(document.querySelector('.item-' + i));
    noteTitle.value = '';
    noteText.value = '';
    listText.value = '';

    storedNoteColor = '#fff';
    noteContainer.style.height = '0';
    noteTitle.style.backgroundColor = storedNoteColor;
    noteText.style.backgroundColor = storedNoteColor;
    listBox.style.backgroundColor = storedNoteColor;
    listText.style.backgroundColor = storedNoteColor;
    document.querySelector('.color-white').style.border = '.25px solid #000';
    for (let i = 0; i <= 4; i++) document.querySelectorAll('.color-container div:not(.color-white)')[i].style.border = '.25px solid transparent';
    document.getElementById('color-palette-checkbox').checked = false;

    document.querySelector('.note-pin').checked = false;
    itemNumber = 1;
    listToggle = false;
    noteToggle = false;
};

function changeCol(color) {     // as the name hints, we are changing the color of the note-taking box. The same color will be used when the note is saved
    let selectedColor = document.querySelector('.color-' + color);      // to separate the selected color from others, we will create a solid border around the selected one
    let otherColors = document.querySelectorAll('.color-container div:not(.color-' + color + ')');  // and a transparent border around others

    selectedColor.style.border = '.25px solid #000';
    for (let i = 0; i <= 4; i++) otherColors[i].style.border = '.25px solid transparent';

    const getColor = new Map([  // color codes used
        ['white', '#fff'],
        ['turquoise', '#62ffef'],
        ['red', '#ffa1a1'],
        ['yellow', '#e7e776'],
        ['green', '#88ff88'],
        ['blue', '#b0b0ff'],
    ]);
    storedNoteColor = getColor.get(color);

    // mow changing the colors of the boxes
    [noteTitle, noteText, listBox, listText].forEach(e => { e.style.backgroundColor = storedNoteColor; });
    for (let i = 0; i < itemNumber; i++) document.querySelector('.list-text-' + i).style.backgroundColor = storedNoteColor;

    document.getElementById('color-palette-checkbox').checked = false;  // resetting the color palette box
};

function itemDone(note, item, noteText) {       // this fucntion will move the list items to the 'Finished Items' section
    document.querySelector('.list-' + note + '-heading').style.display = 'block';
    document.querySelector(`.list-${note} .stored-item-${item}`).style.display = 'none';    // removing the item from the list
    let doneMarkup = `<div class="done-item-${item}"">
                            <i class="checked-box-icon far fa-check-square"></i>
                            <div class="list-item-text-done d-item-${item}-text">${noteText}</div>
                        </div>`;
    document.querySelector('.list-' + note).insertAdjacentHTML('beforeend', doneMarkup);
};

const formatList = () => {      // this function will properly give names and item numbers to the lists
    let listLength = list['list-' + notesCounter].length, listMarkup = '';
    for (let i = 0; i < listLength; i++) {
        if (list['list-' + notesCounter][i] !== '') {   // if we have an empty key, we will not add it to the markup so that we do not have an empty item in the list
            listMarkup += `<div class="stored-item-${i}">
                            <i class="unchecked-box-icon far fa-square" onclick="itemDone(${notesCounter}, ${i}, '${list['list-' + notesCounter][i]}')"></i>
                            <div class="list-item-text-not-done nd-item-text-${i}">${list['list-' + notesCounter][i]}</div>
                        </div>`;
        }
    };

    let markup = `<div class="stored-list-middle list-${notesCounter}">
                    ${listMarkup}
                    <p class="stored-list-finished-heading list-${notesCounter}-heading"><i class="down-icon fas fa-chevron-down"></i> Checked items:</p>
                </div>`;
    return markup;
};

const addListItems = () => {    // here we will store the list in the 'list' object. Each key woould contain an array that would be the list items
    list['list-' + notesCounter] = [];
    for (let i = 0; i < itemNumber; i++) {
        list['list-' + notesCounter][i] = document.querySelector(`.list-text-${i}`).value;
    }
};

function delNote(noteNumber) {
    let child = document.querySelector('.stored-note-' + noteNumber);
    child.style.transform = 'scale(0)';

    setTimeout(() => {      // this function will bring back the 'stored notes' boxes back to their original height. Setting time out so that the 'scale' transition is visible. This function is run right about when the 'scale' transition is finished
        child.parentNode.removeChild(child);
        let otherContainerChildren = document.querySelectorAll('.container-other > div');
        let pinnedContainerChildren = document.querySelectorAll('.container-pinned > div');

        if (pinnedContainerChildren.length === 0) {
            document.querySelector('.pinned-subheading').style.display = 'block';
            document.querySelector('.container-pinned').style.height = 'auto';
        }
        if (otherContainerChildren.length === 0) {
            document.querySelector('.other-subheading').style.display = 'block';
            document.querySelector('.container-other').style.height = 'auto';
        }
        if (pinnedContainerChildren.length === 0 && otherContainerChildren.length === 0) {
            document.querySelector('.display-style-icon-container').style.display = 'none';
        } else document.querySelector('.display-style-icon-container').style.display = 'block';
    }, 275);
};

const storeTheNote = (addToPinned, type) => {   // here we will store the note in the 'Pinned Notes' box or the 'Other Notes' box
    let markup, markupNote = '', markupList = '', divWidth = '95%';     // markups are the HTMLs that would be added to the divs
    let t = new Date(), date, month, hour, minute, period = 'AM';       // for time and date to be shown on the note

    if (document.getElementById('display-style-check').checked && window.innerWidth > 360) divWidth = 'auto';  // if grid view is on

    date = t.getDate();
    minute = t.getMinutes();
    hour = t.getHours();
    const convertMonth = new Map([
        [0, 'Jan'],
        [1, 'Feb'],
        [2, 'Mar'],
        [3, 'Apr'],
        [4, 'May'],
        [5, 'Jun'],
        [6, 'Jul'],
        [7, 'Aug'],
        [8, 'Sep'],
        [9, 'Oct'],
        [10, 'Nov'],
        [11, 'Dec']
    ]);
    month = convertMonth.get(t.getMonth());
    if (date < 10) date = '0' + date;
    if (minute < 10) minute = '0' + minute;
    if (hour > 12) {
        hour -= 12;
        period = 'PM';
    }
    if (hour < 10) hour = '0' + hour;

    let markupTitle = `<div class="stored-note-${notesCounter}" style="background-color: ${storedNoteColor}; width: ${divWidth}">
    <p class="stored-note-title title-${notesCounter}">${title[notesCounter]}</p>`;
    if (type === 'note') {
        markupNote = `<p class="stored-note-text note-${notesCounter}">${note[notesCounter]}</p>`
    }
    if (type === 'list') {
        markupList = formatList();
    }
    let markupBottom = `<div class="stored-note-bottom">
                            <span class="time">Saved: ${date}-${month} at ${hour}:${minute} ${period}</span>
                            <div onclick="delNote(${notesCounter})" class="stored-note-delete del-note-${notesCounter}"><i class="delete-icon fas fa-trash-alt"></i></div>
                        </div>`;
    markup = markupTitle + markupNote + markupList + markupBottom;

    if (addToPinned) {
        document.querySelector('.pinned-subheading').style.display = 'none';
        document.querySelector('.container-pinned').insertAdjacentHTML('beforeend', markup);
    } else {
        document.querySelector('.other-subheading').style.display = 'none';
        document.querySelector('.container-other').insertAdjacentHTML('beforeend', markup);
    }

    notesCounter++;

    if (window.innerWidth > 360) {  // stored notes display style not available to devices with smaller widths
        document.querySelector('.display-style-icon-container').style.display = 'block';
    }
};

function saveTheNote() {    // just to save the note/list text to the arrays and object
    let addToPinned = document.querySelector('.note-pin').checked;
    if (noteTitle.value) title.push(noteTitle.value);
    else title.push('');

    if (noteBox.style.display === 'block') {
        if (noteText.value) {
            note[notesCounter] = noteText.value;
            storeTheNote(addToPinned, 'note');
        }
    } else {
        if (listText.value) {
            addListItems();
            storeTheNote(addToPinned, 'list');
        }
    }
    putTheBoxesBack();
};

function letsBegin(type) {  // where the note taking process begins
    noteContainer.style.transform = 'scale(1.0)';
    noteContainer.style.height = 'auto';
    if (type === 'note') {
        if (!noteToggle) {      // noteToggle and listToggle are used to display/hide the respective note-taking boxes
            noteBox.style.display = 'block';
            listBox.style.display = 'none';
            noteToggle = true;
        } else putTheBoxesBack();
    }
    if (type === 'list') {
        if (!listToggle) {
            noteBox.style.display = 'none';
            listBox.style.display = 'block';
            listToggle = true;
        } else putTheBoxesBack();
    }
};

listText.onkeydown = e => {    // if enter key is pressed, we add more <input> for items
    if (e.keyCode === 13 ) {
        let markup = `<div class="item-${itemNumber}">
                            <i class="add-icon fas fa-plus"></i>
                            <input type="text" class="list-text list-text-${itemNumber}" placeholder="Next item" style="background-color: ${storedNoteColor}">
                        </div>`;
        document.querySelector('.list').insertAdjacentHTML('beforeend', markup);
        itemNumber++;
    }
};

document.querySelector('.display-style-icon-container').addEventListener('click', () => {   // here we are changing the display style of the notes (grid or list)
    const pinnedContainer = document.querySelector('.container-pinned');
    const pinnedContainerChildren = document.querySelectorAll('.container-pinned > div');
    const otherContainer = document.querySelector('.container-other');
    const otherContainerChildren = document.querySelectorAll('.container-other > div');

    if (!document.getElementById('display-style-check').checked) {      // if not checked, display is list
        if (pinnedContainerChildren.length >= 1) {      // applying this style only if we have divs in the box
            for (let i = 0; i < pinnedContainerChildren.length; i++) {
                pinnedContainerChildren[i].style.width = '95%';
            }
            pinnedContainer.style.justifyContent = 'center';
        }
        if (otherContainerChildren.length >= 1) {
            for (let i = 0; i < otherContainerChildren.length; i++) {
                otherContainerChildren[i].style.width = '95%';
            }
            otherContainer.style.justifyContent = 'center';
        }
    } else {    // if checked, display is grid
        if (pinnedContainerChildren.length >= 1) {
            for (let i = 0; i < pinnedContainerChildren.length; i++) {
                pinnedContainerChildren[i].style.width = 'auto';
            }
            pinnedContainer.style.justifyContent = 'flex-start';
        }
        if (otherContainerChildren.length >= 1) {
            for (let i = 0; i < otherContainerChildren.length; i++) {
                otherContainerChildren[i].style.width = 'auto';
            }
            otherContainer.style.justifyContent = 'flex-start';
        }
    }
});

document.querySelector('.logo').addEventListener('click', putTheBoxesBack);
document.querySelector('.close-icon').addEventListener('click', putTheBoxesBack);
document.querySelector('.save-icon').addEventListener('click', saveTheNote);