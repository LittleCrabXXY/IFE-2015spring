window.onload = function() {
    var previous = document.getElementById('arrow-left');
    addEvent(previous, 'click', prePic);
    var next = document.getElementById('arrow-right');
    addEvent(next, 'click', nextPic);
    var link = document.getElementById('link');
    delegate(link, 'li', 'click', linkPic);
    
    // 每5秒自动轮播
    setInterval(nextPic, 5000);

    /*// 鼠标移上图片轮播停止，移出图片轮播恢复
    var inner = document.getElementById('inner');
    var interval = setInterval(nextPic, 5000);
    addEvent(inner, 'mouseover', function() {
        clearInterval(interval);
    });
    addEvent(inner, 'mouseout', function() {
        interval = setInterval(nextPic, 5000);
    });*/
};

var picWidth = 600;     //单张图片宽度，单位像素
var flag = true;    // 防止冲突

/**
 * 事件处理程序
 * @param {element} element  监听元素
 * @param {string} event    监听事件
 * @param {function} listener 触发函数
 */
function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, listener);
    } else {
        element['on' + event] = listener;
    }
}

/**
 * 事件代理
 * @param  {element} element  代理元素
 * @param  {string} tag      监听元素的标签
 * @param  {string} event    监听事件
 * @param  {function} listener 触发函数
 * @return {null}
 */
function delegate(element, tag, event, listener) {
    addEvent(element, event, function(e) {
        var target = e.target || e.srcElement;
        if (target.tagName.toLowerCase() === tag) {
            listener(e);
        }
    });
}

/**
 * 切换至前一张图片
 * @return {null}
 */
function prePic() {
    var currentLeft = document.getElementById('inner').offsetLeft;  // offsetLeft: relative to offsetParent
    animation(currentLeft, currentLeft + picWidth);
}

/**
 * 切换至后一张图片
 * @return {null}
 */
function nextPic() {
    var currentLeft = document.getElementById('inner').offsetLeft;  // offsetLeft: relative to offsetParent
    animation(currentLeft, currentLeft - picWidth);
}

/**
 * 切换至指定图片
 * @param  {event} e 事件信息
 * @return {null}
 */
function linkPic(e) {
    var currentLeft = document.getElementById('inner').offsetLeft;  // offsetLeft: relative to offsetParent
    var target = e.target || e.srcElement;
    animation(currentLeft, 0 - target.value * picWidth);
}

/**
 * 切换动画
 * @param  {number} currentLeft 当前left值
 * @param  {number} targetLeft  目标left值
 * @return {null}
 */
function animation(currentLeft, targetLeft) {
    if (flag) {
        flag = false;
        var time = 100;     //总切换时长，单位毫秒
        var speed = (targetLeft - currentLeft) / time;  // 分步切换长度，单位像素
        var inner = document.getElementById('inner');
        var interval = setInterval(function() {
            inner.style.left = inner.offsetLeft + speed + 'px';
            if (parseInt(inner.style.left) === targetLeft) {
                clearInterval(interval);
                if (targetLeft === 0) {
                    inner.style.left = '-1800px';
                }
                if (targetLeft === -2400) {
                    inner.style.left = '-600px';
                }
                changeLink();
                flag = true;
            }
        }, 2);     // 每2毫秒执行一次
    }
}

/**
 * 更改焦点
 * @return {null}
 */
function changeLink() {
    var links = document.getElementById('link').children;
    for (var i = 0; i < links.length; i++) {
        links[i].setAttribute('class', 'non-current');
    }
    var inner = document.getElementById('inner');
    links[inner.offsetLeft / -600 - 1].setAttribute('class', 'current');
}