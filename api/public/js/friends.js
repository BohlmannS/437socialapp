$(document).ready(function () {
	if (localStorage.getItem('uid') === '0') {
		$(location).attr('href', 'login');
	}
	$(document).delegate('#logout', 'click', function (e) {
		$(location).attr('href', '/login');
	})

	var delete_hidden = true;
	var add_hidden = true;

	$("#friend-info").hide();
	$('#friend-delete-info').hide();
	var friendList = {};
	const fList = fetchFriendList({ uid: localStorage.getItem('uid') });
	fList.then(function (data) {
		var updateList = '';
		if (data.length === 0) {
			updateList = '<p style="color:black">You have no friends :( </p>';
		}
		else {
			data.forEach(function (element) {
				updateList += '<div> <p style="color:black;cursor:pointer;display:inline;" onclick="friendPage(\''+element.username+'\')">' + element.first_name + ' ' + element.last_name + '&nbsp;&nbsp;&nbsp;&nbsp;</p><button onclick="fetchCallDelete({friendName:\''+element.username+'\',uid:\''+localStorage.getItem('uid')+'\'}).then(updateFriends)">Button</button></div><br>';
			})
		}
		$('#friend-data').html(updateList);
	})
	$(document).delegate('#add-button', 'click', function (e) {
		if (add_hidden) {
			$('#friend-info').show();
			add_hidden = false;
		}
		else {
			$('#friend-info').hide();
			add_hidden = true;
		}
	})
	$(document).delegate('#friend-button', 'click', function (e) {
		var friend = $('#friend-name').val()
		if (friend !== '') {
			const d = fetchCallFriend({ uid: localStorage.getItem('uid'), friendName: friend })
			d.then(function (data) {
				//				console.log(data.response);
				var updateFriend = 'Unrecognized error from server. Something went really wrong.';
				if (data.response === 0) { updateFriend = 'Friend added' }
				if (data.response === 1) { updateFriend = 'That user is already your friend' }
				if (data.response === 2) { updateFriend = 'User with that name not found' }
				if (data.response === 3) { updateFriend = 'That guy does NOT want to be your friend' }
				$('#friend-response').html(updateFriend);
				updateFriends();
				//$('#friend-info').hide();
			})
		}
	})
})

function updateFriends() {
	window.location.href='/friends_index';
	var friendList = {};
	const fList = fetchFriendList({ uid: localStorage.getItem('uid') });
	fList.then(function (data) {
		var updateList = '';
		if (data.length === 0) {
			updateList = '<p>You have no friends :( </p>';
		}


 		else {
                        data.forEach(function (element) {
                                updateList += '<div> <p style="color:black;cursor:pointer;display:inline;" onclick="friendPage(\''+element.username+'\')">' + element.first_name + ' ' + element.last_name + '&nbsp;&nbsp;&nbsp;&nbsp;</p><button onclick="fetchCallDelete({friendName:\''+element.username+'\',uid:\''+localStorage.getItem('uid')+'\'})">Button</button></div><br>';
                        })
                }


	})
}

async function fetchCallDelete(data) {
	const response = await fetch('/frienddelete', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	return await response.json();
}

async function fetchCallFriend(data) {
	const response = await fetch('/friendrequest', {
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
