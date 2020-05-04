const Joi = require('joi');

module.exports = {
  // GET /v1/projects
  listProjects: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
    },
  },

  // POST /v1/projects
  createProject: {
    body: {
      title: Joi.string().min(3).required(),
      description: Joi.string().min(10).required(),
      thumbnail: Joi.string().required(),
      video: Joi.string().required(),
      source: Joi.string().required(),
    },
  },

  // PATCH /v1/projects/:projectId
  updateProject: {
    body: {
      title: Joi.string().min(3),
      description: Joi.string().min(10),
      thumbnail: Joi.string(),
      video: Joi.string(),
      source: Joi.string(),
    },
    params: {
      projectId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },

  // POST /v1/projects/presigned-urls
  createPresignedUrls: {
    body: {
      data: Joi.array()
        .items(Joi.object().keys({
          name: Joi.string().required(),
          type: Joi.string().required(),
          public: Joi.bool(),
        }))
        .required(),
    },
  },

  // POST /v1/projects/public-s3-urls
  publicS3Urls: {
    body: {
      data: Joi.array().items(Joi.string().required()).required(),
    },
  },
};
