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
	var users = [];
	const inc = fetchIncReq({uid:localStorage.getItem('uid')});
	inc.then(function (data){
		let updateReq = '<p><b>Incoming Requests:</b></p>';
		if (data[0].username === ''){
			updateReq += '<p>No incoming friend requests</p>';
		}
		else{
			console.log(data);
			data.forEach(function(e){
				updateReq += '<div style="color:black;display:inline;">';
				updateReq += e.first_name + ' ' + e.last_name + ' wants to be your friend!';
				updateReq += '&nbsp;&nbsp;&nbsp;<button onclick="fetchCallFriendReal({friendName:\''+e.username+'\',uid:\''+localStorage.getItem('uid')+'\'}).then(updateFriends)">Accept</button>';
				updateReq += '&nbsp;&nbsp;<button onclick="fetchCallDeleteReq({uid:\''+localStorage.getItem('uid')+'\',friendName:\''+e.username+'\'}).then(updateFriends)">Delete</button></div>';
			})
			$('#inc-req').html(updateReq);
		}
	})
	const fSearch = friendSearch({uid: localStorage.getItem('uid')});
	fSearch.then(function (data){
		data.forEach(function(e){
			users.push({username: e.username, name:e.first_name.toLowerCase()+e.last_name.toLowerCase(), proper: e.first_name + ' ' + e.last_name});
		})
	});
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
	$(document).on('input', '#friend-name', function(){
		let input = $('#friend-name').val();
		let matched = searchFriends(input, users);
		let matchedText = '';
		matched.forEach(function(element){
			matchedText += '<p style="cursor:pointer;" id="matched-name" ';
			matchedText+= 'onclick="replaceText(\''+element.proper+'\')">'+element.proper + '</p>';
		})
		$('#friend-response').html(matchedText);
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
		let fname = findUname(friend, users);
		if (fname !== '') {
			const d = fetchCallFriend({ uid: localStorage.getItem('uid'), friendName: fname })
			d.then(function (data) {
				//				console.log(data.response);
				var updateFriend = 'User does not exist';
				if (data.response === 0) { updateFriend = 'Friend Request Sent' }
				if (data.response === 1) { updateFriend = 'Request already sent to that user' }
				if (data.response === 2) { updateFriend = 'User has already sent you a request below. Accept it there.' }
				if (data.response === 3) { updateFriend = 'That guy does NOT want to be your friend' }
				$('#friend-response').html(updateFriend);
				//$('#friend-info').hide();
			})
		}
	})
}) 

function findUname(name, data){
	let n = name.replace(/\s/g, '');
	n = n.toLowerCase();
	let res = '';
	data.forEach(function(element){
		if(element.name===n) res=element.username;
	})
	return res;
}

function replaceText(data){
	document.getElementById("friend-name").value = data;
}

function searchFriends(name, data){
	let n = name.replace(/\s/g, '');
	n = n.toLowerCase();
	let res = [];
	data.forEach(function(element){
		if(element.name.includes(n)){
			if(res.length !== 6){
			res.push(element);
			}
		}
	})
	return res;	
}

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

async function fetchIncReq(data){
	const response = await fetch('/incomingrequests', {
	method: 'POST',
	headers: {'Content-Type':'application/json'},
	body: JSON.stringify(data)})
	return await response.json();
}

async function friendSearch(data){
	const response = await fetch('/friendsearch', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
		})
	return await response.json();
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


async function fetchCallDeleteReq(data) {
        const response = await fetch('/friendrequestdel', {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
        })
        return await response.json();
}



async function fetchCallFriend(data) {
	const response = await fetch('/friendrequestext', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	return await response.json();
}

async function fetchCallFriendReal(data) {
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
