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

        var username = $('#username').val()
        console.log($('#username').val());

        const preObject = document.getElementById('object');
        const dbRefObject = firebase.database().ref().child('chats');
        // dbRefObject.on('value', snap => console.log(snap.val()));

        dbRefObject.orderByChild("text").on("child_added", function (snapshot) {
            console.log(snapshot.key + " was " + snapshot.val().name + " meters tall");
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
