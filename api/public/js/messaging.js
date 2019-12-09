$(document).ready(function () {

    var myFirebase = new Firebase('https://fir-messaging-app-86905.firebaseio.com/');

    var textInput = document.querySelector(".write_msg");
    var postButton = document.querySelector(".msg_send_btn");

    postButton.addEventListener("click", function () {
        var msgText = textInput.value;
        myFirebase.set(msgText);
        textInput.value = "";

        var testUser = "test";

        myFirebase.push({ name: testUser, sender_id: "1234", text: msgText });
    });

    var beginListening = function () {
        myFirebase.on('child_added', function (snapshot) {
            var msg = snapshot.val();

            // var msgUsernameElement = document.createELement("b");
            // msgUsernameELement.textContent = msg.name;

            var msgTextElement = document.createElement("p");
            msgTextElement.textContent = msg.text;
            var sentMsgElement = document.createElement("div");
            sentMsgElement.appendChild(msgTextElement);
            sentMsgElement.className = "sent_msg";
            var outgoingMsgElement = document.createElement("div");
            outgoingMsgElement.appendChild(sentMsgElement);
            outgoingMsgElement.className = "outgoing_msg";
            document.getElementById("msg_history").appendChild(msgElement);
        });
    }

    beginListening();

})
