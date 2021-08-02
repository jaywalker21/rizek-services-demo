require("dotenv").config();

import * as CommuteService from "./src/service/commute-service";

/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: true
});

fastify.register(require("fastify-cors"), instance => (req, callback) => {
  const corsOptions = { origin: true };
  callback(null, corsOptions); // callback expects two parameters: error and options
});

// Setup our static files
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/" // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("fastify-formbody"));

/**
 * Our home page route
 *
 * returns hello world
 */
fastify.get("/", function(request, reply) {
  reply.send({ hello: "world" });
});

fastify.get("/locations", function(request, reply) {
  reply.send(CommuteService.getDistinctLocations());
});

fastify.get("/getBestMatchingDeals", function(request, reply) {
  const {
    query: { from, to, type }
  } = request;
  reply.send(CommuteService.getShortestPathBetweenTwoNodes(from, to, type));
});

// Run the server and report out to the logs
fastify.listen(process.env.PORT, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
