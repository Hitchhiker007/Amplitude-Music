// auth module to handle user session data
module.exports = {
    // first get account info from session storage
        getAccount: function() {
            const user = sessionStorage.getItem('user');
            // check if user exists or is undefined
            if(!user || user === 'undefined') {
                console.log('null user!');
                return null;
            } else {
                // log user data for debugging
                console.log('getAccount()')
                console.log(JSON.parse(user));
                return JSON.parse(user);
            }
        },

        // get token associated with current user session from session storage
        getToken: function() {
            return sessionStorage.getItem('token');
        },
        // store user and token info in session storage
        setSession: function(user, token) {
            sessionStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('token', token);
        },
        // clear user and token info from session storage, resetting session
        resetSession: function() {
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
        }
}

