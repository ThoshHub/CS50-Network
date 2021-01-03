document.addEventListener('DOMContentLoaded', function() {
    initialize();

	document.addEventListener('click', event => { //unused as of 20.10.29
		const element = event.target;
		console.log("Something was clicked");
	})
});

initialize(){
	console.log("Page Initialized")
}