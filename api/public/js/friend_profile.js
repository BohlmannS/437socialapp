$(document).ready(function(){
	if(localStorage.getItem('uid') === '0'){
                        $(location).attr('href', 'login');
	}
	$(document).delegate('#logout', 'click', function(e){
                        $(location).attr('href', '/login');
                })
	const myclasses = fetchClassData({uid: localStorage.getItem('uid')});
	var classList = {};
	var classArray = [];
	myclasses.then(function(data){
		//console.log("got data back: ");
		//console.log(data);
		//console.log(data[1]);
		if(data.length !== 0){
			classList = data[0][0];
		}
		//console.log(classList);
		var updateClasses = '';
		if (data.length === 0){
			updateClasses = '<p style="color:black">No classes :(</p>';
		}
		else{
			var i = 1;
			for (var prop1 in data[1]){
				updateClasses+='<p style="color:black">'+data[1][prop1]+'</p><br>';
				classArray.push({[classList['class'+i]] : data[1][prop1]});
				i++;
			}
		}
		$('#class-data').html(updateClasses);
	}).then(function(data){
		if(classList.class1 !== null){
		for (var prop2 in classList){
			if(classList[prop2] === null){
				delete classList[prop2];
			}
		}
		const friendSchedule = fetchFriendData({uid: localStorage.getItem('uid'), classList: classList});
		var updateSchedule = '';
		friendSchedule.then(function(data){
			//console.log('got data back 2: ');
			//console.log(data);
			//console.log(data[0]);
			//console.log(classList);
			//console.log(classArray);
			if (data.length === 0){
				updateSchedule = '<p style="color:black">you have no friends, or no friends in any classes</p>';
			}
			else{
				updateSchedule = '<p style="color:black">';
				//console.log(classList);
				//console.log(classArray);
				console.log(data);
				var j = -1;
				for (var prop3 in classList){
					j++;
					updateSchedule+=classArray[j][classList[prop3]] + ' - ';
					let count = 0;
					let frens = [];
					for(var k = 0; k < data.length; k++){
						for(var prop4 in data[k]){
							if(classList[prop3] === data[k][prop4]){
								count++;
								frens.push(data[k].username);
							}
						}
					}
					if(frens.length !== 0){
						updateSchedule+=count + ' friends: ';
						for(var l = 0; l < frens.length; l++){
							if(l === frens.length-1){updateSchedule+=frens[l]}
							else {updateSchedule+=frens[l] + ', '}
						}
					}else{
						updateSchedule+='no friends';
					}
					updateSchedule+='<br><br>';
				}
				updateSchedule+='</p>';	
			}
			$('#mutual-data').html(updateSchedule);
		})
		}else{
			$('#mutual-data').html('<p style="color:black">you have no friends, or no friends in any classes</p>');
		}
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
