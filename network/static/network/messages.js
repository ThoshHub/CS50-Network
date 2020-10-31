document.addEventListener('DOMContentLoaded', function() {
	console.log("page loaded!")

	document.addEventListener('click', event => { //unused as of 20.10.29
		const element = event.target;
		console.log("Something was clicked")

		if (element.id == "submit_message_button") {
			// submit_message()
			
		}
		// need to test whether the element's id = "submit_message_button"
		// if it is, then send fetch request to create object in database
		// after that next step is to start displaying posts (maybe play with animations?)

		// new plan looks like we CAN't do that because django doesn't let us
		// if you go to the index.html page, the django form is submitted and the page is reloaded 
		// automatically so it HAS to be through django, no problem though
  })
});

function submit_message() { //unused as of 20.10.29
	console.log("message was submitted!")
}