 $("#login-button").click(function(event){
		 event.preventDefault();
	 
	
	 
	 if($("#name").val()=="admin" && $("#pass").val()=="admin"){
			 $('form').fadeOut(500);
			 $('.wrapper').addClass('form-success');
			 $('.menu').toggle("slide");
			window.setTimeout(function() {
		    window.location.href = 'Home.html';
		}, 7000);
	 }
	 else
	 {
		$('input[type="text"]').css({"border":"2px solid red","box-shadow":"0 0 3px red"});
		$('input[type="password"]').css({"border":"2px solid #00F5FF","box-shadow":"0 0 5px #00F5FF"});
	 }
	
});