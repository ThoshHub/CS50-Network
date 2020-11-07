document.addEventListener('DOMContentLoaded', function() {
	console.log("page loaded!");
	load() // load messages on page load

	document.addEventListener('click', event => { //unused as of 20.10.29
		const element = event.target;
		console.log("Something was clicked")
		
		// Unused
		// if (element.id == "submit_message_button") {
		// 	// submit_message()	
		// }

  })
});

function load() {
	fetch('/messages')
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

function get_user(id) {
	var returnVal = ""
	fetch('/users/' + id)
	.then(res => res.json())
	.then(data => {
		// console.log(data);
		// console.log(data[0]);
		// console.log(data[0].name); // returns name
		// console.log(data[0].name.toString()); // returns name
		// console.log(typeof(data[0].name)); // returns string
		returnVal = data[0].name.toString()
	})
	console.log("returnVal: ")
	console.log(returnVal)
	return returnVal;
	// TODO returnVal is blank even though it is set in the .then statement
}

function display_message(element) {
	//console.log(element);
	const content = element.fields.content;
	const writer_id = element.fields.writer;
	var writer = get_user(writer_id);
	const date = element.fields.date;
	
	// console.log(writer)
	
	// Create a new div for the email
	const post = document.createElement('div');
	post.id = "message_" + element.id // give each message a new id

	const html_str = "<h4>" + content + "</h4>" + "\n" + writer_id + "<br>\n" + date;
	post.innerHTML = `${html_str}`;

	// Attach generated HTML to the messages div
	document.querySelector('#index_messages').append(post);

	// TODO for the first one 
	document.getElementById(post.id).style.border = "2px solid dodgerblue";
	document.getElementById(post.id).style.borderRadius = "15px";
	document.getElementById(post.id).style.padding = "10px"
	document.getElementById(post.id).style.marginBottom = "10px"
	
	// Make link clickable
}

// REMOVE THIS FUNCTION
function get_emails(mailbox){
	fetch('/emails/' + mailbox)
	.then(response => response.json())
	.then(emails => {
		// Print emails
		console.log(emails);
		
		// ... do something else with emails ...
		emails.forEach(element => {
			console.log(mailbox)
			create_email_listing(element, mailbox) // Mailbox is passed in because the individual email view depends on what mailbox the mail is from in display_email()
		});
	});
}

function submit_message() { //unused as of 20.10.29
	console.log("message was submitted!")
}