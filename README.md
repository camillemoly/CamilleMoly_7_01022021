# Install modules
Type `cd backend` then `npm install` to install all the necessary packages in the backend folder
Type `cd frontend` then `npm install` to install all the necessary packages in the frontend folder

# Server
  ## Before starting the server
  You need to create 3 databases for each environment (test, dev, prod).<br>
  Then, create 3 `.env` files for each database : `.env.test`, `.env.dev`, `.env.prod`.<br>
  Each `.env` file contain :
  * `DB_NAME`
  * `DB_USER`
  * `DB_PASSWORD`
  * `DB_HOST`
  * `DB_DIALEC`
  * `SECRET_KEY` <br>
  <!-- end of the list -->
  `.env.test` also contains `USER_EMAIL`,` USER_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` fields (see [Tests](#Tests) section).
  ## Start the server
  Type `cd backend` to go to backend folder. Then type :
  * `npm run test` or `npm test` if you want to be in test environment
  * `npm run dev` if you want to be in dev environment
  * `npm run prod` if you want to be in prod environment

# Begin with the app
Type `cd frontend` to go to frontend folder. Then type `npm run serve` to launch the web app.
Launch a server in an other terminal (see [Start the server](##Start-the-server)) and do these steps for each database.
  ## Create admin account
  First, you need to create an `admin` account :
  * Create a new user account
  * Then, edit manually in the database the `is_admin` field of this account to `1` <br>
  <!-- end of the list -->
  It defines the `is_admin` to `true` and gives admin rights to the account (modify/delete users, posts and comments of all database).
  ## Create the first user account
  Create the first `user` account without admin rights (modify/delete his own account, posts and comments).

# Tests
  ## Configure the tests
  First, you need to define in the `.env.test` the `ADMIN_EMAIL`, `ADMIN_PASSWORD` with the admin account you created.
  Then, do the same thing with `USER_EMAIL`, `USER_PASSWORD` with the admin account you created.
  To create these accounts, see [Begin with the app](#Begin-with-the-app) section.
  ## Launch the tests
  Start the server in the test environment (see [Start the server](##Start-the-server) section).
  On an other terminal, type `cd backend` then `npm run launch-test` to launch the backend tests.

# Documentation API
You can consult API documentation just [here](https://documenter.getpostman.com/view/13743956/TWDTLyEE).