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
    addEvent(allTask, 'click', getTaskList);
    var cateList = document.getElementById('cate-list');
    delegateEvent(cateList, 'li', 'click', getTaskList);
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
    // task-list: filter
    var filter = document.getElementById('filter');
    delegateEvent(filter, 'span', 'click', execFilter);
    // task-list: checkout task
    var taskList = document.getElementById('task-list');
    delegateEvent(taskList, 'li', 'click', checkoutTask);
    // task-list: add task
    var addTask = document.getElementById('add-task');
    addEvent(addTask, 'click', function() {
        var cateName = getCurrentCateName();
        if (localStorage.getItem(cateName)) {
            alert('不能为已有子分类的分类添加任务');
        } else {
            editTask(true);
        }
    });
    // task-content: add events
    addTaskContentEvents();
};

function initLocalStorage() {
    var cateList = document.getElementById('cate-list');
    cateList.innerHTML = '<li class="default icon-floder current-cate" id="default">默认分类&nbsp;(0)</li>';
    if (localStorage.length === 0) {
        localStorage.setItem('***分类', '默认分类');
        localStorage.setItem('***名单', '***名单,***分类,默认分类');
    } else {
        var topCate = localStorage.getItem('***分类');
        topCate = topCate.split(',');
        removeClass(document.getElementById('all-task'), 'current-cate');
        for (var i=1; i<topCate.length; i++) {
            getCate(null, topCate[i], true);
        }
    }
    // get number of tasks
    getNumTasks();
    // show default task list
    sortByDate();
    showTask(-1);
    // style of task content
    cancelTask();
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

function getTaskList(event) {
    var target = event.target || event.srcElement;
    focusCurrentCate(target);
    getTask(target);
    sortByDate();
    showTask(-1);   // all
    cancelTask();
}

function focusCurrentCate(target) {
    var allTask = document.getElementById('all-task');
    removeClass(allTask, 'current-cate');
    var lis = document.getElementById('cate-list').getElementsByTagName('li');
    for (var i=0; i<lis.length; i++) {
        removeClass(lis[i], 'current-cate');
    }
    addClass(target, 'current-cate');
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

function getCurrentCate() {
    var lis = document.getElementById('cate-list').getElementsByTagName('li');
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
    return currentCate;
}

function getCurrentCateName() {
    var currentCate = getCurrentCate() || document.getElementById('default');
    var cateStr = currentCate.innerHTML;
    var cateName = cateStr.substring(0, cateStr.indexOf('&nbsp;'));
    return cateName;
}

function preAddCate() {
    // find current-cate
    var currentCate = getCurrentCate();
    // default, cate(top-cate, sub-cate)
    if (currentCate && hasClass(currentCate, 'default')) {
        alert('不能为默认分类添加子分类');
        return;
    }
    if (currentCate) {
        // 不允许给已有直接task的category添加sub-category
        var cateStr = currentCate.innerHTML;
        var cateName = cateStr.substring(0, cateStr.indexOf('&nbsp;'));
        if (localStorage.getItem('@' + cateName)) {
            alert('不能为已有直接任务的分类添加子分类');
            return;
        }
    }
    cancelTask();
    overlay('addCate');
    var input = document.getElementById('mask-input');
    addEvent(input, 'keyup', function(event) {
        var inputValue = input.value;
        if (event.keyCode === 13) {
            if (inputValue === '') {
                alert('分类名不能为空');
            } else if (inputValue.indexOf(',') !== -1){
                alert('命名不能包含逗号');
            } else if (inputValue.indexOf('@') !== -1){
                alert('命名不能包含@符');
            } else if (isDuplicateKey(inputValue)) {
                // category和task均不允许重名
                alert('不能重复命名分类名称和任务标题');
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
    var lis = document.getElementById('cate-list').getElementsByTagName('li');
    var target;
    for (var i=0; i<lis.length; i++) {
        target = lis[i];
        if (hasClass(target, 'current-cate')) {
            break;
        }
    }
    getTask(target);
    sortByDate();
    showTask(-1);
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
        var confirmDelCate = document.createElement('div');
        confirmDelCate.innerHTML = '<p>确认删除该分类？</p>'
            + '<input class="confirm-ok" type="button" value="确认">'
            + '<input class="confirm-cancel" type="button" value="取消">';
        confirmDelCate.id = 'confirmDelCate';
        confirmDelCate.className = 'confirm';
        document.body.appendChild(confirmDelCate);
        delegateEvent(confirmDelCate, 'input', 'click', function(event) {
            var target = event.target || event.srcElement;
            var cfmValue = target.getAttribute('value');
            execDelCate(cfmValue, tgtDelCate);
        });
        var winWidth = document.documentElement.clientWidth;
        var winHeight = document.documentElement.clientHeight;
        confirmDelCate = document.getElementById('confirmDelCate');
        confirmDelCate.style.left = (winWidth - confirmDelCate.offsetWidth)/2 + 'px';
        confirmDelCate.style.top = (winHeight - confirmDelCate.offsetHeight)/2 + 'px';
    }
    if (type === 'confirmDone') {
        var confirmDone = document.createElement('div');
        confirmDone.innerHTML = '<p>确认完成该任务？</p>'
            + '<input class="confirm-ok" type="button" value="确认">'
            + '<input class="confirm-cancel" type="button" value="取消">';
        confirmDone.id = 'confirmDone';
        confirmDone.className = 'confirm';
        document.body.appendChild(confirmDone);
        delegateEvent(confirmDone, 'input', 'click', function(event) {
            var target = event.target || event.srcElement;
            var cfmValue = target.getAttribute('value');
            clearOverlay('confirmDone');
            if (cfmValue === '确认') {
                markDone();
            }
        });
        winWidth = document.documentElement.clientWidth;
        winHeight = document.documentElement.clientHeight;
        confirmDone = document.getElementById('confirmDone');
        confirmDone.style.left = (winWidth - confirmDone.offsetWidth)/2 + 'px';
        confirmDone.style.top = (winHeight - confirmDone.offsetHeight)/2 + 'px';
    }
}

function clearOverlay(type) {
    if (type === 'addCate') {
        var input = document.getElementById('mask-input');
        document.body.removeChild(input);
    }
    if (type === 'delCate') {
        var confirmDelCate = document.getElementById('confirmDelCate');
        document.body.removeChild(confirmDelCate);
    }
    if (type === 'confirmDone') {
        var confirmDone = document.getElementById('confirmDone');
        document.body.removeChild(confirmDone);
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
    }
}

function removeCate(cateName) {
    var subCategory = localStorage.getItem(cateName);
    var task = localStorage.getItem('@' + cateName);
    if (subCategory) {
        subCategory = subCategory.split(',');
        for (var i=0; i<subCategory.length; i++) {
            removeCate(subCategory[i]);
        }
        localStorage.removeItem(cateName);
    } else if (task) {
        task = JSON.parse(task).tasks;
        for (var j=0; j<task.length; j++) {
            rmValueStr('***名单', task[j].title);
        }
        localStorage.removeItem('@' + cateName);
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
    if (value) {
        value = value.split(',');
        value.splice(value.indexOf(valueStr), 1);
        if (value.length > 0) {
            localStorage.setItem(key, value.join(','));
        } else {
            localStorage.removeItem(key);
        }
    }
}

/* task related */
var arrTasks = [],
    isNewTask = true;

function markDone() {
    var title = document.getElementById('taskname').value;
    for (var i=0; i<arrTasks.length; i++) {
        if (arrTasks[i].title === title) {
            var targetCate = arrTasks[i].directCate;
            break;
        }
    }
    var cateTask = JSON.parse(localStorage.getItem(targetCate));
    for (i=0; i<cateTask.tasks.length; i++) {
        if (cateTask.tasks[i].title === title) {
            cateTask.tasks[i].done = 1;     // done
            break;
        }
    }
    localStorage.setItem(targetCate, JSON.stringify(cateTask));
    // style
    readonlyStyle(1);
    // get number of tasks
    getNumTasks();
    // get task list
    var target = getCurrentCate() || document.getElementById('all-task');
    getTask(target);
    sortByDate();
    showTask(-1, title);
}

function editTask(isNew) {
    isNewTask = isNew;
    var btns = document.getElementById('btns');
    btns.style.display = 'inline-block';
    var cursor = document.getElementById('cursor');
    cursor.style.cursor = 'pointer';
    var taskName = document.getElementById('taskname');
    var taskDate = document.getElementById('set-date');
    taskDate.previousElementSibling.style.visibility = 'visible';
    var taskContent = document.getElementById('textarea');
    if (isNew) {
        taskName.value = '';
        taskDate.value = '';
        taskContent.value = '';
    }
    taskName.removeAttribute('readonly');
    taskDate.removeAttribute('readonly');
    taskContent.removeAttribute('readonly');
    var tipTitle = document.getElementById('tip-title');
    var tipDate = document.getElementById('tip-date');
    var tipContent = document.getElementById('tip-content');
    tipTitle.style.display = 'inline-block';
    tipDate.style.display = 'inline-block';
    tipContent.style.display = 'inline-block';
    var iconFinish = document.getElementById('icon-finish');
    var iconEdit = document.getElementById('icon-edit');
    iconFinish.style.visibility = 'hidden';
    iconEdit.style.visibility = 'hidden';
    taskName.focus();
}

function addTaskContentEvents() {
    var maxTitleLen = 20,
        maxContentLen = 500;
    var taskName = document.getElementById('taskname');
    var tipTitle = document.getElementById('tip-title');
    addEvent(taskName, 'keyup', function() {
        validLength(taskName, maxTitleLen, tipTitle);
    });
    var taskDate = document.getElementById('set-date');
    var tipDate = document.getElementById('tip-date');
    addEvent(taskDate, 'keyup', function() {
        validDateFmt(taskDate, tipDate);
    });
    var taskContent = document.getElementById('textarea');
    var tipContent = document.getElementById('tip-content');
    addEvent(taskContent, 'keyup', function() {
        validLength(taskContent, maxContentLen, tipContent);
    });
    var btnCancel = document.getElementById('btn-cancel');
    addEvent(btnCancel, 'click', function() {
        if (isNewTask) {
            cancelTask();
        } else {
            var lis = document.getElementById('task-list').getElementsByTagName('li');
            for (var i=0; i<lis.length; i++) {
                if (hasClass(lis[i], 'current-task')) {
                    var oldTitle = lis[i].innerHTML;
                    break;
                }
            }
            for (var j=0; j<arrTasks.length; j++) {
                if (arrTasks[j].title === oldTitle) {
                    taskName.value = arrTasks[j].title;
                    taskDate.value = arrTasks[j].date;
                    taskContent.value = arrTasks[j].content;
                    break;
                }
            }
            readonlyStyle(0);
        }
    });
    var btnConfirm = document.getElementById('btn-confirm');
    addEvent(btnConfirm, 'click', function() {
        validLength(taskName, maxTitleLen, tipTitle);
        validDateFmt(taskDate, tipDate);
        validLength(taskContent, maxContentLen, tipContent);
        var tipTitleColor = tipTitle.style.color;
        var tipDateColor = tipDate.style.color;
        var tipContentColor = tipContent.style.color;
        if (tipTitleColor === 'rgb(255, 0, 0)' || tipDateColor === 'rgb(255, 0, 0)' || tipContentColor === 'rgb(255, 0, 0)') {
            // nothing to do.
        } else if (isNewTask && isDuplicateKey(taskName.value)) {
            alert('不能重复命名分类名称和任务标题');
        } else {
            confirmTask(taskName.value, taskDate.value, taskContent.value);
        }
    });
    // icon-finish, icon-edit
    var iconFinish = document.getElementById('icon-finish');
    addEvent(iconFinish, 'click', function() {
        overlay('confirmDone');
    });
    var iconEdit = document.getElementById('icon-edit');
    addEvent(iconEdit, 'click', function() {
        editTask(false);
    });
}

function validLength(taskElem, maxLen, tipElem) {
    var textLen = taskElem.value.split('').length;
    var isValid = (textLen === 0 || textLen > maxLen) ? false : true;
    var tipText = tipElem.innerHTML;
    var prefix = tipText.substring(0, tipText.indexOf('&nbsp;'));
    var arrTip = tipText.split('/');
    arrTip[0] = textLen;
    tipElem.innerHTML = prefix + '&nbsp;' + arrTip.join('/');
    if (isValid) {
        tipElem.style.color = '#999';
    } else {
        tipElem.style.color = '#f00';
    }
}

function validDateFmt(taskElem, tipElem) {
    var reg = new RegExp('^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})'
    + '-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))$'
    + '|^((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$');
    var isValid = reg.test(taskElem.value);
    if (isValid) {
        tipElem.style.color = '#999';
    } else {
        tipElem.style.color = '#f00';
    }
}

function cancelTask() {
    var btns = document.getElementById('btns');
    btns.style.display = 'none';
    var cursor = document.getElementById('cursor');
    cursor.style.cursor = 'auto';
    var taskName = document.getElementById('taskname');
    var taskDate = document.getElementById('set-date');
    taskDate.previousElementSibling.style.visibility = 'hidden';
    var taskContent = document.getElementById('textarea');
    taskName.value = '';
    taskDate.value = '';
    taskContent.value = '';
    taskName.setAttribute('readonly', 'readonly');
    taskDate.setAttribute('readonly', 'readonly');
    taskContent.setAttribute('readonly', 'readonly');
    var tipTitle = document.getElementById('tip-title');
    var tipDate = document.getElementById('tip-date');
    var tipContent = document.getElementById('tip-content');
    tipTitle.style.display = 'none';
    tipDate.style.display = 'none';
    tipContent.style.display = 'none';
    var iconFinish = document.getElementById('icon-finish');
    var iconEdit = document.getElementById('icon-edit');
    iconFinish.style.visibility = 'hidden';
    iconEdit.style.visibility = 'hidden';
}

function confirmTask(title, date, content) {
    var newTask = {
        title: title,
        date: date,
        content: content,
        done: 0,     // undo
    };
    if (isNewTask) {
        var cateName = getCurrentCateName();
        newTask.directCate = '@' + cateName;
        var cateTask = localStorage.getItem(newTask.directCate);
        if (!cateTask) {
            localStorage.setItem(newTask.directCate, '{\"tasks\":[]}');
            cateTask = localStorage.getItem(newTask.directCate);
        }
        cateTask = JSON.parse(cateTask);
        cateTask.tasks.push(newTask);
    } else {
        var lis = document.getElementById('task-list').getElementsByTagName('li');
        for (var i=0; i<lis.length; i++) {
            if (hasClass(lis[i], 'current-task')) {
                var oldTitle = lis[i].textContent;
                break;
            }
        }
        for (i=0; i<arrTasks.length; i++) {
            if (arrTasks[i].title === oldTitle) {
                newTask.directCate = arrTasks[i].directCate;
                break;
            }
        }
        cateTask = JSON.parse(localStorage.getItem(newTask.directCate));
        for (i=0; i<cateTask.tasks.length; i++) {
            if (cateTask.tasks[i].title === oldTitle) {
                cateTask.tasks[i] = newTask;
                break;
            }
        }
        rmValueStr('***名单', oldTitle);
    }
    localStorage.setItem(newTask.directCate, JSON.stringify(cateTask));
    addName(newTask.title);
    // style
    readonlyStyle(newTask.done);
    // get number of tasks
    getNumTasks();
    // get task list
    var target = getCurrentCate() || document.getElementById('all-task');
    getTask(target);
    sortByDate();
    showTask(-1, newTask.title);
}

function readonlyStyle(isDone) {
    var btns = document.getElementById('btns');
    btns.style.display = 'none';
    var cursor = document.getElementById('cursor');
    cursor.style.cursor = 'auto';
    var taskName = document.getElementById('taskname');
    var taskDate = document.getElementById('set-date');
    taskDate.previousElementSibling.style.visibility = 'visible';
    var taskContent = document.getElementById('textarea');
    taskName.setAttribute('readonly', 'readonly');
    taskDate.setAttribute('readonly', 'readonly');
    taskContent.setAttribute('readonly', 'readonly');
    var tipTitle = document.getElementById('tip-title');
    var tipDate = document.getElementById('tip-date');
    var tipContent = document.getElementById('tip-content');
    tipTitle.style.display = 'none';
    tipDate.style.display = 'none';
    tipContent.style.display = 'none';
    var iconFinish = document.getElementById('icon-finish');
    var iconEdit = document.getElementById('icon-edit');
    if (isDone) {
        iconFinish.style.visibility = 'hidden';
        iconEdit.style.visibility = 'hidden';
    } else {
        iconFinish.style.visibility = 'visible';
        iconEdit.style.visibility = 'visible';
    }
}

function getTask(target) {
    var cateStr = target.innerHTML;
    var cateName = cateStr.substring(0, cateStr.indexOf('&nbsp;'));
    if (cateName === '所有任务') {
        cateName = '***分类';
    }
    arrTasks = [];
    getSubTask(cateName);
}

function getSubTask(cateName) {
    if (localStorage.getItem('@' + cateName)) {
        var subTasks = JSON.parse(localStorage.getItem('@' + cateName)).tasks;
        for (var i=0; i<subTasks.length; i++) {
            arrTasks.push(subTasks[i]);
        }
    } else if (localStorage.getItem(cateName)) {
        var subCates = localStorage.getItem(cateName).split(',');
        for (var j=0; j<subCates.length; j++) {
            getSubTask(subCates[j]);
        }
    }
}

function getNumTasks() {
    var allTask = document.getElementById('all-task');
    getTask(allTask);
    allTask.innerHTML = allTask.innerHTML.replace(/\(\d+\)/, '(' + arrTasks.length + ')');
    var lis = document.getElementById('cate-list').getElementsByTagName('li');
    for (var i=0; i<lis.length; i++) {
        getTask(lis[i]);
        lis[i].innerHTML = lis[i].innerHTML.replace(/\(\d+\)/, '(' + arrTasks.length + ')');
    }
}

function sortByDate() {
    var tmp;
    for (var i=1; i<arrTasks.length; i++) {
        for (var j=0; j<i; j++) {
            if (arrTasks[i].date < arrTasks[j].date) {
                tmp = arrTasks[i];
                for (var k=i; k>j; k--) {
                    arrTasks[k] = arrTasks[k-1];
                }
                arrTasks[j] = tmp;
            }
        }
    }
}

function showTask(type, currentTitle) {
    // type: -1(all), 0(undo), 1(done)
    var taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    var elementP = document.createElement('p');
    var elementUl = document.createElement('ul');
    var elementLi = document.createElement('li');
    var tmpDate = 'xxxx-xx-xx';
    for (var i=0; i<arrTasks.length; i++) {
        if (type === -1 || type === arrTasks[i].done) {
            if (arrTasks[i].date !== tmpDate) {
                if (elementUl.innerHTML !== '') {
                    taskList.appendChild(elementUl);
                    elementUl = document.createElement('ul');
                }
                elementP.textContent = arrTasks[i].date;
                taskList.appendChild(elementP);
                elementP = document.createElement('p');
                tmpDate = arrTasks[i].date;
            }
            elementLi.textContent = arrTasks[i].title;
            if (arrTasks[i].done) {
                addClass(elementLi, 'done');
            }
            if (currentTitle && currentTitle === arrTasks[i].title) {
                addClass(elementLi, 'current-task');
            }
            elementUl.appendChild(elementLi);
            elementLi = document.createElement('li');
        }
    }
    if (elementUl.innerHTML !== '') {
        taskList.appendChild(elementUl);
    }
}

function execFilter(event) {
    var spans = document.getElementById('filter').getElementsByTagName('span');
    for (var i=0; i<spans.length; i++) {
        removeClass(spans[i], 'current-filter');
    }
    var target = event.target || event.srcElement;
    addClass(target, 'current-filter');
    switch (target.innerHTML) {
        case '所有':
            showTask(-1);
            break;
        case '未完成':
            showTask(0);
            break;
        case '已完成':
            showTask(1);
            break;
        default:
            break;
    }
    cancelTask();
}

function checkoutTask(event) {
    var lis = document.getElementById('task-list').getElementsByTagName('li');
    for (var i=0; i<lis.length; i++) {
        removeClass(lis[i], 'current-task');
    }
    var target = event.target || event.srcElement;
    addClass(target, 'current-task');
    var tgtTitle = target.innerHTML;
    for (var j=0; j<arrTasks.length; j++) {
        var tgtTask = arrTasks[j];
        if (tgtTask.title === tgtTitle) {
            break;
        }
    }
    var taskName = document.getElementById('taskname');
    var taskDate = document.getElementById('set-date');
    var taskContent = document.getElementById('textarea');
    taskName.value = tgtTask.title;
    taskDate.value = tgtTask.date;
    taskContent.value = tgtTask.content;
    readonlyStyle(tgtTask.done);
}