window.onload = function() {
    initLocalStorage();
    getList('###分类');
};

window.onunload = function() {
    localStorage.clear();
};

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

function getList(key) {
    var list = document.getElementById('list');
    if (localStorage.getItem(key)) {
        var cate = localStorage.getItem(key).split(',');
        for (var i=0; i<cate.length; i++) {
            var li = document.createElement('li');
            li.innerText = cate[i];
            list.appendChild(li);
        }
    }
}