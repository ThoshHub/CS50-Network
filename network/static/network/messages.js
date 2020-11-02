document.addEventListener('DOMContentLoaded', function() {
	console.log("page loaded!");
	fetch('/messages')
	.then(res => res.json())
	.then(data => {console.log(data);});

	document.addEventListener('click', event => { //unused as of 20.10.29
		const element = event.target;
		console.log("Something was clicked")

		// Unused
		// if (element.id == "submit_message_button") {
		// 	// submit_message()
			
		// }

	// Load first 10 messages
	// load()
  })
});

function load() {
	// var data = null
	fetch('/messages')
	.then(res => res.json)
	.then(data = console.log(data))
	//console.log(fetch('/messages'))
	// .then(response => response.json());
	// .then
}

// function get_emails(mailbox){
// 	fetch('/emails/' + mailbox)
// 	.then(response => response.json())
// 	.then(emails => {
// 		// Print emails
// 		console.log(emails);
		
// 		// ... do something else with emails ...
// 		emails.forEach(element => {
// 			console.log(mailbox)
// 			create_email_listing(element, mailbox) // Mailbox is passed in because the individual email view depends on what mailbox the mail is from in display_email()
// 		});
// 	});
// }

function submit_message() { //unused as of 20.10.29
	console.log("message was submitted!")
}