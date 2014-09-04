(function() {
  var todoList;

  todoList = {
    init: function() {
      return todoList.initForm();
    },
    initForm: function() {
      var form, newTodo;
      form = document.getElementsByTagName("form")[0];
      newTodo = document.getElementById("new-todo");
      return form.addEventListener("submit", function(event) {
        var entry;
        entry = {
          state: true,
          value: newTodo.value
        };
        todoList.todoAdd(entry);
        todoList.storageAdd(entry);
        this.reset();
        return event.preventDefault();
      });
    },
    initList: function() {},
    todoAdd: function(entry) {},
    todoEdit: function() {},
    todoRemove: function() {},
    storageAdd: function(entry) {},
    storageEdit: function() {},
    storageRemove: function() {}
  };

  todoList.init();

}).call(this);
