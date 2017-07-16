

var elements = {
	getUserButton: document.querySelector('#get-user'),
	deleteUserButton: document.querySelector('#delete-user'),
	getUsersButton: document.querySelector('#get-users'),
	userIdInput: document.querySelector('#user-id'),
	usersContainer: document.querySelector('#users-container'),
    addUserButton: document.querySelector('#add-user'),
    newUserNameInput: document.querySelector('#new-name'),
    newUserEmailInput: document.querySelector('#new-email')
};

(function(){
	bindListeners();
})();

var currentUsers = [];

function bindListeners(){
	elements.getUsersButton.addEventListener('click', function(event){
		getUsers(null, function(err, users){
			renderUsers(users);
		});
	});

	elements.getUserButton.addEventListener('click', function(event){
		var userId = Number(elements.userIdInput.value);
		if (!isNaN(userId)){
			getUsers(userId, function(err, users){
				renderUsers(users);
			});
		}
	});

	elements.deleteUserButton.addEventListener('click', function(event){
		var userId = Number(elements.userIdInput.value);
		if (!isNaN(userId)){
			deleteUser(userId, function(isSuccess){
				if (isSuccess){
					renderUsers
				}
			});
		}
	});

    elements.addUserButton.addEventListener('click', function(event){
        var userName = String(elements.newUserNameInput.value);
        var userEmail = String(elements.newUserEmailInput.value);

        var newUser = {};
        newUser.id = 99;
        newUser.name = userName;
        newUser.email = userEmail;

        addUser(newUser, function(isSuccess){
            if (isSuccess){
                console.log('USER WAS ADDED!!!');
            }
        });


    });
}

function renderUsers(users){
	if (!users){
		users = currentUsers;
	}
	elements.usersContainer.innerHTML = '';

	for (var i = 0; i < users.length; i++){
		var user = users[i];
		var userContainer = document.createElement('div');
		userContainer.className = 'user-container';

		var userId = document.createElement('div');
		userId.innerText = user.id;
		userContainer.appendChild(userId);

		var userName = document.createElement('div');
		userName.innerText = user.name;
		userName.className = 'user-name';
		userContainer.appendChild(userName);

		var userEmail = document.createElement('div');
		userEmail.innerText = user.email;
		userContainer.appendChild(userEmail);

		elements.usersContainer.appendChild(userContainer);
	}
}

function deleteUser(id, callback){
	var connection = new XMLHttpRequest();
	connection.addEventListener('load', reqListener);
	connection.open('DELETE', '/api/user/' + id);
	connection.send();

	function reqListener(event){
		callback(this.status === 200);		
	}
}

function getUsers(id, callback){
	var idString = '';
	var isOneUser = false;
	if (id !== null){
		idString = '/' + id;
		isOneUser = true;
	}
	var connection = new XMLHttpRequest();
	connection.addEventListener('load', reqListener);
	connection.open('GET', '/api/user' + idString);
	connection.send();

	function reqListener(event){
		try {
			var resp = JSON.parse(this.responseText);
			if (isOneUser){
				resp = [resp];
			} else {
				currentUsers = resp;
			}
		} catch(e){
			return callback(new Error('error parsing response'));
		}
		callback(null, resp);
	}
}

function addUser(user, callback) {

    var params = JSON.stringify(user);
    var connection = new XMLHttpRequest();
    //connection.addEventListener('load', reqListener);

    connection.onreadystatechange = function() {
        if (connection.readyState != 4) return;
        if (connection.status != 200) {
            alert(connection.status + ': ' + connection.statusText);
        } else {
            alert(connection.responseText);
            reqListener(this);
        }

    }

    connection.open('POST', '/api/user', '');
    connection.setRequestHeader("Content-Type", "application/json");
    connection.send(params);

    function reqListener(self){
        callback(self.status === 200);
    }
}