function addEvent(element, event, listener) {
    if (element.addEventListener) { // IE9+
        element.addEventListener(event, listener);
    } else if (element.attachEvent) {   // IE8
        element.attachEvent('on' + event, listener);
    } else {
        element['on' + event] = listener;
    }
}

function delegateEvent(element, tag, event, listener) {
    addEvent(element, event, function(e) {
        var target = e.target || e.srcElement;  // IE9+ || IE8
        if (target.tagName.toLowerCase() == tag) {
            listener(e);
        }
    });
}

function hasClass(element, queryClass) {
    var result = false;
    var classStr = element.className;
    if (classStr.indexOf(queryClass) !== -1) {
        result = true;
    }
    return result;
}
