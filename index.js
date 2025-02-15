"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
//loading synchronusly
const packageDefinition = protoLoader.loadSync(
//getting current directory adding proto code for sync
path_1.default.join(__dirname, "./a.proto"));
//parsing the proto file
const personProto = grpc.loadPackageDefinition(packageDefinition);
const PERSONS = [];
//@ts-ignore
function handleAddPerson(call, callback) {
    //   console.log(call);
    let person = {
        name: call.request.name,
        age: call.request.age,
    };
    PERSONS.push(person);
    //arg1 -> error object, second argument-> user details
    callback(null, person);
}
const server = new grpc.Server();
// server.addService(
//   (personProto.AddressBookService as ServiceClientConstructor).service,
//   { addPerson: handleAddPerson }
// );
//@ts-ignore -removing type here
server.addService(personProto.AddressBookService.service, {
    addPerson: handleAddPerson,
});
server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});
