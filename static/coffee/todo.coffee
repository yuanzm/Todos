todoList =
	#initialize the application
	init: ->
		todoList.initForm()
	#bind events
	initForm: ->
		form = document.getElementsByTagName("form")[0]
		newTodo = document.getElementById "new-todo"
		form.addEventListener "submit", (event)->
			entry =
				# id: 
				state: true
				value: newTodo.value
			todoList.todoAdd entry
			todoList.storageAdd entry
			this.reset()
			event.preventDefault()

	#initialize the todo-list when first load the page or refresh the page
	initList: ->
	#add list to todo-list
	todoAdd: (entry)->
		# window.localStorage.setItem "todoList:"
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
