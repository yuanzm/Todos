todoList =
	index: window.localStorage.getItem "index"
	allTodo: document.getElementById "todo-list"
	#initialize the application
	init: ->
		todoList.initStorage()
		todoList.initList()
		todoList.initForm()
	#bind events
	initForm: ->
		form = document.getElementsByTagName("form")[0]
		newTodo = document.getElementById "new-todo"
		lists = todoList.allTodo.getElementsByTagName "a"
		form.addEventListener "submit", (event)->
			entry =
				id: todoList.index
				state: true
				value: newTodo.value
			todoList.todoAdd entry
			todoList.storageAdd entry
			this.reset()
			event.preventDefault()
		for list in lists
			list.addEventListener "click", ->
				parId = this.parentNode.parentNode.getAttribute("id")
				entry = JSON.parse(window.localStorage.getItem("Todolist:"+ parId))
				todoList.todoRemove(entry)
				todoList.storageRemove(entry)

	#initialize the todo-list when first load the page or refresh the page
	initList: ->
		if window.localStorage.length-1
			todolist = []
			i = 0
			while i < window.localStorage.length
				key = window.localStorage.key(i) 
				if /Todolist:\d+/.test(key)
					todolist.push(JSON.parse(window.localStorage.getItem(key)))
				i++
			if todolist.length
				for key in todolist
					todoList.todoAdd key
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

		li.setAttribute "id", entry.id
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
	todoRemove: (entry)->
		todoList.allTodo.removeChild(document.getElementById(entry.id))
	#offline storage the added list
	storageAdd: (entry)->
		window.localStorage.setItem "Todolist:" + entry.id, JSON.stringify(entry)
		window.localStorage.setItem "index", ++todoList.index
	#offline storage the edited list
	storageEdit: ->
	#offline storage the result of removed list
	storageRemove: (entry)->
		window.localStorage.removeItem("Todolist:"+ entry.id)
		window.localStorage.setItem "index", --todoList.index
todoList.init()
