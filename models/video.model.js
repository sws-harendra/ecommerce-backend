const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    static associate(models) {
      // 🔗 Each video belongs to a Product
      Video.belongsTo(models.Product, { foreignKey: "productId" });
    }
  }

  Video.init(
    {
      videoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Video",

      timestamps: true, // createdAt / updatedAt
    }
  );

  return Video;
};
