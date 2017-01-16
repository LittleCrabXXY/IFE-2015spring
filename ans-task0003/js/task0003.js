window.onload = function() {
    // resize height
    var minCH = document.getElementById('category').clientHeight;
    var addH = document.getElementById('add-cate').offsetHeight;
    var minH = minCH - addH;
    adaptiveHeight(minH);
    window.onresize = function() {
        adaptiveHeight(minH);
    };
    // init localStorage
    initLocalStorage();
    // cate-list: change category
    var allTask = document.getElementById('all-task');
    addEvent(allTask, 'click', getTask);
    var cateList = document.getElementById('cate-list');
    delegateEvent(cateList, 'li', 'click', getTask);
    // cate-list: add category
    var addCate = document.getElementById('add-cate');
    addEvent(addCate, 'click', preAddCate);
    // cate-list: delete
    delegateEvent(cateList, 'li', 'mouseover', iconDelete);
    delegateEvent(cateList, 'li', 'mouseout', iconDelete);
    delegateEvent(cateList, 'span', 'mouseover', iconDelete);
    delegateEvent(cateList, 'span', 'mouseout', iconDelete);
    delegateEvent(cateList, 'span', 'click', function(event) {
        var tgtDelCate = (event.target || event.srcElement).parentElement;
        overlay('delCate', tgtDelCate);
    });
    // task-list: add task
    var addTask = document.getElementById('add-task');
    addEvent(addTask, 'click', function() {
        editTask(true);
    });
};

function initLocalStorage() {
    var cateList = document.getElementById('cate-list');
    // todo: (0)
    cateList.innerHTML = '<li class="default icon-floder current-cate" id="default">默认分类&nbsp;(0)</li>';
    if (localStorage.length === 0) {
        localStorage.setItem('***分类', '默认分类');
        localStorage.setItem('***名单', '***名单,***分类,默认分类');
    } else {
        var topCate = localStorage.getItem('***分类');
        topCate = topCate.split(',');
        for (var i=1; i<topCate.length; i++) {
            getCate(null, topCate[i], true);
        }
    }
}

function getCate(currentCate, cateName, isInit) {
    var newCate = document.createElement('li');
    newCate.innerHTML = cateName + '&nbsp;(0)<span class="icon-delete"></span>';
    if (!currentCate) {
        newCate.className = isInit ? 'icon-floder' : 'icon-floder current-cate';
        currentCate = document.getElementById('default');
        removeClass(document.getElementById('all-task'), 'current-cate');
        currentCate.parentElement.insertBefore(newCate, currentCate);
    } else {
        newCate.className = isInit ? 'icon-paper' : 'icon-paper current-cate';
        newCate.style.paddingLeft = parseInt(currentCate.style.paddingLeft || 0) + 20 + 'px';
        newCate.style.backgroundPosition = parseInt(currentCate.style.backgroundPosition || '10px 6px') + 20 + 'px 6px';
        removeClass(currentCate, 'current-cate');
        currentCate.parentElement.insertBefore(newCate, currentCate.nextSibling);
    }
    var subCate = localStorage.getItem(cateName);
    if (subCate) {
        subCate = subCate.split(',');
        for (var i=0; i<subCate.length; i++) {
            getCate(newCate, subCate[i], isInit);
        }
    }
}

function setCate(currentCate, cateName) {
    var oldValue;
    if (!currentCate) {
        oldValue = localStorage.getItem('***分类');
        localStorage.setItem('***分类', oldValue + ',' + cateName);
    } else {
        var cateStr = currentCate.innerHTML;
        var currCateName = cateStr.substring(0, cateStr.indexOf('&nbsp;'));
        oldValue = localStorage.getItem(currCateName);
        if (oldValue) {
            localStorage.setItem(currCateName, oldValue + ',' + cateName);
        } else {
            localStorage.setItem(currCateName, cateName);
        }
    }
    addName(cateName);
}

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
        return;
    }
    if (currentCate) {
        // 不允许给已有task的category添加sub-category
        var cateStr = currentCate.innerHTML;
        var numTask = cateStr.substring(cateStr.indexOf('(') + 1, cateStr.indexOf(')'));
        if (parseInt(numTask) !== 0) {
            alert('不能为已有任务的分类添加子分类');
            return;
        }
    }
    overlay('addCate');
    var input = document.getElementById('mask-input');
    addEvent(input, 'keyup', function(event) {
        var inputValue = input.value;
        if (event.keyCode === 13) {
            if (inputValue === '') {
                alert('分类名不能为空');
            } else if (inputValue.indexOf(',') !== -1){
                alert('命名不能包含逗号');
            } else if (isDuplicateKey(inputValue)) {
                // category和task都不允许重名
                alert('不能重复命名分类或任务');
            } else {
                execAddCate(currentCate, inputValue);
            }
        }
    });
}

function isDuplicateKey(value) {
    var flag = false;
    var nameList = localStorage.getItem('***名单');
    nameList = nameList.split(',');
    for (var i=0; i<nameList.length; i++) {
        if (nameList[i] === value) {
            flag = true;
            break;
        }
    }
    return flag;
}

function execAddCate(currentCate, cateName) {
    setCate(currentCate, cateName);
    clearOverlay('addCate');
    getCate(currentCate, cateName, false);
    // todo: getTask
}

function addName(newName) {
    var oldNameList = localStorage.getItem('***名单');
    localStorage.setItem('***名单', oldNameList + ',' + newName);
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
    if (type === 'addCate') {
        var input = document.createElement('input');
        input.id = 'mask-input';
        input.className = 'mask-input';
        input.setAttribute('type', 'text');
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
    if (type === 'addCate') {
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
        var tgtCateStr = tgtDelCate.innerHTML;
        var tgtCateName = tgtCateStr.substring(0, tgtCateStr.indexOf('&nbsp;'));
        removeCate(tgtCateName);
        removeCateName(tgtDelCate);
        initLocalStorage();
        // todo: getTask
    }
}

function removeCate(cateName) {
    var subCategory = localStorage.getItem(cateName);
    if (subCategory) {
        subCategory = subCategory.split(',');
        for (var i=0; i<subCategory.length; i++) {
            removeCate(subCategory[i]);
        }
        localStorage.removeItem(cateName);
    }
    rmValueStr('***名单', cateName);
}

function removeCateName(tgtDelCate) {
    var cateStr = tgtDelCate.innerHTML;
    var cateName = cateStr.substring(0, cateStr.indexOf('&nbsp;'));
    var pLeft = parseInt(tgtDelCate.style.paddingLeft || 0);
    var cateListKey;
    if (pLeft === 0) {
        cateListKey = '***分类';
    } else {
        var preElement = tgtDelCate;
        var preElePLeft, preEleStr;
        do {
            preElement = preElement.previousElementSibling;
            preElePLeft = parseInt(preElement.style.paddingLeft || 0);
        } while (preElePLeft !== pLeft - 20);
        preEleStr = preElement.innerHTML;
        cateListKey = preEleStr.substring(0, preEleStr.indexOf('&nbsp;'));
    }
    rmValueStr(cateListKey, cateName);
}

function rmValueStr(key, valueStr) {
    var value = localStorage.getItem(key);
    value = value.split(',');
    value.splice(value.indexOf(valueStr), 1);
    localStorage.setItem(key, value.join(','));
}

/* task related */

function editTask(isNew) {
    // style
    var iconFinish = document.getElementById('icon-finish');
    var iconEdit = document.getElementById('icon-edit');
    iconFinish.style.display = 'none';
    iconEdit.style.display = 'none';
    var btns = document.getElementById('btns');
    btns.style.display = 'inline-block';
    var taskname = document.getElementById('taskname');
    var taskdate = document.getElementById('set-date');
    var taskcontent = document.getElementById('textarea');
    if (isNew) {
        taskname.setAttribute('value', '');
        taskdate.setAttribute('value', '');
        taskcontent.innerHTML = '';
    }
    taskname.removeAttribute('readonly');
    taskdate.removeAttribute('readonly');
    taskcontent.removeAttribute('readonly');
    var tipTitle = document.getElementById('tip-title');
    var tipDate = document.getElementById('tip-date');
    var tipContent = document.getElementById('tip-content');
    tipTitle.style.display = 'inline-block';
    tipDate.style.display = 'inline-block';
    tipContent.style.display = 'inline-block';
    taskname.focus();
}