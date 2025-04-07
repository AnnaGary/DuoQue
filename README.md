(Security Approach)

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
