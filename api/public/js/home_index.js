$(document).ready(function(){
	const myclasses = fetchClassData({uid: localStorage.getItem('uid')});
	var classList = {};
	myclasses.then(function(data){
		console.log("got data back: ");
		console.log(data);
		console.log(data[0]);
		classList = data[0];
		var updateClasses = '';
		if (data.length === 0){
			updateClasses = '<p>You have no classes :( Please input a schedule.</p>';
		}
		else{
			for (var prop1 in data[0]){
				updateClasses+='<p>'+data[0][prop1]+'</p><br>';
			}
		}
		$('#class-data').html(updateClasses);
	}).then(function(data){
		const friendSchedule = fetchFriendData({uid: localStorage.getItem('uid'), classList: classList});
		var updateSchedule = '';
		friendSchedule.then(function(data){
			console.log('got data back 2: ');
			console.log(data);
			console.log(data[0]);
			if (data.length === 0){
				updateSchedule = '<p>you have no friends, or no friends in any classes</p>';
			}
			else{
				
				
			}
			$('#mutual-data').html(updateSchedule);
		})
	})
})

async function fetchClassData(data){
        const response = await fetch('/myclasses',{
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                })
        return await response.json();
        }
async function fetchFriendData(data){
	const response = await fetch('/friendclasses',{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
		})
		return await response.json();
	}
