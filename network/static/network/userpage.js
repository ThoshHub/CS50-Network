document.addEventListener('DOMContentLoaded', function() {
	// console.log("page loaded!");
    loadUserData() // load messages on page load

	document.addEventListener('click', event => { //unused as of 20.10.29
		const element = event.target;
		console.log("Something was clicked")
	})
});

function loadUserData(){
    // need to call api here
}