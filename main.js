const deleteUser = async function (userID) {
    await fetch(`http://localhost:3000/users/${userID}`,  {
        method: 'DELETE',
    });
    await getUsers();
};





const getUsers = async () => {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();
    const tBody = document.querySelector('table tbody');
    tBody.innerHTML = '';
    users.forEach( user => {
        const tr = document.createElement('tr');
        tBody.appendChild(tr);

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

        const modifierButton = document.createElement('button');
        const modifierIcon = document.createElement('i');
        modifierIcon.classList.add("fa");
        modifierIcon.classList.add("fa-pencil");
        modifierButton.appendChild(modifierIcon);
        edit.appendChild(modifierButton);

        const deleteButton = document.createElement('button');
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add("fa");
        deleteIcon.classList.add("fa-trash");
        deleteButton.appendChild(deleteIcon);
        edit.appendChild(deleteButton);

        tr.appendChild(edit);

        deleteButton.addEventListener('click', () => {
            deleteUser(user.id)
        });
        
    });
}
    await getUsers();


