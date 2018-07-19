var todoList = {
	todos: [],
	add: function(todoText){
		this.todos.push({
			todoText: todoText,
			completed: false
		}); 
	},
	edit: function(index, newText){
		this.todos[index].todoText = newText;
	},
	toggleCompleted: function(index){
		var todo = this.todos[index];
		todo.completed = !todo.completed;
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
	},
	remove: function(index){
		this.todos.splice(index, 1);
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
	editTodo: function(){
		var editPosition = document.getElementById("editPosition");
		var editTodoText = document.getElementById("editTodoText");
		todoList.edit(editPosition.valueAsNumber, editTodoText.value);
		editPosition.value = "";
		editTodoText.value = "";
		view.displayTodos();
	},
	removeTodo: function(position){
		todoList.remove(position);
		view.displayTodos();
	},
	toggleTodo: function(){
		var togglePosition = document.getElementById("togglePosition");
		todoList.toggleCompleted(togglePosition.valueAsNumber);
		togglePosition.value = "";
		view.displayTodos();
	},
};

var view = {
	displayTodos: function(){
		var todosUl = document.querySelector("ul");
		todosUl.innerHTML = "";

		todoList.todos.forEach(function(todo, position){
			var todoLi = document.createElement("li");
			var todoTextWithCompletion = '';

			if(todo.completed === true){
				todoTextWithCompletion = '(x) ' + todo.todoText;
			}
			else{
				todoTextWithCompletion = '( ) ' + todo.todoText;
			}

			todoLi.id = position;
			todoLi.textContent = todoTextWithCompletion;
			todoLi.className = 'liClass';
			todoLi.appendChild(this.createDeleteButton());
			todosUl.appendChild(todoLi);
		}, this);
	},
	createDeleteButton: function(){
		var deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.className = 'deleteButton';
		return deleteButton;
	},
	setUpEventListeners: function(){
		var todosUl = document.querySelector('ul');

		todosUl.addEventListener("click", function(event){
			// Get the element that was clicked
			var elementClicked = event.target;

			// Check if elementClicked is a delete button
			if(elementClicked.className === 'deleteButton'){
				handlers.removeTodo(parseInt(elementClicked.parentNode.id));
			}
		});	
	}
};

view.setUpEventListeners();

// function runWithDebugger(ourFunction){
// 	debugger;
// 	ourFunction();
// };
