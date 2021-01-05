document.addEventListener('DOMContentLoaded', function() {
	var page_counter = document.querySelector('#page_counter').innerHTML // returns 0 upon load

	initialize(page_counter);

	document.addEventListener('click', event => {
		const element = event.target;
		console.log("Something was clicked");
	})
});

async function initialize(page_counter){
	const curr_id = await return_current_user_id();
	console.log("Starting Feed For User: " + curr_id.toString());

	fetch('/messages/followpage/' + curr_id + '/' + page_counter)
	.then(res => res.json())
	.then(data => {
		// Print data
		console.log(data);
	
		// data.forEach(element => {
		// 	// Display each element
		// 	display_message(element, current_id)
		// });
	});
}

async function return_current_user_id(){
    const id = await fetch('/user/current');
	const data = await id.json();
    return data.loggedin; // loggedin is the actual attribute name  of the id
}