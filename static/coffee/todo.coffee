EventUtil =
    addHandler: (element, type, handler)->
        if element.addEventListener
            element.addEventListener(type,handler,false)
        if element.attachEvent
            element.attachEvent("on" + type,handler)
        else
            element["on" + type] = handler
    removeHandler: (element, type,handler) ->
        if element.removeEventListener
            element.removeEventListener(type,handler,false)
        if element.detachEvent
            element.detachEvent("on" + type,handler)
        else
            element["on" + type] = null
#extend the prototype of Date
#Author:  meizz
Date.prototype.Format = (fmt) ->
    o =
        "M+" : this.getMonth() + 1
        "d+" : this.getDate()
        "h+" : this.getHours()
        "m+" : this.getMinutes()
        "s+" : this.getSeconds()
        "q+" : Math.floor((this.getMonth() + 3) / 3)
        "S"  : this.getMilliseconds()
    if /(y+)/.test(fmt)
        fmt = fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length))
    for k of o
        if new RegExp("("+k+")").test(fmt)
            fmt = fmt.replace(RegExp.$1, flag = if RegExp.$1.length==1 then (o[k]) else (("00"+ o[k]).substr((""+ o[k]).length)))
    return fmt
todoList =
    index: window.localStorage.getItem "index"
    allTodo: document.getElementById "todo-list"
    todoCount: document.getElementById "todo-count"
    toggleAll: document.getElementById "toggle-all"
    _clear: document.getElementById "clear-completed"
    form: document.getElementsByTagName("form")[0]
    newTodo: document.getElementById "new-todo"
    hasClass: (ele, cls) ->
        reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
        className = if ele.getAttribute("class") then ele.className else ""
        return reg.test(className)
    addClass: (ele,cls) ->
        if not todoList.hasClass(ele, cls)
            ele.className += " " + cls
    removeClass: (ele,cls) ->
        if todoList.hasClass(ele, cls)
            reg = new RegExp('(\\s|^)'+cls+'(\\s|$)')
            ele.className = ele.className.replace(reg,' ')
    getElementsByClass: (cls)->
        el = []
        _el = document.getElementsByTagName "*"
        for els in _el
            if todoList.hasClass(els, cls)
                el.push els
        return el
    checkBox: ->
        todoInput = todoList.getElementsByClass "toggle"
        footer = document.getElementsByTagName("footer")[0]
        count = 0
        _result = []
        for _input in todoInput
            if not _input.checked
                count++
            else
                _result.push(_input)
        todoList.todoCount.innerHTML = "<span>" + count + "</span>" + " item left"
        flag = if count == 0 then true else false
        todoList.toggleAll.checked = if todoInput.length == 0 then false else flag
        footer.style.display = if todoInput.length > 0 then "block" else "none"
        clearNum = todoInput.length - count
        todoList._clear.innerHTML = "Clear " + clearNum + " completed"
        return _result
    #add list to todo-list
    todoAdd: (entry)->
        li = document.createElement "li"
        div = document.createElement "div"
        input = document.createElement "input"
        label = document.createElement "label"
        a = document.createElement "a"
        input2 = document.createElement "input"
        span = document.createElement "span"
        li.setAttribute "id", entry.id
        li.className = entry.state
        div.className = "view"
        input.setAttribute "type","checkbox"
        input.className = "toggle"
        input.checked = entry.isCheck
        label.appendChild(document.createTextNode(entry.value))
        span.className = "phone"
        span.appendChild(document.createTextNode(entry.time))
        a.className = "destroy"
        input2.className = "edit"
        input2.setAttribute "type","text"
        input2.setAttribute "value", entry.value
        div.appendChild(input)
        div.appendChild(label)
        div.appendChild(span)
        div.appendChild(a)
        li.appendChild(div)
        li.appendChild(input2)
        todoList.allTodo.appendChild(li)
    #edit list of todo-list
    todoEdit: (target)->
        parId = target.parentNode.getAttribute("id")
        entry = JSON.parse(window.localStorage.getItem("Todolist:"+ parId))
        entry.value = target.value
        entry.time = new Date().Format("yyyy-MM-dd hh:mm:ss")
        todoList.storageEdit(entry)
        label = target.parentNode.getElementsByTagName("label")[0]
        span = target.parentNode.getElementsByTagName("span")[0]
        label.innerHTML = target.value
        span.innerHTML = entry.time
        todoList.removeClass(target.parentNode,"editing")
    #remove list of todo-list
    todoRemove: (entry)->
        todoList.allTodo.removeChild(document.getElementById(entry.id))
    initStorage: ->
        if !todoList.index
            window.localStorage.setItem "index", 1
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
        #bind events
    bindEvent: ->
        todoList.form.addEventListener "submit", (event)->
            if todoList.newTodo.value != ""
                entry =
                    id: todoList.index
                    state: ""
                    isCheck: false
                    value: todoList.newTodo.value
                    time: new Date().Format("yyyy-MM-dd hh:mm:ss")
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
            if target && target.nodeName == "INPUT" && todoList.hasClass(target,"toggle")
                parent = target.parentNode.parentNode
                if target.checked
                    todoList.addClass(parent, "done")
                    entry.state = "done"
                    entry.isCheck = true
                else
                    todoList.removeClass(parent, "done")
                    entry.state = ""
                    entry.isCheck = false
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
                parId = _input.parentNode.parentNode.getAttribute("id")
                entry = JSON.parse(window.localStorage.getItem("Todolist:"+ parId))
                entry.state = state
                entry.isCheck = flag
                todoList.storageEdit(entry)
                if flag == true
                    todoList.addClass(parent, "done")
                else
                    todoList.removeClass(parent, "done")
            todoList.checkBox()
        document.onkeydown = (moz_ev)->
            if window.event
                ev = window.event
            else
                ev = moz_ev
            if ev != null && ev.keyCode == 13
                if todoList.hasClass(ev.target,"edit")
                    todoList.todoEdit(ev.target)
        todoList._clear.addEventListener "click", ->
            _result = todoList.checkBox()
            for _rel in _result
                parId = _rel.parentNode.parentNode.getAttribute("id")
                entry = JSON.parse(window.localStorage.getItem("Todolist:"+ parId))
                todoList.todoRemove(entry)
                todoList.storageRemove(entry)
                todoList.checkBox()
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
    #initialize the application
    init: ->
        todoList.initStorage()
        todoList.initList()
        todoList.checkBox()
        todoList.bindEvent()
EventUtil =
    addHandler: (element, type, handler)->
        if element.addEventListener
            element.addEventListener(type,handler,false)
        if element.attachEvent
            element.attachEvent("on" + type,handler)
        else
            element["on" + type] = handler
    removeHandler: (element, type,handler) ->
        if element.removeEventListener
            element.removeEventListener(type,handler,false)
        if element.detachEvent
            element.detachEvent("on" + type,handler)
        else
            element["on" + type] = null
window.onload = ->
    todoList.init()
