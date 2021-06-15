import React, { useState, useEffect } from 'react'

const DeleteUserForm = props => {
  const [ user, setUser ] = useState(props.currentUser)

  useEffect(
    () => {
      setUser(props.currentUser)
    },
    [ props ]
  )

  return (
    <form
      onSubmit={event => {
        event.preventDefault()

        props.deleteUser(user.id)
      }}
    >
      <label>Name {user.name}</label>
      <button>delete user</button>
      <button onClick={() => props.setDeleting(false)} className="button muted-button">
        Cancel
      </button>
    </form>
  )
}

export default DeleteUserForm
