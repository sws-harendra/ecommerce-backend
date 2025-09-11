"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate(models) {
      // Blog belongs to User (author)
      Blog.belongsTo(models.User, {
        foreignKey: "authorId",
        as: "author",
      });
    }
  }

  Blog.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title is required",
          },
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Slug is required",
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Content is required",
          },
        },
      },
      excerpt: {
        type: DataTypes.TEXT,
      },
      featuredImage: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM("draft", "published"),
        defaultValue: "draft",
      },
      metaTitle: {
        type: DataTypes.STRING,
      },
      metaDescription: {
        type: DataTypes.TEXT,
      },
      metaKeywords: {
        type: DataTypes.STRING,
      },
      authorId: {
        type: DataTypes.INTEGER,

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      publishedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Blog",
      tableName: "Blogs",
      paranoid: true, // Enable soft delete
      hooks: {
        beforeCreate: (blog) => {
          if (blog.status === "published" && !blog.publishedAt) {
            blog.publishedAt = new Date();
          }
        },
        beforeUpdate: (blog) => {
          if (
            blog.changed("status") &&
            blog.status === "published" &&
            !blog.publishedAt
          ) {
            blog.publishedAt = new Date();
          }
        },
      },
    }
  );

  return Blog;
};
