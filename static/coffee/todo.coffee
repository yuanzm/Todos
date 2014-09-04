#整个页面涉及到的交互如下：
#1. 在输入框输入内容之后，按回车键下面的todo-list增加一条，同时离线存储到浏览器
#2. 点击mark all as complete的单选框，下面的todo-list全部选中
#	同时下面的条目统计变化
#	同时离线存储到本地浏览器
#3. 鼠标悬浮在下面的todo-list上面，出现右边的删除按钮
#4 .点击todo-list对应的单选框，对应的todo-list增加横线穿过该lisi
#	还需要判断是不是全部完成了
#	同时下面的条目统计变化
#	同时离线存储到本地浏览器
#5. 点击todo-list的删除按钮，删除当前list，并且离线存储到本地
#	同时下面的条目统计变化

todoList =
	#initialize the application
	init: ->
	#bind events
	initForm: ->
	#initialize the todo-list when first load the page or refresh the page
	initList: ->
	#add list to todo-list
	todoAdd: ->
	#edit list of todo-list
	todoEdit: ->
	#remove list of todo-list
	todoRemove: ->
	#offline storage the added list
	storageAdd: ->
	#offline storage the edited list
	storageEdit: ->
	#offline storage the result of removed list
	storageRemove: ->


