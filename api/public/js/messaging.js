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
			data.forEach(function (element) {
				updateList += '<p style="color:black">' + element.username + '</p><br>';
			})
		}
		$('#friend-data').html(updateList);
    })
    
    var entireFriendContainer = document.querySelector(".inbox_chat");
    var chatList = document.createElement('div');
    chatList.className("class_list");



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
        console.log(data[0].username);
    })

    var friendUsername = '';

    var chatLog = '';

    var startChat = document.querySelector(".recent_heading");




    $(".inbox_chat .chat_list").click(function () {

        $('.visible_messages').remove();

        var index = $(this).index();
        console.log(index);
        friendUsername = friends[index].innerText;
        console.log(friends[index].innerText);

        var compareUsernames = myUsername.localeCompare(friendUsername);
        if (compareUsernames < 0) {
            chatLog = myUsername + " -- " + friendUsername;
            console.log(chatLog);
        }
        else {
            chatLog = friendUsername + " -- " + myUsername;
            console.log(chatLog);
        }

        const preObject = document.getElementById('object');
        const dbRefObject = firebase.database().ref().child('chats').child(chatLog);

        dbRefObject.on("child_added", function (snapshot) {
            console.log(snapshot.key + " was " + snapshot.val().sender_id + " meters tall");

            // var sentMessage = document.createElement("p");
            // sentMessage.textContent = snapshot.val().name;
            // preObject.appendChild(sentMessage);

            // if (snapshot.key == chatLog) {
            console.log("in if statemnt");
            // snapshot.forEach(function (childSnapshot) {
            var sentMessage = document.createElement("p");
            // if (snapshot.child("sender_id").val() == myUsername) {
            //     sentMessage.textContent = (myUsername + ": " + snapshot.child("text").val());
            // }
            // else {
            //     sentMessage.textContent = (friendUsername + ": " + snapshot.child("text").val());
            // }
            sentMessage.textContent = snapshot.child("text").val();
            sentMessage.className = "visible_messages";
            console.log(snapshot.child("text").val());
            // if (snapshot.child("sender_id").val() == myUsername) {
            //     preObject.appendChild(myUsername + ": " + sentMessage);
            // }
            // else {
            //     preObject.appendChild(friendUsername + ": " + sentMessage);
            // }
            preObject.appendChild(sentMessage);
            // });
            // console.log("in if statemnt");
            // var sentMessage = document.createElement("p");
            // sentMessage.textContent = snapshot.childSnapshot.child("text").val();
            // console.log(snapshot.childSnapshot.child("text").val());
            // preObject.appendChild(sentMessage);
            // }
        });
    });
    // classname.addEventListener("click", function () {
    // for (var i = 0; i <= classname.length; i++) {
    // classname[i].addEventListener("click", function () {
    // var index = i; 
    // console.log(classname[i].querySelector(".friend").text);
    // console.log(index);
    // var index = $(this).index('.chat_list');

    // $('.friend').click(function () {
    //     var index = $(this).index('.friend')
    //     console.log($(this).index('.friend'));
    // });
    // });
    // }

    // var compareUsernames = myUsername.localeCompare(friendUsername); 
    // if (compareUsernames < 0) {
    //     chatLog = myUsername + " -- " + friendUsername;
    //     console.log(chatLog);
    // }
    //     else {
    //         chatLog = friendUsername + " -- " + myUsername;
    //         console.log(chatLog);
    //     }

    //     const preObject = document.getElementById('object');
    //     const dbRefObject = firebase.database().ref().child('chats').child('chatLog');

    //     dbRefObject.orderByChild("text").on("child_added", function (snapshot) {
    //         console.log(snapshot.key + " was " + snapshot.val().sender_id + " meters tall");

    //         // var sentMessage = document.createElement("p");
    //         // sentMessage.textContent = snapshot.val().name;
    //         // preObject.appendChild(sentMessage);

    //         if (snapshot.val().sender_id == myUsername) {
    //             var sentMessage = document.createElement("p");
    //             sentMessage.textContent = snapshot.val().text;
    //             preObject.appendChild(sentMessage);
    //         }
    //     });

    // })

    postButton.addEventListener("click", function () {

        $('.visible_messages').remove();
        // var msgText = textInput.value;
        // myFirebase.set(msgText);
        // textInput.value = "";

        // var newPostRef = postListRef.push();
        // newPostRef.set({
        //     name: "test",
        //     sender_id: "test",
        //     text: "test"
        // });


        const preObject = document.getElementById('object');
        const dbRefObject = firebase.database().ref().child('chats').child(chatLog);
        // dbRefObject.on('value', snap => console.log(snap.val()));

        dbRefObject.push({
            friend_id: friendUsername,
            sender_id: myUsername,
            text: textInput.value
        })

        dbRefObject.on("child_added", function (snapshot) {
            console.log(snapshot.key + " was " + snapshot.val().sender_id + " meters tall");

            // var sentMessage = document.createElement("p");
            // sentMessage.textContent = snapshot.val().name;
            // preObject.appendChild(sentMessage);

            // if (snapshot.val().sender_id == myUsername) {
            //     var sentMessage = document.createElement("p");
            //     sentMessage.textContent = snapshot.val().text;
            //     preObject.appendChild(sentMessage);
            // }

            var sentMessage = document.createElement("p");
            // if (snapshot.child("sender_id").val() == myUsername) {
            //     sentMessage.textContent = (myUsername + ": " + snapshot.child("text").val());
            // }
            // else {
            //     sentMessage.textContent = (friendUsername + ": " + snapshot.child("text").val());
            // }
            sentMessage.textContent = snapshot.child("text").val();
            sentMessage.className = "visible_messages";
            console.log(snapshot.child("text").val());
            preObject.appendChild(sentMessage);
        });
        console.log("send button clicked");
        // var testUser = "test";

        // myFirebase.push({ name: testUser, sender_id: "1234", text: msgText });
    });

    // var beginListening = function () {
    //     myFirebase.on('child_added', function (snapshot) {
    //         var msg = snapshot.val();

    //         // var msgUsernameElement = document.createELement("b");
    //         // msgUsernameELement.textContent = msg.name;

    //         var msgTextElement = document.createElement("p");
    //         msgTextElement.textContent = msg.text;
    //         var sentMsgElement = document.createElement("div");
    //         sentMsgElement.appendChild(msgTextElement);
    //         sentMsgElement.className = "sent_msg";
    //         var outgoingMsgElement = document.createElement("div");
    //         outgoingMsgElement.appendChild(sentMsgElement);
    //         outgoingMsgElement.className = "outgoing_msg";
    //         document.getElementById("msg_history").appendChild(msgElement);
    //     });
    // }

    // beginListening();

})

// async function fetchUser(data) {
//     const response = await fetch('/messagingdata', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     return await response.json();
// }

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