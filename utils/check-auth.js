const { AuthenticationError } = require('apollo-server')

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

function userAuth(context){
    //context = { ... headers }
    const authHeader = context.req.headers.user_authorization;

    if(authHeader){
        //Bearer ....
        const token = authHeader.split("Bearer ")[1];
        if(token){

            if(token === "guest"){
                return {
                  id: "6082e63b04987ea62a595e3c",
                  email: "guest",
                  username: "guest",
                  role: "user",
                };
            }

            try{
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (err) {
                throw new AuthenticationError('Invalid/Expired token')
            }
        }
        throw new Error(`Authentiction token must be \`Bearer [token]\``)
    }
    throw new Error(`Authorization header must be provided`);

}

function adminAuth(context){
    //context = { ... headers }
    const authHeader = context.req.headers.admin_authorization;

    if(authHeader){
        //Bearer ....
        const token = authHeader.split("Bearer ")[1];
        if(token){

            if(token === "guest"){
                return {
                  id: "6082e63b04987ea62a595e3c",
                  email: "guest",
                  username: "guest",
                  role: "user",
                };
            }

            try{
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (err) {
                throw new AuthenticationError('Invalid/Expired token')
            }
        }
        throw new Error(`Authentiction token must be \`Bearer [token]\``)
    }
    throw new Error(`Authorization header must be provided`);
}


// * Check if user is authenticated
module.exports = {userAuth, adminAuth};