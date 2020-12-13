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

function load(page_counter) {
	fetch('/messages/' + page_counter)
	.then(res => res.json())
	.then(data => {
		// Print data
		// console.log(data);
	
		data.forEach(element => {
			// Display each element
			display_message(element)
		});
	});
}

async function get_user(id) {
    const res = await fetch('/users/' + id);
    const data = await res.json();
    return data[0].name.toString();
}

async function display_message(element) {
	//console.log(element);
	const content = element.fields.content;
	const writer_id = element.fields.writer;
	const writer = capitalizeFirstLetter(element.fields.writername);
	// const writer = "1";
	const date = element.fields.date; // TODO Format this date
	var test = ""

	// Create a new div for the email
	var post = document.createElement('div');
	post.id = "message_" + element.pk; // give each message a new id, id = pk

	// url is a placeholder
	const html_str = "<h4>" + content + "</h4>" + "\n" + "<a href=userpage/" + writer_id + ">" + writer + "</a>" + "<br>\n" + date;
	post.innerHTML = `${html_str}`;

	// Attach generated HTML to the messages div
	document.querySelector('#index_messages').append(post);

	// TODO for the first one 
	document.getElementById(post.id).style.border = "2px solid dodgerblue";
	document.getElementById(post.id).style.borderRadius = "15px";
	document.getElementById(post.id).style.padding = "10px";
	document.getElementById(post.id).style.marginBottom = "10px";
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
	// Set element to updated number
	document.querySelector('#page_counter').innerHTML = new_counter.toString();
	// Clear current posts
	document.querySelector('#index_messages').innerHTML = ""
	// Load new posts
	load(new_counter);
	// Log which page you're on
	console.log(new_counter);
}