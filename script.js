var todoList = {
	todos: [],
	add: function(todoText){
		this.todos.push({
			todoText: todoText,
			completed: false
		}); 
		saveTodosToLocal();
	},
	edit: function(index, newText){
		this.todos[index].todoText = newText;
		saveTodosToLocal();
	},
	toggleCompleted: function(index){
		var todo = this.todos[index];
		todo.completed = !todo.completed;
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
		todoList.add(addTodoText.value);
		addTodoText.value = "";
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
		var todosUl = document.querySelector("ul");
		var checkbox = document.getElementsByClassName("checkboxInput");
		todosUl.innerHTML = "";

		todoList.todos.forEach(function(todo, position){
			var todoLi = document.createElement("li");
			var liClass = 'liClass';
			var isItChecked = false;

			if(todo.completed === true){
				liClass = 'liClassCompleted';
				isItChecked = true;
			}
			
			todoLi.id = position;
			todoLi.textContent =  todo.todoText;
			todoLi.className = liClass;
			todoLi.appendChild(this.createCheckbox(isItChecked));
			todoLi.appendChild(this.checkboxFA1());
			todoLi.appendChild(this.checkboxFA2());
			todoLi.appendChild(this.createDeleteButton());
			todoLi.appendChild(this.createEditButton());
			todosUl.appendChild(todoLi);
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
		var todosUl = document.querySelector('ul');

		todosUl.addEventListener("click", function(event){
			// Get the element that was clicked
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
				//todoLi.removeChild(editButton[parseInt(elementClicked.parentNode.id)]);
			}
			if(elementClicked.className === 'fas fa-check'){
				handlers.editTodo(parseInt(elementClicked.parentNode.id));
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

// get data from local storage
function getTodosFromLocal(){
	var str = localStorage.getItem("todos");
	todoList.todos = JSON.parse(str);
	if(!todoList.todos){
		todoList.todos = [];
	}
}

getTodosFromLocal();
view.displayTodos();