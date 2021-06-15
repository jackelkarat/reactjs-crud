import React, { useState, useEffect, Fragment } from 'react';
import AddUserForm from './forms/AddUserForm'
import EditUserForm from './forms/EditUserForm'
import DeleteUserForm from './forms/DeleteUserForm'

import UserTable from './tables/UserTable'
import Axios from "axios";


const App = () => {

	const initialFormState = { id: null, name: '', country: '' }

	// Setting state
	const [users, setUsers] = useState([])
	const [currentUser, setCurrentUser] = useState(initialFormState)
	const [editing, setEditing] = useState(false)
	const [clicked, setClicked] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [addnewuser, setAddnewuser] = useState(false);

	const getUsers = () => {
		Axios.get("http://localhost:3003/employees").then((response) => {
			setUsers(response.data);
		});
	}

	//Effect is called once during init
	useEffect(() => {
		if (users.length != 0) {
			console.log(users)
		}
	}, [users]);

	const onClick = (event) => {
		if (!clicked) {
			setClicked(true);
			getUsers();
		}
	};


	// CRUD operations
	const addUser = user => {
		user.id = users.length + 1
		setUsers([...users, user])

		Axios.post("http://localhost:3003/create", {
			name: user.name,
			country: user.country,
			position: '',
			age: '',
			wage: 0
		}).then(() => {
			setUsers([
				...users,
				{
					name: user.name,
					country: user.country,
				},
			]);
		});
		setAddnewuser(false);

	}



	const deleteUser = id => {

		Axios.delete(`http://localhost:3003/delete/${id}`).then((response) => {
			setDeleting(false)
			console.log(users)
		});
		setUsers(users.filter(user => user.id !== id))

	}

	const updateUser = (id, updatedUser) => {
		Axios.put(`http://localhost:3003/update/`, { id: id, country: updatedUser.country }).then((response) => {
			setEditing(false)
			setUsers(users.map(user => (user.id === id ? updatedUser : user)))
		});
	}

	const confirmDelete = user => {
		console.log('deleteuser: ', user)

		setDeleting(true)
		setCurrentUser({ id: user.id, name: user.name, country: user.country })

	}

	const editRow = user => {
		console.log('editrow', user)
		setEditing(true)

		setCurrentUser({ id: user.id, name: user.name, country: user.country })
	}

	const addNewUser = bool => {
		// alert('ok')
		if (!addnewuser) {
			setAddnewuser(true);
		} else {
			setAddnewuser(false);
		}
	}

	onClick();

	return (

		<div className="container">
			<h1>CRUD App with Hooks</h1>
			<div className="flex-row">
				<div className="flex-large">
					{editing ? (
						<Fragment>
							<h2>Edit user</h2>
							<EditUserForm
								editing={editing}
								setEditing={setEditing}
								currentUser={currentUser}
								updateUser={updateUser}
							/>
						</Fragment>
					) : ''
						// (
						// 	<Fragment>
						// 		<h2>Add user</h2>
						// 		<AddUserForm addUser={addUser} />
						// 	</Fragment>
						// )
					}

					{addnewuser ? (
						<Fragment>
							<h2>Add user</h2>
							<AddUserForm addUser={addUser} />
						</Fragment>
					) : ''

					}


					{deleting ? (
						<Fragment>
							<h2>Deleting user</h2>
							<DeleteUserForm
								editing={editing}
								setDeleting={setDeleting}
								currentUser={currentUser}
								deleteUser={deleteUser}
							/>
						</Fragment>

					) : ''}
				</div>
				<div className="flex-large">

					<h2>View users <button onClick={addNewUser} className="button muted-button" >add user</button></h2>
					<UserTable users={users} editRow={editRow} deleteUser={deleteUser} confirmDelete={confirmDelete} />
				</div>

			</div>
		</div>
	)
}

export default App
