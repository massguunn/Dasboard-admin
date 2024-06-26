const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const destinations = sequelize.define(
  "destinations",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    city: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.FLOAT,
    },
    price: {
      type: DataTypes.NUMBER,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: "created_at", // Define the column name explicitly to match the database
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: "updated_at", // Define the column name explicitly to match the database
    },
  },
  {
    // Additional options
    timestamps: false, // Disable Sequelize's built-in timestamp fields
  }
);

module.exports = destinations;
