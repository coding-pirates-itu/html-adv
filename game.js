var stepId = 'step-count';
var inventoryId = 'inventory';
var frameId = 'location-block';
var initPage = '/loc/loc-01.01-start.html';
var stepNo = 1;
var inventory = {}


function resizeIframe(obj) {
    obj.style.height = (obj.contentWindow.document.documentElement.scrollHeight + 5) + 'px';
}


function init() {
    // Zero, because then takeStep() will be called
    stepNo = 0;
    inventory = {};
    updateInventory();
}


function takeStep() {
    stepNo++;
    document.getElementById(stepId).textContent = stepNo;
}


function updateInventory() {
    document.getElementById(inventoryId).textContent = Object.keys(inventory);
}


function postGoto(goToLink) {
    window.top.postMessage({ message: 'goto', goTo: goToLink }, '*');
}


function postRestartToParent() {
    window.top.postMessage({ message: 'init' }, '*');
}


function postTake(item) {
    window.top.postMessage({ message: 'take', item: item }, '*');
}


function postConditionToParent(item, trueLink, falseLink) {
    window.top.postMessage({ message: 'condition', item: item, trueLink: trueLink, falseLink: falseLink }, '*');
}


window.onmessage = function(e) {
    message = e.data.message;
    link = e.data.goTo;

    if (message === 'take') {
        inventory[e.data.item] = 1;
        updateInventory();
    }

    if (message === 'condition') {
        if (inventory[e.data.item] != null) {
            link = e.data.trueLink;
        } else {
            link = e.data.falseLink;
        }
        message = 'goto';
    }

    if (message === 'init') {
        init();
        message = 'goto';
        link = initPage;
    }

    if (message === 'goto') {
        takeStep();
        document.getElementById(frameId).src = link;
    }
};
