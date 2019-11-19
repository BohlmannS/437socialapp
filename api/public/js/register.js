$(document).ready(function(){
    localStorage.setItem('uid', 0);
        $(document).delegate('#register-button', 'click', function(e){
                $('#register-info').text('');
                var password = $('#password').val();
		var fname = $('#first-name').val();
		var lname = $('#last-name').val();
		var email = $('#email').val();
		if(password === '' || fname === '' || lname === '' || email === ''){
			return;
		}
                const d = fetchCallRegister({password: password, fname: fname, lname: lname, email: email});
                d.then(function(data){
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

