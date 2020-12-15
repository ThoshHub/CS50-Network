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
	const user_data = await get_user(user_id); // array of 3 items, first item is the name, second is the number of followers, third is the number that the user follows
    // console.log(user_data);
    
    const user_name = user_data[0];
    const user_followers = user_data[1];
    const user_following = user_data[2];
    console.log(user_name + ", " + user_followers + ", " + user_following);

    // Generate and set HTML for user profile
	var post = document.createElement('div');
	post.id = "user_profile_information";
	post.style.cssText = 'margin: auto;width: 50%;border: 3px solid blue;padding: 20px; border-radius: 15px;';

	var user_profile_html = '<img src="https://i.imgur.com/04baa1h.png" width="240px" height="240px" style="display: block; margin-left: auto; margin-right: auto; border-radius: 10%;">' 
	user_profile_html += '<h1 style="text-align: center;">' + capitalizeFirstLetter(user_name) + '</h1>\n'
	user_profile_html += '<h5 style="text-align: center;">Followers: ' + user_followers.toString() + '<h5>\n'
	user_profile_html += '<h5 style="text-align: center;">Following: ' + user_following.toString() + '<h5>'
    post.innerHTML = `${user_profile_html}`;
    document.querySelector('#user_profile').append(post);

	// After loading the user's profile, load their posts
	loadUserPosts(user_id);
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

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}