const fs = require('fs');
const _ = require('lodash');
const exec = require('child_process').exec;
const path = require('path');

// Concatenate root directory path with our backup folder.
const backupDirPath = path.join(__dirname, 'database-backup');

const dbOptions = {
  user: 'SaxDev',
  pass: process.env.DB_PW,
  host: 'localhost',
  port: 27017,
  database: 'gladiator',
  autoBackup: true,
  removeOldBackup: true,
  keepLastDaysBackup: 2,
  autoBackupPath: backupDirPath,
  uri: process.env.DB_URL
};

// return stringDate as a date object.
exports.stringToDate = dateString => {
  return new Date(dateString);
};

// Check if variable is empty or not.
exports.empty = mixedVar => {
  let undef, key, i, len;
  const emptyValues = [undef, null, false, 0, '', '0'];
  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i]) {
      return true;
    }
  }
  if (typeof mixedVar === 'object') {
    for (key in mixedVar) {
      return false;
    }
    return true;
  }
  return false;
};
//Manual Backup Function
exports.dbManualBackup = () => {
  dbOptions.autoBackupPath = process.env.DB_PATH
  this.dbAutoBackUp()
}

// Auto backup function
exports.dbAutoBackUp = () => {
  // check for auto backup is enabled or disabled
  if (dbOptions.autoBackup == true) {
    let date = new Date();
    let beforeDate, oldBackupDir, oldBackupPath;

    // Current date
    currentDate = this.stringToDate(date);
    let newBackupDir =
      currentDate.getFullYear() +
      '-' +
      (currentDate.getMonth() + 1) +
      '-' +
      currentDate.getDate();

    // New backup path for current backup process
    let newBackupPath = dbOptions.autoBackupPath + '-mongodump-' + newBackupDir;
    // check for remove old backup after keeping # of days given in configuration
    if (dbOptions.removeOldBackup == true) {
      beforeDate = _.clone(currentDate);
      // Substract number of days to keep backup and remove old backup
      beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup);
      oldBackupDir =
        beforeDate.getFullYear() +
        '-' +
        (beforeDate.getMonth() + 1) +
        '-' +
        beforeDate.getDate();
      // old backup(after keeping # of days)
      oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir;
    }

    // Command for mongodb dump process
    let cmd =
      'mongodump --uri ' +
      dbOptions.uri +
      ' --db ' +
      dbOptions.database +
      ' --out ' +
      newBackupPath;

    try {
      exec(cmd, (error, stdout, stderr) => {
        console.log(error)
        if (this.empty(error)) {
          // check for remove old backup after keeping # of days given in configuration.
          if (dbOptions.removeOldBackup == true) {
            if (fs.existsSync(oldBackupPath)) {
              exec('rm -rf ' + oldBackupPath, err => {console.log(err)});
            }
          }
        }
      });
      console.log('Backup complete')
    } catch (err) {
      console.log('Backup error: ' + err)
    }
  }
};
