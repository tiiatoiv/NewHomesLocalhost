'use strict';

const url = 'http://localhost:5500'; // change url when uploading to server

const loginbutton = document.getElementById('loginbutton');
const logoutbutton = document.getElementById('logoutbutton');
const uluserinfo = document.getElementById('userinfolist');  //select ul element for user info
const ul = document.getElementById('mydogslist');  //select ul element to show user's own posts
const breed = document.getElementById('breed');
let giveusername; //variable for saving username from getUser function
const breedList = document.querySelectorAll('.breed-list');
const userList = document.querySelectorAll('.users-list');
const size = document.getElementById('size');
const addPostForm = document.getElementById('addPostForm');
const ulmessagelist = document.getElementById('usermessagelist');
const ulsentlist = document.getElementById('sentmessages');
const receiverList = document.querySelectorAll('.receiver-list');
const userListMessage = document.querySelectorAll('.users-list');
const addMessageForm = document.getElementById('addMessageForm');
const postbutton = document.getElementById('postbutton');
const userpage = document.getElementById('userpage');

//const deleteButton = document.getElementById('deleteButton');
//const modifyButton = document.getElementById('deleteButton');
//const modifydiv = document.getElementById('modifydiv');
//let givedogid;
//const ulform = document.getElementById('doglist');  //select ul element in index.html
//const ul = document.getElementById('doglist');  //select ul element in index.html
//const sendmessage = document.getElementById('sendmessage');
//const openMessageForm = document.getElementById('openMessageForm');

//Get's the user token from the login or register page
let userinfo = sessionStorage.getItem("token");
console.log('user token?', userinfo);

//fetch the logged in user's info from database
const getUser = async () => {
    try {
        //Check if the credentials are correct to be able to fetch the data
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/user/', options);
        console.log('Fetch response: ', response.body);
        const user = await response.json();
                         // const userString = await JSON.stringify(response);
        console.log('Fetch as json: ', user);
        //Shows the logged in user's info in the profile panel
        uluserinfo.innerHTML += `
      <li>
      <h3>${user.username}</h3>
      <p>${user.email}</p>
      </li>
      `
        //logged in user's username is passed outside the getUser() function,
        //so that it's able to be used on other functions below to get user's own posts/messages
        giveusername = user.username;
    }
    catch (e) {
        console.log(e.message);
    };
};
getUser();

//DIRECT MESSAGES: fetch all messages from the database and
// build ul list elements of the messages where receiver or sender is current user
const getMessage = async () => {
    //clear lists before every update
    ulmessagelist.innerHTML = '';
    ulsentlist.innerHTML = '';
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        //fetch all messages from the database
        const response = await fetch(url + '/message', options);
        const messages = await response.json();
        messages.forEach(async (message) => {
            //if the messages receiver matches to the logged in user, show the message on the "Received Messages" section
            if (message.receiver === giveusername) {

                ulmessagelist.innerHTML += `
      <li class="light-border">
          <h2>Message from: ${message.sender}</h2>
          <p>Message: ${message.message}</p>
      </li>
      `
            };
            //if the messages sender matches to the logged in user, show the message on the "Sent Messages" section
            if (message.sender === giveusername) {
                ulsentlist.innerHTML += `
      <li class="light-border">
          <h2>Message to: ${message.receiver}</h2>
          <p>Message: ${message.message}</p>
      </li>
      `
            }
        });
    } catch (e) {
        console.log(e.message);
    };
};
getMessage();

//SEND MESSAGE FORM
//create options to select the receiver user on the form
const createRecUserOptions = (users) => {
    receiverList.forEach((list) => {
        // clear list
        list.innerHTML = '';
        users.forEach((user) => {
            // create options to the message form
            const option = document.createElement('option');
            option.innerHTML = user.username;
            option.classList.add('light-border');
            list.appendChild(option);
        });
    });
};

// get all the users for form options from the database
const getRecUsers = async () => {
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        try {
            const response = await fetch(url + '/user/all', options);
            const users = await response.json();
            createRecUserOptions(users);
        } catch (e) {
            console.log(e.message);
        }
        ;

    } catch (e) {
        console.log(e.message);
    }
};
getRecUsers();

//create options to select the user on the form => only option is the currently logged in user
const createUserOptionsMessage = (user) => {
    userListMessage.forEach((list) => {
        // clear list
        list.innerHTML = '';
        // users.forEach((user) => {
        // create options
        const option = document.createElement('option');
        option.innerHTML = user.username;
        option.classList.add('light-border');
        list.appendChild(option);
    });
};

// set/fetch the only possible owner option on the form to be the currently logged in user
const getUsersForMessage = async () => {
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        try {
            const response = await fetch(url + '/user', options);
            const user = await response.json();
            createUserOptionsMessage(user);
        } catch (e) {
            console.log(e.message);
        }
        ;
    } catch (e) {
        console.log(e.message);
    }
    ;
};
getUsersForMessage();

//SEND MESSAGE: add event listener to the form > post message to the database when submitted
addMessageForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = serializeJson(addMessageForm);
    console.log('This is about to be sent: ', data);
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify(data),
    };
    const response = await fetch(url + '/message', fetchOptions);
    const json = await response.json();
    console.log('addmessage response', json);
    window.alert('Message sent.');
    getMessage();
});

//MY POSTS: fetch data from the database and build ul list elements of the logged in users posts
const getDog = async () => {
    ul.innerHTML = '';
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/dog', options);
        const dogs = await response.json();
        dogs.forEach(async (dog) => {
               if (dog.owner === giveusername) {         //if the dog's owner matches to the logged in user > show it on the userpage

                   ul.innerHTML += `
      <li class="smaller center">
      <a href="deletepost.html?id=${dog.id}"> <button id="deletepost${dog.id}">Delete post</button></a>
          <h2>${dog.name}</h2>
          <figure>
              <img src="${url}/thumbnails/${dog.filename}" class="resp">
          </figure>
          <p>Age: ${dog.age}</p>
          <p>Size: ${dog.breed}</p>
          <p>Owner: ${dog.owner}</p>
          <p>Location: ${dog.location}</p>
          <a href="dog.html?id=${dog.id}"><h2>GO TO PAGE</h2></a>
      </li>
      `
               };
        });
    } catch (e) {
        console.log(e.message);
    };
};
getDog();

//CREATE NEW POST FORM:
// create options to select the breed on the form
const createBreedOptions = (breeds) => {
    breedList.forEach((list) => {
        // clear list
        list.innerHTML = '';
        breeds.forEach((breed) => {
            // create options
            const option = document.createElement('option');
            option.innerHTML = breed.type;
            option.classList.add('light-border');
            list.appendChild(option);
        });
    });
};

// get all the breeds for form options from the database
const getBreeds = async () => {
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        try {
            const response = await fetch(url + '/breed', options);
            const breeds = await response.json();
            createBreedOptions(breeds);
        } catch (e) {
            console.log(e.message);
        }
        ;

    } catch (e) {
        console.log(e.message);
    }
};
getBreeds();

//create options to select the user on the form
const createUserOptions = (user) => {
    userList.forEach((list) => {
        // clear list
        list.innerHTML = '';

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

//add event listener to the form > post info to the database when submitted and create a new dog
addPostForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const fd = new FormData(addPostForm);
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: fd,
    };
    const response = await fetch(url + '/dog', fetchOptions);
    const json = await response.json();
    console.log('add response', json);
    window.alert('Post created.');
    getDog();
});

//function to open the Create a Post form
function openForm() {
    document.getElementById("myForm").style.display = "block";
}
//Close Create a Post form
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

//function to open the Send a Message form
function messageFormOpen() {
    document.getElementById("myMessageForm").style.display = "block";
}
//Close Create a Post form
function messageFormClose() {
    document.getElementById("myMessageForm").style.display = "none";
}


//show/hid logout/login button based on if user is logged in or not
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

logoutbutton.style.display = 'none';
postbutton.style.display = 'none';
userpage.style.display= 'none';
//show/hid logout/login button based on if user is logged in or not
logoutbutton.style.display = 'none';
userpage.style.display= 'none';
if (sessionStorage.getItem('token')) {
    loginbutton.style.display = 'none';
    logoutbutton.style.display = 'block';
    postbutton.style.display = 'block';
    userpage.style.display= 'block';
}