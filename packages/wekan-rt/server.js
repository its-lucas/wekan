/**
 * Handles an RT Login
 * @typedef {{
 *  rt?: boolean
 *  username: string
 *  rtPassword: string
 * }} LoginRequest
 * @param {LoginRequest} request The login request
 */
function loginHandler(request) {
  if (!request.rt) {
    return undefined;
  }

  try {
  console.log('Being called');

  const username = request.username;
  const password = request.rtPassword;

    const response = HTTP.get(`https://rt.fontis.com.au/REST/2.0/user/${username}`, {
      auth: `${username}:${password}`
    });

    // TODO: This could be 401 for unauthorized
    if (response.statusCode !== 200) {
      throw new Error('Either the username or password are incorrect');
    }

    const { EmailAddress: email, RealName: name } = response.data;

    const user = Meteor.users.findOne({ username });

    if (!user) {
      const _id = Accounts.createUser({
        username,
        email,
        password,
      });

      Meteor.users.update({ _id }, {
        $set: {
          'emails.0.verified': true,
          'authenticationMethod': 'rt',
        }
      });

      const { token } = Accounts._generateStampedLoginToken()

      return {
        userId: _id,
        token
      }
    } else {
      const { token } = Accounts._generateStampedLoginToken();

      return {
        userId: user._id,
        token
      }
    }
  } catch (err) {
    throw new Error('Unable to retrieve users');
  }
}

Accounts.registerLoginHandler('rt', loginHandler);
