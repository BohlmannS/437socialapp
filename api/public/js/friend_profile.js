$(document).ready(function(){
	var currentView = 0;
	var listView = '';
	var gridView = '<a id="switch-view" style="color:#CC1219; cursor:pointer;">Switch to List View</a>';
	if(localStorage.getItem('uid') === '0'){
                        $(location).attr('href', 'login');
	}
	$('#my-friend-name').text(localStorage.getItem('fname'));
	$('#myName').text('Name: '+localStorage.getItem('fname'));
	$('#myEmail').text('Email: '+localStorage.getItem('fid')+'@wustl.edu');
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
	const gridData = fetchGridData({uid: localStorage.getItem('fuid')});
	gridData.then(function(data){
		gridView += data;
	})
	const y = fetchSharedClasses({uid: localStorage.getItem('uid'), fid: localStorage.getItem('fuid')});
	y.then(function(data){
		console.log(data);
		$('#mutual-data').html(data);
	})
	const x = fetchClassData({uid: localStorage.getItem('fuid')});
	x.then(function(data){
		$('#class-data').html(data.myData);
		listView = data.myData;
		//$('#mutual-data').html(data.mutualData);
	})
})



function classPage(data){
	let str = data.replace(/\s+/g,'-');
	str = '/class_index?class=' + str;
	window.location.href = str;
}

async function fetchSharedClasses(data){
	 const response = await fetch('/commonclasses',{
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                })
        return await response.json();

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
