'use strict';

const url = 'http://localhost:5500'; // change url when uploading to server

const ul = document.getElementById('doglist');  //select ul element in index.html
const dogList = document.querySelectorAll('.dog-list');
const size = document.getElementById('size');
const deletePostForm = document.getElementById('deletePostForm');
const thebutton = document.getElementById('thebutton');
let currentdog;

//create options to select the user on the form
const createDogOptions = (dog) => {
    dogList.forEach((list) => {
        // clear list
        list.innerHTML = '';
        // users.forEach((user) => {
        // create options with DOM methods
        const option = document.createElement('option');
        option.innerHTML = dog.name;
        option.classList.add('light-border');
        list.appendChild(option);
    });
};


// set/fetch the only possible owner option on the form to be the currently logged in user
const getDog = async () => {
        const idString = window.location.search;
        const id = idString.slice(4);
        try {
            const options = {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            };
            try {
                const response = await fetch(url + '/dog/' + id, options);
                const dog = await response.json();
                createDogOptions(dog);
                currentdog = dog.id;
            } catch (e) {
                console.log(e.message);
            }
            ;
        } catch (e) {
            console.log(e.message);
        }
        ;
    };
    getDog();

//add event listener to the delete form > try deleting the current user's info from the database
    thebutton.addEventListener('click', async (evt) => {
        evt.preventDefault();
        const fd = new FormData(deletePostForm);
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
            const response = await fetch(url + '/dog/' + currentdog, fetchOptions);
            const json = await response.json();
            console.log('deletepost response', json);
            window.location.replace('userpage.html');
            window.alert('Your post has been deleted.');
        } catch (e) {
            window.alert('Something went wrong.');
            window.location.replace('userpage.html');
        }
    });