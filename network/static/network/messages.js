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
		console.log("line 22")
		console.log(data);
	
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
	// const writer = await get_user(writer_id);
	const writer = "1";
	const date = element.fields.date; // TODO Format this date
	var test = ""
	
	// TODO because of await, instead of generating html return an array of sorted html_str and generate that in the calling function
	var arr = [];
	//array.push(value);
	//This will add another item to it.
	//To take one off, use array.pop();



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

function submit_message() { //unused as of 20.10.29
	console.log("message was submitted!")
}