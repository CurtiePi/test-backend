const express                   = require('express');
const routingController         = require('../controllers/webRoutingController');
const validator                 = require('../middleware/validator.js');
const createVR                  = validator.createVR;
const retrieveVR                = validator.retrieveVR;
const updateVR                  = validator.updateVR;
const deleteVR                  = validator.deleteVR;
const webValidate               = validator.webValidate;
const converter                 = require('../middleware/utilities.js').converter;
const isLoggedIn                = require('../middleware/security.js').isLoggedIn;

const userWebRouter = express.Router();
module.exports = userWebRouter;


userWebRouter.get('/', routingController.goHome);
userWebRouter.get('/login',  routingController.signIn);
userWebRouter.get('/logout', routingController.logout);
userWebRouter.get('/register', routingController.enroll);

/**
 * @api {get} /list Request list of person
 * @apiName ListPerson
 *
 * @apiParam None
 *
 * @apiSuccess {JSON object} JSON object of person.
 */
userWebRouter.get('/user/list', isLoggedIn, routingController.getPersonList);

/**
 * @api {get} /user/:personId Request single person
 * @apiName GetPersonById
 *
 * @apiParam {String} personId Person's unique ID
 *
 * @apiSuccess {JSON object} JSON object of person.
 */
userWebRouter.get('/user/:personId',isLoggedIn, converter, retrieveVR(), webValidate, routingController.retrievePerson);

/**
 * @api {post} /enroll/   single user
 * @apiName EnrollPersonById
 *
 * @apiParam {String} personId Person's unique ID
 *
 * @apiSuccess {JSON object} JSON object of person.
 */
userWebRouter.post('/user/enroll', isLoggedIn, converter, createVR(), webValidate, routingController.enrollPerson);

/**
 * @api {post} /catalog/   single user
 * @apiName GetPersonByData
 *
 * @apiParam {JSON obj} criteria data for getting person(s)
 *
 * @apiSuccess {JSON object} JSON object of person(s).
 */
userWebRouter.post('/user/catalog', isLoggedIn,  routingController.retrievePeople);


/**
 * @api {post} /update   single person
 * @apiName UpdatePerson
 *
 * @apiParam {String} personId Person's unique ID
 *
 * @apiSuccess {JSON object} JSON object of person.
 */
userWebRouter.post('/user/update', isLoggedIn, converter, updateVR(), webValidate, routingController.updatePerson);

/**
 * @api {post} /rangeid   single or muliple  persons
 * @apiName CatalogPersons
 *
 * @apiParam {String}  userid of the user to search from
 * @apiParam {Integer} distance: max distance to search in meters
 *                       
 * @apiSuccess {JSON object} JSON object of person(s).
 **/
userWebRouter.post('/user/rangeid', isLoggedIn, converter, routingController.retrievePeopleRangeOfId);

/**
 * @api {post} /remove   single person
 * @apiName RemovePerson
 *
 * @apiParam {String} personId Person's unique ID
 *
 * @apiSuccess {String} message confirming the deletion.
 */
userWebRouter.post('/user/remove', isLoggedIn, converter, deleteVR(), webValidate, routingController.deletePerson);
