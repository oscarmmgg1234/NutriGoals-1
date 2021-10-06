//Create server call func for app
import {
  AuthSeverCall,
  APIBackend,
  UserBackend,
  APITokenCall,
} from './axios_config';

const saltRounds = 5;

{
  /*auth server calls*/
}
AuthSeverCall.defaults.timeout = 2000;
export const checkUsernameStatus = (username) => {
  let result;
  AuthSeverCall.get('/usernameStatus', {username: username}).then(function (
    res,
  ) {
    result = res.data.count;
  });
  return result;
};

export const registerUser = (username, name, email, password) => {
  AuthSeverCall.post('/register/user', {
    username: username,
    name: name,
    email: email,
    password: password
  });
};

