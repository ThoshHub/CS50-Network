document.addEventListener('DOMContentLoaded', function() {
    initialize();

	document.addEventListener('click', event => { //unused as of 20.10.29
		const element = event.target;
		console.log("Something was clicked");
	})
});

async function initialize() {
	// return which page the user is on
	var page_counter = return_page_counter();
	// return which user the user page is of
	const user_id = return_user_id();

	// return the id of the logged in user
	const current_id = await return_current_user_id();
	console.log("User Visiting: " + current_id + " User Being Visited: " + user_id);


	// only have next button upon page load
	// assignNextButton();

	loadUserData(user_id, page_counter); // loads user data on page load
	if (current_id != -1) {
		// determine whether the visting user follows the page user or not
		const follows = await determine_follow(current_id, user_id)
		console.log("Follows? " + follows)
		loadFollowStatus(current_id, user_id, follows) // loads the follow button and associated logic
	}
	// console.log("About To Check Button Assignment")
	setTimeout(function (){
		checkButtonAssignment();
	  }, 150);
}

function checkButtonAssignment(){
	// only have next button upon page load if there are at least 10 message
	// Get the number of messages on page by matching all ids that start with "message_", and get the length of that array
	var numOfMessagesOnPage = document.querySelectorAll('*[id^="message_"]').length;
	console.log("Num Of Messages: " + numOfMessagesOnPage)
	if (numOfMessagesOnPage < 10) { // less than 10 messages means last page
		assignNoButtons() // only show previous button 
	} else {
		assignNextButton() // show only next button
	}
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
	user_profile_html += '<h5 id=userFollowers style="text-align: center;">Followers: ' + user_followers.toString() + '<h5>\n'
	user_profile_html += '<h5 id=userFollowing style="text-align: center;">Following: ' + user_following.toString() + '<h5>'
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

	const current_id = await return_current_user_id();
	// console.log("User Visiting: " + current_id);

	// fetch('/messages/' + user_id) // calls original API, this works
	fetch('/messages/user/' + user_id + '/' + page_counter)
	.then(res => res.json())
	.then(data => {
		// Print data
		// console.log(data);
	
		data.forEach(element => {
			// Display each element
			display_message(element, current_id);
		});
	});
}

async function display_message(element, current_id) {
	//console.log(element);
	const content = element.fields.content;
	const writer_id = element.fields.writer;
	const writer = capitalizeFirstLetter(element.fields.writername);
	// const writer = "1";
	const date = element.fields.date; // TODO Format this date
	
	const numoflikes = element.fields.numoflikes.toString(); 
	const liked_by = element.fields.liked_by;
	const curr_user_likes_post = liked_by.includes(current_id);
	// console.log("Number of Likes:\t" + numoflikes + "\nLiked By:\t" + liked_by);
	// console.log("User ID: " + current_id + " Likes Message ID: " + element.pk + ": " + curr_user_likes_post.toString())

    const formatted_date = formatDate(date)
	// console.log("Content: " + content.toString() + ", Writer: " + writer + ", Formatted Date: " + formatted_date)

	// Create a new div for the email
	var post = document.createElement('div');
	post.id = "message_" + element.pk; // give each message a new id, id = pk

	// url is a placeholder
	var html_str = "<h4>" + content + "</h4>" + "\n" + "<a href=/userpage/" + writer_id + ">" + writer + "</a>" + "<br>\n" + date;
	
	// Add number of likes and like/dislike button inside a new div
	html_str += "<br><div id=like_div_" + element.pk + ">"
	html_str += "<h6 id=numoflikes_" + element.pk + ">Likes: " + numoflikes + "</h6>";
	
	if (current_id != -1) {
		if (curr_user_likes_post) { // If the user likes the post, display the unlike button
			const onclick_unlike = " onclick=\"unlike_post('" + element.pk + "','" + current_id + "')\""
			html_str += "<br>";
			html_str += "<button id=unlike_button_" + element.pk;
			html_str += " type=\"button\"";
			html_str += " class=\"btn btn-outline-danger\""
			html_str += onclick_unlike;
			html_str += ">";
			html_str += "Unlike 💔"
			html_str += "</button>"
		} else { // if the user doesn't already like the post, display the like button
			const onclick_like = " onclick=\"like_post('" + element.pk + "','" + current_id + "')\""
			html_str += "<br>";
			html_str += "<button id=like_button_" + element.pk;
			html_str += " type=\"button\"";
			html_str += " class=\"btn btn-outline-primary\""
			html_str += onclick_like;
			html_str += ">";
			html_str += "Like 💗"
			html_str += "</button>"
		}
	}

	html_str += "</div>"	

	// Add Button to edit if it is the currently logged in user's own post
	if(writer_id == current_id){
		const onclick_str = " onclick=\"edit_post('" + element.pk + "','" + content+ "')\"" // calling the proper editing function
		// console.log(onclick_str)
		
		// building the button
		html_str += "<br>";
		html_str += "<button" 
		html_str += " type=\"button\"";
		html_str += " class=\"btn btn-success\""
		html_str += onclick_str;
		html_str += ">";
		html_str += "Edit"
		html_str +=  "</button>"
	}
    post.innerHTML = `${html_str}`;

	// Attach generated HTML to the messages div
	document.querySelector('#user_posts').append(post);

	// TODO for the first one 
	document.getElementById(post.id).style.border = "2px solid dodgerblue";
	document.getElementById(post.id).style.borderRadius = "15px";
	document.getElementById(post.id).style.padding = "10px";
	document.getElementById(post.id).style.marginBottom = "10px";
}

async function like_post(message_id, current_id){
	// console.log("User ID: " + current_id + " Liked Post: " + message_id + "!");
	const res = await fetch('/message/like/' + message_id + '/' + current_id);
    const data = await res.json();
	// console.log(data);

	reset_unlike_div(message_id, current_id); // pressing the like button creates the unlike button
}

async function unlike_post(message_id, current_id){
	// console.log("User ID: " + current_id + " Unliked Post: " + post_id + "!");
	const res = await fetch('/message/unlike/' + message_id + '/' + current_id);
    const data = await res.json();
	// console.log(data);

	reset_like_div(message_id, current_id); // pressing the unlike button creates the like button
}

function reset_unlike_div(message_id, current_id){ // pressing the like button creates the unlike button
	// console.log("resetting the div for: " + message_id.toString())
	const div_id = "like_div_" + message_id.toString() // id for the edit div
	const numoflikes_id = "numoflikes_" + message_id.toString() // id for the "Likes" label

	const numoflikes_str = document.getElementById(numoflikes_id).innerText.charAt(7); //number of likes before user liked post
	var new_numoflikes_str = parseInt(numoflikes_str) + 1 //number of likes after user liked post (+1)
	// console.log("\"" + numoflikes_str + "\" -- \"" + new_numoflikes_str + "\"");

	var post = document.getElementById(div_id); // the div that will be set
	
	html_str = "<h6 id=numoflikes_" + message_id + ">Likes: " + new_numoflikes_str.toString() + "</h6>";
	const onclick_unlike = " onclick=\"unlike_post('" + message_id + "','" + current_id + "')\"" 
	html_str += "<br>";
	html_str += "<button id=unlike_button_" + message_id; 
	html_str += " type=\"button\"";
	html_str += " class=\"btn btn-outline-danger\""
	html_str += onclick_unlike;
	html_str += ">";
	html_str += "Unlike 💔"
	html_str +=  "</button>"

	post.innerHTML = `${html_str}`;
}

function reset_like_div(message_id, current_id){ // pressing the unlike button creates the like button
	// console.log("resetting the div for: " + message_id.toString())
	const div_id = "like_div_" + message_id.toString() // id for the edit div
	const numoflikes_id = "numoflikes_" + message_id.toString() // id for the "Likes" label

	const numoflikes_str = document.getElementById(numoflikes_id).innerText.charAt(7); //number of likes before user liked post
	var new_numoflikes_str = parseInt(numoflikes_str) - 1 //number of likes after user liked post (-1)
	// console.log("\"" + numoflikes_str + "\" -- \"" + new_numoflikes_str + "\"");

	var post = document.getElementById(div_id); // the div that will be set
	html_str = "<h6 id=numoflikes_" + message_id + ">Likes: " + new_numoflikes_str.toString() + "</h6>";
	const onclick_like = " onclick=\"like_post('" + message_id + "','" + current_id + "')\"" 
	html_str += "<br>";
	html_str += "<button id=like_button_" + message_id;
	html_str += " type=\"button\"";
	html_str += " class=\"btn btn-outline-primary\""
	html_str += onclick_like;
	html_str += ">";
	html_str += "Like 💗"
	html_str +=  "</button>"

	post.innerHTML = `${html_str}`;	
}

function edit_post(message_id, init_content){
	const post_id = "message_" + message_id;
	console.log("Editing Post: " + message_id + ", Content: " + init_content);
	post = document.getElementById(post_id);
	const message_text = init_content //this is the original text from the message

	var edit_post_area = "";
	edit_post_area += "<textarea";
	edit_post_area += " id='message_edit_" + message_id +"'";
	edit_post_area += " rows='2'";
	edit_post_area += " columns='100'";
	edit_post_area += " class='form-control'>";
	edit_post_area += init_content // text which appears in textarea
	edit_post_area += "</textarea>";

	const onclick_str = " onclick=\"submit_edit('" + message_id + "','message_edit_" + message_id + "')\"" // calling the proper editing function
	var edit_post_button = "";
	edit_post_button += "<br>";
	edit_post_button += "<button" 
	edit_post_button += " type=\"button\"";
	edit_post_button += " class=\"btn btn-info\""
	edit_post_button += onclick_str;
	edit_post_button += ">";
	edit_post_button += "Submit"
	edit_post_button +=  "</button>"

	edit_post_area += edit_post_button;
	// console.log(edit_post_area);

	// post.innerHTML = "TEST"; 
	post.innerHTML = edit_post_area; 
}

async function submit_edit(message_id, textarea_id){
	// message_id is the object id of the message that is being edited (needs to be sent to api)
	// textarea_id is the css id of the textarea field where the new message is
	// console.log("message_id: " + message_id + ", textarea_id: " + textarea_id);
	const csrftoken = getCookie('csrftoken');
	// console.log(csrftoken);

	var textarea_sel = document.getElementById(textarea_id); // grab the textarea element
	const edited_message = textarea_sel.value; // the edited message
	// console.log("Written Text: " + edited_message); // Prints out the current text in the textarea box

	// Need to make post request here
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() { // Print or Alert response recieved from server
		if (xhr.readyState == XMLHttpRequest.DONE) {
			// alert(xhr.responseText);
			console.log("Recieved POST Response from Server: " + xhr.responseText);
		}
	}
	xhr.open("POST", '/message/edit/' + message_id.toString(), true);
	xhr.setRequestHeader('X-CSRFToken', csrftoken);
	xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	xhr.setRequestHeader("Accept", "application/json");
	xhr.send(JSON.stringify({
		"new_message": edited_message
	}));

	setTimeout(function (){
		reset_message(message_id);
	  }, 150); // delay by 150 milliseconds to wait for database update
	// reset_message(message_id); // return div to original state of printed message
}

async function reset_message(message_id){
	const post_id = "message_" + message_id.toString();
	const current_id = await return_current_user_id();
	// console.log("Resetting Div with ID of: " + post_id);
	
	// get_single_message_data(message_id); // DEBUG
	const message_data = await get_single_message_data(message_id, current_id);
	// console.log("Writer Name: " + message_data.writername + ", Writer ID: " + message_data.writer_id + ",\n Date: " + message_data.date + ", Content: " + message_data.content);

	// grab post div by id and set it equal to dummy value
	var post = document.getElementById(post_id);
	
	// Assign Variables for HTML Generation
	const content = message_data.content;
	const writer_id = message_data.writer_id;
	const writer = capitalizeFirstLetter(message_data.writername);
	// const writer = "1";
	const date = message_data.date; // TODO Format this date

	const numoflikes = message_data.numoflikes.toString(); 
	const liked_by = message_data.liked_by;
	var curr_user_likes_post = false // Assume false
	if(liked_by == "True"){
		curr_user_likes_post = true // Set true if current userlikes the post
	}

    const formatted_date = formatDate(date)
	// console.log("Content:\t\t" + content.toString() + "\nWriter:\t\t\t" + writer + "\nWriter ID:\t\t" + writer_id + "\nDate:\t\t\t" + date)

	// Generate HTML
	var html_str = "<h4>" + content + "</h4>" + "\n" + "<a href=userpage/" + writer_id + ">" + writer + "</a>" + "<br>\n" + "<span>" + date + "</span>";
	
	// Add number of likes and like/dislike button inside a new div
	html_str += "<br><div id=like_div_" + message_id + ">"
	html_str += "<h6 id=numoflikes_" + message_id + ">Likes: " + numoflikes + "</h6>";
	
	if(curr_user_likes_post){ // If the user likes the post, display the unlike button
		const onclick_unlike = " onclick=\"unlike_post('" + message_id + "','" + current_id+ "')\"" 
		html_str += "<br>";
		html_str += "<button id=unlike_button_" + message_id; 
		html_str += " type=\"button\"";
		html_str += " class=\"btn btn-outline-danger\""
		html_str += onclick_unlike;
		html_str += ">";
		html_str += "Unlike 💔"
		html_str +=  "</button>"
	} else { // if the user doesn't already like the post, display the like button
		const onclick_like = " onclick=\"like_post('" + message_id + "','" + current_id+ "')\"" 
		html_str += "<br>";
		html_str += "<button id=like_button_" + message_id;
		html_str += " type=\"button\"";
		html_str += " class=\"btn btn-outline-primary\""
		html_str += onclick_like;
		html_str += ">";
		html_str += "Like 💗"
		html_str +=  "</button>"
	}

	html_str += "</div>"
	
	const onclick_str = " onclick=\"edit_post('" + message_id + "','" + content+ "')\"" // calling the proper editing function
	html_str += "<br>";
	html_str += "<button" 
	html_str += " type=\"button\"";
	html_str += " class=\"btn btn-success\""
	html_str += onclick_str;
	html_str += ">";
	html_str += "Edit"
	html_str +=  "</button>"
	post.innerHTML = `${html_str}`;
}

async function get_single_message_data(message_id, current_id){
    // console.log("About To Fetch Data For: " + message_id);
    const data = await fetch('/message/content/' + message_id + '/' + current_id);
	const message_data = await data.json();
	// console.log("Writer Name: " + message_data.writername + ", Writer ID: " + message_data.writer_id + ",\n Date: " + message_data.date + ", Content: " + message_data.content);

	// var myArray = Object.values(message_data); // Can convert it into an array (optional)
	return message_data
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
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
        console.log("entered path to follow")
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
        console.log("entered path to unfollow")
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
		incrementFollowerCount(current_id, user_id); // increments the follower count
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
		decrementFollowerCount(current_id, user_id); // decrements the follower count
    });
}

function incrementFollowerCount(current_id, user_id){
	console.log("Follower Count Incremented");
	// Get current number of followers, by grabbing the string in the userFollowers tag and then getting the last char
	follower_num_init = document.getElementById("userFollowers").innerHTML.charAt(11); 
	follower_num_init_int = parseInt(follower_num_init);
	// console.log("Incrementing: " + follower_num_init_int.toString());
	follower_num_fin = follower_num_init_int + 1;
	// console.log("Incremented: " + follower_num_fin.toString());
	document.getElementById("userFollowers").innerHTML = "Followers: " + follower_num_fin.toString();
}

function decrementFollowerCount(current_id, user_id){
	console.log("Follower Count Decremented");
	// Get current number of followers, by grabbing the string in the userFollowers tag and then getting the last char
	follower_num_init = document.getElementById("userFollowers").innerHTML.charAt(11); 
	follower_num_init_int = parseInt(follower_num_init);
	// console.log("Decrementing: " + follower_num_init_int.toString());
	follower_num_fin = follower_num_init_int - 1;
	// console.log("Decremented: " + follower_num_fin.toString());
	document.getElementById("userFollowers").innerHTML = "Followers: " + follower_num_fin.toString();
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

	setTimeout(function () {
		// Get the number of messages on page by matching all ids that start with "message_", and get the length of that array
		var numOfMessagesOnPage = document.querySelectorAll('*[id^="message_"]').length;
		// console.log("Num Of Messages: " + numOfMessagesOnPage)
		if (numOfMessagesOnPage < 10) { // less than 10 messages means last page
			assignPreviousButton() // only show previous button 
		} else {
			assignBothButtons() // show previous AND next button
		}
	}, 150);

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
    // // Prevent negative numbers
    // if(new_counter < 0) {
    //     new_counter = 0;
    // }
	// Set element to updated number
	document.querySelector('#page_counter').innerHTML = new_counter.toString();
	// Clear current posts
	document.querySelector('#user_posts').innerHTML = ""
	// Load new posts
	loadUserPosts(user_id, new_counter);

	setTimeout(function () {
		if (new_counter == 0) { // on page 0
			assignNextButton() // only show mext button 
			console.log("Got to Zero")
		} else {
			assignBothButtons() // show previous AND next button
			console.log("Got to something else")
		}
	}, 150);

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

function assignNextButton(){
	post_id = "pageButtons"
	post = document.getElementById(post_id);
	post.innerHTML=`${"<button id=\"btnNext\" class=\"btn btn-danger btn-md center-block\" Style=\"width: 100px;\" OnClick=\"next_page()\" >Next</button>"}`;
}

function assignPreviousButton(){
	post_id = "pageButtons"
	post = document.getElementById(post_id);
	post.innerHTML=`${"<button id=\"btnPrevious\" class=\"btn btn-primary btn-md center-block\" Style=\"width: 100px;\" OnClick=\"previous_page()\" >Previous</button>"}`;
}

function assignBothButtons(){
	post_id = "pageButtons"
	post = document.getElementById(post_id);
	post.innerHTML=`${"<div id=\"pageButtons\" class=\"col-sm-12 text-center\"><button id=\"btnPrevious\" class=\"btn btn-primary btn-md center-block\" Style=\"width: 100px; margin: 2px\" OnClick=\"previous_page()\" >Previous</button><button id=\"btnNext\" class=\"btn btn-danger btn-md center-block\" Style=\"width: 100px; margin: 2px;\" OnClick=\"next_page()\" >Next</button></div>"}`;
}

function assignNoButtons(){
	post_id = "pageButtons"
	post = document.getElementById(post_id);
	post.innerHTML=`${""}`;
}