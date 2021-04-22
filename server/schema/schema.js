import graphql from 'graphql';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const _ = require('lodash');
import Book from '../models/book.js';
import Author from '../models/author.js';
import axios from 'axios'
import { AccountName, VtexKey, VtexToken } from '../config/config.js'

const { GraphQLObjectType, 
        GraphQLString, 
        GraphQLSchema,
        GraphQLID,
        GraphQLInt,
        GraphQLList,
        GraphQLNonNull
      } = graphql; 

const BookType = new GraphQLObjectType({
  name:'Book',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    genre: {
      type: GraphQLString
    },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId);
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name:'Author',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    age: {
      type: GraphQLInt
    },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args) {
        return Book.find({ authorId: parent.id });

      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
          return Book.findById(args.id);
        // const content = await axios.get(`https://${AccountName}.vtexcommercestable.com.br/api/dataentities/books/documents/${args.id}?_fields=name,genre,authorId,id`, {
        //   headers: {
        //     "x-vtex-api-appKey": VtexKey,
        //     "x-vtex-api-appToken": VtexToken,
        //     'Content-Type': 'application/json'
        //   }
        // })
        // return content.data;
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return Author.findById(args.id);
        // const content = await axios.get(`https://{{AccountName}}.vtexcommercestable.com.br/api/dataentities/authors/documents/${args.id}?_fields=name,age,id`, {
        //   headers: {
        //     "x-vtex-api-appKey": VtexKey,
        //     "x-vtex-api-appToken": VtexToken,
        //     'Content-Type': 'application/json'
        //   }
        // })
        // return content.data;
      }
    },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args) {
        return Book.find({});
        // const content = await axios.get(`https://${AccountName}.vtexcommercestable.com.br/api/dataentities/books/search?_fields=name,genre,authorId,id`, {
        //   headers: {
        //     "x-vtex-api-appKey": VtexKey,
        //     "x-vtex-api-appToken": VtexToken,
        //     'Content-Type': 'application/json'
        //   }
        // })
        // return content.data;
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve(parent, args) {
        return Author.find({});
        // const content = await axios.get(`https://${AccountName}.vtexcommercestable.com.br/api/dataentities/authors/search?_fields=name,age,id`, {
        //   headers: {
        //     "x-vtex-api-appKey": VtexKey,
        //     "x-vtex-api-appToken": VtexToken,
        //     'Content-Type': 'application/json'
        //   }
        // })
        // return content.data;
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
})

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

