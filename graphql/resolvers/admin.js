const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError} = require("apollo-server");

const Admin = require("../../models/admin");
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators')

const {adminAuth} = require("../../utils/check-auth");
const SECRET_KEY = process.env.SECRET_KEY;

function generateToken(user){
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
}

module.exports = {
  Query: {
    async getAdmins() {
      try{
        const admins = await Admin.find();
        return admins;
      }
      catch(err){
        throw new Error(err)
      }
    }
  },
  Mutation: {
    // * Register Admin
    async adminRegister(
      _,
      { registerInput: { username, email, password, confirmPassword, role, first_name, last_name} },
      context
    ) {
      if (adminAuth(context).role !== "admin") {
        throw new Error("Only administrators can add admins.");
      }

      //validate user data

      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //Make sure user doesn't exist

      const admin = await Admin.findOne({ username });
      if (admin) {
        throw new UserInputError("This username is taken.");
      }

      //hash password and create auth token

      password = await bcrypt.hash(password, 12);

      const newAdmin = new Admin({
        email,
        password,
        username,
        createdAt: new Date().toISOString(),
        role,
        first_name,
        last_name,
      });

      const res = await newAdmin.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
        role: "admin",
      };
    },

    // * Login Admin
    async adminLogin(_, { username, password }){
        const {errors, valid} = validateLoginInput(username, password)
        const admin = await Admin.findOne({username})

        if(!valid){
            throw new UserInputError('Errors', {errors})
        }

        if(!admin){
            errors.general = 'Admin not found'
            throw new UserInputError('Admin not found', {errors})
        }

        const match = await bcrypt.compare(password, admin.password)
        if(!match){
            errors.general = "Wrong credentials";
            throw new UserInputError("Wrong credentials", { errors });
        }

        const token = generateToken(admin);

        return {
          ...admin._doc,
          id: admin._id,
          token,
          role: "admin"
        };
    }
  },
};
