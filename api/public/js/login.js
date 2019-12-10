$(document).ready(function(){
    localStorage.setItem('uid', 0);
    $(document).delegate('#login-button', 'click', function(e){
       var username = $('#username').val()
       var password = $('#password').val()
       const d = fetchCallLogin({username: username, password: password});
       d.then(function(data){
	console.log(data)
	if(data.length == 0){
		localStorage.setItem('uid', 0);
		$('#logged-in').text('Incorrect Username/Password');	
	}
	else if(data[0].verified === 0){
		$('#logged-in').html('<p>You have not verified your wustl email. Please check your email and click the link to verify your account. <a href="verify">Click here to request another email</a></p>');
	}
	else{
		document.myuid = data[0].uid;
		localStorage.setItem('uid',data[0].uid);
		localStorage.setItem('name', data[0].first_name + ' ' + data[0].last_name);
		localStorage.setItem('email', data[0].email);
		$(location).attr('href', '/home_index');
	}
	});
        
    })
	$(document).delegate('#register-button', 'click', function(e){
		$(location).attr('href', '/register');
	})
})

async function fetchCallLogin(data){
  const response = await fetch('/loginrequest',{
   method: 'POST',
   headers: {
   'Content-Type': 'application/json'
    },
   body: JSON.stringify(data)
   })
  return await response.json();
}

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
