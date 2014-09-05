todoList =
	index: window.localStorage.getItem "index"
	allTodo: document.getElementById "todo-list"
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
			todoList.storageAdd entry
			this.reset()
			event.preventDefault()

	#initialize the todo-list when first load the page or refresh the page
	initList: ->
	initStorage: ->
		if !todoList.index
			window.localStorage.setItem "index", 1
	#add list to todo-list
	todoAdd: (entry)->
		li = document.createElement "li"
		div = document.createElement "div"
		input = document.createElement "input"
		label = document.createElement "label"
		a = document.createElement "a"
		input2 = document.createElement "input"

		div.className = "view"
		input.setAttribute "type","checkbox"
		input.className = "toggle"
		label.appendChild(document.createTextNode(entry.value))
		a.className = "destroy"
		input2.className = "edit"
		input2.setAttribute "value", entry.value

		div.appendChild(input)
		div.appendChild(label)
		div.appendChild(a)
		li.appendChild(div)
		li.appendChild(input2)
		todoList.allTodo.appendChild(li)
	#edit list of todo-list
	todoEdit: ->
	#remove list of todo-list
	todoRemove: ->
	#offline storage the added list
	storageAdd: (entry)->
		entry.id = todoList.index
		window.localStorage.setItem "Todolist:" + entry.id, JSON.stringify(entry)
		window.localStorage.setItem "index", ++todoList.index
		console.log window.localStorage
	#offline storage the edited list
	storageEdit: ->
	#offline storage the result of removed list
	storageRemove: ->

todoList.init()
