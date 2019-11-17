$(document).ready(function(){
    localStorage.setItem('uid', 0);
    $(document).delegate('#login-button', 'click', function(e){
       var username = $('#username').val()
       var password = $('#password').val()
       const d = fetchCallLogin({username: username, password: password});
       d.then(function(data){
	//console.log(data)
	if(data.length == 0){
		localStorage.setItem('uid', 0);
		$('#logged-in').text('Incorrect Username/Password');	
	}
	else{
		document.myuid = data[0].uid;
		localStorage.setItem('uid',data[0].uid);
		$(location).attr('href', '/home_index');
	}
	});
        
    })
	$(document).delegate('#register-button', 'click', function(e){
		/*$('#register-info').text('');
		var username = $('#username').val()
		var password = $('#password').val()
		const d = fetchCallRegister({username: username, password: password});
		d.then(function(data){
			$('#register-info').text(data);
		});*/
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
