const bcrypt = require('bcrypt');

const saltRounds = 10;
const myPlaintextPassword = 'parola123';

const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(myPlaintextPassword, salt);

const users = [
  {
    emailAddress: 'cristian.stancu@gdm.co.uk',
    password: hash,
    activated: true,
    firstName: 'Cristian',
    lastName: 'Stancu',
    language: 'en',
    country: 'en',
    isAdmin: true,
    isMasterAdmin: true,
    phoneNumber: '0700222444',
    address: 'Str. Prevederii, Nr. 1',
    locality: 'Bucuresti',
    state: 'Bucuresti',
    company: 'GDM',
    job: 'Persoana Fizica',
  },
  {
    emailAddress: 'matei.paun@gdm.co.uk',
    password: hash,
    activated: true,
    firstName: 'Matei',
    lastName: 'Paun',
    language: 'en',
    country: 'en',
    isAdmin: true,
    isMasterAdmin: true,
    phoneNumber: '0700222444',
    address: 'Str. Prevederii, Nr. 1',
    locality: 'Bucuresti',
    state: 'Bucuresti',
    company: 'GDM',
    job: 'Persoana Fizica',
  },
  {
    emailAddress: 'mihai.baran@etexgroup.co.uk',
    password: hash,
    activated: true,
    firstName: 'Mihai',
    lastName: 'Baran',
    language: 'en',
    country: 'en',
    isAdmin: true,
    isMasterAdmin: true,
    phoneNumber: '0700222444',
    address: 'Str. Prevederii, Nr. 1',
    locality: 'Bucuresti',
    state: 'Bucuresti',
    company: 'GDM',
    job: 'Persoana Fizica',
  },
  {
    emailAddress: 'florin.mancas@etexgroup.co.uk',
    password: hash,
    activated: true,
    firstName: 'Florin',
    lastName: 'Mancas',
    language: 'en',
    country: 'en',
    isAdmin: true,
    isMasterAdmin: true,
    phoneNumber: '0700222444',
    address: 'Str. Prevederii, Nr. 1',
    locality: 'Bucuresti',
    state: 'Bucuresti',
    company: 'GDM',
    job: 'Persoana Fizica',
  },
];

module.exports = {
  async up(db) {
    await db.collection('users').insertMany(users, (err, doc) => console.log(err, doc));
  }
};
