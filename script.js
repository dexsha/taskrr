var todoList = {
	todos: [],
	lists: [],
	addTodo: function(todoText){
		this.todos.push({
			todoText: todoText,
			completed: false
		}); 
		saveTodosToLocal();
	},
	addTodoToList: function(todoText, index){
		this.lists[index].todos.push({
			todoText: todoText,
			completed: false
		}); 
		saveListsToLocal();
	},
	addList: function(newList){
		this.lists.push({
			listname: newList,
			todos: []
		});
		saveListsToLocal();
	},
	edit: function(index, newText){
		this.todos[index].todoText = newText;
		saveTodosToLocal();
	},
	toggleCompleted: function(index){
		var todo = this.todos[index];
		todo.completed = !todo.completed;
		//todo.push(this.todos.splice(index, 1));
		saveTodosToLocal();
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
	remove: function(index){
		this.todos.splice(index, 1);
		saveTodosToLocal();
	}
};

var handlers = {
	toggleAll: function(){
		todoList.toggleAll();
		view.displayTodos();
	},
	addTodo: function(){
		var addTodoText = document.getElementById("addTodoText");
		if(addTodoText.value != ""){
			todoList.addTodo(addTodoText.value);
			addTodoText.value = "";
			addTodoText.focus();
		}
		view.displayTodos();
	},
	editTodo: function(position){
		var editTextInput = document.getElementsByClassName('editTextInput')[0];
		todoList.edit(position, editTextInput.value);
		view.displayTodos();
	},
	removeTodo: function(position){
		todoList.remove(position);
		view.displayTodos();
	},
	toggleTodo: function(position){
		todoList.toggleCompleted(position);
		view.displayTodos();
	}
};

var view = {
	displayTodos: function(){
		var todosUl = document.getElementById("notcompleted");
		var todosUlCompleted = document.getElementById("completed");
		var checkbox = document.getElementsByClassName("checkboxInput");
		todosUl.innerHTML = "";
		todosUlCompleted.innerHTML = "";
		console.log(todoList.todos);

		todoList.todos.forEach(function(todo, position){
			var todoLi = document.createElement("li");
			var liClass = 'liClass';
			var isItChecked = false;


			if(todo.completed){
					liClass = 'liClassCompleted';
					isItChecked = true;
			}

			// if(todo.todoText.length > 40){	
			// 	if(todo.completed){
			// 		liClass = 'liClassCompletedLongText';
			// 		isItChecked = true;

			// 	}
			// 	else{
			// 		liClass = 'liClassLongText'
			// 	}
			// }
			// else if(todo.completed){
			// 		liClass = 'liClassCompleted';
			// 		isItChecked = true;
			// }
			
			todoLi.id = position;
			todoLi.textContent =  todo.todoText;
			todoLi.className = liClass;
			todoLi.appendChild(this.createCheckbox(isItChecked));
			todoLi.appendChild(this.checkboxFA1());
			todoLi.appendChild(this.checkboxFA2());
			todoLi.appendChild(this.createDeleteButton());
			todoLi.appendChild(this.createEditButton());
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
		getTodosFromLocal();
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
	createEditTextInput: function(position){
		var editTextInput = document.createElement('input');
		editTextInput.type = 'text';
		editTextInput.className = 'editTextInput';
		editTextInput.value = todoList.todos[position].todoText;
		
		return editTextInput;
	},
	createConfirmEditButton: function(position){
		var confirmEditButton = document.createElement('i');
		confirmEditButton.className = 'fas fa-check';
		return confirmEditButton;
	},
	setUpEventListeners: function(){
		var todosUl = document.getElementsByClassName('todoUl');
		var input = document.getElementById('addTodoText');

		function todoUl(){
			var elementClicked = event.target;

			// Check if elementClicked is a delete button
			if(elementClicked.className === 'fas fa-times'){
				handlers.removeTodo(parseInt(elementClicked.parentNode.id));
			}
			if(elementClicked.className === 'checkboxInput'){
				handlers.toggleTodo(parseInt(elementClicked.parentNode.id));
			}
			if(elementClicked.className === 'far fa-edit'){
				view.displayTodos();
				var todoLi = document.getElementById(elementClicked.parentNode.id)
				todoLi.textContent = "";
				var editButton = document.getElementsByClassName('editButton');
				todoLi.appendChild(view.createEditTextInput(parseInt(elementClicked.parentNode.id)));
				todoLi.appendChild(view.createConfirmEditButton(parseInt(elementClicked.parentNode.id)));
				var editTextInput = document.getElementsByClassName('editTextInput')[0];
				editTextInput.addEventListener("keydown", function(event){
					if(event.keyCode === 13){
						handlers.editTodo(parseInt(elementClicked.parentNode.id));
						console.log("test");
					}
				});
				editTextInput.focus();
				//todoLi.removeChild(editButton[parseInt(elementClicked.parentNode.id)]);
			}
			if(elementClicked.className === 'fas fa-check'){
				handlers.editTodo(parseInt(elementClicked.parentNode.id));
			}
		}

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

		
	}
};

view.setUpEventListeners();


// localStorage

// save data to local storage
function saveTodosToLocal(){
	var str = JSON.stringify(todoList.todos);
	localStorage.setItem("todos", str);
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

getTodosFromLocal();
getListsFromLocal();
view.displayTodos();