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
	const userData = await get_user(2); //TODO CHANGE THIS TO GET CURRENT USER NOT '2'
	console.log(userData);
}

async function get_user(id) {
    const res = await fetch('/users/' + id);
	const data = await res.json();
	user_name = data[0].name.toString();
	num_of_followers = data[0].numFollowers.toString();
	num_of_following = data[0].numFollowing.toString();
	//TODO add these to an array and return that instead of string

	// console.log(user_name + ", " + num_of_followers + ", " + num_of_following)
	// return data[0].name.toString();
	return 'DUMMY VARIABLE'
}