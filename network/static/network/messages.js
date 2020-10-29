document.addEventListener('DOMContentLoaded', function() {
	console.log("page loaded!")

	document.addEventListener('click', event => {
	  const element = event.target;
	  console.log("Something was clicked")
	  // need to test whether the element's id = "submit_message_button"
	  // if it is, then send fetch request to create object in database
	  // after that next step is to start displaying posts (maybe play with animations?)
  })
});