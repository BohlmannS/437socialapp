module.exports = {
	checkLoggedIn: function(){
		if(localStorage.getItem('uid') === 0)
			$(location).attr('href', 'login');
	},
	delegateLogout: function(){
		$(document).delegate('#logout', 'click', function(e){
			$(location).attr('href', '/login');
		})
	}
}
