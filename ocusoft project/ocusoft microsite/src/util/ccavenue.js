/* eslint-disable */
const crypto = require('crypto');

exports.encrypt = (plainText, workingKey) => {
  const key = crypto.createHash('sha256').update(workingKey).digest();
  const iv = crypto.randomBytes(16); // Generate a random IV
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag(); // Get authentication tag for integrity

  return {
    iv: iv.toString('hex'), // Convert IV to a string for storage/transfer
    encryptedData: encrypted,
    authTag: authTag.toString('hex') // Convert authentication tag to a string
  };
};

exports.decrypt = function (encData, workingKey) {
  const key = crypto.createHash('sha256').update(workingKey).digest();
  const iv = Buffer.from(encData.iv, 'hex'); // Parse IV from the input
  const authTag = Buffer.from(encData.authTag, 'hex'); // Parse authentication tag

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag); // Set the authentication tag for decryption

  let decrypted = decipher.update(encData.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};



