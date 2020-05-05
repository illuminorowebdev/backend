const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/project.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');
const {
  listProjects,
  createProject,
  updateProject,
  createPresignedUrls,
  publicS3Urls,
} = require('../../validations/project.validation');

const router = express.Router();

/**
 * Load project when API with projectId route parameter is hit
 */
router.param('projectId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/projects List Projects
   * @apiDescription Get a list of projects
   * @apiVersion 1.0.0
   * @apiName ListProjects
   * @apiGroup Project
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Users per page
   *
   * @apiSuccess {Object[]} users List of users.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(validate(listProjects), controller.list)
  /**
   * @api {post} v1/projects Create Project
   * @apiDescription Create a new project
   * @apiVersion 1.0.0
   * @apiName CreateProject
   * @apiGroup Project
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String{3..}}     title         Project's title
   * @apiParam  {String{10..}}    description   Project's description
   * @apiParam  {String}          thumbnail     Project's thumbnail
   * @apiParam  {String}          video         Project's video
   * @apiParam  {String}          source        Project's source
   *
   * @apiSuccess (Created 201) {String}  id           Project's id
   * @apiSuccess (Created 201) {String}  title        Project's title
   * @apiSuccess (Created 201) {String}  description  Project's description
   * @apiSuccess (Created 201) {String}  video        Project's video
   * @apiSuccess (Created 201) {String}  source       Project's source
   * @apiSuccess (Created 201) {Date}    createdAt    Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createProject), controller.create);

router
  .route('/presigned-urls')
  .post(
    authorize(ADMIN),
    validate(createPresignedUrls),
    controller.getPresiendUrls,
  );

router
  .route('/public-s3-urls')
  // get public urls for private s3 objects
  .post(validate(publicS3Urls), controller.publicS3Urls);

router
  .route('/:projectId([a-fA-F0-9]{24})')
  /**
   * @api {get} v1/projects/:id Get User
   * @apiDescription Get project information
   * @apiVersion 1.0.0
   * @apiName GetProject
   * @apiGroup Project
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {String}  id           Project's id
   * @apiSuccess {String}  title        Project's title
   * @apiSuccess {String}  description  Project's description
   * @apiSuccess {String}  video        Project's video
   * @apiSuccess {String}  source       Project's source
   * @apiSuccess {Date}    createdAt    Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(controller.get)
  /**
   * @api {patch} v1/projects/:id Update Project
   * @apiDescription Update some fields of a project document
   * @apiVersion 1.0.0
   * @apiName UpdateProject
   * @apiGroup Project
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String{3..}}     title         Project's title
   * @apiParam  {String{10..}}    description   Project's description
   * @apiParam  {String}          thumbnail     Project's thumbnail
   * @apiParam  {String}          video         Project's video
   * @apiParam  {String}          source        Project's source
   * (You must be an admin to change the user's role)
   *
   * @apiSuccess {String}  id           Project's id
   * @apiSuccess {String}  title        Project's title
   * @apiSuccess {String}  description  Project's description
   * @apiSuccess {String}  video        Project's video
   * @apiSuccess {String}  source       Project's source
   * @apiSuccess {Date}    createdAt    Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(authorize(ADMIN), validate(updateProject), controller.update)
  /**
   * @api {patch} v1/projects/:id Delete Project
   * @apiDescription Delete a project
   * @apiVersion 1.0.0
   * @apiName DeleteProject
   * @apiGroup Project
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      User does not exist
   */
  .delete(authorize(ADMIN), controller.remove);

module.exports = router;
