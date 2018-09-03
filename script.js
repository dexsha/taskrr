var listIndex = 0;

var priorityCheckbox = false;

var todoList = {
	todos: [],
	lists: [],
	addTodoToList: function(todoText, tagName, index){
		this.lists[index].todos.push({
			todoText: todoText,
			completed: false,
			tag: tagName
		}); 
		saveListsToLocal();
	},
	addList: function(newList){
		this.lists.push({
			listName: newList,
			todos: []
		});
		saveListsToLocal();
	},
	editTodo: function(index, newText){
		this.lists[listIndex].todos[index].todoText = newText;
		saveListsToLocal();
	},
	editList: function(index, newText){
		this.lists[listIndex].listName = newText;
		saveListsToLocal();
	},
	toggleCompleted: function(index){
		var todo = this.lists[listIndex].todos[index];
		todo.completed = !todo.completed;
		//todo.push(this.todos.splice(index, 1));
		saveListsToLocal();
	},
	toggleAll: function(){
		var totalTodos = this.todos.length;
		var completedTodos = 0;

		this.todos.forEach(function(todo){ 			// check how many are completed
			if(todo.completed === true){
				completedTodos++;
			}
		});

		this.todos.forEach(function(todo){
			if(completedTodos === totalTodos){  // check if all are completed and set them to not completed
				todo.completed = false;  
			}
			else{								// otherwise set all to completed
				todo.completed = true;
			}
		});
		saveTodosToLocal();
	},
	removeTodo: function(index){
		this.lists[listIndex].todos.splice(index, 1);
		saveListsToLocal();
	},
	removeList: function(index){
		this.lists.splice(index, 1);
		saveListsToLocal();
	}
};

var handlers = {
	toggleAll: function(){
		todoList.toggleAll();
		view.displayTodos();
	},
	addTodo: function(index = listIndex){

		var addTodoText = document.getElementById("addTodoText");
		var priority = document.getElementById('priority');
		if(addTodoText.value != ""){
			if(todoList.lists.length === 0){
				todoList.addList("New list");
				todoList.addTodoToList(addTodoText.value, priority.options[priority.selectedIndex].value, 0);
				if(priorityCheckbox == true) {
					handlers.sortByPriority();
				}
				addTodoText.value = "";
				addTodoText.focus();
				view.displayLists();
			}
			else{
				todoList.addTodoToList(addTodoText.value, priority.options[priority.selectedIndex].value, index);
				if(priorityCheckbox == true) {
					handlers.sortByPriority();
				}
				addTodoText.value = "";
				addTodoText.focus();
			}
		}
		view.displayTodos();
	},
	addList: function(){
		var addListText = document.getElementById("addListText");
		if(addListText.value != ""){
			todoList.addList(addListText.value);
			addListText.value = "";
			addListText.focus();
		}
		view.displayLists();
	},
	editTodo: function(position){
		var editTextInput = document.getElementsByClassName('editTextInput')[0];
		todoList.editTodo(position, editTextInput.value);
		view.displayTodos();
	},
	editList: function(position){
		var editTextInput = document.getElementsByClassName('editTextInput')[0];
		todoList.editList(position, editTextInput.value);
		view.displayLists();
	},
	removeTodo: function(position){
		todoList.removeTodo(position);
		view.displayTodos();
	},
	toggleTodo: function(position){
		todoList.toggleCompleted(position);
		view.displayTodos();
	},
	removeList: function(position){
		todoList.removeList(position);
		view.displayLists();
	},
	sortByPriority: function() {
	todoList.lists[listIndex].todos.sort(function(a,b){return b.tag - a.tag});
	saveListsToLocal();
	view.displayTodos();
	}
};

var view = {
	displayTodos: function(index = listIndex){
		var todosUl = document.getElementById("notcompleted");
		var todosUlCompleted = document.getElementById("completed");
		var checkbox = document.getElementsByClassName("checkboxInput");
		todosUl.innerHTML = "";
		todosUlCompleted.innerHTML = "";
		// console.log(todoList.todos);
		
		var noTasks = document.createElement("p");
		noTasks.className = "noTasks";
		noTasks.textContent = "No tasks. Would you like to add one?";

		
		if(todoList.lists.length === 0){
			todosUl.appendChild(noTasks);
		}
		else if(todoList.lists[index].todos.length === 0){
					todosUl.appendChild(noTasks);
		}
		else{
			todoList.lists[index].todos.forEach(function(todo, position){
				var todoLi = document.createElement("li");
				var todoText = document.createElement("p");
				todoText.className = "todoText";
				todoText.textContent = todo.todoText;

				var liClass = 'liClass';
				var isItChecked = false;	

				if(todo.completed){
						liClass = 'liClassCompleted';
						isItChecked = true;
				}

				todoLi.id = position;
				// todoLi.textContent =  todo.todoText;
				todoLi.className = liClass;

				if(todo.tag === '3'){
					todoLi.classList.toggle('highPriority');
				} else if(todo.tag === '2'){
					todoLi.classList.toggle('mediumPriority');
				} else if(todo.tag === '1'){
					todoLi.classList.toggle('lowPriority');
				} else if(todo.tag === '0'){
					todoLi.classList.toggle('noPriority');
				}

				todoLi.appendChild(this.createCheckbox(isItChecked));
				todoLi.appendChild(this.checkboxFA1());
				todoLi.appendChild(this.checkboxFA2());
				todoLi.appendChild(this.createDeleteButton());
				todoLi.appendChild(this.createEditButton());
				todoLi.appendChild(todoText);
				todosUl.appendChild(todoLi)

				// Sort completed
				// if(!todo.completed){
				// 	todosUl.appendChild(todoLi);
				// }
				// else{
				// 	//todosUlCompleted.insertBefore(todoLi, todosUl.childNodes[0]);
				// 	todosUlCompleted.appendChild(todoLi);
				// }
			}, this);
		}
		
		getTodosFromLocal();
	},
	displayLists: function(){
		var listsUl = document.getElementsByClassName("listsUl")[0];
		listsUl.innerHTML = "";

		todoList.lists.forEach(function(list, position){
			var todoLi = document.createElement("li");
			var liClass = 'listsLiClass';

			todoLi.id = String("l" + position);
			todoLi.textContent = list.listName;
			todoLi.className = liClass;


			todoLi.appendChild(this.createDeleteButton());
			todoLi.appendChild(this.createEditButton());
			listsUl.appendChild(todoLi);
		}, this);

		if(todoList.lists.length === 0){

		}
		else{
			var listsLiClass = document.getElementsByClassName('listsLiClass');
			listsLiClass[listIndex].className  += " active";
		}
		getListsFromLocal();
	},
	createCheckbox: function(isItChecked){
		var checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.className = 'checkboxInput';
		checkbox.checked = isItChecked;		
		return checkbox;
	},
	checkboxFA1: function(){
		var checkboxFA1 = document.createElement('i');
		checkboxFA1.className = 'far fa-circle';
		return checkboxFA1;
	},
	checkboxFA2: function(){
		var checkboxFA2 = document.createElement('i');
		checkboxFA2.className = 'far fa-check-circle';
		return checkboxFA2;
	},
	createDeleteButton: function(){
		var deleteButton = document.createElement('i');
		deleteButton.className = 'fas fa-times';
		return deleteButton;
	},
	createEditButton: function(){
		var editButton = document.createElement('i');
		editButton.className = 'far fa-edit';
		return editButton;
	},
	createEditTextInputTodo: function(position){
		var editTextInput = document.createElement('textarea');
		editTextInput.className = 'editTextInput';
		editTextInput.setAttribute("spellcheck", "false");
		editTextInput.value = todoList.lists[listIndex].todos[position].todoText;
	  	setTimeout(function(){
	    editTextInput.style.cssText = 'height:auto; padding:0';
	    editTextInput.style.cssText = 'height:' + editTextInput.scrollHeight + 'px';

	  },0);
		return editTextInput;
	},
	createEditTextInputList: function(position){
		var editTextInput = document.createElement('input');
		editTextInput.type = 'text';
		editTextInput.className = 'editTextInput';
		return editTextInput;
	},
	createConfirmEditButton: function(position){
		var confirmEditButton = document.createElement('i');
		confirmEditButton.className = 'fas fa-check';
		return confirmEditButton;
	},
	setUpEventListeners: function(){
		var todosUl = document.getElementsByClassName('todoUl');
		var listsUl = document.getElementsByClassName('listsUl');
		var input = document.getElementById('addTodoText');
		var inputAddList = document.getElementById('addListText');
		var sortByPriority = document.getElementById('sort');
		var priorityCheckboxElement = document.getElementById('priorityCheckbox');

		priorityCheckboxElement.addEventListener('click', function() {
			if(priorityCheckboxElement.checked) {
				priorityCheckbox = true;
				handlers.sortByPriority();
				savePriorityCheckbox();
			} else {
				priorityCheckbox = false;
				savePriorityCheckbox();
			}
		})

		function autosize(){
		  var el = this;
		  setTimeout(function(){
		    el.style.cssText = 'height:auto; padding:0';
		    // for box-sizing other than "content-box" use:
		    // el.style.cssText = '-moz-box-sizing:content-box';
		    el.style.cssText = 'height:' + el.scrollHeight + 'px';
		  },0);
		}
		
		function todoUl(){
			var elementClicked = event.target;
			
			if(elementClicked.className === 'noTasks'){
				input.focus();
			}
			if(elementClicked.className === 'fas fa-times'){
				handlers.removeTodo(parseInt(elementClicked.parentNode.id));
			}
			if(elementClicked.className === 'checkboxInput'){
				handlers.toggleTodo(parseInt(elementClicked.parentNode.id));
			}
			if(elementClicked.className === 'far fa-edit'){

				console.log(event);
				view.displayLists();
				view.displayTodos();
				var todoLi = document.getElementById(elementClicked.parentNode.id);
				todoLi.textContent = "";
				todoLi.appendChild(view.createEditTextInputTodo(parseInt(elementClicked.parentNode.id)));
				todoLi.appendChild(view.createConfirmEditButton(parseInt(elementClicked.parentNode.id)));
				var editTextInput = document.getElementsByClassName('editTextInput')[0];
				editTextInput.addEventListener("keydown", function(event){
					if(event.keyCode === 13){
						handlers.editTodo(parseInt(elementClicked.parentNode.id));
					}
				});
				var editTextInputVar = document.querySelector('textarea');
				editTextInputVar.addEventListener('input', autosize);
				editTextInput.focus();
			}
			if(elementClicked.className === 'fas fa-check'){
				handlers.editTodo(parseInt(elementClicked.parentNode.id));
			}
			if(elementClicked.className === 'liClass'){
				view.displayTodos();
				view.displayLists();
				var todoLi = document.getElementById(elementClicked.id);
				todoLi.textContent = "";
				todoLi.appendChild(view.createEditTextInputTodo(parseInt(elementClicked.id)));
				todoLi.appendChild(view.createConfirmEditButton(parseInt(elementClicked.id)));
				var editTextInput = document.getElementsByClassName('editTextInput')[0];
				editTextInput.addEventListener("keydown", function(event){
					if(event.keyCode === 13){
						handlers.editTodo(parseInt(elementClicked.id));
					}
				});
				editTextInput.focus();
			}
		}

		function listUl(){
			var elementClicked = event.target;
			console.log(event);

			if(elementClicked.className === 'listsLiClass'){
				
				var theId = elementClicked.id.replace( /^\D+/g, '');
				view.displayTodos(parseInt(theId));
				listIndex = parseInt(theId);
				

				if(todoList.lists.length === 0){

				}
				else{
					var listsLiClass = document.getElementsByClassName('listsLiClass');

					listsLiClass[listIndex].className  += " active";
					
					// elementClicked.className += " active";

					// var current = document.getElementsByClassName(" active");

					for(var i = 0; i<listsLiClass.length; i++)
					{
						listsLiClass[i].className = listsLiClass[i].className.replace(" active", "");
					}

					listsLiClass[listIndex].className  += " active";
				}

				

				// var current = document.getElementsByClassName("active");
				// current[listIndex].className = current[0].className.replace(" active", "");
				// elementClicked.className += " active";
				
								
				saveListIndex();
			}

			if(elementClicked.className === 'fas fa-times'){
				var theId = elementClicked.parentNode.id.replace( /^\D+/g, '');
				handlers.removeList(parseInt(theId));
				listIndex = 0;
				view.displayTodos();
			}
			if(elementClicked.className === 'far fa-edit'){
				view.displayTodos();
				view.displayLists();
				var listsLi = document.getElementById(elementClicked.parentNode.id);
				var theId = elementClicked.parentNode.id.replace( /^\D+/g, '');
				listsLi.textContent = "";
				listsLi.appendChild(view.createEditTextInputList(parseInt(elementClicked.parentNode.id)));
				listsLi.appendChild(view.createConfirmEditButton(parseInt(elementClicked.parentNode.id)));
				var editTextInput = document.getElementsByClassName('editTextInput')[0];
				editTextInput.value = todoList.lists[parseInt(theId)].listName;
				editTextInput.addEventListener("keydown", function(event){
					if(event.keyCode === 13){
						handlers.editList(parseInt(elementClicked.parentNode.id));
						console.log("test");
					}
				});
				editTextInput.focus();
				//todoLi.removeChild(editButton[parseInt(elementClicked.parentNode.id)]);
			}
			if(elementClicked.className === 'fas fa-check'){
				handlers.editList(parseInt(elementClicked.parentNode.id));
			}
			// if(elementClicked.className === 'listsLiClass'){
				
			// 	view.displayLists();
			// 	var listsLi = document.getElementById(elementClicked.id);
			// 	var theId = elementClicked.id.replace( /^\D+/g, '');
			// 	listsLi.textContent = "";
			// 	listsLi.appendChild(view.createEditTextInputList(parseInt(elementClicked.id)));
			// 	listsLi.appendChild(view.createConfirmEditButton(parseInt(elementClicked.id)));
			// 	var editTextInput = document.getElementsByClassName('editTextInput')[0];
			// 	editTextInput.value = todoList.lists[parseInt(theId)].listName;
			// 	editTextInput.addEventListener("keydown", function(event){
			// 		if(event.keyCode === 13){
			// 			handlers.editList(parseInt(elementClicked.id));
			// 			console.log("test");
			// 		}
			// 	});
			// 	editTextInput.focus();
			// }

		}

		listsUl[0].addEventListener("click", function(event){
			listUl();
		});

		todosUl[0].addEventListener("click", function(event){
			// Get the element that was clicked
			todoUl();
			
		});	

		todosUl[1].addEventListener("click", function(event){
			// Get the element that was clicked
			todoUl();
			
		});	
		
		input.addEventListener("keydown", function(event){
			if(event.keyCode === 13){
				handlers.addTodo();
			}
		});

		inputAddList.addEventListener("keydown", function(event){
			if(event.keyCode === 13){
				handlers.addList();
			}
		});



		
	}
};

view.setUpEventListeners();

// save data to local storage
function saveTodosToLocal(){
	var str = JSON.stringify(todoList.todos);
	localStorage.setItem("todos", str);
}

function saveListIndex(){
	var str = JSON.stringify(listIndex);
	localStorage.setItem("listIndex", str);
}

function savePriorityCheckbox(){
	var str = JSON.stringify(priorityCheckbox);
	localStorage.setItem("priorityCheckbox", str);
}

function saveListsToLocal(){
	var str = JSON.stringify(todoList.lists);
	localStorage.setItem("lists", str);
}

// get data from local storage
function getTodosFromLocal(){
	var str = localStorage.getItem("todos");
	todoList.todos = JSON.parse(str);
	if(!todoList.todos){
		todoList.todos = [];
	}
}

function getListsFromLocal(){
	var str = localStorage.getItem("lists");
	todoList.lists = JSON.parse(str);
	if(!todoList.lists){
		todoList.lists = [];
	}
}

function getListIndex(){
	var str = localStorage.getItem("listIndex");
	listIndex = JSON.parse(str);
	if(!listIndex){
		listIndex = 0;
	}
}

function getPriorityCheckbox(){
	var str = localStorage.getItem("priorityCheckbox");
	priorityCheckbox = JSON.parse(str);
}

getTodosFromLocal();
getListsFromLocal();
getListIndex();
getPriorityCheckbox();
view.displayTodos();
view.displayLists();