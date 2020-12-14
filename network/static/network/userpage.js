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
    const res = await fetch('/users/pageinfo/' + id);
	const data = await res.json();
	user_name = data[0].name.toString();
	num_of_followers = data[0].numFollowers.toString();
	num_of_following = data[0].numFollowing.toString();
	// console.log(user_name + ", " + num_of_followers + ", " + num_of_following)
    
    // returns an array of 3 items, first item is the name, second is the number of followers, third is the number that the user follows
	return [user_name, num_of_followers, num_of_following]
}