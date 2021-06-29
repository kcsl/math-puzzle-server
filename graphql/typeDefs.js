const { gql } = require("apollo-server");

module.exports = gql`
  enum PartType {
    SLIDE
    QUESTION
  }

  interface Part {
    id: ID!
    ProblemID: ID!
    index: Int!
    completed: Boolean!
  }

  type Slide implements Part {
    id: ID!
    ProblemID: ID!
    index: Int!
    completed: Boolean!
    body: String!
  }

  type Question implements Part {
    id: ID!
    ProblemID: ID!
    index: Int!
    completed: Boolean!
    question: String!
    answer: String!
  }

  type Problem {
    id: ID!
    title: String!
    parts: [Part]!
    topic: String!
    sections: Int!
    createdAt: String!
    createdBy: ID!
    author: String!
    started: Boolean
  }

  type Admin {
    id: ID!
    username: String!
    email: String!
    token: String
    role: String!
    first_name: String!
    last_name: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    token: String
    problemsCompleted: [Problem]!
    role: String!
  }

  input PartInput {
    question: String
    answer: String
    explanation: String
    body: String
  }

  input ProblemInput {
    title: String!
    parts: [PartInput]!
    topic: String!
  }

  input AdminRegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
    role: String!
    first_name: String!
    last_name: String!
  }

  input UserRegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  type Query {
    getProblems: [Problem]!
    getProblem(problemID: ID!): Problem!
    getParts(problemID: ID): [Part]!

    getUser: User!

    getCompletedProblem(ProblemID: ID!): Problem!
    getCompletedPart(partID: ID!): Part!

    getAdmins: [Admin]!
  }

  type Mutation {
    adminRegister(registerInput: AdminRegisterInput): Admin!
    adminLogin(username: String!, password: String!): Admin!

    userRegister(registerInput: UserRegisterInput): User!
    userLogin(username: String!, password: String!): User!

    solvePart(partID: ID!): String!

    createProblem(newProblemInput: ProblemInput!): Problem!

    updateProblem(problemID: ID!, problem: ProblemInput!): Problem!
    deleteProblem(problemID: ID!): ID!
  }
`;
