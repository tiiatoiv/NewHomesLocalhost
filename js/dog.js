'use strict';

const url = 'http://localhost:5500';
//const ul = document.querySelector('ul');
const loginbutton = document.getElementById('loginbutton');
const logoutbutton = document.getElementById('logoutbutton');
const userpage = document.getElementById('userpage');

const getDog = async () => {
    //take dog id string from url 
    const idString = window.location.search
    //?id=1 cut the fisrt four letters
    const id = idString.slice(4)

    try{
        
        const response = await fetch(url + '/dog/' + id);
        const dog = await response.json();
        
        getOwner(dog.owner);

        console.log(dog);
        document.getElementById('breed').innerHTML = dog.breed;
        document.getElementById('dog-name').innerHTML = dog.name;
        document.getElementById('dob').innerHTML = new Date(dog.dob).toLocaleDateString();
        document.getElementById('location').innerHTML = dog.location;
        document.getElementById('description').innerHTML = dog.description;
        document.getElementById('img').src = "../uploads/" + dog.filename;
    }catch (e) {
        console.log(e.message);
      }
    
}

const getOwner = async (name) => {
    let owner;
    try{
        const fetchOptions = {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
          };
        const response = await fetch(url + '/user/name/' + name, fetchOptions);
        owner = await response.json();
        
    }catch (e) {
        console.log(e.message);
        document.getElementById("main").innerHTML = e.message;
      }

    document.getElementById('owner-name').innerHTML = owner.username;
    document.getElementById('owner-phone').innerHTML = owner.phone;
    document.getElementById('owner-email').innerHTML = owner.email;
    document.getElementById('email').href = "mailto:" + owner.email;
    document.getElementById('phone').href = "phone:" + owner.phone;
}



getDog();

//event for page loading
window.onload = () => {

    const idString = window.location.search
    const id = idString.slice(4);

    const ip = "10.114.32.144";
    document.getElementById("fb").href =
        `https://www.facebook.com/sharer/sharer.php?u=http%3A//${ip}/html/dog.html?id=${id}`;
        
    document.getElementById("twit").href =
    `https://twitter.com/intent/tweet?text=NewHomes!%20Find%20your%20new%20dog%20now%3A%20http%3A//${ip}/html/dog.html?id=${id}`

        
    //turn the liked string into object
    const liked = JSON.parse(localStorage.getItem("liked") || "{}");
    console.log("liked", liked)
    //if the like button is clicked, change the button color
    if (liked[id]) {
        console.log("this dog has been liked")
        document.getElementById("like").style.background = "crimson"
    }
    //eventhandler for liked dog
    document.getElementById("like").onclick = event => {
        console.log("liked", liked)
        liked[id] = true;
        document.getElementById("like").style.background = "crimson"
        localStorage.setItem("liked", JSON.stringify(liked));
    }
}

//show/hid logout/login button based on if user is logged in or not
logoutbutton.style.display = 'none';
userpage.style.display = 'none';
if (sessionStorage.getItem('token')) {
    userpage.style.display = 'block';
    loginbutton.style.display = 'none';
    logoutbutton.style.display = 'block';
}

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