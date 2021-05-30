const problemsResolvers = require("./problem")
const adminResolvers = require("./admin")
const userResolvers = require("./user");


module.exports = {
  Query: {
    ...problemsResolvers.Query,
    ...userResolvers.Query,
    ...adminResolvers.Query,
  },
  Mutation: {
    ...adminResolvers.Mutation,
    ...userResolvers.Mutation,
    ...problemsResolvers.Mutation,
  },
};