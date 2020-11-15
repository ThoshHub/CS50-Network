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

// DELETE THIS
function get_user_1(id) {
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

// DELETE THIS
function get_user_2(id) {
	var data;
    // or $.get(...).then, or request(...).then, or query(...).then
    fetch('/users/' + id).then(function(response){
		data = response.json();
	});
	console.log(data)
    return data;
}

// DELETE THIS
function get_user_3(id) {
    var data;
    var data2;
    // or $.get(...).then, or request(...).then, or query(...).then
    fetch('/users/' + id).then(function(response){
        data = response.json();
        data.then(function(result){
            // console.log(result[0].name)
			data2 = result[0].name
			return data2;
        });
    });
    //console.log(data2) // THIS Doesn't Work, I need to review JS Promises
    //return data;
}

// DELETE THIS
function get_user_4(id) {
    // RETURN the promise
    return fetch('/users/' + id).then(function(response){
		data = response.json();
    	return data // process it inside the `then`
	});
}

// DELETE THIS
async function get_user_5(id) {
	fetch('/users/' + id)
	.then(res => res.json())
	.then(data => {
		returnVal = data[0].name.toString()
	})
	console.log("returnVal: ")
	console.log(returnVal)
	return returnVal; // returnVal is blank even though it is set in the .then statement
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
	const writer = await get_user(writer_id);
	const date = element.fields.date; // TODO Format this date
	var test = ""
	
	// TODO because of await, instead of generating html return an array of sorted html_str and generate that in the calling function

	// Create a new div for the email
	var post = document.createElement('div');
	post.id = "message_" + element.pk; // give each message a new id, id = pk

	const html_str = "<h4>" + content + "</h4>" + "\n" + writer + "<br>\n" + date;
	post.innerHTML = `${html_str}`;

	// Attach generated HTML to the messages div
	document.querySelector('#index_messages').append(post);

	// TODO for the first one 
	document.getElementById(post.id).style.border = "2px solid dodgerblue";
	document.getElementById(post.id).style.borderRadius = "15px";
	document.getElementById(post.id).style.padding = "10px";
	document.getElementById(post.id).style.marginBottom = "10px";

	// Make link clickable
}

// DELETE THIS
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

// DELETE THIS
function get_emails(mailbox){
	fetch('/emails/' + mailbox)
	.then(response => response.json())
	.then(emails => {
		// Print emails
		console.log(emails);
		\
		emails.forEach(element => {
			console.log(mailbox)
			create_email_listing(element, mailbox)
		});
	});
}