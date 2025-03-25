"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Collection.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE"
      });
      Collection.hasMany(models.Entry, {
        foreignKey: "collectionId",
        onDelete: "CASCADE"
      });
    }
  }
  Collection.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Collection name cannot be empty."
          },
          notNull: {
            args: true,
            msg: "Collection name cannot be empty."
          }
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "User ID must be an integer."
          },
          notNull: {
            args: true,
            msg: "User ID cannot be empty."
          }
        },
        references: {
          model: "Users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      }
    },
    {
      sequelize,
      modelName: "Collection"
    }
  );
  return Collection;
};
