# Lando Server Development

## Development

Clone repo:
```bash
git clone git@github.com:lando/core.git
cd core/
```

Scripts are declared in the [`Makefile`](./Makefile) over `package.json` for DX because it's a
little more flexible. (Syntax highlighting, comments, etc) Not  opposed to moving them into 
`package.json` if there's reason or just alternate opinions.

Install dependencies and run the server:
```bash
# Build yarn deps & proto files
make

# Run the server
make serve
```

Other targets:
```
# Rebuild proto files
make protos

# Run the test client script
make test
```

## Language
- `cmd`: A command string (Use `cmd` to indicate a string as opposed to a Command object)
- `Command`: [Model] A Lando command object
- `CommandCall`: [Model] A Lando Command Call object; The highest level object that represents the API call, Command, and stage workflow
- `gRPC Service`: A single gRPC service in either the `.proto` file, the auto generated files, or the custom implementation file.
- `Model`: A JavaScript class used for data structure but not business logic
- `Module`: A NodeJS module; A JavaScript file with exports
- `Stage`: [Model] A CommandCall Stage object.

## Directory Structure
```
├── bin             Executables
├── build           Generated files
│   └── protos          JavaScript proto files
├── client          Client implementation directory
├── config          Yaml configurations
├── protos          Source .proto files
└── server          Server implmementation directory
    ├── grpc            grpc service files
    ├── lib             Business logic
    └── models          Data models (No business logic)
```

## gRPC Service Modules
`gRPC Service` refers to the service defined in a `.proto` file, and `Module` refers to
the NodeJS module file that exports the gRPC Service data, health check, & implementation.

Example export:
```javascript
module.exports = {
  name: SERVICE_NAME,
  definition: service.CommandServiceService,
  implementation: {list, run},
  healthCheck,
};
```

## Models
JavaScript files in the `models` directory are Anemic Models, or classes designed
to contain only data and perhaps light logic for formatting or to facilitate the serialization 
and deserialization of properties. These classes will be void of any business logic.

Each model module exports a single class which is explicitly loaded in `models/index.js`
so all models may be accessed as below:

Models can be loaded like so:
```javascript
const {Command, CommandCall, Stage} = require('./models');
```
