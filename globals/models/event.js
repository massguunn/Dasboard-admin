const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    location: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT, // Mengubah tipe data menjadi FLOAT untuk harga
      allowNull: false,
      validate: {
        min: 0, // Menambahkan validasi bahwa harga harus non-negatif
      },
    },
    image: {
      type: DataTypes.STRING,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false, // Mengubah agar end_date wajib diisi
      validate: {
        isAfterStart(value) {
          if (value <= this.start_date) {
            throw new Error("End date must be after start date");
          }
        },
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "events", // Menentukan nama tabel secara eksplisit
    timestamps: false,
  }
);

module.exports = Event;
