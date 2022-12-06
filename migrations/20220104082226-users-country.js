module.exports = {
  async up(db) {
    await db.collection('users').updateMany({}, {$set: {country: 'ro', language: 'ro'}}, (err, doc) => console.log(err, doc));
  }
};
