Meteor.loginWithRt = function (username, rtPassword, callback) {
  const loginRequest = { username, rtPassword, rt: true };

  console.log('loginWithRT getting called');
  console.log(Accounts);
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback(err) {
      if (err) {
        if (callback) {
          callback(err);
        }
      } else if (callback) {
        callback();
      }
    },
  })
}
