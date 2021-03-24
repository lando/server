# Installs dependencies and builds proto files
build: install pb

# Installs dependencies
install:
	yarn install

# Builds .proto files defined in ./protos and writes the resulting .js files to ./build/protos
pb:
	./node_modules/grpc-tools/bin/protoc -I=. ./protos/lando.proto \
		--js_out=import_style=commonjs,binary:./build \
		--grpc_out=./build \
		--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`

# A test client for now
test:
	node ./client/test.js

test-unit:
	./node_modules/.bin/nyc --reporter=html --reporter=text mocha --timeout 5000 test/**/*.spec.js

# Starts the gRPC server
serve:
	node ./bin/lando-server.js
