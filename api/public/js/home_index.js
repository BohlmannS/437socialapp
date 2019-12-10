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
	const x = fetchClassData({uid: localStorage.getItem('uid')});
	x.then(function(data){
		$('#class-data').html(data.myData);
		listView = data.myData;
		if(data.mutualData === '2' || data.mutualData === 2){
		$('#mutual-data').html('You have no friends in any classes');
		}	
		else{
		$('#mutual-data').html(data.mutualData);
		}
	})
})

function classPage(data){
	let str = data.replace(/\s+/g,'-');
	str = '/class_index?class=' + str;
	window.location.href = str;
}


async function fetchClassData(data){
        const response = await fetch('/myclassesnew',{
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
