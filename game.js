var stepId = 'step-count';
var inventoryId = 'inventory';
var frameId = 'location-block';
var initPage = 'loc-01.01-start.html';
var stepNo = 1;
var state = {}


function init() {
    // Zero, because then takeStep() will be called
    stepNo = 0;
    state = {};
    updateState();
}


function takeStep() {
    stepNo++;
    document.getElementById(stepId).textContent = stepNo;
}


function updateState() {
    document.getElementById(inventoryId).textContent = Object.keys(state);
}


function postLinkToParent(goToLink) {
    window.top.postMessage({ message: 'goto', goTo: goToLink }, '*');
}


function postRestartToParent() {
    window.top.postMessage({ message: 'init', goTo: initPage }, '*');
}


function postTakeToParent(item, goToLink) {
    window.top.postMessage({ message: 'take', goTo: goToLink, item: item }, '*');
}


function postConditionToParent(item, trueLink, falseLink) {
    window.top.postMessage({ message: 'condition', item: item, trueLink: trueLink, falseLink: falseLink }, '*');
}


window.onmessage = function(e) {
    message = e.data.message;
    link = e.data.goTo;

    if (message === 'take') {
        state[e.data.item] = 1;
        updateState();
        message = 'goto';
    }

    if (message === 'condition') {
        if (state[e.data.item] != null) {
            link = e.data.trueLink;
        } else {
            link = e.data.falseLink;
        }
        message = 'goto';
    }

    if (message === 'init') {
        init();
        message = 'goto';
    }

    if (message === 'goto') {
        takeStep();
        document.getElementById(frameId).src = link;
    }
};
