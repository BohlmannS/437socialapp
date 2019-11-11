$(document).ready(function(){
    $("#friend-info").hide();
	var friendList = {};
	const fList = fetchFriendList({uid: localStorage.getItem('uid')});
	fList.then(function(data){
		var updateList = '';
		if(data.length === 0){
			updateList = '<p>You have no friends :( </p>';
		}
		else{
			data.forEach(function(element){
				updateList += '<p>'+element.username+'</p><br>';	
			})
		}
		$('#friend-data').html(updateList);
	})
    $(document).delegate('#add-button', 'click', function(e){
		$('#friend-info').show();
        })
	$(document).delegate('#friend-button', 'click', function(e){
		var friend = $('#friend-name').val()
		if(friend !== ''){
			const d = fetchCallFriend({uid: localStorage.getItem('uid'), friendName: friend})
			d.then(function(data){
//				console.log(data.response);
				var updateFriend = 'Unrecognized error. Something went really wrong.';
				if(data.response === 0){updateFriend = 'Friend added'}
				if(data.response === 1){updateFriend = 'That user is already your friend'}
				if(data.response === 2){updateFriend = 'User with that name not found'}
				if(data.response === 3){updateFriend = 'That guy does NOT want to be your friend'}
				$('#friend-response').html(updateFriend);
			})
		}
	})
})

async function fetchCallFriend(data){
  const response = await fetch('/friendrequest',{
   method: 'POST',
   headers: {
   'Content-Type': 'application/json'
    },
   body: JSON.stringify(data)
   })
  return await response.json();
}

async function fetchFriendList(data){
	const response = await fetch('/frienddata', {
	method: 'POST',
	headers: {
	'Content-Type': 'application/json'
	},
	body: JSON.stringify(data)
	})
	return await response.json();
}
