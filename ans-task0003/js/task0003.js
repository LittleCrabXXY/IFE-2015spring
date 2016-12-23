window.onload = function() {
    // resize height
    var minCH = document.getElementById('category').clientHeight;
    var addH = document.getElementById('add-cate').offsetHeight;
    var minH = minCH - addH;
    adaptiveHeight(minH);
    window.onresize = function() {
        adaptiveHeight(minH);
    };
    // cate-list: change category
    var allTask = document.getElementById('all-task');
    addEvent(allTask, 'click', getTask);
    var cateList = document.getElementById('cate-list');
    delegateEvent(cateList, 'li', 'click', getTask);
    // cate-list: add
    var addCate = document.getElementById('add-cate');
    addEvent(addCate, 'click', preAddCate);
    // cate-list: delete
    delegateEvent(cateList, 'li', 'mouseover', iconDelete);
    delegateEvent(cateList, 'li', 'mouseout', iconDelete);
    delegateEvent(cateList, 'span', 'mouseover', iconDelete);
    delegateEvent(cateList, 'span', 'mouseout', iconDelete);
    delegateEvent(cateList, 'span', 'click', function(event) {
        var tgtDelCate = event.target || event.srcElement;
        overlay('delCate', tgtDelCate);
    });
};

function getTask(event) {
    var allTask = document.getElementById('all-task');
    removeClass(allTask, 'current-cate');
    var lis = document.getElementById('cate-list').getElementsByTagName('li');
    for (var i=0; i<lis.length; i++) {
        removeClass(lis[i], 'current-cate');
    }
    var target = event.target || event.srcElement;
    addClass(target, 'current-cate');
    // todo
}

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

function preAddCate() {
    var lis = document.getElementById('cate-list').getElementsByTagName('li');
    // find current-cate
    var currentCate = null;
    for (var i=0; i<lis.length; i++) {
        currentCate = lis[i];
        if (hasClass(currentCate, 'current-cate')) {
            break;
        }
    }
    if (i === lis.length) {
        currentCate = null;
    }
    // default, cate(top-cate, sub-cate)
    if (currentCate && hasClass(currentCate, 'default')) {
        alert('不能为默认分类添加子分类');
    } else {
        overlay('addCate');
        var input = document.getElementById('mask-input');
        addEvent(input, 'keyup', function(event) {
            if (event.keyCode === 13) {
                if (input.value === '') {
                    alert('不能为空');
                } else {
                    execAddCate(currentCate, input.value);
                }
            }
        });
    }
}

function execAddCate(currentCate, cateName) {
    // todo: storage

    clearOverlay('addCate');

    var newCate = document.createElement('li');
    newCate.innerHTML = cateName + '&nbsp;(0)<span class="icon-delete"></span>';
    if (!currentCate) {
        newCate.className = 'icon-floder current-cate';
        currentCate = document.getElementById('default');
        removeClass(document.getElementById('all-task'), 'current-cate');
        currentCate.parentElement.insertBefore(newCate, currentCate);
    } else {
        newCate.className = 'icon-paper current-cate';
        newCate.style.paddingLeft = parseInt(currentCate.style.paddingLeft || 0) + 20 + 'px';
        newCate.style.backgroundPosition = parseInt(currentCate.style.backgroundPosition || '10px 6px') + 20 + 'px 6px';
        removeClass(currentCate, 'current-cate');
        currentCate.parentElement.insertBefore(newCate, currentCate.nextSibling);
    }
    // todo: getTask
}

function overlay(type, tgtDelCate) {
    // add mask
    var mask = document.createElement('div');
    mask.id = 'mask';
    mask.className = 'mask';
    document.body.appendChild(mask);
    addEvent(mask, 'click', function() {
        clearOverlay(type);
    });
    // add input
    if (type === 'addCate' || type === 'addTask') {
        var input = document.createElement('input');
        input.id = 'mask-input';
        input.className = 'mask-input';
        input.setAttribute('type', 'text');
        if (type === 'addTask') {
            input.style.left = '242px';
        }
        document.body.appendChild(input);
        input = document.getElementById('mask-input');
        input.focus();
    }
    if (type === 'delCate') {
        var confirm = document.createElement('div');
        confirm.innerHTML = '<p>确认删除？</p>'
            + '<input class="confirm-ok" type="button" value="确认">'
            + '<input class="confirm-cancel" type="button" value="取消">';
        confirm.id = 'confirm';
        confirm.className = 'confirm';
        document.body.appendChild(confirm);
        delegateEvent(confirm, 'input', 'click', function(event) {
            var target = event.target || event.srcElement;
            var cfmValue = target.getAttribute('value');
            execDelCate(cfmValue, tgtDelCate);
        });
        var winWidth = document.documentElement.clientWidth;
        var winHeight = document.documentElement.clientHeight;
        confirm = document.getElementById('confirm');
        confirm.style.left = (winWidth - confirm.offsetWidth)/2 + 'px';
        confirm.style.top = (winHeight - confirm.offsetHeight)/2 + 'px';
    }
}

function clearOverlay(type) {
    if (type === 'addCate' || type === 'addTask') {
        var input = document.getElementById('mask-input');
        document.body.removeChild(input);
    }
    if (type === 'delCate') {
        var confirm = document.getElementById('confirm');
        document.body.removeChild(confirm);
    }
    var mask = document.getElementById('mask');
    document.body.removeChild(mask);
}

function iconDelete(event) {
    var target = event.target || event.srcElement;
    var tagName = target.tagName.toLowerCase();
    var type = event.type;
    var iconDel = null;
    if (tagName === 'li') {
        iconDel = target.getElementsByTagName('span')[0];
    } else if (tagName === 'span') {
        iconDel = target;
    }
    if (iconDel) {
        if (type === 'mouseover') {
            iconDel.style.visibility = 'visible';
        }
        if (type === 'mouseout') {
            iconDel.style.visibility = 'hidden';
        }
    }
}

function execDelCate(cfmValue, tgtDelCate) {
    clearOverlay('delCate');
    if (cfmValue === '确认') {
        // todo：storage
        var cateList = document.getElementById('cate-list');
        cateList.removeChild(tgtDelCate.parentElement);
        // todo: getTask
    }
}