'use strict';

class UserUtil {

    /**
     * Check, whether the username is available
     *
     * @param username username to check
     *
     * @returns Promise resolves if available, otherwise rejects
     * */
    static usernameAvailable(username) {
        return new Promise((resolve, reject) => {
            // TODO: Check for whitespace mismatch (e.g. 'Hallo Du Da    ' != "Hallo Du Da"
            WebSuite.getDatabase().query("SELECT userID FROM wsUser WHERE username = ?", [username]).then(result => {
                // reject on result
                reject(new Error('username not available'));
            }).catch(err => {
                if(err.message === 'no data found') {
                    // resolve on 'no data found'
                    resolve();
                } else {
                    // reject on error with error
                    reject(err);
                }
            });
        });
    }

    /**
     * Check, whether the username is valid
     *
     * @param username username to check
     *
     * @returns Promise resolves if valid, otherwise rejects
     * */
    static usernameValid(username) {
        return new Promise((resolve, reject) => {
            // Check for valid length
            if(username.length > 3 && username.length <= 25) {
                reject(new Error('username length mismatch'));
                return;
            }

            // check for invalid characters
            if(!username.match(/^[a-zA-Z0-9 _.-]/)) {
                reject(new Error('username character mismatch'));
                return;
            }

            // check for full whitespace name
            if(username.replace(/ /g, '').length === 0) {
                reject(new Error('username whitespace mismatch'));
                return;
            }

            //resolve
            resolve();
        });
    }

    /**
     * Check, whether the email-address is available
     *
     * @param email username to check
     *
     * @returns Promise resolves if available, otherwise rejects
     * */
    static emailAvailable(email) {
        return new Promise((resolve, reject) => {
            WebSuite.getDatabase().query("SELECT userID FROM wsUser WHERE email = ?", [email]).then(result => {
                // reject on result
                reject(new Error('email not available'));
            }).catch(err => {
                if(err.message === 'no data found') {
                    // resolve on 'no data found'
                    resolve();
                } else {
                    // reject on error with error
                    reject(err);
                }
            });
        });
    }

    /**
     * Check, whether the email-address is valid
     *
     * @param email email-address to check
     *
     * @returns Promise resolves if valid, otherwise rejects
     * */
    static emailValid(email) {
        return new Promise((resolve, reject) => {
            // Check for valid length to save it in the database
            if(email.length <= 64) {
                reject(new Error('email length mismatch'));
                return;
            }

            // check for invalid characters
            // TODO: Check for valid email-address
            if(!email.match(/^[a-zA-Z0-9_.-]/)) {
                reject(new Error('email character mismatch'));
                return;
            }

            // check for full whitespace email-address
            if(email.replace(/ /g, '').length === 0) {
                reject(new Error('email whitespace mismatch'));
                return;
            }

            //resolve
            resolve();
        });
    }

}

global.UserUtil = UserUtil;