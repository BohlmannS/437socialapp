$(document).ready(function(){
if(localStorage.getItem('uid') === '0'){
                        $(location).attr('href', 'login');
        }
        $(document).delegate('#logout', 'click', function(e){
                        $(location).attr('href', '/login');
                })

})
