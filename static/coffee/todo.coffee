todoList =
	index: window.localStorage.getItem "index"
	#initialize the application
	init: ->
		todoList.initForm()
		todoList.initStorage()
	#bind events
	initForm: ->
		form = document.getElementsByTagName("form")[0]
		newTodo = document.getElementById "new-todo"
		form.addEventListener "submit", (event)->
			entry =
				state: true
				value: newTodo.value
			todoList.todoAdd entry
			# todoList.storageAdd entry
			this.reset()
			event.preventDefault()

	#initialize the todo-list when first load the page or refresh the page
	initList: ->
	initStorage: ->
		if !todoList.index
			alert 24234
			window.localStorage.setItem "index", 1
	#add list to todo-list
	todoAdd: (entry)->
		entry.id = todoList.index
		window.localStorage.setItem "Todolist:" + entry.id, JSON.stringify(entry)
		window.localStorage.setItem "index", ++todoList.index
	#edit list of todo-list
	todoEdit: ->
	#remove list of todo-list
	todoRemove: ->
	#offline storage the added list
	storageAdd: (entry)->
		
	#offline storage the edited list
	storageEdit: ->
	#offline storage the result of removed list
	storageRemove: ->

todoList.init()
