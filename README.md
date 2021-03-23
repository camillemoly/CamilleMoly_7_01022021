![icon-left-font-monochrome-black - Copie](https://user-images.githubusercontent.com/65662608/112165838-656cb600-8bef-11eb-8e30-b2b0bfd8cba9.png)

# Install modules
Type `cd backend` then `npm install` to install all the necessary packages in the backend folder. <br>
Type `cd frontend` then `npm install` to install all the necessary packages in the frontend folder.

# Databases
You need to create **3 databases**, for each environment (test, dev, prod), named `groupomania_<ENV>`.
Each database has **4 tables**:
* **users** with 8 fields: id, email, password, first_name, last_name, profile_picture, about, is_admin
* **posts** with 5 fields: id, user_id, date, content, post_picture
* **likes** with 3 fields: id, user_id, post_id
* **comments** with 4 fields: id, user_id, post_id, content <br>
<!-- end of the list -->
Here the database diagram to show the connections between tables (primary key and foreign key): <br>
![database_diagram](https://user-images.githubusercontent.com/65662608/112166136-a95fbb00-8bef-11eb-89b9-892005330041.PNG) <br>


# Server
  ## Before starting the server
  Create 3 `.env` files for each database : `.env.test`, `.env.dev`, `.env.prod`.<br>
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
  * `npm run test` or `npm test` to be in test environment
  * `npm run dev` to be in dev environment
  * `npm run prod` to be in prod environment

# Begin with the app
Type `cd frontend` to go to frontend folder. Then type `npm run serve` to launch the web app.
Launch a server in an other terminal (see [Start the server](##Start-the-server)) and do these steps for **each database**.
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
  First, you need to define in the `.env.test` the `ADMIN_EMAIL`, `ADMIN_PASSWORD` with the admin account you created. <br>
  Then, do the same thing with `USER_EMAIL`, `USER_PASSWORD` with the admin account you created. <br>
  To create these accounts, see [Begin with the app](#Begin-with-the-app) section.
  ## Launch the tests
  Start the server in the test environment (see [Start the server](##Start-the-server) section). <br>
  On an other terminal, type `cd backend` then `npm run launch-test` to launch the backend tests.

# Documentation API
You can consult API documentation just **[here]**(https://documenter.getpostman.com/view/13743956/TWDTLyEE).
