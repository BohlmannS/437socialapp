$(document).ready(function(){
	if(localStorage.getItem('uid') === '0'){
                        $(location).attr('href', 'login');
        }
        $(document).delegate('#logout', 'click', function(e){
                        $(location).attr('href', '/login');
                })

    $('#delete-message').hide();
    $(document).delegate('#schedule-button', 'click', function(e){
       var schedule = $('#user-text').val()
	 $('#sent-data').html('');
       const d = fetchScheduleData({schedule: schedule, uid: localStorage.getItem('uid'),name:localStorage.getItem('name')});
       d.then(function(data){
        $('#sent-data').append('<br>' + data);
    })
})
	$(document).delegate('#delete-button', 'click', function(e){
		$('#delete-message').show();
	})
	$(document).delegate('#confirm-button', 'click', function(e){
		const d = fetchScheduleDelete({uid: localStorage.getItem('uid')});
		d.then(function(data){
			$('#sent-data').html(data);
			$('#delete-message').hide();
		})
	})
})

async function fetchScheduleData(data){
	console.log('sent schedule');
	const response = await fetch('/inputschedule',{
	method:'POST',
	headers:{'Content-Type': 'application/json'},
	body: JSON.stringify(data)
	})
	return await response.json();
}

async function fetchScheduleDelete(data){
	const response = await fetch('/deleteschedule',{
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(data)
        })
        return await response.json();
}
