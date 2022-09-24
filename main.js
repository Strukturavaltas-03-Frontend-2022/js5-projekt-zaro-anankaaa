let isEditMode = false;
let patterns = {
    name: /(^[A-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    address:/\d+\w+\s\w+\s\w+/,
}

const validateData = (user) => {
    if (!patterns.name.test(user.name)) {
        alert('Hibás a név')
        return false;
    }
    if (!patterns.email.test(user.emailAddress)) {
        alert('Hibás az email cím!')
        return false;
    }
    if (!patterns.address.test(user.address)) {
        alert('Hibás a cím!')
        return false;
    }
    return true;
} 

const deleteUser = async function (userID) {
    await fetch(`http://localhost:3000/users/${userID}`, {
        method: 'DELETE',
    });

    users = await getUsers();
    createTable(users);
};

const addUser = async () => {
    const name = document.querySelector('.nameInput').value;
    const email = document.querySelector('.emailInput').value;
    const address = document.querySelector('.addressInput').value;
    const user = {
        name: name,
        emailAddress: email,
        address: address
    }
    if (validateData(user)) {
        let newUser = await fetch('http://localhost:3000/users', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-type': 'application/json',
            }
        })
        .then(response => response.json())
        
        console.log("New user added: ", newUser);
        users.push(newUser);
        
        createTable(users);
    }
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

    if (validateData(user)) {
        console.log("User edited: ", user)
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
}

const cancel = async (user) => {
    document.querySelector(`.edit${user.id}`).style.display = 'block';
    document.querySelector(`.update${user.id}`).style.display = 'none';

    isEditMode = false;
    toggleEditMode(user)
    await getUsers();
}


const getUsers = async () => {
    const response = await fetch('http://localhost:3000/users');
    return await response.json();
}

const createNewUserRow = (table) => {
    const tr = document.createElement('tr');
    table.appendChild(tr);

    const id = document.createElement('td');
    tr.appendChild(id);
    id.textContent = '#';

    const name = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.classList.add('nameInput');
    name.appendChild(nameInput);
    tr.appendChild(name);

    const emailAddress = document.createElement('td');
    const emailInput = document.createElement('input');
    emailInput.classList.add('emailInput');
    emailAddress.appendChild(emailInput);
    tr.appendChild(emailAddress);

    const address = document.createElement('td');
    const addressInput = document.createElement('input');
    addressInput.classList.add('addressInput');
    address.appendChild(addressInput);
    tr.appendChild(address);

    const save = document.createElement('td');
    const div = document.createElement('div');
    const saveButton = document.createElement('button');
    const saveIcon = document.createElement('i');
    saveIcon.classList.add("fa");
    saveIcon.classList.add("fa-save");
    saveButton.appendChild(saveIcon);
    div.appendChild(saveButton);

    saveButton.addEventListener('click', function (event) {
        addUser();
    });
    save.appendChild(div);
    tr.appendChild(save);

    table.appendChild(tr);
}

const createTable = (users) => {
    const tBody = document.querySelector('table tbody');
    tBody.innerHTML = '';
    createNewUserRow(tBody);
    users.forEach(user => {
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
                alert("Please finish editing!")
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
                alert("Please finish editing!")
            }
        });

        div = document.createElement('div');
        div.classList.add(`update${user.id}`);
        div.style.display = 'none';


        const saveButton = document.createElement('button');
        const saveIcon = document.createElement('i');
        saveIcon.classList.add("fa");
        saveIcon.classList.add("fa-save");
        saveButton.appendChild(saveIcon);
        div.appendChild(saveButton);

        saveButton.addEventListener('click', function (event) {
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

let users = await getUsers();
createTable(users);
