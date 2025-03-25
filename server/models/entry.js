"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Entry.belongsTo(models.Collection, {
        foreignKey: "collectionId",
        onDelete: "CASCADE"
      });
    }
  }
  Entry.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Title cannot be empty."
          }
        }
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Type cannot be empty."
          },
          isIn: {
            args: [["anime", "manga"]],
            msg: "Type must be either 'anime' or 'manga'."
          }
        }
      },
      progress: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: {
            args: true,
            msg: "Progress must be an integer."
          },
          min: {
            args: 0,
            msg: "Progress must be at least 0."
          }
        }
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      collectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Collections",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      jikanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Jikan ID cannot be empty."
          }
        }
      }
    },
    {
      sequelize,
      modelName: "Entry"
    }
  );
  return Entry;
};
