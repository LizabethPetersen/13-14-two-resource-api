# 13: Two-Resource Resource Mongo and Express API
[![Build Status](https://travis-ci.com/LizabethPetersen/13-14-two-resource-api.svg?branch=master)](https://travis-ci.com/LizabethPetersen/13-14-two-resource-api)

## Submission Instructions
* Read this document entirely and estimate how long this assignment will take.
* Work in a fork of this repository
* Work in a branch on your fork called `lab-13`
* Set up Travis CI to your forked repo
* **A deployed Heroku URL is not due until Lab 14, but you should start working on deployment for this lab now** 
* Create a pull request from your lab branch branch to your `master` branch
* Open a pull request to this repository
* Submit on canvas a question and observation,your original estimate, how long you spent, and a link to your pull request


## Learning Objectives  
* students will be able to work with the MongoDB database management system
* students will understand the primary concepts of working with a NoSQL database management system
* students will be able to create custom data models *(schemas)* through the use of mongoose.js using a clear one-to-many relationship
* students will be able to use mongoose.js helper methods for interacting with their database persistence layer

## Requirements

#### Feature Tasks
* create an HTTP Server using `express`
* utilize all the new dependencies used in lecture
* use the express `Router` to create a route for doing **RESTFUL CRUD** operations against your models
* create a resource model of your choice (that is different from the lecture models) that uses `mongoose.Schema` and `mongoose.model`. This model should be something that would make sense as the *one* in your *one-to-many* data relationship, and will be considered a  *document* in the Mongo database. E.g., in lecture code, one classroom can have many students. 
* create a resource model of your choice that makes sense as the *many* in your *one-to-many* data relationship. This will be considered a *subdocument* in the Mongo database.  

## Server Endpoints *this applies to BOTH of your models*
### `/api/resource-name`
* `POST` request
  * should pass data as stringifed JSON in the body of a post request to create a new resource

### `/api/resource-name/:id`
* `GET` request
  * should pass the id of a resource through the url endpoint to get a resource
    * **this should use `req.params`, not querystring parameters**
* `PUT` request
  * should pass data as stringifed JSON in the body of a put request to overwrite a pre-existing resource
* `DELETE` request
  * should pass the id of a resource though the url endpoint to delete a resource
    * **this should use `req.params`**

### Tests
* create a test that will ensure that your API returns a status code of 404 for routes that have not been registered
* create a series of tests to ensure that your `/api/resource-name` endpoint responds as described for each condition below:
 * `GET` - test 200, returns a resource with a valid body
 * `GET` - test 404, respond with 'not found' for valid requests made with an id that was not found
 * `PUT` - test 200, returns a resource with an updated body
 * `PUT` - test 400, responds with 'bad request' if no request body was provided
 * `PUT` - test 404, responds with 'not found' for valid requests made with an id that was not found
 * `POST` - test 400, responds with 'bad request' if no request body was provided
 * `POST` - test 200, returns a resource for requests made with a valid body
 
 ### Stretch Goals
 * Test your DELETE route for all success and error conditions
 * Test to ensure that if you remove a subdocument from your database, i.e. the *many* in your *one-to-many* data relationship, you have properly removed it from its parent document's array.
 * Try to implement a many-to-many relationship between your models or with a third model and test that code
 * If you use an `enum` property on your Mongoose schema, test for errors when trying to enter a value that isn't permitted on the schema
 * Research other cool things you can do with Mongoose by reading the docs and sharing your findings with the class!
