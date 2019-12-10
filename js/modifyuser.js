'use strict';

const url = 'http://localhost:5500'; // change url when uploading to server

const ul = document.getElementById('doglist');  //select ul element in index.html
const userList = document.querySelectorAll('.users-list');
const size = document.getElementById('size');
const modifyUserForm = document.getElementById('modifyUserForm');
const modifyUserFormbutton = document.getElementById('modifybutton');
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
        currentuser = user.id;
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
        } catch (e) {
            console.log(e.message);
        }
        ;
    } catch (e) {
        console.log(e.message);
    }
    ;
};
getUsers();

//add event listener to the form > post info to the database when submitted
//and create a new dog
modifyUserFormbutton.addEventListener('submit', async (evt) => {
    console.log('wtf');
    evt.preventDefault();
    const fd = new FormData(modifyUserForm);
    console.log('Got the form.');
    const fetchOptions = {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: fd,
    };
    const response = await fetch(url + '/user/' + currentuser, fetchOptions);
    const json = await response.json();
    console.log('add response', json);
    window.location.replace('userpage.html');
    // getDog();
});