document.addEventListener('DOMContentLoaded', function() {
	// console.log("page loaded!");
	var page_counter = document.querySelector('#page_counter').innerHTML // returns 0 upon load
	// console.log(page_counter)
	load(page_counter) // load messages on page load

	document.addEventListener('click', event => { //unused as of 20.10.29
		const element = event.target;
		console.log("Something was clicked")
	})
});

async function load(page_counter) {
	// return the id of the logged in user
	const current_id = await return_current_user_id();
	// console.log("User Visiting: " + current_id);

	fetch('/messages/' + page_counter)
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

async function return_current_user_id(){
    //console.log("3 About To Fetch")
    const id = await fetch('/user/current');
    const data = await id.json();
    // console.log(data)
    return data.loggedin; // loggedin is the actual attribute name  of the id
}

// NOT USED as of 20.12.13 (also I have change the API so this function doesn't work anymore)
async function get_user(id) {
    const res = await fetch('/users/' + id);
    const data = await res.json();
    return data[0].name.toString();
}

async function display_message(element, current_id) {
	//console.log(element);
	//console.log("User Visiting: " + current_id);
	
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
	// console.log(post.id.toString())
	
	// url is a placeholder
	var html_str = "<h4>" + content + "</h4>" + "\n" + "<a href=userpage/" + writer_id + ">" + writer + "</a>" + "<br>\n" + "<span>" + date + "</span>";
	// Add Button to edit if it is the currently logged in user's own post
	if(writer_id == current_id){
		const onclick_str = " onclick=\"edit_post('" + post.id + "')\"" // calling the proper editing function
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
	document.querySelector('#index_messages').append(post);

	// Styling
	document.getElementById(post.id).style.border = "2px solid dodgerblue";
	document.getElementById(post.id).style.borderRadius = "15px";
	document.getElementById(post.id).style.padding = "10px";
	document.getElementById(post.id).style.marginBottom = "10px";
}

function edit_post(post_id){
	console.log("Editing Post: " + post_id)
	post = document.getElementById(post_id)
	post.innerHTML = "TEST"; 
	console.log("cleared")
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function next_page(){
	// console.log("You Clicked On Next Page!")
	// Get Current Number
	var page_counter = parseInt(document.querySelector('#page_counter').innerHTML);
	// Store and increment
	var new_counter = page_counter + 1;
	// Set element to updated number
	document.querySelector('#page_counter').innerHTML = new_counter.toString();
	// Clear current posts
	document.querySelector('#index_messages').innerHTML = ""
	// Load new posts
	load(new_counter);
	// Log which page you're on
	console.log(new_counter);
}

function previous_page(){
	// console.log("You Clicked On Previous Page!")
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
	document.querySelector('#index_messages').innerHTML = ""
	// Load new posts
	load(new_counter);
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