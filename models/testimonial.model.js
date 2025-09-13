const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Testimonial extends Model {
    static associate(models) {
      // If testimonials belong to a user/customer in future:
      // Testimonial.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  Testimonial.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Testimonial",
      tableName: "testimonials",
    }
  );

  return Testimonial;
};
