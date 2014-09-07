todoList =
	index: window.localStorage.getItem "index"
	allTodo: document.getElementById "todo-list"
	todoCount: document.getElementById "todo-count"
	toggleAll: document.getElementById "toggle-all"

	hasClass: (ele, cls) ->
		reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
		return reg.test(ele.className)
	addClass: (ele,cls) ->
		if not todoList.hasClass(ele, cls)
			ele.className += " " + cls
	removeClass: (ele,cls) ->
		if todoList.hasClass(ele, cls)
			reg = new RegExp('(\\s|^)'+cls+'(\\s|$)')
			ele.className=ele.className.replace(reg,' ')
	getElementsByClass: (cls)->
		el = []
		_el = document.getElementsByTagName "*"
		for els in _el
			if todoList.hasClass(els, cls)
				el.push els
		return el
	checkNum: ->
		todoInput = todoList.getElementsByClass "toggle"
		count = 0
		for _input in todoInput
			if not _input.checked
				count++
		todoList.todoCount.innerHTML = "<span>" + count + "</span>" + " item left"
	#initialize the application
	init: ->
		todoList.initStorage()
		todoList.initList()
		todoList.checkNum()
		todoList.initForm()
	#bind events
	initForm: ->
		form = document.getElementsByTagName("form")[0]
		newTodo = document.getElementById "new-todo"
		todoInput = todoList.getElementsByClass "toggle"
		form.addEventListener "submit", (event)->
			entry =
				id: todoList.index
				state: true
				value: newTodo.value
			todoList.todoAdd entry
			todoList.storageAdd entry
			todoList.checkNum()
			this.reset()
			event.preventDefault()
		todoList.allTodo.addEventListener "click", (e)->
			target = e.target
			if target && target.nodeName == "A"
				parId = target.parentNode.parentNode.getAttribute("id")
				entry = JSON.parse(window.localStorage.getItem("Todolist:"+ parId))
				todoList.todoRemove(entry)
				todoList.storageRemove(entry)
			if target && target.nodeName == "INPUT"
				# if todoList.hasClass(target, "toggle")
				parent = target.parentNode.parentNode
				if target.checked 
					todoList.addClass(parent, "done")
				else
					todoList.removeClass(parent, "done")
				todoList.checkNum()
		todoList.toggleAll.addEventListener "click", ->
			flag = if this.checked then true else false 
			for _input in todoInput
				parent = _input.parentNode.parentNode	
				_input.checked = flag
				if flag == true
					todoList.addClass(parent, "done")
				else
					todoList.removeClass(parent, "done")
			todoList.checkNum()

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
		
window.onload = ->
	todoList.init()
