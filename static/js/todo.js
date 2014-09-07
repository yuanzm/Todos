(function() {
  var todoList;

  todoList = {
    index: window.localStorage.getItem("index"),
    allTodo: document.getElementById("todo-list"),
    todoCount: document.getElementById("todo-count"),
    toggleAll: document.getElementById("toggle-all"),
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
      var count, flag, todoInput, _i, _input, _len;
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
      return todoList.toggleAll.checked = flag;
    },
    init: function() {
      todoList.initStorage();
      todoList.initList();
      todoList.checkBox();
      return todoList.initForm();
    },
    initForm: function() {
      var form, newTodo;
      form = document.getElementsByTagName("form")[0];
      newTodo = document.getElementById("new-todo");
      form.addEventListener("submit", function(event) {
        var entry;
        entry = {
          id: todoList.index,
          state: true,
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
        if (target && target.nodeName === "A") {
          parId = target.parentNode.parentNode.getAttribute("id");
          entry = JSON.parse(window.localStorage.getItem("Todolist:" + parId));
          todoList.todoRemove(entry);
          todoList.storageRemove(entry);
          todoList.checkBox();
          todoList.checkIsAll();
        }
        if (target && target.nodeName === "INPUT") {
          parent = target.parentNode.parentNode;
          if (target.checked) {
            todoList.addClass(parent, "done");
          } else {
            todoList.removeClass(parent, "done");
          }
          todoList.checkBox();
          return todoList.checkIsAll();
        }
      });
      return todoList.toggleAll.addEventListener("click", function() {
        var flag, parent, todoInput, _i, _input, _len;
        todoInput = todoList.getElementsByClass("toggle");
        flag = this.checked ? true : false;
        for (_i = 0, _len = todoInput.length; _i < _len; _i++) {
          _input = todoInput[_i];
          parent = _input.parentNode.parentNode;
          _input.checked = flag;
          if (flag === true) {
            todoList.addClass(parent, "done");
          } else {
            todoList.removeClass(parent, "done");
          }
        }
        return todoList.checkBox();
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
      div.className = "view";
      input.setAttribute("type", "checkbox");
      input.className = "toggle";
      label.appendChild(document.createTextNode(entry.value));
      a.className = "destroy";
      input2.className = "edit";
      input2.setAttribute("value", entry.value);
      div.appendChild(input);
      div.appendChild(label);
      div.appendChild(a);
      li.appendChild(div);
      li.appendChild(input2);
      return todoList.allTodo.appendChild(li);
    },
    todoEdit: function() {},
    todoRemove: function(entry) {
      return todoList.allTodo.removeChild(document.getElementById(entry.id));
    },
    storageAdd: function(entry) {
      window.localStorage.setItem("Todolist:" + entry.id, JSON.stringify(entry));
      return window.localStorage.setItem("index", ++todoList.index);
    },
    storageEdit: function() {},
    storageRemove: function(entry) {
      window.localStorage.removeItem("Todolist:" + entry.id);
      return window.localStorage.setItem("index", --todoList.index);
    }
  };

  window.onload = function() {
    return todoList.init();
  };

}).call(this);
