'use strict';

const url = 'http://localhost:5500';
const user = JSON.parse(sessionStorage.getItem('user'));
console.log(user);
if(user.admin == 0){
    window.location.replace("/html/index.html")
}
const getUsers = async () => {
//authorization headers
    const fetchOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
//fetching all the users
  const response = await fetch(url + '/user/all', fetchOptions);
  const users = await response.json();
  console.log(users);

    /*mock data until I integrate the API
    const users = [
        {
            name: 'Boi',
            phone: '+358 40 578943',
            email: 'boi@metrpolia.fi',
            id: 0
        },
        {
            name: 'Balabi',
            phone: '+358 40 783783',
            email: 'balabi@metrpolia.fi',
            id: 1
        },
        {
            name: 'Lulu',
            phone: '+358 40 892103',
            email: 'lulu@metrpolia.fi',
            id: 2
        }
    ]*/
    
//looping through all users to display the specific user
  for (const user of users) {
    console.log(user);
    const form = document.createElement("form")
    form.innerHTML = `
        <div>Username: ${user.username}</div>
        <div>Phone: ${user.phone}</div>
        <div>Email: ${user.email}</div>
        <button type="submit-button" class="delete">Delete</button>
    `;

    //when press delete button, this function handels the event
    form.onsubmit = async event => {
        //stop the form from submitting itself
        event.preventDefault();
        
        //authorize before deleting using fetch function
        const fetchOptions = {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
          };
        console.log("deleteting user", user.id)
        try {
            //delete the user by id
            const response = await fetch(url +  "/user/" + user.id, fetchOptions);
            const res = await response.json();
            console.log(res)
            location.reload();
        } catch(e) {
            console.log(e);
            return false
        }
        

        return false;
    }

    const edit = document.createElement("button")
    edit.innerHTML = "Modify"
    edit.className = "modify"
    edit.type = "button"
    edit.onclick = () => editUser(user);

    form.appendChild(edit)

    document.querySelector("section").appendChild(form);
  }
};

getUsers();

//modify user
function editUser(user) {
    console.log(user);
    //prefill the user info in the modify form
    document.querySelector("aside").style.display = "block";
    document.querySelector("input[name=id]").value = user.id;
    document.querySelector("input[name=username]").value = user.username;
    document.querySelector("input[name=password]").value = "";
    document.querySelector("input[name=phone]").value = user.phone;
    document.querySelector("input[name=email]").value = user.email;

    //set the event handler for edit form
    document.getElementById("editform").onsubmit = async event => {
        event.preventDefault();

        //take new changes after user modify
        const id = document.querySelector("input[name=id]").value;
        const username = document.querySelector("input[name=username]").value;
        const password = document.querySelector("input[name=password]").value;
        const phone = document.querySelector("input[name=phone]").value;
        const email = document.querySelector("input[name=email]").value;
        
        //put everything in one user object
        const modifiedUser = { id, username, password, phone, email };

        //authorize before modifying using fetch function
        const fetchOptions = {
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
              //make headers json to user object
              'Content-Type': 'application/json',
            },
            //make the object into a string
            body: JSON.stringify(modifiedUser),
          };
        console.log("updating user", user.id)
        try {
            //modify user info by id
            const response = await fetch(url +  "/user/" + user.id, fetchOptions);
            const res = await response.json();
            console.log(res)
            location.reload();
        } catch(e) {
            console.log(e);
            return false
        }

        return false;

    }
}
