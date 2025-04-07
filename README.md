The project is a matching platform for hobby partners, similar to Tinder, where users connect based on shared interests and activities.
Finding hobby partners can be difficult if using most social media platforms. They typically focus on dating or professional networking rather than connecting people with shared interests. Our project DuoQue, is a matchmaking platform that focuses on connecting people based on their hobbies. These can include reading, gaming, painting, surfing, and any other niche interest that you can think of. By using matchmaking algorithms written in Javascript, our aim is to make it easier to connect compatible partners based on their shared profiles to create meaningful connections. 
This project aligns with the “X but for Y” capstone theme because it is “Tinder but for hobby partners.” The goal is to create a swipe-based, geosocial matchmaking system to connect users based on their shared interests rather than for romantic reasons. 
Unlike many existing applications that focus on social networking, DuoQue prioritizes activity-based connections. The app also incorporates event creation, chat rooms, and skill based matchmaking, making this a go to platform for hobby enthusiasts.

(Security Approach)
The app uses bcrypt to securely hash passwords before storing them in MongoDB, ensuring passwords are never saved in plain text. During login, bcrypt.compare() verifies the entered password against the stored hash. After successful login, the username is saved in localStorage to simulate session management, and access to pages like profile.html is restricted if no user is logged in. Input validation is handled client-side in validation.js, ensuring required fields are filled and passwords meet minimum criteria before form submission. All authentication routes are wrapped in try/catch blocks with meaningful error handling. While there are no user roles or advanced permissions at this stage, the current setup provides a basic, secure login system suitable for further development.

(Test Coverage)

Tools/Setup?
	Jest for unit testing and integration testing
	Supertest for API endpoint testing

What is tested?
	validation.test.js: Validates login and signup input on the client
	users.test.js: Tests Mongoose schema for required fields and valid user creation
	server.test.js: Tests endpoints like GET /index.html, POST /login, and 404 check
	signup.test.js: partially created, Tests new user creation

Known Limitations?
	No automated tests yet for /profile /update-bio /update-hobbies
	No tests for frontend rendering (JSDOM only used for form validation)
	No tests yet for role based access
 
(How to run)
	In order to start the server, run "npm start"
	In order to launch the testing suite, (server must be running) run "npm test"

 
