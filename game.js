var stepNo = 1;
var stepId = 'step-count';
var inventoryId = 'inventory';
var frameId = 'location-block';
var state = {}


function takeStep() {
    stepNo++;
    document.getElementById(stepId).textContent = stepNo;
}


function postLinkToParent(goToLink) {
    window.top.postMessage({ message: 'goto', goTo: goToLink }, '*');
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
        document.getElementById(inventoryId).textContent = Object.keys(state);
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

    if (message === 'goto') {
        takeStep();
        document.getElementById(frameId).src = link;
    }
};
