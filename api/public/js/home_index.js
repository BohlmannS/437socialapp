$(document).ready(function(){
	var currentView = 0;
	var listView = '';
	var gridView = '<a id="switch-view" style="color:#CC1219; cursor:pointer;">Switch to List View</a>';
	if(localStorage.getItem('uid') === '0'){
                        $(location).attr('href', 'login');
	}
	$('#myName').text('Name: '+localStorage.getItem('name'));
	$('#myEmail').text('Email: '+localStorage.getItem('email'));
	$(document).delegate('#logout', 'click', function(e){
                        $(location).attr('href', '/login');
                })
	$(document).delegate('#switch-view', 'click', function(e){
		if(currentView === 0){
			currentView = 1;
			$('#class-data').html(gridView);
		}
		else{
			currentView = 0;
			$('#class-data').html(listView);
		}
	})
	const gridData = fetchGridData({uid: localStorage.getItem('uid')});
	gridData.then(function(data){
		gridView += data;
	})
	const myclasses = fetchClassData({uid: localStorage.getItem('uid')});
	var classList = {};
	var classArray = [];
	myclasses.then(function(data){
		if(data.length !== 0){
			classList = data[0][0];
		}
		//console.log(classList);
		var updateClasses = '';
		if (data.length === 0){
			updateClasses = '<p style="color:black">You have no classes :( Please input a schedule.</p>';
		}
		else{
			var i = 1;
			for (var prop1 in data[1]){
				updateClasses+='<p style="color:black" onclick="classPage(\''+data[1][prop1]+'\')">'+data[1][prop1]+'</p><br>';
				classArray.push({[classList['class'+i]] : data[1][prop1]});
				i++;
			}
		}
		if(updateClasses !== '<p style="color:black">You have no classes :( Please input a schedule.</p>'){
			updateClasses = '<a id="switch-view" style="color:#CC1219;cursor:pointer;">Switch To Grid View</a></p>' + updateClasses;
		}
		listView = updateClasses;
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
			if (data.length === 0){
				updateSchedule = '<p style="color:black">you have no friends, or no friends in any classes</p>';
			}
			else{
				updateSchedule = '<p style="color:black">';
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

function classPage(data){
	let str = data.replace(/\s+/g,'-');
	str = '/class_index?class=' + str;
	window.location.href = str;
}

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
async function fetchGridData(data){
	const response = await fetch('/gridview',{
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify(data)
	})
	return await response.json();
	}
