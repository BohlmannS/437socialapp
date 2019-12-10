$(document).ready(function () {

    if (localStorage.getItem('uid') === '0') {
        $(location).attr('href', 'login');
    }
    $(document).delegate('#logout', 'click', function (e) {
        $(location).attr('href', '/login');
    })

    var firebaseConfig = {
        apiKey: "AIzaSyCygtuUxUGItCvV7UkDRCHrnBjjQQQnP8o",
        authDomain: "fir-messaging-app-86905.firebaseapp.com",
        databaseURL: "https://fir-messaging-app-86905.firebaseio.com",
        projectId: "fir-messaging-app-86905",
        storageBucket: "fir-messaging-app-86905.appspot.com",
        messagingSenderId: "812660206927",
        appId: "1:812660206927:web:c6a0690980ebdae4ce293a",
        measurementId: "G-J72MYFVE6Y"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var textInput = document.querySelector(".write_msg");
    var postButton = document.querySelector(".msg_send_btn");

    // Get a reference to the database service
    var database = firebase.database();

    // const currentUser = fetchUser({ uid: localStorage.getItem('uid') });
    // currentUser.then(function (data) {
    //     console.log(data[0]);
    // })

    var classname = document.getElementsByClassName("chat_list");
    var friends = document.getElementsByClassName("friends");
    // function getFriend() {
    //     // var attribute = this.getAttribute("data-myattribute");
    //     // alert(attribute);
    //     console.log("friend clicked");
    //     console.log(classname.textContent);

    //     // var attribute = this.getAttribute("data-myattribute");
    //     // alert(attribute);
    // };

    for (var i = 0; i < classname.length; i++) {
        console.log(i);
        classname[i].addEventListener("click", function () {
            console.log("friend clicked");
            // console.log(classname[i].querySelector(".friend").text);
            console.log(friends[i].innerText);
        });
    }

    // var userSelection = document.getElementsByClassName('friendtest');

    // var test = document.getElementById("friendtest");
    // test.addEventListener("click", function () {
    //     alert("clickkkkk");
    //     console.log("clickckksdfkwfwef");
    // })

    // for(let i = 0; i < userSelection.length; i++) {
    //   userSelection[i].addEventListener("click", function() {
    //     console.log("Clicked index: " + i);
    //   })
    // }
    // var friend = document.getElementsByClassName('.chat_ib')[0];

    // friend.addEventListener("click", function () {
    //     console.log(friend.textContent);
    //     console.log("friend clicked")
    // });

    var myUsername = '';

    const currentUser = fetchUser({ uid: localStorage.getItem('uid') });
    currentUser.then(function (data) {
        myUsername = data[0].username;
        console.log(data[0].username);
    })

    postButton.addEventListener("click", function () {
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
        const dbRefObject = firebase.database().ref().child('chats');
        // dbRefObject.on('value', snap => console.log(snap.val()));

        dbRefObject.push({
            friend_id: "friend_id",
            sender_id: myUsername,
            text: textInput.value
        })

        dbRefObject.orderByChild("text").on("child_added", function (snapshot) {
            console.log(snapshot.key + " was " + snapshot.val().sender_id + " meters tall");

            // var sentMessage = document.createElement("p");
            // sentMessage.textContent = snapshot.val().name;
            // preObject.appendChild(sentMessage);

            if (snapshot.val().sender_id == myUsername) {
                var sentMessage = document.createElement("p");
                sentMessage.textContent = snapshot.val().text;
                preObject.appendChild(sentMessage);
            }
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
