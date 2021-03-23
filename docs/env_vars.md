# Environment Variables

*Environment Variables* in the context of Lando refer to those which are declared as component
configuration and are accessible in containers managed by Lando.

Lando Environment Variables are declared with a scope, key, and value. The scope gives
context to the variable in the form of a prefix to the variable name.

## Environment Variable Scopes

- `global`: Global scoped env vars are available in all containers, including utility containers, 
  and have a name prefixed with `LANDO_`.
- `service`: Service scoped env vars are specific to the service responsible for creating them
  and have a name prefixed with `LANDO_SVC_`.
- `app`: App scoped env vars contain application specific data and have a name prefixed with `LANDO_APP_`.

The convention of associating a scope to an env var provides a way for plugins to target and
modify env vars set by other plugins and make it easier to reason about the context when viewing
a list of key/value pairs.

## Globally Scoped Environment Variables

Global env vars are declared with the `global` scope prefixed with `LANDO_`.

LANDO_STATE=ON
LANDO_CONFIG_DIR=/Users/me/.lando
LANDO_DOMAIN=lndo.site
LANDO_HOST_HOME=/Users/me
LANDO_HOST_IP=host.docker.internal
LANDO_HOST_OS=darwin
LANDO_HOST_USER=mmilano
LANDO_LEIA=0
LANDO_LOAD_KEYS=true

## Service Scope
LANDO_WEBROOT_USER=www-data
LANDO_HOST_UID=501
LANDO_WEBROOT_GROUP=www-data
LANDO_WEBROOT=/app/./public
LANDO_SERVICE_TYPE=php

## App Scoped Environment Variables

App scoped env vars are specific to an application. They are declared with the `app` 
scope and prefixed with `LANDO_APP_`.

LANDO_APP_INFO=<json services object>
LANDO_APP_ROOT_BIND=/Users/me/projects/my-app
LANDO_APP_PROJECT=jebportal
LANDO_APP_PROXY_NAMES=DNS.10 = my-app.lndo.site
LANDO_APP_SERVICE_NAME=appserver
LANDO_APP_NAME=my-app
LANDO_APP_ROOT=/Users/me/projects/my-app
LANDO_APP_CA_CERT=/lando/certs/lndo.site.pem
LANDO_APP_CA_KEY=/lando/certs/lndo.site.key
LANDO_APP_MOUNT=/app




LANDO_HOST_GID=20
LANDO_PROXY_PASSTHRU=true
