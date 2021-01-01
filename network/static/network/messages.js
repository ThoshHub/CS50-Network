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
	document.querySelector('#index_messages').append(post);

	// Styling
	document.getElementById(post.id).style.border = "2px solid dodgerblue";
	document.getElementById(post.id).style.borderRadius = "15px";
	document.getElementById(post.id).style.padding = "10px";
	document.getElementById(post.id).style.marginBottom = "10px";
}

function edit_post(message_id, init_content){
	const post_id = "message_" + message_id;
	// console.log("Editing Post: " + message_id + ", Content: " + init_content);
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
	
	// console.log("cleared");	
}

async function submit_edit(message_id, textarea_id){
	// message_id is the object id of the message that is being edited (needs to be sent to api)
	// textarea_id is the css id of the textarea field where the new message is
	console.log("message_id: " + message_id + ", textarea_id: " + textarea_id);
	const csrftoken = getCookie('csrftoken');
	// console.log(csrftoken);

	var textarea_sel = document.getElementById(textarea_id); // grab the textarea element
	const edited_message = textarea_sel.value; // the edited message
	// console.log("Written Text: " + edited_message); // Prints out the current text in the textarea box

	/// TODO grab the new text inputted by the user om the 'textarea_id' textarea
	/// then store it in a variable and replace "test_value" with that var in the xhr.send below
	/// then need to edit the views.py to make the change in the database
	// finally need to reset the div holding the message to whatever the new message

	// Need to make post request here
	//TODO: UNCOMMENT (commented for debugging purposes)
	// var xhr = new XMLHttpRequest();
	// xhr.onreadystatechange = function() { // Print or Alert response recieved from server
	// 	if (xhr.readyState == XMLHttpRequest.DONE) {
	// 		// alert(xhr.responseText);
	// 		console.log("Recieved POST Response from Server: " + xhr.responseText);
	// 	}
	// }
	// xhr.open("POST", 'message/edit/' + message_id.toString(), true);
	// xhr.setRequestHeader('X-CSRFToken', csrftoken);
	// xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	// xhr.setRequestHeader("Accept", "application/json");
	// xhr.send(JSON.stringify({
	// 	"new_message": edited_message
	// }));

	reset_message(message_id); // return div to original state of printed message
}

async function reset_message(message_id){
	const post_id = "message_" + message_id.toString();
	console.log("Resetting Div with ID of: " + post_id);
	
	// DEBUG
	get_single_message_data(message_id);
	//const message_data = await get_single_message_data(message_id);
	//console.log("2: " + message_data);

	// grab post div by id and set it equal to dummy value
	var post = document.getElementById(post_id);
	post.innerHTML = "TEST"


	// probably need to send a fetch request...
	// need the: 
}

async function get_single_message_data(message_id){
    console.log("About To Fetch Data For: " + message_id);
    const data = await fetch('/message/content/' + message_id);
	const message_data = await data.json();
	var myArray = Object.values(message_data);
    console.log("1: " + myArray.toString())
	
	
	// message_data.forEach(element => {
	// 	// Display each element
	// 	console.log(element)
	// });

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