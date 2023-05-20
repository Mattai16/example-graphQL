const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://:@cluster0.3vey2ya.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch(error => console.error('Error al conectar a la base de datos:', error));


const schema = buildSchema(`
  type Pet {
    id: ID!
    name: String!
    raza: String!
    edad: String!
    peso: String!
    habilidad: String!


  }

  type Query {
    getPet(id: ID!): Pet
    getPetByName(name: String!): Pet
    getPets: [Pet]
  }
  
  type Mutation {
    createPet(name: String!, raza: String!, edad: String!, peso: String!, habilidad: String!): Pet
  }
`);


const PetModel = mongoose.model('Pet', {
    name: String,
    raza: String,
    edad: String,
    peso: String,
    habilidad: String
  });
  
  const root = {
    getPet: async ({ id }) => {
      const pet = await PetModel.findById(id);
      return pet;
    },
    getPetByName: async ({ name }) => {
      const pet = await PetModel.findOne({ name });
      return pet;
    },
    getPets: async () => {
      const pets = await PetModel.find();
      return pets;
    },
    createPet: async ({ name, raza, edad, peso, habilidad }) => {
      const pet = new PetModel({ name, raza, edad, peso, habilidad });
      await pet.save();
      return pet;
    }
  };

const app = express();


app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true 
}));


app.listen(4000, () => {
  console.log('http://localhost:4000/graphql');
});
