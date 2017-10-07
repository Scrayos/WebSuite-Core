'use strict';

const crypto = require('crypto');

class CryptoUtil {

    /**
     * Hashes in SHA 512 and salts a password
     *
     * @param raw the password
     * @param salt the salt
     *
     * @returns String double salted, hashed password
     * */
    hashPassword(raw, salt) {
        return crypto.createHmac('sha512', salt).update(raw).digest('hex');
    }

    /**
     * Check for password-match
     *
     * @param raw the password
     * @param hashed the hashed and salted password
     * @param salt the salt of the hashed password
     *
     * @returns boolean true, when matches, otherwise false
     * */
    matchPassword(raw, hashed, salt) {
        return this.hashPassword(raw, salt) === hashed;
    }

    /**
     * Generates a salt (save it to a file and don't store it in the database!)
     *
     * @param length length of the salt
     *
     * @returns String random salt
     * */
    generateSalt(length) {
        return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    }

}

global.CryptoUtil = CryptoUtil;