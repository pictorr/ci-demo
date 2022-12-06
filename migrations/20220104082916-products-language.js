module.exports = {
  async up(db) {
    await db.collection('products').updateMany({}, {$set: {language: 'ro'}}, (err, doc) => console.log(err, doc));
  }
};
