$(document).ready(function(){
    localStorage.setItem('uid', 0);
	var back = false;
        $(document).delegate('#register-button', 'click', function(e){
		if(back){return}
                $('#register-info').text('');
                var password = $('#password').val();
		var password2 = $('#password2').val();
		var fname = $('#first-name').val();
		var lname = $('#last-name').val();
		var email = $('#email').val();
		if(password === '' || fname === '' || lname === '' || email === '' || password2 === ''){
			$('#register-info').text('Please fill out all fields');
			return;
		}
		if(password !== password2){
			$('#register-info').text('Passwords do not match');
			return;
		}
                const d = fetchCallRegister({password: password, fname: fname, lname: lname, email: email});
                d.then(function(data){
			back = true;
                        $('#register-info').text(data);
                });
        })
})

async function fetchCallRegister(data){
        const response = await fetch('/registerrequest',{
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                })
        return await response.json();
        }

