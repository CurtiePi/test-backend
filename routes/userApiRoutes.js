const express               = require('express');
const passport              = require('passport');
const routingController     = require('../controllers/apiRoutingController');

const validator             = require('../middleware/validator.js');
const createVR              = validator.createVR;
const retrieveVR            = validator.retrieveVR;
const deleteVR              = validator.deleteVR;
const changeVR              = validator.changeVR;
const apiValidate           = validator.apiValidate;

const converter             = require('../middleware/utilities.js').converter;
const isVerified            = require('../middleware/security.js').bearerVerified;

const userAPIRouter         = express.Router();
module.exports              = userAPIRouter;

/**
 * @api {get} /list Request list of person
 * @apiName ListPerson
 *
 * @apiParam None
 *
 * @apiSuccess {JSON object} JSON object of person.
 */
userAPIRouter.get('/user/list', isVerified, routingController.getPersonList);

/**
 * @api {get} /user/:personId Request single person
 * @apiName GetPersonById
 *
 * @apiParam {String} personId Person's unique ID
 *
 * @apiSuccess {JSON object} JSON object of person.
 */
userAPIRouter.get('/user/:personId', isVerified, retrieveVR(), apiValidate, routingController.retrievePerson);

/**
 * @api {post} /enroll   single person
 * @apiName EnrollPerson
 *
 * @apiParam {String} personId Person's unique ID
 *
 * @apiSuccess {JSON object} JSON object of person.
 **/
userAPIRouter.post('/user/enroll', isVerified, converter, createVR(), apiValidate, routingController.enrollPerson);

/**
 * @api {post} /catalog   single or muliple  persons
 * @apiName CatalogPersons
 *
 * @apiParam {JSON obj}  criteria to search users on
 *
 * @apiSuccess {JSON object} JSON object of person(s).
 **/
userAPIRouter.post('/user/catalog', isVerified, converter, routingController.retrieveGroup);

/**
 * @api {post} /radar   single or muliple  persons
 * @apiName CatalogPersons
 *
 * @apiParam {JSON obj}  geo criteria to search users on
 *                       :position:  location obj - containing coordinates to search from
 *                       :distance: Integer - max distance to search in meters
 *                       
 * @apiSuccess {JSON object} JSON object of person(s).
 **/
userAPIRouter.post('/user/radar', isVerified, converter, routingController.retrieveInRange);

/**
 * @api {post} /rangeid   single or muliple  persons
 * @apiName CatalogPersons
 *
 * @apiParam {String}  userid of the user to search from
 * @apiParam {Integer} distance: max distance to search in meters
 *                       
 * @apiSuccess {JSON object} JSON object of person(s).
 **/
userAPIRouter.post('/user/rangeid', isVerified, converter, routingController.retrieveInRangeOfId);

/**
 * @api {post} /update  single person
 * @apiName UpdatePerson
 *
 * @apiParam {String} personId Person's unique ID and fields to be updated
 *
 * @apiSuccess {JSON object} JSON object of person.
 */
userAPIRouter.post('/user/update', isVerified, converter, changeVR(), apiValidate, routingController.updatePerson);

/**
 * @api {post} /remove   single person
 * @apiName GetPersonById
 *
 * @apiParam {String} personId Person's unique ID
 *
 * @apiSuccess {String} message confirming the deletion.
 */
userAPIRouter.post('/user/remove', isVerified, converter, deleteVR(), apiValidate, routingController.deletePerson);
