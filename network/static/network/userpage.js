document.addEventListener('DOMContentLoaded', function() {
    // Get URL minus the domain name, convert it to string and then split it with "/"
    var urlArr = window.location.pathname.toString().split("/");
    // Get final index of urlArr which gives us the ID of the user
    var user_id = urlArr[urlArr.length - 1] ;
    // console.log(user_id)
    loadUserData(user_id); // loads user data on page load

	document.addEventListener('click', event => { //unused as of 20.10.29
		const element = event.target;
		console.log("Something was clicked");
	})
});

async function loadUserData(user_id){
	// Request data from Server
	const user_data = await get_user(user_id);
    // console.log(user_data);
    
    // Generate and set HTML for user profile
    // document.getElementById("#user_information").innerHTML = "<p>TEST TEST TEST</p>";
    // console.log(user_information_block)
    document.querySelector('#user_information').append("testtesttest");
}

async function loadUserPosts(user_id){
    console.log("TODO");
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