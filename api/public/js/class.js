$(document).ready(function(){
	if(localStorage.getItem('uid') === '0'){
                        $(location).attr('href', 'login');
	}
	$('#myName').text('Name: '+localStorage.getItem('name'));
	$('#myEmail').text('Email: '+localStorage.getItem('email'));
	$(document).delegate('#logout', 'click', function(e){
                        $(location).attr('href', '/login');
                })
	let str = getUrlParameter('class');
	str = str.replace(/-/g, ' ');
	const x = fetchClassData({uid:localStorage.getItem('uid'),course:str});
	x.then(function(data){
		if(data === '1' || data === 1){
			$('#class-data').html('<p>You have no friends in this class.</p>');
			$('#mutual-data').html('<p>You have no friends in this class.</p>');
		}
		
		
		$('#classTitle').html('<h1></h1>');
		$('#classSection').html('<h2></h2>');
	})
	
})

function friendPage(data){
	let str = data.replace(/\s+/g,'-');
	str = '/friend_profile_index?friend=' + str;
	window.location.href=str;
}

async function fetchClassData(data){
        const response = await fetch('/course',{
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                })
        return await response.json();
        }

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}
