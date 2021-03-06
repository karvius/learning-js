'use strict';

function statusChangeCallback(response) {
    if (response.status === 'connected') {
        console.log('Logged in and authenticated');
        setElements(true);
        testAPI();
    } else {
        console.log('Not authenticated');
        setElements(false);
    }
};

function checkLoginState() {
    FB.getLoginStatus(response => {
        statusChangeCallback(response);
    });
};

function testAPI() {
    FB.api('/me?fields=name,email,birthday,location', response => {
        if (response && !response.error) {
            buildProfile(response);
        }
        FB.api('/me/feed', response => {
            if (response && !response.error) {
                buildFeed(response);
            }
        })
    });
};

function buildProfile(user) {
    let profile = `
        <h3>${user.name}</h3>
        <ul class="list-group">
            <li class="list-group-item">User ID: ${user.id}</li>
            <li class="list-group-item">Email: ${user.email}</li>
            <li class="list-group-item">Birthday: ${user.birthday}</li>
            <li class="list-group-item">Location: ${user.location.name}</li>
        </ul>
    `;

    document.getElementById('profile').innerHTML = profile;
};

function buildFeed(feed) {
    let output = '<h3>Latest Posts</h3>';
    for (let i in feed.data) {
        if (feed.data[i].message) {
            output += `
                <div class="well">
                    ${feed.data[i].message} <span>${feed.data[i].created_time}</span>
                </div>
            `;
        }
    }
    document.getElementById('feed').innerHTML = output;
};

function logout() {
    FB.logout(response => {
        setElements(false);
    });
};

function setElements(isLoggedIn) {
    if (isLoggedIn) {
        document.getElementById('profile').style.display = 'block';
        document.getElementById('feed').style.display = 'block';
        document.getElementById('fb-btn').style.display = 'none';
        document.getElementById('logout').style.display = 'block';
        document.getElementById('heading').style.display = 'none';
    } else {
        document.getElementById('feed').style.display = 'none';
        document.getElementById('profile').style.display = 'none';
        document.getElementById('fb-btn').style.display = 'block';
        document.getElementById('logout').style.display = 'none';
        document.getElementById('heading').style.display = 'block';
    }
};
