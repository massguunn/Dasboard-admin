const Hapi = require("@hapi/hapi");
const Joi = require("joi");
const sequelize = require("./db");
const destinations = require("./models/destinasi");
const events = require("./models/event");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      cors: true, // Set to true to enable CORS for all routes
    },
  });

  // Sinkronisasi database
  await sequelize.sync();

  // CREATE destinasi
  server.route({
    method: "POST",
    path: "/destinations",
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          description: Joi.string().required(),
          location: Joi.string().required(),
          rating: Joi.number().required(),
          price: Joi.number().required(),
          image_url: Joi.string().required(),
        }),
        failAction: (request, h, err) => {
          return err;
        },
      },
    },
    handler: async (request, h) => {
      const { name, description, location, rating, price, image_url } =
        request.payload;
      try {
        const destinasi = await destinations.create({
          name,
          description,
          location,
          rating,
          price,
          image_url,
        });
        return h.response(destinasi).code(201);
      } catch (error) {
        console.error("Error creating destination:", error);
        return h.response("Internal server error").code(500);
      }
    },
  });

  // untuk Get All destinasi
  server.route({
    method: "GET",
    path: "/destinations",
    handler: async (request, h) => {
      try {
        const destinasi = await destinations.findAll();
        return destinasi;
      } catch (err) {
        console.error("Error fetching destinations:", err);
        return h.response("Internal server error").code(500);
      }
    },
  });

  // untuk Get by ID destinasi
  server.route({
    method: "GET",
    path: "/destinations/{id}",
    handler: async (request, h) => {
      const { id } = request.params;
      try {
        const destinasi = await destinations.findByPk(id);
        if (!destinasi) {
          return h.response({ error: "Destination not found" }).code(404);
        }
        return destinasi;
      } catch (error) {
        console.error("Error fetching destination:", error);
        return h.response("Internal server error").code(500);
      }
    },
  });

  // UPDATE destinasi
  server.route({
    method: "PUT",
    path: "/destinations/{id}",
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          description: Joi.string().required(),
          location: Joi.string().required(),
          rating: Joi.number().required(),
          price: Joi.number().required(),
          image_url: Joi.string().required(),
        }),
        failAction: (request, h, err) => {
          return err;
        },
      },
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const { name, description, location, rating, price, image_url } =
        request.payload;
      try {
        let destinasi = await destinations.findByPk(id);
        if (!destinasi) {
          return h.response({ error: "Destination not found" }).code(404);
        }
        destinasi.name = name;
        destinasi.description = description;
        destinasi.location = location;
        destinasi.rating = rating;
        destinasi.price = price;
        destinasi.image_url = image_url;
        await destinasi.save();
        return destinasi;
      } catch (error) {
        console.error("Error updating destination:", error);
        return h.response("Internal server error").code(500);
      }
    },
  });

  // DELETE destinasi
  server.route({
    method: "DELETE",
    path: "/destinations/{id}",
    handler: async (request, h) => {
      const { id } = request.params;
      try {
        const destinasi = await destinations.findByPk(id);
        if (!destinasi) {
          return h.response({ error: "Destination not found" }).code(404);
        }
        await destinasi.destroy();
        return { message: "Destination deleted" };
      } catch (error) {
        console.error("Error deleting destination:", error);
        return h.response("Internal server error").code(500);
      }
    },
  });

  // untuk membuat data event
  server.route({
    method: "POST",
    path: "/events",
    options: {
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          description: Joi.string().required(),
          location: Joi.string().required(),
          start_date: Joi.date().required(),
          end_date: Joi.date()
            .required()
            .min(Joi.ref("start_date"))
            .message("End date must be greater than or equal to start date"),
        }),
        failAction: (request, h, err) => {
          return err;
        },
      },
    },
    handler: async (request, h) => {
      const { title, description, location, start_date, end_date } =
        request.payload;
      try {
        const event = await events.create({
          title,
          description,
          location,
          start_date,
          end_date,
        });
        return h.response(event).code(201);
      } catch (error) {
        console.error("Error creating destination:", error);
        return h.response("Internal server error").code(500);
      }
    },
  });

  //untuk get All event
  server.route({
    method: "GET",
    path: "/events",
    handler: async (request, h) => {
      try {
        const event = await events.findAll();
        return event;
      } catch (err) {
        console.error("error saat mengmbil data event:", err);
        return h.response("internar server error").code(500);
      }
    },
  });

  //untuk get by id event
  server.route({
    method: "GET",
    path: "/events/{id}",
    handler: async (request, h) => {
      const { id } = request.params;
      try {
        const event = await events.findByPk(id);
        if (!event) {
          return h.response({ error: "event not found" }).code(400);
        }
        return event;
      } catch (error) {
        console.error("gagal mengambil data event dengan id:", error);
        return h.response("internal server error").code(500);
      }
    },
  });

  //untuk update event
  server.route({
    method: "PUT",
    path: "/events/{id}",
    options: {
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          description: Joi.string().required(),
          location: Joi.string().required(),
          start_date: Joi.date().required(),
          end_date: Joi.date()
            .required()
            .min(Joi.ref("start_date"))
            .message("End date must be greater than or equal to start date"),
        }),
        failAction: (request, h, err) => {
          return err;
        },
      },
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const { title, description, location, start_date, end_date } =
        request.payload;
      try {
        let event = await events.findByPk(id);
        if (!event) {
          return h.response({ error: "event not found" }).code(404);
        }
        event.title = title;
        event.description = description;
        event.location = location;
        event.start_date = start_date;
        event.end_date = end_date;
        await event.save();
        return event;
      } catch (error) {
        console.error("Error creating destination:", error);
        return h.response("Internal server error").code(500);
      }
    },
  });

  //untuk delete event
  server.route({
    method: "DELETE",
    path: "/events/{id}",
    handler: async (request, h) => {
      const { id } = request.params;
      try {
        const event = await events.findByPk(id);
        if (!event) {
          return h.response({ error: "event not pound" }).code(400);
        }
        await event.destroy();
        return { message: "Berhasil di hapus" };
      } catch (error) {
        console.error("gagal menghapus event:", error);
        return h.response("internal server error").code(500);
      }
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

init();
