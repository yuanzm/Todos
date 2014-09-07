todoList =
	index: window.localStorage.getItem "index"
	allTodo: document.getElementById "todo-list"
	todoCount: document.getElementById "todo-count"
	toggleAll: document.getElementById "toggle-all"
	_clear: document.getElementById "clear-completed"

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
	checkBox: ->
		todoInput = todoList.getElementsByClass "toggle"
		count = 0
		for _input in todoInput
			if not _input.checked
				count++
		todoList.todoCount.innerHTML = "<span>" + count + "</span>" + " item left"
		flag = if count == 0 then true else false
		todoList.toggleAll.checked = flag
		clearNum = todoInput.length - count
		todoList._clear.innerHTML = "Clear " + clearNum + " completed"

	#initialize the application
	init: ->
		todoList.initStorage()
		todoList.initList()
		todoList.checkBox()
		todoList.initForm()
	#bind events
	initForm: ->
		form = document.getElementsByTagName("form")[0]
		newTodo = document.getElementById "new-todo"
		form.addEventListener "submit", (event)->
			entry =
				id: todoList.index
				state: ""
				isCheck: false
				value: newTodo.value
			todoList.todoAdd entry
			todoList.storageAdd entry
			todoList.checkBox()
			this.reset()
			event.preventDefault()

		todoList.allTodo.addEventListener "click", (e)->
			target = e.target
			if target
				parId = target.parentNode.parentNode.getAttribute("id")
				entry = JSON.parse(window.localStorage.getItem("Todolist:"+ parId))
			if target && target.nodeName == "A"
				todoList.todoRemove(entry)
				todoList.storageRemove(entry)
				todoList.checkBox()
			if target && target.nodeName == "INPUT" && todoList.hasClass(target,"toggle")
				# if todoList.hasClass(target, "toggle")
				parent = target.parentNode.parentNode
				if target.checked 
					todoList.addClass(parent, "done")
					entry.state = "done"
					entry.isCheck = true
				else
					entry.state = ""
					entry.isCheck = false
					todoList.removeClass(parent, "done")
				todoList.storageEdit(entry)
				todoList.checkBox()
		allLi = document.getElementsByTagName("li")
		for li in allLi
			li.addEventListener "dblclick", (e)->
				parId = this.getAttribute("id")
				entry = JSON.parse(window.localStorage.getItem("Todolist:"+ parId))
				todoList.addClass(this,"editing")
				todoList.getElementsByClass("edit")[0].focus()
		todoList.toggleAll.addEventListener "click", ->
			todoInput = todoList.getElementsByClass "toggle"
			flag = if this.checked then true else false
			state = if this.checked then "done" else "" 
			for _input in todoInput
				parent = _input.parentNode.parentNode	
				_input.checked = flag
				if flag == true
					todoList.addClass(parent, "done")
				else
					todoList.removeClass(parent, "done")
			j = 0
			while j < window.localStorage.length
				key = window.localStorage.key(j)
				if /Todolist:\d+/.test(key)
					console.log key
					entry = JSON.parse(window.localStorage.getItem(key))
					entry.state = state
					entry.isCheck = flag
					todoList.storageEdit(entry)
				j++
			todoList.checkBox()

		document.onkeydown = (moz_ev)->
			if window.event
				ev = window.event
			else
				ev = moz_ev
			if ev != null && ev.keyCode == 13
				todoList.todoEdit(ev.target)
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
			todolist.sort (a, b)->
				return flag = if a.id < b.id then -1 else 1
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
		li.className = entry.state
		div.className = "view"
		input.setAttribute "type","checkbox"
		input.className = "toggle"
		input.checked = entry.isCheck
		label.appendChild(document.createTextNode(entry.value))
		a.className = "destroy"
		input2.className = "edit"
		input2.setAttribute "type","text"
		input2.setAttribute "value", entry.value

		div.appendChild(input)
		div.appendChild(label)
		div.appendChild(a)
		li.appendChild(div)
		li.appendChild(input2)
		todoList.allTodo.appendChild(li)
	#edit list of todo-list
	todoEdit: (target)->
		target.focus()
		parId = target.parentNode.getAttribute("id")
		entry = JSON.parse(window.localStorage.getItem("Todolist:"+ parId))
		entry.value = target.value
		todoList.storageEdit(entry)
		label = target.parentNode.getElementsByTagName("label")[0]
		label.innerHTML = target.value
		todoList.removeClass(target.parentNode,"editing")

	#remove list of todo-list
	todoRemove: (entry)->
		todoList.allTodo.removeChild(document.getElementById(entry.id))
	#offline storage the added list
	storageAdd: (entry)->
		window.localStorage.setItem "Todolist:" + entry.id, JSON.stringify(entry)
		window.localStorage.setItem "index", ++todoList.index
	#offline storage the edited list
	storageEdit: (entry)->
		window.localStorage.setItem("Todolist:"+ entry.id, JSON.stringify(entry));
	#offline storage the result of removed list
	storageRemove: (entry)->
		window.localStorage.removeItem("Todolist:"+ entry.id)
		window.localStorage.setItem "index", --todoList.index

window.onload = ->
	todoList.init()
