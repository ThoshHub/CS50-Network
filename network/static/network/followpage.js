document.addEventListener('DOMContentLoaded', function() {
	var page_counter = document.querySelector('#page_counter').innerHTML // returns 0 upon load

	initialize(page_counter);

	document.addEventListener('click', event => {
		const element = event.target;
		console.log("Something was clicked");
	})
});

async function return_current_user_id(){
    const id = await fetch('/user/current');
	const data = await id.json();
    return data.loggedin; // loggedin is the actual attribute name  of the id
}

async function initialize(page_counter){
	const current_id = await return_current_user_id();
	console.log("Starting Feed For User: " + current_id.toString());

	fetch('/messages/followpage/' + current_id + '/' + page_counter)
	.then(res => res.json())
	.then(data => {
		// Print data
		// console.log(data);
	
		data.forEach(element => {
			// Display each element
			display_message(element, current_id)
		});
	});
}

async function display_message(element, current_id) {
	//console.log(element);
	//console.log("User Visiting: " + current_id);
	
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
	// console.log(post.id.toString())
	
	// url is a placeholder
	var html_str = "<h4>" + content + "</h4>" + "\n" + "<a href=userpage/" + writer_id + ">" + writer + "</a>" + "<br>\n" + "<span>" + date + "</span>";
	
	// Add number of likes and like/dislike button inside a new div
	html_str += "<br><div id=like_div_" + element.pk + ">"
	html_str += "<h6 id=numoflikes_" + element.pk + ">Likes: " + numoflikes + "</h6>";
	
	if(curr_user_likes_post){ // If the user likes the post, display the unlike button
		const onclick_unlike = " onclick=\"unlike_post('" + element.pk + "','" + current_id+ "')\"" 
		html_str += "<br>";
		html_str += "<button div=unlike_button_" + element.pk; 
		html_str += " type=\"button\"";
		html_str += " class=\"btn btn-outline-danger\""
		html_str += onclick_unlike;
		html_str += ">";
		html_str += "Unlike 💔"
		html_str +=  "</button>"
	} else { // if the user doesn't already like the post, display the like button
		const onclick_like = " onclick=\"like_post('" + element.pk + "','" + current_id+ "')\"" 
		html_str += "<br>";
		html_str += "<button div=like_button_" + element.pk;
		html_str += " type=\"button\"";
		html_str += " class=\"btn btn-outline-primary\""
		html_str += onclick_like;
		html_str += ">";
		html_str += "Like 💗"
		html_str +=  "</button>"
	}

	html_str += "</div>"
	
	post.innerHTML = `${html_str}`;

	// Attach generated HTML to the messages div
	document.querySelector('#following_posts').append(post);

	// Styling
	document.getElementById(post.id).style.border = "2px solid dodgerblue";
	document.getElementById(post.id).style.borderRadius = "15px";
	document.getElementById(post.id).style.padding = "10px"; // not working so just added it to the #following_posts div instead
	document.getElementById(post.id).style.marginBottom = "10px";
}

async function like_post(message_id, current_id){
	console.log("User ID: " + current_id + " Liked Post: " + message_id + "!");
	const res = await fetch('/message/like/' + message_id + '/' + current_id);
    const data = await res.json();
	// console.log(data);

	reset_unlike_div(message_id, current_id); // pressing the like button creates the unlike button
}

async function unlike_post(message_id, current_id){
	console.log("User ID: " + current_id + " Unliked Post: " + message_id + "!");
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
	html_str += "<button div=unlike_button_" + message_id; 
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
	html_str += "<button div=like_button_" + message_id;
	html_str += " type=\"button\"";
	html_str += " class=\"btn btn-outline-primary\""
	html_str += onclick_like;
	html_str += ">";
	html_str += "Like 💗"
	html_str +=  "</button>"

	post.innerHTML = `${html_str}`;	
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
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