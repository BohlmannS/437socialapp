$(document).ready(function(){
        $(document).delegate('#submit-button', 'click', function(e){
		var email = $('#useremail').val();
                if(email === ''){
                        return;
                }
                const d = fetchCallReverify({email: email});
                d.then(function(data){
                        $('#submit-info').text(data);
                });
        })
})

async function fetchCallReverify(data){
        const response = await fetch('/reverify',{
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                })
        return await response.json();
        }
