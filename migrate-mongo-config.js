require('dotenv').config();

const config = {
  mongodb: {
    url: `mongodb://${ process.env.DB_HOST }/${ process.env.DB_PORT }`,
    databaseName: process.env.DB_NAME,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  migrationsDir: "migrations",
  changelogCollectionName: "migrations",
  migrationFileExtension: ".js",
  useFileHash: false
};

module.exports = config;
