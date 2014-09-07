(function() {
  var todoList;

  todoList = {
    index: window.localStorage.getItem("index"),
    allTodo: document.getElementById("todo-list"),
    todoCount: document.getElementById("todo-count"),
    toggleAll: document.getElementById("toggle-all"),
    _clear: document.getElementById("clear-completed"),
    hasClass: function(ele, cls) {
      var reg;
      reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      return reg.test(ele.className);
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
      var clearNum, count, flag, todoInput, _i, _input, _len;
      todoInput = todoList.getElementsByClass("toggle");
      count = 0;
      for (_i = 0, _len = todoInput.length; _i < _len; _i++) {
        _input = todoInput[_i];
        if (!_input.checked) {
          count++;
        }
      }
      todoList.todoCount.innerHTML = "<span>" + count + "</span>" + " item left";
      flag = count === 0 ? true : false;
      todoList.toggleAll.checked = flag;
      clearNum = todoInput.length - count;
      return todoList._clear.innerHTML = "Clear " + clearNum + " completed";
    },
    init: function() {
      todoList.initStorage();
      todoList.initList();
      todoList.checkBox();
      return todoList.initForm();
    },
    initForm: function() {
      var allLi, form, li, newTodo, _i, _len;
      form = document.getElementsByTagName("form")[0];
      newTodo = document.getElementById("new-todo");
      form.addEventListener("submit", function(event) {
        var entry;
        entry = {
          id: todoList.index,
          state: "",
          isCheck: false,
          value: newTodo.value
        };
        todoList.todoAdd(entry);
        todoList.storageAdd(entry);
        todoList.checkBox();
        this.reset();
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
          todoList.checkBox();
        }
        if (target && target.nodeName === "INPUT" && todoList.hasClass(target, "toggle")) {
          parent = target.parentNode.parentNode;
          if (target.checked) {
            todoList.addClass(parent, "done");
            entry.state = "done";
            entry.isCheck = true;
          } else {
            entry.state = "";
            entry.isCheck = false;
            todoList.removeClass(parent, "done");
          }
          todoList.storageEdit(entry);
          return todoList.checkBox();
        }
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
        var entry, flag, j, key, parent, state, todoInput, _input, _j, _len1;
        todoInput = todoList.getElementsByClass("toggle");
        flag = this.checked ? true : false;
        state = this.checked ? "done" : "";
        for (_j = 0, _len1 = todoInput.length; _j < _len1; _j++) {
          _input = todoInput[_j];
          parent = _input.parentNode.parentNode;
          _input.checked = flag;
          if (flag === true) {
            todoList.addClass(parent, "done");
          } else {
            todoList.removeClass(parent, "done");
          }
        }
        j = 0;
        while (j < window.localStorage.length) {
          key = window.localStorage.key(j);
          if (/Todolist:\d+/.test(key)) {
            console.log(key);
            entry = JSON.parse(window.localStorage.getItem(key));
            entry.state = state;
            entry.isCheck = flag;
            todoList.storageEdit(entry);
          }
          j++;
        }
        return todoList.checkBox();
      });
      return document.onkeydown = function(moz_ev) {
        var ev;
        if (window.event) {
          ev = window.event;
        } else {
          ev = moz_ev;
        }
        if (ev !== null && ev.keyCode === 13) {
          return todoList.todoEdit(ev.target);
        }
      };
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
    initStorage: function() {
      if (!todoList.index) {
        return window.localStorage.setItem("index", 1);
      }
    },
    todoAdd: function(entry) {
      var a, div, input, input2, label, li;
      li = document.createElement("li");
      div = document.createElement("div");
      input = document.createElement("input");
      label = document.createElement("label");
      a = document.createElement("a");
      input2 = document.createElement("input");
      li.setAttribute("id", entry.id);
      li.className = entry.state;
      div.className = "view";
      input.setAttribute("type", "checkbox");
      input.className = "toggle";
      input.checked = entry.isCheck;
      label.appendChild(document.createTextNode(entry.value));
      a.className = "destroy";
      input2.className = "edit";
      input2.setAttribute("type", "text");
      input2.setAttribute("value", entry.value);
      div.appendChild(input);
      div.appendChild(label);
      div.appendChild(a);
      li.appendChild(div);
      li.appendChild(input2);
      return todoList.allTodo.appendChild(li);
    },
    todoEdit: function(target) {
      var entry, label, parId;
      target.focus();
      parId = target.parentNode.getAttribute("id");
      entry = JSON.parse(window.localStorage.getItem("Todolist:" + parId));
      entry.value = target.value;
      todoList.storageEdit(entry);
      label = target.parentNode.getElementsByTagName("label")[0];
      label.innerHTML = target.value;
      return todoList.removeClass(target.parentNode, "editing");
    },
    todoRemove: function(entry) {
      return todoList.allTodo.removeChild(document.getElementById(entry.id));
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
    }
  };

  window.onload = function() {
    return todoList.init();
  };

}).call(this);
