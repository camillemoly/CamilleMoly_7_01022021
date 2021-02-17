# Install modules
First, type `npm install` to install all the packages you need in the project.

# Before starting the server
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
`.env.test` also contains a `USER_TOKEN` that will be used to perform the tests.

# To start the server
Type `cd backend` to go to backend directory. Then type :
* `npm run dev` if you want to be in dev environment
* `npm run prod` if you want to be in prod environment

# To launch the tests
To launch the tests, type `npm test` or `npm run test` (from the backend directory again).

# Documentation API
You can consult API documentation just [here](https://documenter.getpostman.com/view/13743956/TWDTLyEE).