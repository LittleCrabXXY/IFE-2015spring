window.onload = function() {
    initLocalStorage();
    getList('###分类', false);
    var list = document.getElementById('list');
    delegateEvent(list, 'li', 'touchend', function(event) {
        var target = event.target || event.srcElement;
        getList(target.innerText, false);
    });
    var backBtn = document.getElementById('back');
    addEvent(backBtn, 'touchend', function() {
        getList(crumb[crumb.length - 2], true);
    });
};

window.onunload = function() {
    localStorage.clear();
};

var crumb = [];

function initLocalStorage() {
    localStorage.clear();
    localStorage.setItem('###分类', '默认分类,分类1,分类2');
    localStorage.setItem('默认分类', 'readme,测试任务');
    var readme = {
        title: 'readme',
        date: '2017-02-19',
        content: '这是一个移动端的简化版to-do'
    };
    localStorage.setItem('@readme', JSON.stringify(readme));
    var test = {
        title: '测试任务',
        date: '2017-02-19',
        content: '这是一个测试'
    };
    localStorage.setItem('@测试任务', JSON.stringify(test));
}

function getList(key, isBack) {
    var list = document.getElementById('list');
    list.innerHTML = '';
    if (localStorage.getItem(key)) {
        var cate = localStorage.getItem(key).split(',');
        for (var i=0; i<cate.length; i++) {
            var li = document.createElement('li');
            li.innerText = cate[i];
            list.appendChild(li);
        }
    } else if (localStorage.getItem('@' + key)) {
        var task = JSON.parse(localStorage.getItem('@' + key));
        var taskKeys = Object.keys(task);
        for (i=0; i<taskKeys.length; i++) {
            var div = document.createElement('div');
            div.innerText = task[taskKeys[i]];
            if (taskKeys[i] === 'content') {
                addId(div, 'content');
            }
            list.appendChild(div);
        }
    }
    if (isBack) {
        crumb.pop();
    } else {
        crumb.push(key);
    }
    var backBtn = document.getElementById('back');
    if (crumb.length > 1) {
        setVisibility(backBtn, 'visible');
    } else {
        setVisibility(backBtn, 'hidden');
    }
    var title = document.getElementById('title');
    if (key === '###分类') {
        key = 'to-do';
    }
    title.innerText = key;
}

// utils
function setVisibility(element, value) {
    element.style.visibility = value;
}

function addId(element, id) {
    element.id = id;
}

function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, listener);
    } else {
        element['on' + event] = listener;
    }
}

function delegateEvent(element, tag, event, listener) {
    addEvent(element, event, function(e) {
        var target = e.target || e.srcElement;
        if (target.tagName.toLowerCase() === tag) {
            listener(e);
        }
    });
}
