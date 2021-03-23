# Architecture & Coding Standards

Use this doc for standards to be discussed. Don't hesitate to add ideas that are not complete.
They only need to be ready for discussion.

Write proposals as if they have been accepted already, so we do not need to rewrite them.

Rejections which result in an alternate standard should be documented as a new standard.

## Proposed

### Managers (Service layer)
3/19/21 mm

`Managers` are node modules which contain the business logic that manages Command Calls,
Stages, Steps, etc. In other frameworks, this might be referred to as the service layer,
however the term `service` is overloaded with respect to Docker and Lando services.

The `grpc` directory contains the gRPC service definitions (think Controllers) which contain
minimal "glue" code to wire up the requests to be processed through the managers. While
gRPC service implementations are aware of the managers, the managers are not aware of gRPC
services. Utilities in the `lib` directory may be used to transform data betwen Protobuf
objects and Lando models.

### Module exports at the bottom of file
3/19/21 mm

Module exports should be declared as a single export at the bottom of the file.
i.e. `module.exports = {}`.

Module exports are an API of sorts and the ability to see everything a
module exposes at a glance is better DX than having to figure out the API by
scrolling through around.

Example:
```javascript
const foo = () => (1);
const bar = () => (2);
module.exports = {
  foo,
  bar,
};
```

### mapping vs forEach
3/19/21 mm

`map` should only be used when the result of the transformation is being used.

`forEach` should be considered over `map` when the returned is not a transformation which is used.
This is primarily for DX so the developer does not need to rewrite the loop for debugging purposes.

## Accepted


## Rejected
