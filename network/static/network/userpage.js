document.addEventListener('DOMContentLoaded', function() {
    initialize();

	document.addEventListener('click', event => { //unused as of 20.10.29
		const element = event.target;
		console.log("Something was clicked");
	})
});

async function initialize(){
        // return which page the user is on
        var page_counter = return_page_counter();
        // return which user the user page is of
        const user_id = return_user_id();
        
        // return the id of the logged in user
        const current_id = await return_current_user_id();
        // console.log("User Visiting: " + current_id + " User Being Visited: " + user_id);
        
        // determine whether the visting user follows the page user or not
        const follows = await determine_follow(current_id, user_id)
        // console.log("Follows? " + follows)

        loadUserData(user_id, page_counter); // loads user data on page load
        loadFollowStatus(current_id, user_id, follows) // loads the follow button and associated logic
}

async function return_current_user_id(){
    //console.log("3 About To Fetch")
    const id = await fetch('/user/current');
    const data = await id.json();
    // console.log(data)
    return data.loggedin; // loggedin is the actual attribute name  of the id
}

// determines whether the current user (user_id_1) follows the user of the profile (user_id_2)
async function determine_follow(user_id_1, user_id_2){
    // console.log("User Visiting: " + user_id_1 + " User Being Visited: " + user_id_2);
	const follows = await fetch('/following/user/' + user_id_1 + '/' + user_id_2);
    const data = await follows.json();
    // console.log(data);
    return data.follows; // follows is the actual attribute name 
}

function return_user_id(){
        // Get URL minus the domain name, convert it to string and then split it with "/"
        var urlArr = window.location.pathname.toString().split("/");
        // Get final index of urlArr which gives us the ID of the user
        var user_id = urlArr[urlArr.length - 1] ;
        // console.log(user_id)
        return user_id
}

function return_page_counter(){
    var page_counter = document.querySelector('#page_counter').innerHTML // returns 0 upon first page load
    return page_counter
}

async function loadUserData(user_id, page_counter){
	// Request data from Server
	const user_data = await get_user(user_id); // array of 3 items, first item is the name, second is the number of followers, third is the number that the user follows
    // console.log(user_data);
    
    const user_name = user_data[0];
    const user_followers = user_data[1];
    const user_following = user_data[2];
    // console.log(user_name + ", " + user_followers + ", " + user_following);

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
	loadUserPosts(user_id, page_counter);
}

async function loadUserPosts(user_id, page_counter){
	// Debug Values
	// user_id = 2 // mercury
    // page_counter = 0 // page 1
    // console.log("User ID: " + user_id.toString() + ", Page Counter: " + page_counter.toString());

	// fetch('/messages/' + user_id) // calls original API, this works
	fetch('/messages/user/' + user_id + '/' + page_counter)
	.then(res => res.json())
	.then(data => {
		// Print data
		// console.log(data);
	
		data.forEach(element => {
			// Display each element
			display_message(element);
		});
	});
}

async function display_message(element) {
	//console.log(element);
	const content = element.fields.content;
	const writer_id = element.fields.writer;
	const writer = capitalizeFirstLetter(element.fields.writername);
	// const writer = "1";
    const date = element.fields.date; // TODO Format this date
    const formatted_date = formatDate(date)
	// console.log("Content: " + content.toString() + ", Writer: " + writer + ", Formatted Date: " + formatted_date)

	// Create a new div for the email
	var post = document.createElement('div');
	post.id = "message_" + element.pk; // give each message a new id, id = pk

	// url is a placeholder
	const html_str = "<h4>" + content + "</h4>" + "\n" + "<a href=userpage/" + writer_id + ">" + writer + "</a>" + "<br>\n" + date;
	post.innerHTML = `${html_str}`;

	// Attach generated HTML to the messages div
	document.querySelector('#user_posts').append(post);

	// TODO for the first one 
	document.getElementById(post.id).style.border = "2px solid dodgerblue";
	document.getElementById(post.id).style.borderRadius = "15px";
	document.getElementById(post.id).style.padding = "10px";
	document.getElementById(post.id).style.marginBottom = "10px";
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

function loadFollowStatus(current_id, user_id, follows){
    console.log("User Visiting ID: \t" + user_id + "\nUser Profile ID: \t" + current_id + "\nFollows? \t\t" + follows);
    
    if(follows == "no"){
        console.log("entered path 1")
        // Need to fill in div #follow_option and create css for it too!
        var follow_button = document.createElement('button');
        follow_button.type = "button";
        follow_button.innerHTML = "Follow";
        follow_button.id = "follow_button"; // give this div an id
        follow_button.className = "btn btn-primary";
        follow_button.style.cssText = 'margin:0 auto;display: block;';
        follow_button.addEventListener('click', function(){
            followUser(current_id, user_id)
        });

        // Attach button to "follow_option" div
        document.querySelector('#follow_option').append(follow_button);
    } 
    else if (follows == "yes"){
        console.log("entered path 2")
        // Need to fill in div #follow_option and create css for it too!
        var unfollow_button = document.createElement('button');
        unfollow_button.type = "button";
        unfollow_button.innerHTML = "Unfollow";
        unfollow_button.id = "follow_button"; // give this div an id
        unfollow_button.className = "btn btn-danger";
        unfollow_button.style.cssText = 'margin:0 auto;display: block;';
        unfollow_button.addEventListener('click', function(){
            unfollowUser(current_id, user_id)
        });

        // Attach button to "follow_option" div
        document.querySelector('#follow_option').append(unfollow_button);
    }
    else {
        console.log("Same User, not adding a button")
    }

}

// makes current_id follow user_id
async function followUser(current_id, user_id){
    console.log(current_id + " Will Now Follow: " + user_id)
    
    // Call API to make change
    fetch('/follow/' + current_id + '/' + user_id)
	.then(res => res.json())
	.then(data => {
		// Print data
		console.log(data);
        
        // after following, clear the current follow button and add unfollow button
        document.getElementById('follow_option').innerHTML = ""; 
        loadFollowStatus(current_id, user_id, "yes") // will now display unfollow button
    });
}

// makes current_id unfollow user_id
async function unfollowUser(current_id, user_id){
    console.log(current_id + " Will Now Unfollow: " + user_id)

    // Call API to make change
    fetch('/unfollow/' + current_id + '/' + user_id)
	.then(res => res.json())
	.then(data => {
		// Print data
		console.log(data);
    
        // after following, clear the current follow button and add unfollow button
        document.getElementById('follow_option').innerHTML = "";
        loadFollowStatus(current_id, user_id, "no") // will now display follow button
    });
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function next_page(){
    // console.log("You Clicked On Next Page!")
    // Get User ID
    var user_id = return_user_id();
	// Get Current Number
	var page_counter = parseInt(document.querySelector('#page_counter').innerHTML);
	// Store and increment
	var new_counter = page_counter + 1;
	// Set element to updated number
	document.querySelector('#page_counter').innerHTML = new_counter.toString();
	// Clear current posts
	document.querySelector('#user_posts').innerHTML = ""
	// Load new posts
	loadUserPosts(user_id, new_counter);
	// Log which page you're on
	console.log(new_counter);
}

function previous_page(){
    // console.log("You Clicked On Previous Page!")
    // Get User ID
    var user_id = return_user_id();
	// Get Current Number
	var page_counter = parseInt(document.querySelector('#page_counter').innerHTML);
	// Store and decrement
    var new_counter = page_counter - 1;
    // Prevent negative numbers
    if(new_counter < 0) {
        new_counter = 0;
    }
	// Set element to updated number
	document.querySelector('#page_counter').innerHTML = new_counter.toString();
	// Clear current posts
	document.querySelector('#user_posts').innerHTML = ""
	// Load new posts
	loadUserPosts(user_id, new_counter);
	// Log which page you're on
	console.log(new_counter);
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}