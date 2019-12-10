'use strict';

const url = 'http://localhost:5500'; // change url when uploading to server

const loginbutton = document.getElementById('loginbutton');
const logoutbutton = document.getElementById('logoutbutton');
const userpage = document.getElementById('userpage');

logoutbutton.style.display = 'none';
userpage.style.display= 'none';

//if log out button is pressed, remove token and log user out
logoutbutton.addEventListener('click', async (evt) => {
    evt.preventDefault();
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/auth/logout', options);
        const json = await response.json();
        console.log(json);
        // remove token
        sessionStorage.removeItem('token');
        alert('You have been logged out. See you next time!');
        //show/hid logout/login button
        logoutbutton.style.display = 'none';
        loginbutton.style.display = 'block';
        window.location.replace('index.html');
    }
    catch (e) {
        console.log(e.message);
    }
});

//show/hid logout/login button based on if user is logged in or not

if (sessionStorage.getItem('token')) {
    loginbutton.style.display = 'none';
    logoutbutton.style.display = 'block';
    userpage.style.display= 'block';
}