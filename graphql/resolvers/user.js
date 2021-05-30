const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { SECRET_KEY } = require("../../config");

const User = require("../../models/user");
const Problem = require("../../models/problem");
const UserProblem = require("../../models/UserProblems");
const Part = require("../../models/part");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");
const {userAuth} = require("../../utils/check-auth");


//TODO Make better roles / privilages system

// * Generate token for user
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: 'user'
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

// * Get completed problem object with problemID and userID
async function getProblemCompleted(problem, userID){
  const ProblemID = problem._id;

  const parts = await Part.find({ ProblemID}).sort({ index: 1 });
  
  return {
    id : ProblemID,
    ...problem._doc,
    started: await UserProblem.exists({ProblemID, userID}),
    parts: await parts.map(async (part) => {
      return {
        id: part._id,
        ...part._doc,
        completed: await UserProblem.exists({
          partID: part._id,
          userID,
        }),
      };
    })
  }
}

// * Get all the completed problems for a user
async function getUserCompleted(userID){
  const allProblems = await Problem.find();

  return await allProblems.map((problem) => getProblemCompleted(problem, userID));
}

module.exports = {
  Query: {
    // * Get completed problem object
    async getCompletedProblem(_, {ProblemID}, context){
      const user = userAuth(context);

      if (user.role !== "user") {
        throw new Error("Admin cannot call this route!");
      }

      try{
        const problem = await Problem.findById(ProblemID);
        return getProblemCompleted(problem, user.id);
      } catch (err) {
        throw new Error(err);
      }
    },

    // *  Get completed part object
    async getCompletedPart(_, {partID}, context){
      const user = userAuth(context);

      if(user === 'guest'){
        return {}
      }

      if(user.role !== "user"){
        throw new Error("Admin cannot call this route!");
      }

      try {

        const part = await Part.findById(partID);

        return {
          id : partID,
          ...part._doc,
          completed : await UserProblem.exists({partID, userID : user.id})
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async getUser(_, {}, context){
      const user = userAuth(context);

      try{
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          problemsCompleted: await getUserCompleted(user.id),
          role : 'user'
        };
      }
      catch(err) {
        throw new Error(err)
      }
    }
  },
  Mutation: {
    // * Register User
    async userRegister(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      // validate user data

      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // make sure user doesn't exist

      const user = await User.findOne({ username });
      if (user) {
        errors.username = "This username is taken.";
        throw new UserInputError("Errors", { errors });
      }

      // hash password and create auth token

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password,
        username,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
        problemsCompleted: [],
        role: "user"
      };
    },

    // * Login User
    async userLogin(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
      const user = await User.findOne({ username });

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
        problemsCompleted: getUserCompleted(user._id),
        role: "user"
      };
    },

    // * Solve Part
    async solvePart(_, {partID}, context){
      const user = userAuth(context);

      if (user.role !== "user") {
        throw new Error("Admin cannot call this route!");
      }

      if(user.username === 'guest') return 'You are a guest. Please sign in!'
      
      const part = new UserProblem({
        userID: user.id,
        partID
      });

      await part.save();

      return "Part solved successfully!";
    }
  },
};
