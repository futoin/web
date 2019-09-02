---
path: /docs/cid/tools/
---

# CID Tools

> Please check [Design section](/docs/cid/design/) first.

As previously dicusses, tools are represented as plugins in CID.

Each tool can be installed or upgraded. Some tools support removal.
Some tools allow multiple concurrent versions installed.

The list of supported tool plugins can retrieved via `cid tool list`.

<div class="cli-highlight"><pre>
<span class="cli-cmd">$ cid tool list</span>
List of tools supported by CID:
<span class="cli-info">  <strong>* ant:</strong> Ant build tool for Java applications.
  <strong>* archiva:</strong> Apache Archiva: The Build Artifact Repository Manager.
  <strong>* artifactory:</strong> JFrog Artifactory: Artifact Repository Manager.
  <strong>* bash:</strong> Bash is an sh-compatible command language interpreter.
  <strong>* aws:</strong> Generic AWS CLI and S3 as RMS.
  <strong>* binutils:</strong> GNU Binutils.
  <strong>* bower:</strong> Bower: a package manager for the web.
  <strong>* brew:</strong> Homebrew. The missing package manager for macOS.
  <strong>* bundler:</strong> Bundler: The best way to manage a Ruby application's gems.
  <strong>* bzip2:</strong> Freely available, patent free (see below), high-quality data compressor.
  <strong>* cargo:</strong> Cargo, Rust;s Package Manager.
  <strong>* cid:</strong> Noop FutoIn-CID - a workaround to allow CID use from virtualenv
  <strong>* cmake:</strong> Build, Test and Package Your Software With CMake.
  <strong>* composer:</strong> Dependency Manager for PHP.
  <strong>* curl:</strong> Command line tool and library for transferring data with URLs.
  <strong>* docker:</strong> Docker - Build, Ship, and Run Any App, Anywhere.
  <strong>* dockercompose:</strong> Compose is a tool for defining and running multi-container Docker applications.
  <strong>* elixir:</strong> Elixir.
  <strong>* erlang:</strong> Erlang OTP.
  <strong>* exe:</strong> Dummy tool to execute files directly
  <strong>* flyway:</strong> Flyway - Evolve your Database Schema easily and
  <strong>* futoin:</strong> futoin.json updater as defined in FTN16.
  <strong>* gcc:</strong> GNU Compiler Collection.
  <strong>* gem:</strong> RubyGems: Find, install, and publish RubyGems.
  <strong>* git:</strong> Git distributed version control system.
  <strong>* go:</strong> The Go Programming Language
  <strong>* gpg:</strong> The GNU Privacy Guard.
  <strong>* gradle:</strong> Gradle Build Tool.
  <strong>* grunt:</strong> Grunt: The JavaScript Task Runner.
  <strong>* gulp:</strong> Automate and enhance your workflow (Node.js).
  <strong>* gvm:</strong> Go Version Manager.
  <strong>* gzip:</strong> Compression utility designed to be a replacement for compress.
  <strong>* hg:</strong> Mercurial SCM.
  <strong>* java:</strong> Java Runtime Environment.
  <strong>* jdk:</strong> Java Development Kit.
  <strong>* jfrog:</strong> JFrog: Command Line Interface for Artifactory and Bintray
  <strong>* liquibase:</strong> Liquibase - source control for your database.
  <strong>* make:</strong> GNU Make.
  <strong>* maven:</strong> Apache Maven is a software project management and comprehension tool.
  <strong>* mix:</strong> Mix - elixir build tool.
  <strong>* nexus:</strong> Sonatype Nexus RMS.
  <strong>* nexus3:</strong> Sonatype Nexus RMS.
  <strong>* nginx:</strong> nginx [engine x], originally written by Igor Sysoev.
  <strong>* node:</strong> Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.
  <strong>* npm:</strong> npm is the package manager for JavaScript.
  <strong>* nvm:</strong> Node Version Manager.
  <strong>* phoenix:</strong> Phoenix - a productive web framework that does not compromise speed or maintainability.
  <strong>* php:</strong> PHP is a popular general-purpose scripting language that is especially suited to web development.
  <strong>* phpbuild:</strong> Builds PHP so that multiple versions can be used side by side.
  <strong>* phpfpm:</strong> PHP is a popular general-purpose scripting language that is especially suited to web development.
  <strong>* pip:</strong> The PyPA recommended tool for installing Python packages.
  <strong>* puma:</strong> A ruby web server built for concurrency http://puma.io
  <strong>* puppet:</strong> Puppet system automation.
  <strong>* python:</strong> Python is a programming language.
  <strong>* ruby:</strong> Ruby is a dynamic, open source programming language.
  <strong>* rust:</strong> Rust is a systems programming language.
  <strong>* rustup:</strong> rustup is an installer for the systems programming language Rust.
  <strong>* rvm:</strong> Ruby Version Manager.
  <strong>* sbt:</strong> The interactive build tool (Scala).
  <strong>* scala:</strong> The Scala Programming Language.
  <strong>* scp:</strong> secure copy.
  <strong>* sdkman:</strong> SDK Man for Java.
  <strong>* setuptools:</strong> Easily download, build, install, upgrade, and uninstall Python packages.
  <strong>* ssh:</strong> Secure Shell client.
  <strong>* svn:</strong> Apache Subversion: Enterprise-class centralized version control for the masses.
  <strong>* tar:</strong> The GNU version of the tar archiving utility.
  <strong>* twine:</strong> Collection of utilities for interacting with PyPI
  <strong>* unzip:</strong> list, test and extract compressed files in a ZIP archive.
  <strong>* uwsgi:</strong> uWSGI application server container http://projects.unbit.it/uwsgi
  <strong>* virtualenv:</strong> Virtual Python Environment builder.
  <strong>* webpack:</strong> webpack is a module bundler (JS world)
  <strong>* xz:</strong> Free general-purpose data compression software with a high compression ratio.
  <strong>* yarn:</strong> YARN: fast, reliable, and secure dependency management.
  <strong>* zip:</strong> package and compress (archive) files.</span>
End.
</pre></div>

Information on any particular tool can be retrieved with `cid tool describe`:

<div class="cli-highlight"><pre>
<span class="cli-cmd">$ cid tool describe php</span>
<span class="cli-info"><strong>* Tool:</strong></span> <span class="cli-warn">php</span>
<span class="cli-info"><strong>* Environment variables:</strong></span> phpDir, phpBin, phpVer, phpfpmVer, phpBinOnly, phpSuryRepo, phpExtRequire, phpExtTry, phpForceBuild, phpSourceVer
<span class="cli-info"><strong>* Dependencies:</strong></span> bash, curl, phpbuild
<span></span>
<span class="cli-info">PHP is a popular general-purpose scripting language that is especially suited to web development.
<span></span>
Home: http://php.net/
<span></span>
<span></span>
By default the latest available PHP binary is used for the following OSes:
&nbsp;* Debian & Ubuntu - uses Sury (https://deb.sury.org/) builds 5.6, 7.0 & 7.1.
&nbsp;* CentOS, RHEL & Oracle Linux - uses SCL 5.6 & 7.0
<span></span>
You can forbid source builds by setting phpBinOnly to non-empty string.
<span></span>
However, if phpVer is set then we use php-build which make consume a lot of time and
resources due to lack of trusted binary builds.
<span></span>
You can control installed extensions by setting:
&nbsp;* phpExtRequire - required extensions to be installed or fail
&nbsp;* phpExtTry - nice to have extensions
</span>
</pre></div>

## Configuration

### Project tool list.

As previously discussed, CID does auto-detection of tools. However, each project
may set strict list of tools with optional version constraint in `.tools` entry
of `futoin.json` configuration.

For example:

```json
{
  "tools": {
    "node": "6",
    "flyway": "*",
    "ruby": "2.3",
    "php": "5"
  }
}
```

### Project-specific tool tuning.

Many tool plugins support tuning. For example, `npm` allows tuning very specific
`--tag` and `--access` parameters during RMS promotion (`npm publish`).

Example:

```json
{
  "toolTune": {
    "npm": {
      "access": "public"
    }
  }
}
```

## Commands

Below is list of tool-related commands.

* `cid tool ...`
    - Family tool-centric commands.
* `cte <tool_name> [<tool_arg>...]`
* `cid tool exec <tool_name> [<tool_version>] [-- <tool_arg>...]`
    - Execute `<tool_name>` binary with provided arguments.
    - Tool and all its dependencies are automatically installed.
    - *Note: not all tools support execution.*
* `cid tool envexec <tool_name> [<tool_version>] [-- <command>...]`
    - Execute arbitrary command with environment of specified tool.
* `cid tool (install|uninstall|update) [<tool_name>] [<tool_version>]`
    - Manage tools.
    - *Note: not all tools support all kinds of actions.*
* `cid tool test [<tool_name>]`
    - Test if tool is installed.
* `cid tool env [<tool_name>]`
    - Dump tool-specific environment variables to be set in shell for execution without CID.
    - Tool and all its dependencies are automatically installed.
* `cid tool (prepare|build|check|package|migrate) <tool_name> [<tool_version>]`
    - Run standard actions described above only for specific tool.
    - Tool and all its dependencies are automatically installed.
    - *Note: auto-detection is skipped and tool is always run.*
* `cid tool list`
    - Show a list of supported tools.
* `cid tool describe <tool_name>`
    - Show tool's detailed description.
* `cid tool detect`
    - Show list of auto-detected tools for current project
      with possible version numbers.
