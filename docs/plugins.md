# Plugins

Most of Lando's functionality comes from core and contributed plugins. As we move into
a version of Lando which aims to support a contrib plugin ecosystem, a strategy to organize
plugins from various remote sources is critical.

- Plugins should be able to be installed from any git repo (github, gitlab, or custom)
- Authors must be able to publish plugins for others to use
- Authors must be able to maintain multiple plugins in a single repository
- Lando must support plugins of the same name by different 3rd parties
- Would be nice if plugins could automatically be downloaded for cases like service definitions

I believe we can follow Go's method of organizing modules in an intuitive directory structure
which uses the repo host and its usernames to namespace the plugin repos.

## Proposal

- `plugin` may be defined anywhere a component is used (In this case, a service)
- The default value for `plugin` will be `lando`, which directs the service type to the core definition
- The value of `plugin` may be a custom git url, or a github or gitlab string with optional branch
  - `<git host>/<host user>/<host repo>:<repo branch or tag>`
  - `github.com/mikemilano/lando-mailhog:develop`  

Official Lando Mailhog
```yaml
services:
  smtp:
    type: mailhog
```

Contrib: Alice has an opinionated mailhog service
```yaml
services:
  smtp:
    type: mailhog:v1.0.3
    plugin: github.com/alice/mailhog:develop
```

Contrib: Another user that maintains their own opinionated version of mailhog
```yaml
services:
  smtp:
    type: mailhog
    plugin: github.com/bob/mailhog
```

With this method, we could automatically download plugins that don't exist (In the case of a service definition anyway)

## Plugin Directory

Since we have multiple users that created a `mailhog` plugin, we use the repo host, user, and repo name to organize
the codebases. This is an approach that Go uses.

```
└── plugins
    ├── github.com
    │   ├── alice
    │   │   └── mailhog
    │   └── bob
    │       └── mailhog
```

## Plugin Discovery

Since multiple plugins can exist in a single repo, a YAML file which declares the list of plugins is required.

We can use glob searches to find `lando.plugin.yml` files recursively and build a single manifest of available plugins.

```yaml
plugins:
  - uri: mailhog
    name: Mailhog
    description: Lando core Mailhog service
  - uri: github.com/alice/mailhog
    name: Mailhog
    description: Alice's custom version of Mailhog
  - uri: github.com/bob/mailhog
    name: Mailhog
    description: Bob's custom version of Mailhog
  - uri: foo@example.com:bar/baz.git
    name: Baz
    description: Custom hosted repository

```
