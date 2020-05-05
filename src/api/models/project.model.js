const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');

/**
 * Project Schema
 * @private
 */
const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    description: {
      type: String,
      index: true,
      minlength: 10,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Methods
 */
projectSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      'id',
      'userId',
      'title',
      'description',
      'thumbnail',
      'video',
      'source',
      'createdAt',
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
projectSchema.statics = {
  /**
   * Get project
   *
   * @param {ObjectId} id - The objectId of project.
   * @returns {Promise<Project, APIError>}
   */
  async get(id) {
    try {
      let project;

      if (mongoose.Types.ObjectId.isValid(id)) {
        project = await this.findById(id).exec();
      }
      if (project) {
        return project;
      }

      throw new APIError({
        message: 'Project does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List projects in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of projects to be skipped.
   * @param {number} limit - Limit number of projects to be returned.
   * @returns {Promise<Project[]>}
   */
  list({
    page = 1, perPage = 30, userId, word,
  }) {
    let options = omitBy({ userId }, isNil);
    if (word) {
      options = Object.assign(options, {
        title: { $regex: word, $options: 'i' },
      });
    }
    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Count projects
   *
   * @param {string} word - searchWord
   * @returns {Promise<Project[]>}
   */
  getSize({ userId, word }) {
    let options = omitBy({ userId }, isNil);
    if (word) {
      options = Object.assign(options, {
        title: { $regex: word, $options: 'i' },
      });
    }

    return this.count(options).exec();
  },
};

/**
 * @typedef Project
 */
module.exports = mongoose.model('Project', projectSchema);
