$(document).ready(function(){
    //Activating the diffferent question types
    $(document).delegate('#login-button', 'click', function(e){
       var username = $('#username').val()
       var password = $('#password').val()
       var formData = new FormData();
       //formData.append('username', username);
       //formData.append('password', password);
       //console.log('Username ' + username + ' password: ' + password);
       //console.log(formData.get('username'));
       //console.log(formData.get('password'));
       //ajaxCalls(formData);
       const d = fetchCall({username: username, password: password});
       d.then(function(data){console.log(data)
	document.myuid = data[0].uid;
	localStorage.setItem('uid',data[0].uid);
	});
        
    })
function ajaxCalls(data){
       $.ajax({
            type: "POST",
            url: '/loginrequest',
            cache: false,
            data: data,
            processData: false,
            success: function(data){
              console.log(data);

            },
            fail: function(data){
              console.log(data);
                
            }
        });
    }
})

async function fetchCall(data){
  const response = await fetch('/loginrequest',{
   method: 'POST',
   headers: {
   'Content-Type': 'application/json'
    },
   body: JSON.stringify(data)
   })
  return await response.json();
}
