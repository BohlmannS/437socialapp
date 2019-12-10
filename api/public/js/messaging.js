$(document).ready(function () {

    if (localStorage.getItem('uid') === '0') {
        $(location).attr('href', 'login');
    }
    $(document).delegate('#logout', 'click', function (e) {
        $(location).attr('href', '/login');
    })

    var firebaseConfig = {
        apiKey: "AIzaSyDz0pWf_WwsPdiCDzALANXjFxyENX2Xloc",
        authDomain: "bearconnect-f8f4e.firebaseapp.com",
        databaseURL: "https://bearconnect-f8f4e.firebaseio.com",
        projectId: "bearconnect-f8f4e",
        storageBucket: "bearconnect-f8f4e.appspot.com",
        messagingSenderId: "138060711341",
        appId: "1:138060711341:web:41441828d326b55bdf8d24"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    //load your friends
    var friendList = {};
    const fList = fetchFriendList({ uid: localStorage.getItem('uid') });
    fList.then(function (data) {
        var updateList = '';
        if (data.length === 0) {
            updateList = "";
        }
        else {
            var i = 0;
            data.forEach(function (element) {
                var friendList = document.getElementsByClassName("friend");
                friendList[i].innerHTML = element.username;
                // updateList += '<p style="color:black">' + element.username + '</p><br>';
                i++;
                // friendList[i].parentNode.parentNode.parentNode.className += (" " + "active_chat");
            });
        }
        // $('#friend-data').html(updateList);
    })

    // var entireFriendContainer = document.querySelector(".inbox_chat");
    // var chatList = document.createElement('div');
    // chatList.className("class_list");



    var textInput = document.querySelector(".write_msg");
    var postButton = document.querySelector(".msg_send_btn");

    // Get a reference to the database service
    var database = firebase.database();

    var classname = document.getElementsByClassName("chat_list");
    var friends = document.getElementsByClassName("friend");

    var myUsername = '';
    const currentUser = fetchUser({ uid: localStorage.getItem('uid') });
    currentUser.then(function (data) {
        myUsername = data[0].username;
    })

    var friendUsername = '';

    var chatLog = '';





    $(".inbox_chat .chat_list").click(function () {

        $('.visible_messages').remove();
        $('.message_by_user').remove();


        var index = $(this).index();
        friendUsername = friends[index].innerText;

        document.querySelector(".recent_heading").firstElementChild.innerHTML = friends[index].innerText;

        var compareUsernames = myUsername.localeCompare(friendUsername);
        if (compareUsernames < 0) {
            chatLog = myUsername + " -- " + friendUsername;
        }
        else {
            chatLog = friendUsername + " -- " + myUsername;
        }

        const chatLogObject = firebase.database().ref().child('chats');
        chatLogObject.once('value').then(function (snapshot) {
            // snapshot.forEach(function (child) {
            // var exists = true;

            if (!(snapshot.child(chatLog).exists())) {
                chatLogObject.child(chatLog).set(
                    {
                        new: "new"
                    }
                );
            }
            // });
        });

        const preObject = document.getElementById('object');
        const dbRefObject = firebase.database().ref().child('chats').child(chatLog);


        dbRefObject.once('value').then(function (snapshot) {
            snapshot.forEach(function (child) {

                var user = document.createElement("p");
                user.className = "message_by_user"
                var sentMessage = document.createElement("p");
                if (child.val().sender_id == myUsername) {
                    user.textContent = (myUsername + ":");
                }
                else if (child.val().sender_id == friendUsername) {
                    user.textContent = (friendUsername + ":");
                }
                else {
                    user.textContent = "";
                }
                sentMessage.textContent = child.val().text;
                sentMessage.className = "visible_messages";
                preObject.appendChild(user);
                preObject.appendChild(sentMessage);
            });
        });

    });
    

    postButton.addEventListener("click", function () {

        $('.visible_messages').remove();
        $('.message_by_user').remove();


        const preObject = document.getElementById('object');
        const dbRefObject = firebase.database().ref().child('chats').child(chatLog);


        dbRefObject.push({
            friend_id: friendUsername,
            sender_id: myUsername,
            text: textInput.value
        })

        dbRefObject.once('value').then(function (snapshot) {
            snapshot.forEach(function (child) {

                var user = document.createElement("p");
                user.className = "message_by_user"
                var sentMessage = document.createElement("p");
                if (child.val().sender_id == myUsername) {
                    user.textContent = (myUsername + ":");
                }
                else if (child.val().sender_id == friendUsername) {
                    user.textContent = (friendUsername + ":");
                }
                else {
                    user.textContent = "";
                }
                sentMessage.textContent = child.val().text;
                sentMessage.className = "visible_messages";
                preObject.appendChild(user);
                preObject.appendChild(sentMessage);
            });
        });
    });

   

    window.setInterval(function () {
        if (chatLog != "") {
            $('.visible_messages').remove();
            $('.message_by_user').remove();

            const preObject = document.getElementById('object');
            const dbRefObject = firebase.database().ref().child('chats').child(chatLog);

            dbRefObject.on("child_added", function (snapshot) {
                var user = document.createElement("p");
                user.className = "message_by_user"
                var sentMessage = document.createElement("p");
                if (snapshot.child("sender_id").val() == myUsername) {
                    user.textContent = (myUsername + ":");
                }
                else if (snapshot.child("sender_id").val() == friendUsername) {
                    user.textContent = (friendUsername + ":");
                }
                else {
                    user.textContent = "";
                }
                sentMessage.textContent = snapshot.child("text").val();
                sentMessage.className = "visible_messages";
                preObject.appendChild(user);
                preObject.appendChild(sentMessage);
            });
        }
    }, 5)


})


async function fetchUser(data) {
    const response = await fetch('/messagingdata', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return await response.json();
}

async function fetchFriendList(data) {
    const response = await fetch('/frienddata', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return await response.json();
}