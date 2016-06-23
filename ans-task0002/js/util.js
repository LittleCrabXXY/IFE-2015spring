/**
 * 2.JavaScript数据类型及语言基础
 */
// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
    return arr instanceof Array;
}

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
    var flag = false;
    if (typeof fn == "function") {
        flag = true;
    }
    return flag;
}

// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src) {
    var obj;
    switch (typeof src) {
        case "number":
            obj = src;
            break;
        case "string":
            obj = src;
            break;
        case "boolean":
            obj = src;
            break;
        case "object":
            if (src instanceof Date) {
                obj = new Date(src);
            } else if (src instanceof Array) {
                obj = [];   // 对象字面量表示法 优于使用 new Array()
                for (var arrProp in src) {
                    obj[arrProp] = cloneObject(src[arrProp]);
                }
            } else if (src instanceof Object) {
                obj = {};   // 对象字面量表示法 优于使用 new Object()
                for (var objProp in src) {
                    // 方括号表示法访问对象属性：优点是可以通过变量来访问属性
                    obj[objProp] = cloneObject(src[objProp]);
                }
            }
            break;
        default:
            break;
    }
    return obj;
}

// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray(arr) {
    var unique = [];
    arr.forEach(function(item) {
        if (unique.indexOf(item) == -1) {
            unique.push(item);
        }
    });
    return unique;
}

// 实现一个简单的trim函数，用于去除一个字符串头部和尾部的空白字符
// 假定空白字符只有半角空格、Tab
// 练习通过循环，以及字符串的一些基本方法，分别扫描字符串str头部和尾部是否有连续的空白字符，并且删掉他们
// 最后返回一个完成去除的字符串
function simpleTrim(str) {
    var strNoSpace = "", startIndex = 0, endIndex = str.length;
    for (var i = 0; i < str.length; i++) {
        if (str[i]!=' ' && str[i]!='\t') {
            startIndex = i;
            break;
        }
    }
    for (i = str.length - 1; i >= 0; i--) {
        if (str[i]!=' ' && str[i]!='\t') {
            endIndex = i + 1;
            break;
        }
    }
    strNoSpace = str.substring(startIndex, endIndex);
    return strNoSpace;
}

// 对字符串头尾进行空格字符的去除、包括空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
// 其中fn函数可以接受两个参数：item和index
function each(arr, fn) {
    arr.forEach(function(item, index) {
        fn(item, index);
    });
}

// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj) {
    // Object.keys()返回对象自身所有可枚举属性的属性名数组
    return Object.keys(obj).length;
}

// 判断是否为邮箱地址
function isEmail(emailStr) {
    var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;
    return reg.test(emailStr);
}

// 判断是否为手机号
function isMobilePhone(phone) {
    var reg = /1\d{10}/g;
    return reg.test(phone);
}


/**
 * 3.DOM
 */
// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    var cName = element.className;
    if (cName.indexOf(newClassName) == -1) {
        if (cName.length === 0) {
            cName = newClassName;
        } else {
            cName += " " + newClassName;
        }
        element.className = cName;
    }
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    var cName = element.className;
    if (cName.indexOf(oldClassName) != -1) {
        var arrCName = cName.split(' ');
        arrCName.splice(arrCName.indexOf(oldClassName), 1);
        if (arrCName.length > 0) {
            cName = arrCName.join(' ');
            element.className = cName;
        } else {
            element.removeAttribute("class");
        }
    }
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    return element.parentNode === siblingNode.parentNode;
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var actualLeft = element.offsetLeft;
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        actualLeft += current.offsetLeft;
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    // scrollLeft和scrollTop的 混杂/兼容模式 || 标准模式
    actualLeft -= document.body.scrollLeft || document.documentElement.scrollLeft;
    actualTop -= document.body.scrollTop || document.documentElement.scrollTop;
    return {
        x: actualLeft,
        y: actualTop
    };
}

// 实现一个简单的Query，只要求返回第一个符合要求的元素
function query(current, selector) {
    var result = null;
    switch (selector.charAt(0)) {
        case "#": // ID选择器
            result = document.getElementById(selector.substring(1));
            break;
        case ".": // 类选择器
            result = current.getElementsByClassName(selector.substring(1))[0];
            break;
        case "[": // 属性选择器
            var all = current.getElementsByTagName("*");
            var attr, attrValue, j;
            var posEqual = selector.indexOf("=");
            if (posEqual == -1) {
                attr = selector.substring(1, selector.length - 1);
                for (j = 0; j < all.length; j++) {
                    if (all[j].hasAttribute(attr)) {
                        result = all[j];
                        break;
                    }
                }
            } else {
                attr = selector.substring(1, posEqual);
                attrValue = selector.substring(posEqual + 1, selector.length - 1);
                for (j = 0; j < all.length; j++) {
                    if (all[j].getAttribute(attr) === attrValue) {
                        result = all[j];
                        break;
                    }
                }
            }
            break;
        default: // 标签选择器
            result = current.getElementsByTagName(selector)[0];
            break;
    }
    return result;
}
// mini $，只要求返回第一个符合要求的元素
function $(selector) {
    var arrSelector = selector.split(" ");
    var current = document;
    for (var i = 0; i < arrSelector.length; i++) {
        current = query(current, arrSelector[i]);
    }
    return current;
}

/**
 * 4.事件
 */
// 给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener);
    } else if (element.attachEvent) {
        element.attachEvent("on" + event, listener);
    } else {
        element["on" + event] = listener;
    }
}

// 移除element对象对于event事件发生时执行listener的响应
function removeEvent(element, event, listener) {
    if (element.removeEventListener) {
        element.removeEventListener(event, listener);
    } else if (element.detachEvent) {
        element.detachEvent("on" + event, listener);
    } else {
        element["on" + event] = null;
    }
}

// 实现对click事件的绑定
function addClickEvent(element, listener) {
    addEvent(element, "click", listener);
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
    // 注意onkeydown事件只对一些元素起作用，如document、input（获得焦点的元素）
    addEvent(element, "keydown", function(event) {
        if (event.keyCode === 13) {
            listener();
        }
    });
}

// 接下来我们把上面几个函数和$做一下结合，把他们变成$对象的一些方法
// - addEvent(element, event, listener) -> $.on(element, event, listener);
// - removeEvent(element, event, listener) -> $.un(element, event, listener);
// - addClickEvent(element, listener) -> $.click(element, listener);
// - addEnterEvent(element, listener) -> $.enter(element, listener);
$.on = addEvent;
$.un = removeEvent;
$.click = addClickEvent;
$.enter = addEnterEvent;

// 事件代理
function delegateEvent(element, tag, eventName, listener) {
    addEvent(element, eventName, function(event) {
        var target = event.target || event.srcElement;  // 兼容IE6-8
        if (target.tagName.toLowerCase() === tag) {
            listener();
        }
    });
}
$.delegate = delegateEvent;

// 封装改变，去除$
// $.on = function(selector, event, listener) {
//     addEvent($(selector), event, listener);
// };
// $.click = function(selector, listener) {
//     addClickEvent($(selector), listener);
// };
// $.un = function(selector, event, listener) {
//     removeEvent($(selector), event, listener);
// };
// $.delegate = function(selector, tag, event, listener) {
//     delegateEvent($(selector), tag, event,listener);
// };
