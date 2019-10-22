$(document).ready(function(){
    $(document).delegate('#schedule-button', 'click', function(e){
       var schedule = $('#user-text').val()
	console.log('clicked');
	 $('#sent-data').html('<p>Schedule Sent!</p>');
       const d = fetchScheduleData({schedule: schedule});
       d.then(function(data){
        //console.log(data)
	$('#sent-data').html('<p>Schedule Sent!</p>');
    })
})
})

async function fetchScheduleData(data){
	const response = await fetch('/inputschedule',{
	method:'POST',
	headers:{'Content-Type': 'application/json'},
	body: JSON.stringify(data)
	})
	return await response.json();
}
