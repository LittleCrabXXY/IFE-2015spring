window.onload = function() {
    // resize height
    var minCH = document.getElementById('category').clientHeight;
    var addH = document.getElementById('add-cate').offsetHeight;
    var minH = minCH - addH;
    adaptiveHeight(minH);
    window.onresize = function() {
        adaptiveHeight(minH);
    };
    // cate-list: delete
    var cateList = document.getElementById('cate-list');
    delegateEvent(cateList, 'li', 'mouseover', iconDelete);
    delegateEvent(cateList, 'li', 'mouseout', iconDelete);
};

function adaptiveHeight(minH) {
    // window height
    var winH = document.documentElement.clientHeight;
    var headerH = document.getElementById('header').offsetHeight;
    var addH = document.getElementById('add-cate').offsetHeight;
    var contentH = ((winH - headerH - addH - 1) > minH) ? (winH - headerH - addH - 1) : minH;
    var emCategory = document.getElementById('category');
    emCategory.style.height = contentH + 'px';
    var emTask = document.getElementById('task');
    emTask.style.height = contentH + 'px';
    var emInnerContent = document.getElementById('inner-content');
    emInnerContent.style.height = contentH + 'px';
    // textarea height
    var innerContentH = document.getElementById('inner-content').clientHeight;
    var taskTitleH = document.getElementById('task-title').offsetHeight;
    var taskDateH = document.getElementById('task-date').offsetHeight;
    var textareaH = innerContentH - taskTitleH - taskDateH - addH - 30;
    var textarea = document.getElementById('textarea');
    textarea.style.height = textareaH + 'px';
}

function iconDelete(event) {
    var target = event.target || event.srcElement;
    var type = event.type;
    var spans = target.getElementsByTagName('span');
    var lastSpan = spans[spans.length - 1];
    if (hasClass(lastSpan, 'icon-delete')) {
        if (type === 'mouseover') {
            lastSpan.style.display = 'inline-block';
        }
        if (type === 'mouseout') {
            lastSpan.style.display = 'none';
        }
    }
}