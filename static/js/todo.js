(function() {
  var todoList;

  todoList = {
    index: window.localStorage.getItem("index"),
    allTodo: document.getElementById("todo-list"),
    init: function() {
      todoList.initStorage();
      todoList.initList();
      return todoList.initForm();
    },
    initForm: function() {
      var form, list, lists, newTodo, _i, _len, _results;
      form = document.getElementsByTagName("form")[0];
      newTodo = document.getElementById("new-todo");
      lists = todoList.allTodo.getElementsByTagName("a");
      form.addEventListener("submit", function(event) {
        var entry;
        entry = {
          id: todoList.index,
          state: true,
          value: newTodo.value
        };
        todoList.todoAdd(entry);
        todoList.storageAdd(entry);
        this.reset();
        return event.preventDefault();
      });
      _results = [];
      for (_i = 0, _len = lists.length; _i < _len; _i++) {
        list = lists[_i];
        _results.push(list.addEventListener("click", function() {
          var entry, parId;
          parId = this.parentNode.parentNode.getAttribute("id");
          entry = JSON.parse(window.localStorage.getItem("Todolist:" + parId));
          todoList.todoRemove(entry);
          return todoList.storageRemove(entry);
        }));
      }
      return _results;
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

  todoList.init();

}).call(this);
