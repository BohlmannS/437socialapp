$(document).ready(function(){
	if(localStorage.getItem('uid') === '0'){
                        $(location).attr('href', 'login');
        }
        $(document).delegate('#logout', 'click', function(e){
                        $(location).attr('href', '/login');
                })
		

    $("#friend-info").hide();
    $('#friend-delete-info').hide();
	var friendList = {};
	const fList = fetchFriendList({uid: localStorage.getItem('uid')});
	fList.then(function(data){
		var updateList = '';
		if(data.length === 0){
			updateList = '<p style="color:black">You have no friends :( </p>';
		}
		else{
			data.forEach(function(element){
				updateList += '<p style="color:black">'+element.username+'</p><br>';	
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
				var updateFriend = 'Unrecognized error from server. Something went really wrong.';
				if(data.response === 0){updateFriend = 'Friend added'}
				if(data.response === 1){updateFriend = 'That user is already your friend'}
				if(data.response === 2){updateFriend = 'User with that name not found'}
				if(data.response === 3){updateFriend = 'That guy does NOT want to be your friend'}
				$('#friend-response').html(updateFriend);
				updateFriends();
				//$('#friend-info').hide();
			})
		}
	})
	$(document).delegate('#delete-button', 'click', function(e){
		$('#friend-delete-info').show();
	})
	$(document).delegate('#delete-submit-button', 'click', function(e){
		var friend = $('#delete-name').val()
		if(friend !== ''){
			const d = fetchCallDelete({uid: localStorage.getItem('uid'), friendName: friend})
			d.then(function(data){
				var updateDelete = 'Unrecognized error from server.';
				if(data.response === 0){updateDelete = 'Friend deleted'}
				if(data.response === 1){updateDelete = 'User is not your friend'}
				$('#delete-response').html(updateDelete);
				updateFriends();
				//$('#friend-delete-info').hide();
			})
		}	
	})
})

function updateFriends(){
        var friendList = {};
        const fList = fetchFriendList({uid: localStorage.getItem('uid')});
        fList.then(function(data){
                var updateList = '';
                if(data.length === 0){
                        updateList = '<p>You have no friends :( </p>';
                }
                else{
                        data.forEach(function(element){
                                updateList += '<p style="color:black">'+element.username+'</p><br>';
                        })
                }
                $('#friend-data').html(updateList);
        })
}

async function fetchCallDelete(data){
   const response = await fetch('/frienddelete',{
   method: 'POST',
   headers: {
   'Content-Type': 'application/json'
    },
   body: JSON.stringify(data)
   })
  return await response.json();
}

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
