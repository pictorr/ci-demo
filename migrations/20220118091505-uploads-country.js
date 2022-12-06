module.exports = {
  async up(db) {
    await db.collection('uploads').updateMany({}, {$set: {language: 'ro'}}, (err, doc) => console.log(err, doc));
  }
};
