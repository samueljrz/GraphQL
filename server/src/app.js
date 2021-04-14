import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const graphqlHTTP = require('express-graphql').graphqlHTTP;;
import schema from '../schema/schema.js';
const mongoose = require('mongoose')

const app = express();

mongoose.connect('mongodb+srv://graphqladmin:graphqlpass@cluster0.9a6rv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
})

mongoose.connection.once('open', () => {
  console.log('connected to database');
})

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(3333, () => {
  console.log('Listening for requests on port 3333');
});