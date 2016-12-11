window.onload = function() {
    var minCH = document.getElementById('category').clientHeight;
    var addH = document.getElementsByClassName('add')[0].offsetHeight;
    var minH = minCH - addH;
    adaptiveHeight(minH);
    window.onresize = function() {
        adaptiveHeight(minH);
    };
};

function adaptiveHeight(minH) {
    var winH = document.documentElement.clientHeight;
    var headerH = document.getElementById('header').offsetHeight;
    var addH = document.getElementsByClassName('add')[0].offsetHeight;
    var contentH = ((winH - headerH - addH - 1) > minH) ? (winH - headerH - addH - 1) : minH;
    var emCategory = document.getElementById('category');
    emCategory.style.height = contentH + 'px';
    var emTask = document.getElementById('task');
    emTask.style.height = contentH + 'px';
    var emInnerContent = document.getElementById('inner-content');
    emInnerContent.style.height = contentH + 'px';
}