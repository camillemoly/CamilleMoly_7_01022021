# Before starting the server
You need to create 3 databases for each environment (test, dev, prod).<br>
Then, create 3 `.env` files for each database : `.env-test`, `.env-dev`, `.env-prod`.<br>
Each `.env` file contain :
* DB_`ENV`_NAME
* DB_`ENV`_USER
* DB_`ENV`_PASSWORD
* DB_`ENV`_HOST
* DB_`ENV`_DIALEC
* `ENV`_SECRET_KEY <br><br>
<!-- end of the list -->
`.env-test` also contains a `ENV`_USER_TOKEN that will be used to perform the tests.

# To start the server
Type `cd backend` to go to backend directory. Then type :
* `npm test` if you're in test environment
* `npm dev` if you're in dev environment
* `npm prod` if you're in prod environment

# Documentation API
You can consult API documentation just [here](https://documenter.getpostman.com/view/13743956/TWDTLyEE).