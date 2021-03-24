import express from 'express';
import graphqlHTTP from 'express-graphql';

const app = express();

app.use('/graphql', graphqlHTTP({

}));

app.listen(3333, () => {
  console.log('Listening for requests on port 3333');
});