'use strict';

const url = 'http://localhost:5500'; // change url when uploading to server

const ul = document.getElementById('doglist');  //select ul element in index.html
const userList = document.querySelectorAll('.users-list');
const size = document.getElementById('size');
const deleteUserForm = document.getElementById('deleteUserForm');
let currentuser;

//create options to select the user on the form
const createUserOptions = (user) => {
    userList.forEach((list) => {
        // clear list
        list.innerHTML = '';
        // users.forEach((user) => {
        // create options with DOM methods
        const option = document.createElement('option');
        option.innerHTML = user.username;
        option.classList.add('light-border');
        list.appendChild(option);
    });
};

// set/fetch the only possible owner option on the form to be the currently logged in user
const getUsers = async () => {
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        try {
            const response = await fetch(url + '/user', options);
            const user = await response.json();
            createUserOptions(user);
            currentuser = user.id;
        } catch (e) {
            console.log(e.message);
        }
        ;
    } catch (e) {
        console.log(e.message);
    };
};
getUsers();

//add event listener to the delete form > try deleting the current user's info from the database
deleteUserForm.addEventListener('click', async (evt) => {
    evt.preventDefault();
    const fd = new FormData(deleteUserForm);
    const fetchOptions = {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: fd,
    };
    //if user delete success, remove the session token, alert the user and redirect to the index.html
    //if error when deleting (mostly happens if user has post's, alerts user and redirects to the userpage.html
    try {
        const response = await fetch(url + '/user/' + currentuser, fetchOptions);
        const json = await response.json();
        console.log('add response', json);
        sessionStorage.removeItem('token');
        window.location.replace('index.html');
        window.alert('You have been logged out and your user is deleted.');
    } catch (e) {
        window.alert('Something went wrong! Check that you have deleted all your post');
        window.location.replace('userpage.html');
    }
});