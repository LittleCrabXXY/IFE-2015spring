window.onload = function() {
    $.delegate($('#nav'), 'li', 'click', function(target) {
        var li = target.parentElement.children;
        var div = document.getElementsByClassName('content');
        for (var i = 0; i < li.length; i++) {
            li[i].style.backgroundColor = '#fff';
            div[i].style.display = 'none';
        }
        target.style.backgroundColor = '#ddd';
        div[target.id].style.display = 'block';
    });
    addClickEvent($('#btn1'), function() {
        var hob = $('#input1').value;
        var tmpHob = '', arrHob = [];
        for (var i = 0; i < hob.length; i++) {
            if (hob[i]!==',' && hob[i]!=='，') {
                tmpHob += hob[i];
            } else {
                arrHob.push(tmpHob);
                tmpHob = '';
            }
        }
        arrHob.push(tmpHob);
        arrHob = uniqArray(arrHob);
        var arrRealHob = [];
        arrHob.forEach(function(item) {
            item = trim(item);
            if (item !== '') {
                arrRealHob.push(item);
            }
        });
        var strHob = arrRealHob.join(',');
        $('#hob1').innerHTML = strHob || '&nbsp;';
    });
    addClickEvent($('#btn2'), function() {
        var hob = $('#input2').value;
        var tmpHob = '', arrHob = [];
        for (var i = 0; i < hob.length; i++) {
            if (hob[i]!=='\r' && hob[i]!=='\n' && hob[i]!==' ' && hob[i]!=='　' && hob[i]!==','
                && hob[i]!=='，' && hob[i]!=='、' && hob[i]!==';' && hob[i]!=='；') {
                tmpHob += hob[i];
            } else {
                arrHob.push(tmpHob);
                tmpHob = '';
            }
        }
        arrHob.push(tmpHob);
        arrHob = uniqArray(arrHob);
        var arrRealHob = [];
        arrHob.forEach(function(item) {
            item = trim(item);
            if (item !== '') {
                arrRealHob.push(item);
            }
        });
        var strHob = arrRealHob.join(',');
        $('#hob2').innerHTML = strHob || '&nbsp;';
    });
    addEvent($('#input3'), 'keyup', function() {
        var hob = $('#input3').value;
        var tmpHob = '', arrHob = [];
        for (var i = 0; i < hob.length; i++) {
            if (hob[i]!=='\r' && hob[i]!=='\n' && hob[i]!==' ' && hob[i]!=='　' && hob[i]!==','
                && hob[i]!=='，' && hob[i]!=='、' && hob[i]!==';' && hob[i]!=='；') {
                tmpHob += hob[i];
            } else {
                arrHob.push(tmpHob);
                tmpHob = '';
            }
        }
        if (tmpHob !== '') {
            arrHob.push(tmpHob);
        }
        if (arrHob.length === 0 || arrHob.length > 10) {
            $('#err').innerHTML = '0&lt;爱好数量&lt;=10';
        } else {
            $('#err').innerHTML = '&nbsp;';
        }
    });
    addClickEvent($('#btn3'), function() {
        if ($('#err').innerHTML !== '&nbsp;') {
            return;
        }
        var hob = $('#input3').value;
        var tmpHob = '', arrHob = [];
        for (var i = 0; i < hob.length; i++) {
            if (hob[i]!=='\r' && hob[i]!=='\n' && hob[i]!==' ' && hob[i]!=='　' && hob[i]!==','
                && hob[i]!=='，' && hob[i]!=='、' && hob[i]!==';' && hob[i]!=='；') {
                tmpHob += hob[i];
            } else {
                arrHob.push(tmpHob);
                tmpHob = '';
            }
        }
        if (tmpHob !== '') {
            arrHob.push(tmpHob);
        }
        if (arrHob.length === 0) {
            $('#err').innerHTML = '0&lt;爱好数量&lt;=10';
            return;
        }
        arrHob = uniqArray(arrHob);
        var arrRealHob = [];
        arrHob.forEach(function(item) {
            item = trim(item);
            if (item !== '') {
                arrRealHob.push(item);
            }
        });
        var checkbox, label;
        $('#hob3').innerHTML = '';
        for (var j = 0; j < arrRealHob.length; j++) {
            checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('id', 'hobby' + j);
            checkbox.setAttribute('value', arrRealHob[j]);
            label = document.createElement('label');
            label.innerHTML = arrRealHob[j];
            label.setAttribute('for', checkbox.id);
            $('#hob3').appendChild(checkbox);
            $('#hob3').appendChild(label);
        }
    });
    var interval;
    addClickEvent($('#btn-cd'), function() {
        var inputDate = $('#input-date').value;
        var reg = /(\d{4})-((0[1-9])|(1[0-2]))-((0[1-9]|([12][0-9])|(3[01])))/;
        if (!reg.test(inputDate)) {
            return;
        }
        var arrDate = inputDate.split('-');
        var target = new Date(parseInt(arrDate[0]), parseInt(arrDate[1]) - 1, parseInt(arrDate[2]));
        $('#year').innerHTML = target.getFullYear() + "";
        $('#month').innerHTML = target.getMonth() + 1 + "";
        $('#date').innerHTML = target.getDate() + "";
        countDown(target);
        $('#cd-info1').style.display = 'block';
        $('#cd-info2').style.display = 'block';
        clearInterval(interval);
        interval = setInterval(function() {
            countDown(target);
        }, 1000);
    });
    function countDown(target) {
        var now = new Date();
        if (target > now) {
            var seconds = Math.floor((target - now) / 1000);
            var s = seconds % 60;
            var m = Math.floor(seconds / 60) % 60;
            var h = Math.floor(seconds / 3600) % 24;
            var d = Math.floor(seconds / (3600*24));
            $('#day').innerHTML = d + "";
            $('#hour').innerHTML = h + "";
            $('#minute').innerHTML = m + "";
            $('#second').innerHTML = s + "";
        } else {
            clearInterval(interval);
            $('#day').innerHTML = "0";
            $('#hour').innerHTML = "0";
            $('#minute').innerHTML = "0";
            $('#second').innerHTML = "0";
        }
    }
};
