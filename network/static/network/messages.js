document.addEventListener('DOMContentLoaded', function() {
	console.log("page loaded!");


	document.addEventListener('click', event => { //unused as of 20.10.29
		const element = event.target;
		console.log("Something was clicked")
		load()
		
		// Unused
		// if (element.id == "submit_message_button") {
		// 	// submit_message()
			
		// }

	// Load first 10 messages
	// load()
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

function display_message(element) {
	// console.log(element)
	const content = element.fields.content
	const writer = element.fields.writer
	const date = element.fields.date
	// console.log(date)
	
	// Create a new div for the email
	const post = document.createElement('div')
	post.id = "message_" + element.id // give each message a new id

	const html_str = "<h4>" + content + "</h4>" + "\n" + writer + "<br>\n" + date
	post.innerHTML = `${html_str}`
	document.querySelector('#index_messages').append(post);

	// Attach generated HTML to the messages div
	//document.querySelector('#index_messages').append(post);
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