// import path from "path";
// import * as grpc from "@grpc/grpc-js";
// import { GrpcObject, ServiceClientConstructor } from "@grpc/grpc-js";
// import * as protoLoader from "@grpc/proto-loader";
// //loading synchronusly
// const packageDefinition = protoLoader.loadSync(
//   //getting current directory adding proto code for sync
//   path.join(__dirname, "./a.proto")
// );
// //parsing the proto file
// const personProto = grpc.loadPackageDefinition(packageDefinition);

// const PERSONS = [];

// //@ts-ignore
// function handleAddPerson(call, callback) {
//   //   console.log(call);
//   let person = {
//     name: call.request.name,
//     age: call.request.age,
//   };
//   PERSONS.push(person);
//   //arg1 -> error object, second argument-> user details
//   callback(null, person);
// }

// const server = new grpc.Server();

// // server.addService(
// //   (personProto.AddressBookService as ServiceClientConstructor).service,
// //   { addPerson: handleAddPerson }
// // );

// //@ts-ignore -removing type here
// server.addService(personProto.AddressBookService.service, {
//   addPerson: handleAddPerson,
// });

// server.bindAsync(
//   "0.0.0.0:50051",
//   grpc.ServerCredentials.createInsecure(),
//   () => {
//     server.start();
//   }
// );

// after generating types
// used ->  node ./node_modules/@grpc/proto-loader/build/bin/proto-loader-gen-types.js  --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=generated a.proto
import path from "path";
import * as grpc from "@grpc/grpc-js";
import { GrpcObject, ServiceClientConstructor } from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./generated/a";
import { AddressBookServiceHandlers } from "./generated/AddressBookService";
import { Status } from "@grpc/grpc-js/build/src/constants";

//loading synchronusly
const packageDefinition = protoLoader.loadSync(
  //getting current directory adding proto code for sync
  path.join(__dirname, "./a.proto")
);
//parsing the proto file, inferring the type here
const personProto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;
//@ts-ignore

const PERSONS = [];

// //@ts-ignore
// function handleAddPerson(call, callback) {
//   //   console.log(call);
//   let person = {
//     name: call.request.name,
//     age: call.request.age,
//   };
//   PERSONS.push(person);
//   //arg1 -> error object, second argument-> user details
//   callback(null, person);
// }

const handler: AddressBookServiceHandlers = {
  AddPerson: (call, callback) => {
    let person = {
      name: call.request.name,
      age: call.request.age,
    };
    PERSONS.push(person);
    callback(null, person);
  },
  GetPersonByName: (call, callback) => {
    //@ts-ignore

    let person = PERSONS.find((x) => x.name === call.request.name);
    if (person) {
      callback(null, person);
    } else {
      //passing back the error here
      callback(
        {
          code: Status.NOT_FOUND,
          details: "not found",
        },
        null
      );
    }
  },
};

const server = new grpc.Server();

// server.addService(
//   (personProto.AddressBookService as ServiceClientConstructor).service,
//   { addPerson: handleAddPerson }
// );

//@ts-ignore -removing type here, ts ignore can be removed as personProto is inferring the type
server.addService(personProto.AddressBookService.service, handler);

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
);
