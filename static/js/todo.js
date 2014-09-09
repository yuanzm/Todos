(function() {
  var EventUtil, todoList;

  EventUtil = {
    addHandler: function(element, type, handler) {
      if (element.addEventListener) {
        element.addEventListener(type, handler, false);
      }
      if (element.attachEvent) {
        return element.attachEvent("on" + type, handler);
      } else {
        return element["on" + type] = handler;
      }
    },
    removeHandler: function(element, type, handler) {
      if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
      }
      if (element.detachEvent) {
        return element.detachEvent("on" + type, handler);
      } else {
        return element["on" + type] = null;
      }
    }
  };

  Date.prototype.Format = function(fmt) {
    var flag, k, o;
    o = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, flag = RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return fmt;
  };

  todoList = {
    index: window.localStorage.getItem("index"),
    allTodo: document.getElementById("todo-list"),
    todoCount: document.getElementById("todo-count"),
    toggleAll: document.getElementById("toggle-all"),
    _clear: document.getElementById("clear-completed"),
    form: document.getElementsByTagName("form")[0],
    newTodo: document.getElementById("new-todo"),
    hasClass: function(ele, cls) {
      var className, reg;
      reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      className = ele.getAttribute("class") ? ele.className : "";
      return reg.test(className);
    },
    addClass: function(ele, cls) {
      if (!todoList.hasClass(ele, cls)) {
        return ele.className += " " + cls;
      }
    },
    removeClass: function(ele, cls) {
      var reg;
      if (todoList.hasClass(ele, cls)) {
        reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        return ele.className = ele.className.replace(reg, ' ');
      }
    },
    getElementsByClass: function(cls) {
      var el, els, _el, _i, _len;
      el = [];
      _el = document.getElementsByTagName("*");
      for (_i = 0, _len = _el.length; _i < _len; _i++) {
        els = _el[_i];
        if (todoList.hasClass(els, cls)) {
          el.push(els);
        }
      }
      return el;
    },
    checkBox: function() {
      var clearNum, count, flag, footer, todoInput, _i, _input, _len, _result;
      todoInput = todoList.getElementsByClass("toggle");
      footer = document.getElementsByTagName("footer")[0];
      count = 0;
      _result = [];
      for (_i = 0, _len = todoInput.length; _i < _len; _i++) {
        _input = todoInput[_i];
        if (!_input.checked) {
          count++;
        } else {
          _result.push(_input);
        }
      }
      todoList.todoCount.innerHTML = "<span>" + count + "</span>" + " item left";
      flag = count === 0 ? true : false;
      todoList.toggleAll.checked = todoInput.length === 0 ? false : flag;
      footer.style.display = todoInput.length > 0 ? "block" : "none";
      clearNum = todoInput.length - count;
      todoList._clear.innerHTML = "Clear " + clearNum + " completed";
      return _result;
    },
    todoAdd: function(entry) {
      var a, div, input, input2, label, li, span;
      li = document.createElement("li");
      div = document.createElement("div");
      input = document.createElement("input");
      label = document.createElement("label");
      a = document.createElement("a");
      input2 = document.createElement("input");
      span = document.createElement("span");
      li.setAttribute("id", entry.id);
      li.className = entry.state;
      div.className = "view";
      input.setAttribute("type", "checkbox");
      input.className = "toggle";
      input.checked = entry.isCheck;
      label.appendChild(document.createTextNode(entry.value));
      span.className = "phone";
      span.appendChild(document.createTextNode(entry.time));
      a.className = "destroy";
      input2.className = "edit";
      input2.setAttribute("type", "text");
      input2.setAttribute("value", entry.value);
      div.appendChild(input);
      div.appendChild(label);
      div.appendChild(span);
      div.appendChild(a);
      li.appendChild(div);
      li.appendChild(input2);
      return todoList.allTodo.appendChild(li);
    },
    todoEdit: function(target) {
      var entry, label, parId, span;
      parId = target.parentNode.getAttribute("id");
      entry = JSON.parse(window.localStorage.getItem("Todolist:" + parId));
      entry.value = target.value;
      entry.time = new Date().Format("yyyy-MM-dd hh:mm:ss");
      todoList.storageEdit(entry);
      label = target.parentNode.getElementsByTagName("label")[0];
      span = target.parentNode.getElementsByTagName("span")[0];
      label.innerHTML = target.value;
      span.innerHTML = entry.time;
      return todoList.removeClass(target.parentNode, "editing");
    },
    todoRemove: function(entry) {
      return todoList.allTodo.removeChild(document.getElementById(entry.id));
    },
    initStorage: function() {
      if (!todoList.index) {
        return window.localStorage.setItem("index", 1);
      }
    },
    storageAdd: function(entry) {
      window.localStorage.setItem("Todolist:" + entry.id, JSON.stringify(entry));
      return window.localStorage.setItem("index", ++todoList.index);
    },
    storageEdit: function(entry) {
      return window.localStorage.setItem("Todolist:" + entry.id, JSON.stringify(entry));
    },
    storageRemove: function(entry) {
      window.localStorage.removeItem("Todolist:" + entry.id);
      return window.localStorage.setItem("index", --todoList.index);
    },
    bindEvent: function() {
      var allLi, li, _i, _len;
      todoList.form.addEventListener("submit", function(event) {
        var entry;
        if (todoList.newTodo.value !== "") {
          entry = {
            id: todoList.index,
            state: "",
            isCheck: false,
            value: todoList.newTodo.value,
            time: new Date().Format("yyyy-MM-dd hh:mm:ss")
          };
          todoList.todoAdd(entry);
          todoList.storageAdd(entry);
          todoList.checkBox();
          this.reset();
        }
        return event.preventDefault();
      });
      todoList.allTodo.addEventListener("click", function(e) {
        var entry, parId, parent, target;
        target = e.target;
        if (target) {
          parId = target.parentNode.parentNode.getAttribute("id");
          entry = JSON.parse(window.localStorage.getItem("Todolist:" + parId));
        }
        if (target && target.nodeName === "A") {
          todoList.todoRemove(entry);
          todoList.storageRemove(entry);
        }
        if (target && target.nodeName === "INPUT" && todoList.hasClass(target, "toggle")) {
          parent = target.parentNode.parentNode;
          if (target.checked) {
            todoList.addClass(parent, "done");
            entry.state = "done";
            entry.isCheck = true;
          } else {
            todoList.removeClass(parent, "done");
            entry.state = "";
            entry.isCheck = false;
          }
          todoList.storageEdit(entry);
        }
        return todoList.checkBox();
      });
      allLi = document.getElementsByTagName("li");
      for (_i = 0, _len = allLi.length; _i < _len; _i++) {
        li = allLi[_i];
        li.addEventListener("dblclick", function(e) {
          var entry, parId;
          parId = this.getAttribute("id");
          entry = JSON.parse(window.localStorage.getItem("Todolist:" + parId));
          todoList.addClass(this, "editing");
          return todoList.getElementsByClass("edit")[0].focus();
        });
      }
      todoList.toggleAll.addEventListener("click", function() {
        var entry, flag, parId, parent, state, todoInput, _input, _j, _len1;
        todoInput = todoList.getElementsByClass("toggle");
        flag = this.checked ? true : false;
        state = this.checked ? "done" : "";
        for (_j = 0, _len1 = todoInput.length; _j < _len1; _j++) {
          _input = todoInput[_j];
          parent = _input.parentNode.parentNode;
          _input.checked = flag;
          parId = _input.parentNode.parentNode.getAttribute("id");
          entry = JSON.parse(window.localStorage.getItem("Todolist:" + parId));
          entry.state = state;
          entry.isCheck = flag;
          todoList.storageEdit(entry);
          if (flag === true) {
            todoList.addClass(parent, "done");
          } else {
            todoList.removeClass(parent, "done");
          }
        }
        return todoList.checkBox();
      });
      document.onkeydown = function(moz_ev) {
        var ev;
        if (window.event) {
          ev = window.event;
        } else {
          ev = moz_ev;
        }
        if (ev !== null && ev.keyCode === 13) {
          if (todoList.hasClass(ev.target, "edit")) {
            return todoList.todoEdit(ev.target);
          }
        }
      };
      return todoList._clear.addEventListener("click", function() {
        var entry, parId, _j, _len1, _rel, _result, _results;
        _result = todoList.checkBox();
        _results = [];
        for (_j = 0, _len1 = _result.length; _j < _len1; _j++) {
          _rel = _result[_j];
          parId = _rel.parentNode.parentNode.getAttribute("id");
          entry = JSON.parse(window.localStorage.getItem("Todolist:" + parId));
          todoList.todoRemove(entry);
          todoList.storageRemove(entry);
          _results.push(todoList.checkBox());
        }
        return _results;
      });
    },
    initList: function() {
      var i, key, todolist, _i, _len, _results;
      if (window.localStorage.length - 1) {
        todolist = [];
        i = 0;
        while (i < window.localStorage.length) {
          key = window.localStorage.key(i);
          if (/Todolist:\d+/.test(key)) {
            todolist.push(JSON.parse(window.localStorage.getItem(key)));
          }
          i++;
        }
        todolist.sort(function(a, b) {
          var flag;
          return flag = a.id < b.id ? -1 : 1;
        });
        if (todolist.length) {
          _results = [];
          for (_i = 0, _len = todolist.length; _i < _len; _i++) {
            key = todolist[_i];
            _results.push(todoList.todoAdd(key));
          }
          return _results;
        }
      }
    },
    init: function() {
      todoList.initStorage();
      todoList.initList();
      todoList.checkBox();
      return todoList.bindEvent();
    }
  };

  EventUtil = {
    addHandler: function(element, type, handler) {
      if (element.addEventListener) {
        element.addEventListener(type, handler, false);
      }
      if (element.attachEvent) {
        return element.attachEvent("on" + type, handler);
      } else {
        return element["on" + type] = handler;
      }
    },
    removeHandler: function(element, type, handler) {
      if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
      }
      if (element.detachEvent) {
        return element.detachEvent("on" + type, handler);
      } else {
        return element["on" + type] = null;
      }
    }
  };

  window.onload = function() {
    return todoList.init();
  };

}).call(this);
