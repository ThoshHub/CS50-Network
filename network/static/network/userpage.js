document.addEventListener('DOMContentLoaded', function() {
	// console.log("page loaded!");
    loadUserData() // load messages on page load

	document.addEventListener('click', event => { //unused as of 20.10.29
		const element = event.target;
		console.log("Something was clicked")
	})
});

async function loadUserData(){
	// need to call api here
	const userData = await get_user(1);
	console.log(userData);
}

async function get_user(id) {
    const res = await fetch('/users/' + id);
    const data = await res.json();
    return data[0].name.toString();
}