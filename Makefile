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

# Starts the gRPC server
serve:
	node ./bin/lando-server.js
