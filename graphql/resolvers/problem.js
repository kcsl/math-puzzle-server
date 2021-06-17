const Problem = require("../../models/problem");
const Part = require("../../models/part");
const {adminAuth} = require("../../utils/check-auth");

// * Adds problem part in database
async function addPart(part, ProblemID, index) {
  const newPart = new Part({
    ...part,
    index,
    ProblemID,
  });

  return newPart.save().then((part) => {
    return {
      id: part._id,
      ...part._doc,
    };
  });
}

// * Gets all the parts for a specific problem
async function getParts(ProblemID) {
  return Part.find({ ProblemID }).sort({index:1}).then((res) => res);
}

module.exports = {
  Query: {
    // * Get all problems
    async getProblems() {
      try {
        const problems = await Problem.find();

        const allProblems = problems.map((problem) => {
          return getParts(problem._id).then((parts) => {
            return {
              id: problem._id,
              ...problem._doc,
              parts,
            };
          });
        });

        return Promise.all(allProblems).then((res) => res);
      } catch (err) {
        throw new Error(err);
      }
    },

    // * Get a specific problem given a specific problem id
    async getProblem(_, { problemID }) {
      try {
        const problem = await Problem.findById(problemID);
        if (problem) {
          return getParts(problemID).then((parts) => {
            return {
              id: problemID,
              ...problem._doc,
              parts,
            };
          });
        } else {
          throw new Error("Problem not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    // * Get a problems's parts
    async getParts(_, { problemID }) {
      try{
        return await getParts(problemID);
      }
      catch(err){
        throw new Error(err)
      }
    }
  },
  Mutation: {
    // * Create a problem
    async createProblem(
      _,
      { newProblemInput: { title, parts, topic } },
      context
    ) {
      const user = adminAuth(context);

      if(user.role !== "admin" && user.role !== "writer"){
        throw new Error('User does not have correct role!')
      }

      const newProblem = new Problem({
        title,
        topic,
        sections: parts.length,
        createdBy: user.id,
        author: user.first_name +" "+ user.last_name,
        createdAt: new Date().toISOString(),
      });

      const problem = await newProblem.save();

      parts = parts.map((part, index) => addPart(part, problem._id, index));

      return {
        id: problem._id,
        ...problem._doc,
        parts,
      };
    },

    // * Update a problem
    async updateProblem(
      _,
      { problemID, problem: { title, parts, topic } },
      context
    ) {
      const user = adminAuth(context);

      if (
        user.role !== "admin" &&
        user.role !== "writer" &&
        user.role !== "editor"
      ) {
        throw new Error("User does not have correct role!");
      }

      try {
        await Problem.findByIdAndUpdate(problemID, {
          title,
          topic,
          sections: parts.length,
        });

        const problem = await Problem.findById(problemID);

        await Part.deleteMany({ ProblemID :  problemID });

        parts = parts.map((part, index) => addPart(part, problemID, index));

        return {
          id: problemID,
          ...problem._doc,
          parts,
        };
      } catch (err) {
        throw new Error(err);
      }
    },

    // * Delete problem
    async deleteProblem(_, { problemID }, context) {
      const user = adminAuth(context);

      if (user.role !== "admin" && user.role !== "writer") {
        throw new Error("User does not have correct role!");
      }

      try {
        const problem = await Problem.findByIdAndDelete(problemID);
        const parts = await Part.deleteMany({ ProblemID : problemID });
        return problemID;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
