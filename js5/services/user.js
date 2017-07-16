const users = [{
	id: 1,
	name: 'Nikolas',
	email: 'nikolas@gmail.com'
},{
	id: 2,
	name: 'Eduard',
	email: 'eduard@gmail.com'
},{
	id: 3,
	name: 'Bohdan',
	email: 'bohdan@gmail.com'
},{
	id: 4,
	name: 'Dima',
	email: 'dima@gmail.com'
}];

function findUser(id){
	const err = null;
	if (typeof id === 'undefined'){
		err = new Error('id is undefined');
	}

	let index;
	const user = users.find((el, ind) => {
		if (el.id === id){
			index = ind;
			return true;
		} else {
			return false;
		}
	});
	return {user, index, err};
}

module.exports = {
	findAll: (callback) => {
        console.log('2:findAll export');
		callback(null, users);
	},

	findOne: (id, callback) => {
		const {err, user} = findUser(id);
        console.log(user);
		callback(err, user);
	},

	add: (user, callback) => {
        console.log(user);
		if (typeof user.id !== 'undefined'){
			users.push(user);
			callback(users);
		} else {
			callback(new Error('user doesnt have id'));
		}
	},

	findOneAndDelete: (id, callback) => {
		let {err, user, index} = findUser(id);
		if (typeof index !== 'undefined'){
			users.splice(index, 1);
		} else {
			err = new Error('no users with such index');
		}
		callback(err);
	},

	findOneAndUpdate: (id, user, callback) => {
		const {err, index} = findUser(id);
		users[index] = Object.assign(users[index], user);
		callback(err);
	}
};