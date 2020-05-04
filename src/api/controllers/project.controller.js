const httpStatus = require('http-status');
const Project = require('../models/project.model');
const { v4: uuid } = require('uuid');
const {
  createPresignedUrls,
  removeFiles,
  generatePublicUrls,
} = require('../utils/fs');
const { getTodayYYYYMMDD } = require('../utils/utils');
/**
 * Load project and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const project = await Project.get(id);
    req.locals = { project };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get project
 * @public
 */
exports.get = (req, res) => res.json(req.locals.project.transform());

/**
 * Get logged in project info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.project.transform());

/**
 * Create new project
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const {
      user: { id: userId },
    } = req;
    const projectData = Object.assign({}, req.body, { userId });
    const project = new Project(projectData);
    const savedProject = await project.save();
    res.status(httpStatus.CREATED);
    res.json(savedProject.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Get S3 Presigned Urls for file upload
 * @public
 */
exports.getPresiendUrls = async (req, res, next) => {
  try {
    const rootPath = `${getTodayYYYYMMDD()}/${uuid()}/`;
    console.log(rootPath);
    const urls = await createPresignedUrls(rootPath, req.body.data);
    res.json(urls);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * Update existing project
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const { project } = req.locals;
    const filesToRemove = [];
    const keys = ['thumbnail', 'video', 'source'];

    keys.forEach((key) => {
      if (req.body[key] && project[key] !== req.body[key]) {
        filesToRemove.push(project[key]);
      }
    });

    const updatedProject = Object.assign(project, req.body);

    console.log(filesToRemove);
    if (filesToRemove.length > 0) await removeFiles(filesToRemove);

    const savedProject = await updatedProject.save();
    res.json(savedProject.transform());
  } catch (error) {
    console.warn(error);
    next(error);
  }
};

/**
 * Get project list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const projects = await Project.list(req.query);
    const transformedProjects = projects.map(e => e.transform());
    res.json(transformedProjects);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete project
 * @public
 */
exports.remove = async (req, res, next) => {
  const { project } = req.locals;

  try {
    const filesToRemove = [];
    const keys = ['thumbnail', 'video', 'source'];
    keys.forEach((key) => {
      filesToRemove.push(project[key]);
    });

    await removeFiles(filesToRemove);

    await project.remove();
    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};

/**
 * Get s3 public urls for private files
 * @public
 */
exports.publicS3Urls = async (req, res, next) => {
  try {
    const { data: privateUrls } = req.body;
    const publicUrls = await generatePublicUrls(privateUrls);
    res.json(publicUrls);
  } catch (error) {
    next(error);
  }
};
