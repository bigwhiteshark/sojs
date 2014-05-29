/**
 * Created by yangxinming on 14-5-22.
 */
require(function () {
    (function (console) {
        var i,
            global = this,
            doc = document,
            fnProto = Function.prototype,
            fnApply = fnProto.apply,
            fnBind = fnProto.bind,
            bind = function (context, fn) {
                return fnBind ?
                    fnBind.call(fn, context) :
                    function () {
                        return fnApply.call(fn, context, arguments);
                    };
            },
            methods = 'assert count debug dir dirxml error group groupCollapsed groupEnd info log markTimeline profile profileEnd table trace warn'.split(' '),
            emptyFn = function () {
            },
            empty = {},
            timeCounters;

        for (i = methods.length; i--;) empty[methods[i]] = emptyFn;
        if (console) {
            for (i = methods.length; i--;) {
                console[methods[i]] = methods[i] in console ?
                    bind(console, console[methods[i]]) : emptyFn;
            }
            console.disable = function () {
                global.console = empty;
            };
            empty.enable = function () {
                global.console = console;
            };
            empty.disable = console.enable = emptyFn;
        } else {
            console = global.console = empty;
            var debugCurTimer;
            var debugTimer = new Date().getTime();
            console.log = function () {
                var message = [];
                for (var i = 0, len = arguments.length; i < len; i++) {
                    if (arguments[i] && arguments[i].length) {
                        message = message.concat(arguments[i]);
                    } else {
                        message.push(arguments[i]);
                    }
                }
                message.join(', ');
                var mess = doc.createElement('div');
                mess.style.cssText = 'border-bottom:1px dashed #e0ecff;' + 'line-height:12px;padding:2px 0;height:12px;';
                mess.innerHTML = '<xmp style="margin:0 80px 0 0;float:left;">' +
                    message + '</xmp>';
                var timeDiv = doc.createElement('div');
                timeDiv.style.cssText = 'float:right;';
                debugCurTimer = new Date().getTime();
                timeDiv.innerHTML = (debugCurTimer - debugTimer) + ' ms';
                debugTimer = debugCurTimer;
                mess.appendChild(timeDiv);
                var dbg = doc.getElementById('__debug');
                var cont = doc.getElementById('__debug_content');
                if (!dbg) {
                    dbg = doc.createElement('div');
                    dbg.id = '__debug';
                    dbg.style.cssText = 'position:fixed;*position:absolute;' + 'bottom:0;' + ';width:99%;height:100px;overflow:hidden;' + 'z-index:100000;background:#fff;font-size:11px;';
                    doc.body.appendChild(dbg);
                    var topBar = doc.createElement('div');
                    topBar.style.cssText = 'height:16px;' + 'line-height:16px;background:#DDD;position:relative;';
                    topBar.innerHTML = '<span style="margin-left:5px;color:white;' + 'font-weight:bold;">日志</span>';
                    var clear = doc.createElement('span');
                    var acss = 'color:white;cursor:pointer;position:absolute;' + 'right:45px;text-decoration:underline;';
                    clear.style.cssText = acss;
                    clear.innerHTML = '清除';
                    clear.onclick = function () {
                        cont.innerHTML = '';
                    };
                    var close = doc.createElement('span');
                    close.style.cssText = acss;
                    close.style.right = '10px';
                    close.innerHTML = '隐藏';
                    close.onclick = function () {
                        if (close.innerHTML == '隐藏') {
                            close.innerHTML = '显示';
                            dbg.style.height = '16px';
                        } else {
                            close.innerHTML = '隐藏';
                            dbg.style.height = '100px';
                        }
                    };
                    topBar.appendChild(clear);
                    topBar.appendChild(close);
                    cont = doc.createElement('div');
                    cont.id = '__debug_content';
                    cont.style.cssText = 'height:80px;overflow:auto;' + 'background:#fff;margin:2px 5px;color:#333333;';
                    dbg.appendChild(topBar);
                    dbg.appendChild(cont);
                }
                dbg.style.display = '';
                cont.appendChild(mess);
                cont.scrollTop = cont.scrollHeight;

            };
            console.disable = console.enable = emptyFn;
        }
        if (!console.time) {
            console.timeCounters = timeCounters = {};
            console.time = function (name, reset) {
                if (name) {
                    var time = +new Date,
                        key = "KEY" + name.toString();
                    if (reset || !timeCounters[key]) timeCounters[key] = time;
                }
            };
            console.timeEnd = function (name) {
                var diff,
                    time = +new Date,
                    key = "KEY" + name.toString(),
                    timeCounter = timeCounters[key];

                if (timeCounter) {
                    diff = time - timeCounter;
                    console.log(name + ": " + diff + "ms");
                    delete timeCounters[key];
                }
                return diff;
            };
        }
    })(typeof console === 'undefined' ? null : console);
});
