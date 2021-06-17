const problemsResolvers = require("./problem")
const adminResolvers = require("./admin")
const userResolvers = require("./user");


module.exports = {
  Part: {
    __resolveType(part, context, info){
      if(part.question){
        return 'Question'
      }
      else if(part.body){
        return 'Slide'
      }

      return null;
    }
  },
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