let isEditMode = false;

const deleteUser = async function (userID) {
    await fetch(`http://localhost:3000/users/${userID}`,  {
        method: 'DELETE',
    });
    await getUsers();
};

const addUser = async () => {
    const name = document.querySelector('.nameInput').value;
    const email = document.querySelector('.emailInput').value;
    const address = document.querySelector('.addressInput').value;
    await fetch('http://localhost:3000/users', {
        method: 'POST',
        body: JSON.stringify(),
        headers: {
            'Content-type': 'application/json',
        }
    })
}

const toggleEditMode = (user) => {
    const row = document.getElementById(user.id);
    row.childNodes.forEach((td, idx) => {
        if (isEditMode) {
            if (idx === 1) {
                td.textContent = '';
                const input = document.createElement('input');
                input.value = user.name;
                td.appendChild(input);
                input.setAttribute('id', 'editName');
            } else if (idx === 2) {
                td.textContent = '';
                const input = document.createElement('input');
                input.value = user.emailAddress;
                td.appendChild(input);
                input.setAttribute('id', 'editEmailAddress');
            } else if (idx === 3) {
                td.textContent = '';
                const input = document.createElement('input');
                input.value = user.address;
                td.appendChild(input);
                input.setAttribute('id', 'editAdress');
            }
        } else {
            if (idx === 1) {
                td.textContent = user.name;
            } else if (idx === 2) {
                td.textContent = user.emailAddress;
            } else if (idx === 3) {
                td.textContent = user.address;
            }
        }
    }) 
}

const editUser = (user) => {
    isEditMode = true;
    document.querySelector(`.edit${user.id}`).style.display = 'none';
    document.querySelector(`.update${user.id}`).style.display = 'block';

    toggleEditMode(user);
}

const save = async (user) => {
    const editDiv = document.querySelector(`.edit${user.id}`);
    const updateDiv = document.querySelector(`.update${user.id}`)
    
    const newName = document.getElementById('editName').value;
    const newEmailAddress = document.getElementById('editEmailAddress').value;
    const newAddress = document.getElementById('editAdress').value;
    user.name = newName;
    user.emailAddress = newEmailAddress;
    user.address = newAddress;

    // TODO: Validate data before saving!

    console.log(JSON.stringify(user))
    await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json',
        }
    });

    isEditMode = false;
    toggleEditMode(user);

    editDiv.style.display = 'block';
    updateDiv.style.display = 'none';
}

const cancel = async (user) => {
    document.querySelector(`.edit${user.id}`).style.display = 'block';
    document.querySelector(`.update${user.id}`).style.display = 'none';

    isEditMode = false;
    toggleEditMode(user)
    await getUsers();
}


const getUsers = async () => {
    console.log("getUsers")
    const response = await fetch('http://localhost:3000/users');
    return await response.json();
}

const createTable = (users) => {
    const tBody = document.querySelector('table tbody');
    tBody.innerHTML = '';
    users.forEach( user => {
        const tr = document.createElement('tr');
        tBody.appendChild(tr);
        tr.setAttribute('id', user.id);

        const id = document.createElement('td');
        tr.appendChild(id);
        id.textContent = user.id;
        
        const name = document.createElement('td');
        tr.appendChild(name);
        name.textContent = user.name;

        const emailAddress = document.createElement('td');
        tr.appendChild(emailAddress);
        emailAddress.textContent = user.emailAddress;

        const address = document.createElement('td');
        tr.appendChild(address);
        address.textContent = user.address;

        const edit = document.createElement('td');
        let div = document.createElement('div');
        div.classList.add(`edit${user.id}`);

        const modifierButton = document.createElement('button');
        const modifierIcon = document.createElement('i');
        modifierIcon.classList.add("fa");
        modifierIcon.classList.add("fa-pencil");
        modifierButton.appendChild(modifierIcon);
        div.appendChild(modifierButton);

        modifierButton.addEventListener('click', () => {
            if (!isEditMode) {
                editUser(user);
            } else {
                console.log("Please finish editing!")
                // TODO: Show alert!
            }
        });

        const deleteButton = document.createElement('button');
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add("fa");
        deleteIcon.classList.add("fa-trash");
        deleteButton.appendChild(deleteIcon);
        div.appendChild(deleteButton);
        
        edit.appendChild(div);
        tr.appendChild(edit);

        deleteButton.addEventListener('click', () => {
            if (!isEditMode) {
                deleteUser(user.id)
            } else {
                console.log("Please finish editing!")
                // TODO: Show alert!
            }
        });

        div = document.createElement('div');
        div.classList.add(`update${user.id}`);
        div.style.display='none';

        
        const saveButton = document.createElement('button');
        const saveIcon = document.createElement('i');
        saveIcon.classList.add("fa");
        saveIcon.classList.add("fa-save");
        saveButton.appendChild(saveIcon);
        div.appendChild(saveButton);

        saveButton.addEventListener('click', function(event) {
            save(user);
        });

        const cancelButton = document.createElement('button');
        const cancelIcon = document.createElement('i');
        cancelIcon.classList.add("fa");
        cancelIcon.classList.add("fa-refresh");
        cancelButton.appendChild(cancelIcon);
        div.appendChild(cancelButton);

        edit.appendChild(div);
        tr.appendChild(edit);

        cancelButton.addEventListener('click', () => {
            cancel(user);
        });
    });
}

const users = await getUsers();
createTable(users);
