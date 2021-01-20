const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require('faunadb'),
  q = faunadb.query;

const typeDefs = gql`
  type Query {
    todos: [Todo]
  }
  type Mutation {
    addTodo(task: String): Todo
    delete_Todo(id:String):String
    update_Todo(task:String,id:String):Todo
  }
  type Todo {
    id: ID
    task: String
    status: Boolean
  }

  
 
 

`

const resolvers = {
  Query: {
    todos: async (root, args, context) => {
      try {
        var adminClient = new faunadb.Client({ secret:'fnAD9rvGNjACBcMukvs-Yp-VnbUza3890vVutPmS' });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('task'))),
            q.Lambda(x => q.Get(x))
          )
        )

        console.log(result.data,"data aya k nahi")
        console.log(result.data.ts,"yeh dekh aya k nahi")

        return result.data.map(d=>{
          return {
            id: d.ref.id,
            status: d.data.status,
            task: d.data.task
          }
        })
      }
      catch (err) {
        console.log(err)
      }
    }
    // authorByName: (root, args, context) => {
    //   console.log('hihhihi', args.name)
    //   return authors.find(x => x.name === args.name) || 'NOTFOUND'
    // },
  },
  Mutation: {
    addTodo: async (_, { task }) => {
      try {
        var adminClient = new faunadb.Client({ secret:'fnAD9rvGNjACBcMukvs-Yp-VnbUza3890vVutPmS' });
        const result = await adminClient.query(
          q.Create(
            q.Collection('todos'),
            {
              data: {
                task: task,
                status: true
              }
            },
          )
        )
        return result.ref.data;
      }
      catch (err) {
        console.log(err)
      }
    },
    delete_Todo:async (_,{id})=>{
      console.log("<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>",id)
      try{
        var adminClient = new faunadb.Client({ secret:'fnAD9rvGNjACBcMukvs-Yp-VnbUza3890vVutPmS' });
  let Del=await adminClient.query(
    q.Delete(
      q.Ref(q.Collection('todos'),id
      )
    )
  )
  console.log(Del,"DEL>>>>>>>>>")
 return(Del.id.toString())
      }catch(error){console.log(error)}
    },

  update_Todo:async(_,{task,id})=>{
    console.log(task,id,"update wala hai")
    try{
      var adminClient = new faunadb.Client({ secret:'fnAD9rvGNjACBcMukvs-Yp-VnbUza3890vVutPmS' });
      const UPDATE=await adminClient.query(
        q.Replace(
          q.Ref(q.Collection('todos'),id),
          { data: { task:task,status:true,id:id } },
        )

       
      )
      return UPDATE.ref.data

    }catch(error){console.log(error)}
  }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()