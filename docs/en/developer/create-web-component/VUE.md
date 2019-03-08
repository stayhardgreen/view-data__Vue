# Develop Vue Web Components for uPortal

## Step by Step guide for Vue.js component

1. [Prerequisites](#1-prerequisites)
   1. [Node.js](#nodejs)
   2. [Vue CLI](#vue-cli)
   3. [Maven](#maven)
   4. [Gradle](#gradle)
2. [Generate the Vue application](#2-generate-the-vue-application)
3. [Edit the Vue application](#3-edit-the-vue-application)
   1. [create gradle.properties](#create-gradleproperties)
   2. [create build.gradle](#create-buildgradle)
   3. [add Gradle wrapper (gradlew) to the project](#add-gradle-wrapper-to-project)
   4. [rename HelloWorld.vue](#rename-helloworldvue)
   5. [edit App.vue](#edit-appvue)
      1. [optional edits in App.vue](#optional-edits-in-appvue)
      2. [optional edits in {component-name}.vue](#optional-edits-in-component-namevue)
   6. [edit package.json](#edit-packagejson)
   7. [edit babel.config.js](#edit-babelconfigjs)
4. [Assemble and deploy the Vue application](#4-assemble-and-deploy-the-vue-application)
5. [Add the component into uPortal](#5-add-the-component-into-uportal)
   1. [create a portlet-definition.xml](#create-a-portlet-definitionxml)
   2. [edit portlet definition](#edit-portlet-definition)
   3. [replace CDATA in portlet definition](#replace-cdata-in-portlet-definition)
   4. [other options for portlet definition](#other-options-for-portlet-definition)
   5. [add WebJar to resource server](#add-webjar-to-resource-server)
   6. [rebuild uPortal-start](#rebuild-uportal-start)

[Appendix](#appendix)

- [A. Quick new deployment](#a-quick-new-deployment)
  1. [Rebuild and redeploy resource-server](#rebuild-and-redeploy-resource-server)
  2. [Import portlet definition or add it in uPortal](#import-portlet-definition-or-add-it-in-uportal)
- [B. Quick rebuild and deploy](#b-quick-rebuild-and-deploy)
  1. [Rebuild web component](#rebuild-web-component)
  2. [Redeploy to uPortal resource-server](#redeploy-to-uportal-resource-server)
- [C. Creating build.gradle files](#c-creating-buildgradle-files)
  - [Naming artifacts](#naming-artifacts)
  - [Publishing artifacts](#publishing-artifacts)
    - [Repository user and password](#repository-user-and-password)
    - [Publish with maven plugin](#publish-with-maven-plugin)
    - [Sample build.gradle with maven plugin:](#sample-buildgradle-with-maven-plugin)
    - [Publish with maven-publish plugin](#publish-with-maven-publish-plugin)
    - [Sample build.gradle with maven-publish plugin:](#sample-buildgradle-with-maven-publish-plugin)
    - [Alternate build.gradle with maven-publish plugin:](#alternate-buildgradle-with-maven-publish-plugin)
  - [build.gradle for Windows](#buildgradle-for-windows)
- [D. Node.js installation](#d-nodejs-installation)
  - [Mac OS X](#mac-os-x)
    - [With MacPorts](#with-macports)
    - [With Homebrew](#with-homebrew)

## 1. Prerequisites

### Node.js

If you don't have node installed there are several ways to do it. One
way is to use Node Version Manager ([nvm](https://github.com/creationix/nvm)).

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
```

Install the latest Long Term Support (LTS) version of node (currently 10.15.1).

```bash
nvm install node
```

### Vue CLI

If you dont have Vue cli installed (Node must already be installed).

```bash
npm install --global @vue/cli
```

### Maven

Use the appropriate package manager for your OS. These instructions were
tested with maven version 3.6.

### Gradle

Use the appropriate package manager for your OS. These instructions were
tested with gradle 5.2.

## 2. Generate the Vue application

Replace `{component-name}` with the desired name for the component.

```bash
vue create {component-name} --default
```

Install dependencies for legacy browser support in the newly generated app.

```bash
cd {component-name}

npm install --save-dev @babel/{cli,plugin-transform-runtime,preset-env}
```

**Note:** whenever you modify dependencies in the Vue application you must
re-run the `npm install` command above.

## 3. Edit the Vue application

### Create gradle.properties

In the root directory, create a **gradle.properties** file, with the
following content:

```gradle
group=org.webjars.npm
```

This is the standard GroupId for [NPM package WebJars](https://www.webjars.org/).

### Create build.gradle

Create a build.gradle file. Here is a simple sample for SNAPSHOT versions:

```gradle
apply plugin: 'java'
apply plugin: 'maven'

def jsonFile = file("${projectDir}/package.json")
def parsedJson = new groovy.json.JsonSlurper().parseText(jsonFile.text)
project.version = parsedJson.version + '-SNAPSHOT'

jar {
    archiveBaseName = project.name
    from '.'
    into "META-INF/resources/webjars/${project.name}/${project.version}"
    include 'META-INF'
    include 'dist/*'
    exclude "dist/demo.html"
    exclude "dist/${project.name}.js"
    exclude "dist/${project.name}.js.map"
    exclude "dist/${project.name}.min.js.map"
}
```

This gets the project version from **package.json**, appends "-SNAPSHOT" to
it, creates a .jar file with the recommended paths for
[contributing WebJars](https://www.webjars.org/contributing)
(META-INF/resources/webjars/${name}/${version}), and includes just the
{project-name}.min.js file generated by Vue, to keep the WebJar as
small as possible. It excludes non-essential files. You can delete
`+ '-SNAPSHOT'` for a release version. Modify build.gradle to include
additional files you may need.

This works for building and publishing to the local Maven repository on
your computer with `./gradlew build` and `./gradlew install`. To publish
to a remote repository and for details on creating a build.gradle file, or
if you have problems, see
[C. Creating build.gradle files](#c-creating-buildgradle-files) in the
[Appendix](#appendix).

### Add Gradle wrapper to project

Run this:

```bash
gradle wrapper --gradle-version=5.1.1
```

**Note:** now that the project has a build.gradle file and a Gradle wrapper, an
IDE like IntelliJ IDEA will recognize it as a Gradle project. You could do
the rest of the required editing in the IDE.

### Rename HelloWorld.vue

Rename the generated **src/components/HelloWorld.vue** file to your `{component-name}`:

```
FROM:
src/components/HelloWorld.vue

TO:
src/components/{component-name}.vue
```

### Edit App.vue

In **src/App.vue**, rename the import for HelloWorld.vue and replace with your
`{component-name}` file:

```javascript
// FROM:
import HelloWorld from './components/HelloWorld.vue';

// TO:
import HelloWorld from './components/{component-name}.vue';
```

#### Optional edits in App.vue

In **App.vue** you can change every instance of `HelloWorld` to your `{ComponentName}`:

```vue
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from './components/{component-name}.vue';

export default {
  name: 'app',
  components: {
    HelloWorld
  }
};
</script>
```

#### Optional edits in {component-name}.vue

In **src/components/{component-name}.vue** you can change every instance
of `HelloWorld` to your `{ComponentName}`:

```vue
<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
};
</script>
```

### Edit package.json

**Note:** in **package.json** the `{component-name}` after `--name` _**must**_
have a hyphen; for example `--name weather-thingy`.

Change the following and replace `{component-name}` with yours:

```
// FROM:
    "build": "vue-cli-service build",

// TO (be sure to rename {component-name}):
    "prebuild": "babel node_modules/@vue/web-component-wrapper/dist/vue-wc-wrapper.js -o node_modules/@vue/web-component-wrapper/dist/vue-wc-wrapper.js",
    "build": "vue-cli-service build --name {component-name} --target wc src/components/{component-name}.vue",

```

Add these top-level declarations:

```
  "main": "dist/{component-name}.js",
  "source": "src/components/{component-name}.vue",
```

It should look something like this when you've finished editing:

```
{
  "name": "weather-thingy",
  "version": "0.1.0",
  "private": true,
  "main": "dist/weather-thingy.js",
  "source": "src/components/weather-thingy.vue",
  "scripts": {
    "serve": "vue-cli-service serve",
    "prebuild": "babel node_modules/@vue/web-component-wrapper/dist/vue-wc-wrapper.js -o node_modules/@vue/web-component-wrapper/dist/vue-wc-wrapper.js",
    "build": "vue-cli-service build --name weather-thingy --target wc src/components/weather-thingy.vue",
    "lint": "vue-cli-service lint"
  },
  ...
}

```

### Edit babel.config.js

Replace the contents of **babel.config.js** with this:

```javascript
module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [['@babel/plugin-transform-runtime', { useESModules: true }]]
};
```

## 4. Assemble and deploy the Vue application

To pack the component, run:

```bash
npm run build
```

You can optionally check that the component will run properly with:

```bash
npm run serve
```

Then go to the address specified in your browser (for example <http://localhost:8080>)
to see if it displays.

To assemble the WebJar and put it in the local maven repo where the uPortal-start
project can find it, run:

```bash
./gradlew install
```

## 5. Add the component into uPortal

The following is done in the **uPortal-start** project.

### Create a portlet-definition.xml

In the uPortal-start project make a copy of an existing portlet definition
that has a web component.

```
COPY:
data/quickstart/portlet-definition/admin-dashboard.portlet-definition.xml

TO:
data/quickstart/portlet-definition/{component-name}.portlet-definition.xml
```

### Edit portlet definition

In the newly-created portlet-definition.xml, modify the following fields:

```xml
    <title>Component Title</title>
    <name>Component Name</name>
    <fname>component-name</fname>
    <desc>An excellent component that does something</desc>
```

### Replace CDATA in portlet definition

Replace the CDATA section of the portlet definition with this, replacing
`{component-name}` with your component name:

```xml
<portlet-preference>
    <name>content</name>
    <readOnly>false</readOnly>
    <value>
        <![CDATA[
           <script src="https://unpkg.com/vue"></script>
           <script type="text/javascript" src="/resource-server/webjars/uportal__{component-name}/dist/{component-name}.min.js"></script>

           <{component-name}></{component-name}>

       ]]>
    </value>
</portlet-preference>
```

To find the name of the component min.js file that you will name in the
script, examine the contents of the WebJar that was created. For example:

```bash
ls -al ~/.m2/repository/org/webjars/npm/uportal__weather-thingy/0.1.0-SNAPSHOT/*.jar
```

This shows the .jar file named:

```
uportal__weather-thingy-0.1.0-SNAPSHOT.jar
```

Now inspect the contents of the .jar file, for example:

```bash
jar tvf uportal__weather-thingy-0.1.0-SNAPSHOT.jar | grep min.js
```

This shows:

```
META-INF/resources/webjars/uportal__weather-thingy/0.1.0-SNAPSHOT/dist/weather-thingy.min.js
```

So the name of the min.js file is **weather-thingy.min.js**, which is what
you put in the CDATA `<script>` tag.

### Other options for portlet definition

To add Chrome (the standard border around portlets):

```xml
    <parameter>
        <name>chromeStyle</name>
        <value>default</value>
    </parameter>
```

To remove Chrome:

```xml
    <parameter>
        <name>chromeStyle</name>
        <value>no-chrome</value>
    </parameter>
```

To grant permission to everyone to browse for the web component and select it:

```xml
    <group>Everyone</group>
    <permissions>
        <permission system="UP_PORTLET_SUBSCRIBE" activity="BROWSE">
            <group>Everyone</group>
        </permission>
    </permissions>

```

### Add WebJar to resource server

In the **overlays/resource-server/build.gradle** file in the uPortal-start
project, add the following runtime dependency:

```gradle
    runtime "org.webjars.npm:uportal__{component-name}:{version}@jar"
```

For example:

```gradle
    runtime "org.webjars.npm:uportal__weather-thingy:0.1.0-SNAPSHOT@jar"
```

### Rebuild uPortal-start

Rebuild the **uPortal-start** project to populate the database with the new
portlet definition and load the new WebJar into the resource server.

```bash
./gradlew portalInit
```

When you start uPortal, you should be able to find the new component when
you select _Customize > Add Stuff_.

## Appendix

### A. Quick new deployment

You can build and deploy a web component without having to restart the
uPortal server and re-initialize uPortal data. Once the web component has
been built and the WebJar dependency has been
[added to the resource server](#add-webjar-to-resource-server) you can
deploy it like this.

#### Rebuild and redeploy resource-server

1. Re-build the resource-server so it pulls the new WebJar into its resources.

   ```bash
   ./gradlew :overlays:resource-server:build
   ```

2. Copy the newly-built **resource-server.war** file into the **tomcat/webapps**
   directory where it will automatically be deployed and overwrite the current one.

   ```bash
   cp overlays/resource-server/build/libs/resource-server.war .gradle/tomcat/webapps/
   ```

#### Import portlet definition or add it in uPortal

It is better, and easier, to create the portlet definition .xml file and
import it ([Method 1](#method-1-import-portlet-definition)) rather than add
it in Portlet Administration in uPortal
([Method 2](#method-2-add-portlet-definition-in-uportal)), but you can do
it both ways.

##### Method 1: Import portlet definition

1. Create a portlet-definition.xml according to the
   [instructions](#create-a-portlet-definitionxml) above and
   [modify it](#edit-portlet-definition) for your web component.
2. Import the portlet-definition.xml into the uPortal database.

   ```bash
   ./gradlew dataImport -Dfile=path/to/portlet-definition.xml
   ```

3. Clear the uPortal cache in the Cache Manager. In uPortal, navigate to
   Admin Tools > Cache Administration. Select the **Empty All Caches** button.
   This causes uPortal to reload data from the database, which will load the
   portlet definition.

You will now be able to find your portlet in the Customize menu.

##### Method 2: Add portlet definition in uPortal

The problem with this method is that the definition is only temporary. It
is not included in the uPortal-start project and only resides in the
database. If you delete or refresh the database, for example with
`./gradlew portalInit`, the portlet definition is gone.

In uPortal, navigate to Admin Tools > Portlet Administration.

1. Select **Register New Portlet** button.
2. Select **Advanced CMS** and Continue.
3. Fill in the Portlet Title, Name, Functional Name, and optionally, Description.
4. Select **Edit Principals** button then select the **Add to Selection**
   button for the group(s) that can access the portlet (**Everyone** is the default at
   the top) and **Save** it.
5. Select the **Published** radio button under **Lifecycle Management**.
6. Select the **Save and Configure** button.
7. In the Content Editor, select the **Source** button and paste the following
   and substite your component name:

   ```html
   <script src="https://unpkg.com/vue"></script>
   <script type="text/javascript" src="/resource-server/webjars/uportal__{component-name}/dist/{component-name}.min.js"></script>
   <{component-name}></{component-name}>
   ```

8. You won't be able to save until you select the **Source** button again to
   return to normal editing. Then select the **Save** icon right next to it
   to save your changes.

You will now be able to find your portlet in the Customize menu.

### B. Quick rebuild and deploy

Once you have built the web component and included it in uPortal, here is
a way to speed up the rebuild and redeployment process so you can see your
changes quickly in uPortal.

#### Rebuild web component

1\. Re-build the web component.

```bash
npm run build
```

2\. Re-package the WebJar and copy to local Maven repo for uPortal-start to use.

```bash
./gradlew install
```

#### Redeploy to uPortal resource-server

You can do this _while uPortal is still running_ which is why it's much
faster. You don't have to stop and restart uPortal which can take several
minutes. This assumes you used the uPortal-start project to run uPortal
locally with `./gradlew portalInit` and `./gradlew portalOpen` (or
`./gradlew tomcatStart`) and that _you have not stopped Tomcat_ (with
`./gradlew tomcatStop`).

In the **uPortal-start project** root directory:

3\. Re-build the resource-server so it pulls the new WebJar into its resources.

```bash
./gradlew :overlays:resource-server:build
```

4\. Copy the newly-built **resource-server.war** file into the **tomcat/webapps**
directory where it will automatically be deployed and overwrite the current one.

```bash
cp overlays/resource-server/build/libs/resource-server.war .gradle/tomcat/webapps/
```

5\. Refresh the browser and you should see the changes.

### C. Creating build.gradle files

To publish WebJars to a remote Maven repository, care must be taken when
naming the artifacts. These instructions are for both the older
[maven plugin](https://docs.gradle.org/current/userguide/maven_plugin.html) and the
newer
[maven-publish plugin](https://docs.gradle.org/current/userguide/publishing_maven.html)
for Gradle.

#### Naming artifacts

In order to publish to a remote Maven repository correctly, you should use
the Gradle **project.name** and **project.version** variables to name the
artifact with the [jar task](https://docs.gradle.org/current/userguide/java_plugin.html#sec:jar)
of the Gradle [java plugin](https://docs.gradle.org/current/userguide/java_plugin.html)
that will later be published with the maven or maven-publish plugins. This
is especially important for SNAPSHOT versions because Maven writes each
version with a timestamp appended to the name and retrieves the latest one
when it is named as a dependencey in a project based on what is in the
maven-metadata.xml file stored with it. This happens automatically and works
properly if you use the project.name and project.version variables to name the
artifact.

The **maven** and **maven-publish** plugins use the following Gradle variables
to determine where to publish the artifact in the remote Maven repository:

- group
- project.name
- project.version
- rootProject.name

If the group is org.webjars.npm, it will be published to:

```
org/webjars/npm/{project.name}/{project.version}/
```

The **group** is set in gradle.properties and should be **org.webjars.npm** to
follow the standard convention for publishing [WebJars](https://www.webjars.org/):

```gradle
group=org.webjars.npm
```

The **project.name** is _read-only_ and is derived from the name of the project
directory or from the rootProject.name variable. If you want the artifact name
to be different than the project directory name, you can set **rootProject.name**
in **settings.gradle**:

```gradle
rootProject.name="some-other-name"
```

Setting rootProject.name is the proper way to name your artifact to something
other than the project directory name if you want it to be published correctly
to remote Maven repositories using the maven or maven-publish plugins.

You can see what these variables are by adding this to your build.gradle script:

```gradle
println("group = ${group}")
println("project.name = ${project.name}")
println("project.version = ${project.version}")
println("rootProject.name = ${rootProject.name}")
```

#### Publishing artifacts

The Gradle **maven** plugin is the old way to publish. The **maven-publish**
plugin is the new way.

##### Repository user and password

_Do not put the repository name and password in the project_. You can store them
as variables in a gradle.properties file in the directory named in
the environment variable `GRADLE_USER_HOME`. If `GRADLE_USER_HOME` isn't set,
Gradle [defaults](https://docs.gradle.org/current/userguide/build_environment.html#sec:gradle_environment_variables)
to the `$USER_HOME/.gradle` directory. For example, put the following in
`$USER_HOME/.gradle/gradle.properties`:

```gradle
mavReleaseUser=RelU$er123
mavReleasePass=RelU$erP@ss
mavSnapshotUser=SnapU$er456
mavSnapshotPass=SnapU$erP@ss
```

See Gradle [Build Environment](https://docs.gradle.org/current/userguide/build_environment.html)
for more.

##### Publish with maven plugin

This example for SNAPSHOT builds includes both a SNAPSHOT repository and
release repository. To publish to a remote Maven repository, run:

```bash
./gradlew uploadArchives
```

The maven plugin automatically selects which one to publish to based on
whether or not the project.version has "-SNAPSHOT" at the end; for example,
`0.1.0-SNAPSHOT` versus `0.1.0`.

##### Sample build.gradle with maven plugin:

```gradle
apply plugin: 'java'
apply plugin: 'maven'

def jsonFile = file("${projectDir}/package.json")
def parsedJson = new groovy.json.JsonSlurper().parseText(jsonFile.text)
project.version = parsedJson.version + '-SNAPSHOT'
/* remove '-SNAPSHOT' for release version */

jar {
    archiveBaseName = project.name
    from '.'
    into "META-INF/resources/webjars/${project.name}/${project.version}"
    include 'META-INF'
    include 'dist/*'
    exclude "dist/demo.html"
    exclude "dist/${project.name}.js"
    exclude "dist/${project.name}.js.map"
    exclude "dist/${project.name}.min.js.map"
}

uploadArchives {
    repositories {
        mavenDeployer {
            repository(url: "https://repo.school.edu/repo/release-repo") {
                authentication(userName: "$mavReleaseUser", password: "$mavReleasePass")
            }
            snapshotRepository(url: "https://repo.school.edu/repo/snapshot-repo") {
                authentication(userName: "$mavSnapshotUser", password: "$mavSnapshotPass")
            }
        }
    }
}
```

To publish to a local Maven repository on your computer, run:

```bash
./gradlew install
```

The maven plugin recognizes the Maven `install` command even though it's not
listed as a task when you run `./gradlew tasks`.

##### Publish with maven-publish plugin

This example for SNAPSHOT builds includes both a SNAPSHOT repository and
release repository, both identified by "myMaven". To publish to a remote
Maven repository, run:

```bash
./gradlew publishWebJarPublicationToMyMavenRepository
```

It checks the name and automatically selects which repository to publish to
based on whether or not it ends with "-SNAPSHOT"; for example, `0.1.0-SNAPSHOT`
versus `0.1.0`.

The maven-publish plugin automatically generates a new task, **publishToMavenLocal**,
and other tasks based on the name of the publication and the name of the
repository. The task name convention for publishing to a remote repository is:

```
publish{publication name}PublicationTo{repository name}Repository
```

For example, the publication in the sample below is named "webJar" and the
repository is named "myMaven" so the task is publishWebJarPublicationToMyMavenRepository.

##### Sample build.gradle with maven-publish plugin:

```gradle
apply plugin: 'java'

def jsonFile = file("${projectDir}/package.json")
def parsedJson = new groovy.json.JsonSlurper().parseText(jsonFile.text)
project.version = parsedJson.version + '-SNAPSHOT'
/* remove '-SNAPSHOT' for release version */

jar {
    archiveBaseName = project.name
    from '.'
    into "META-INF/resources/webjars/${project.name}/${project.version}"
    include 'META-INF'
    include 'dist/*'
    exclude "dist/demo.html"
    exclude "dist/${project.name}.js"
    exclude "dist/${project.name}.js.map"
    exclude "dist/${project.name}.min.js.map"
}

apply plugin: 'java-library'
apply plugin: 'maven-publish'

publishing {

    publications {
        webJar(MavenPublication) {
            artifact file("$buildDir/libs/${project.name}-${project.version}.jar")
        }
    }

    repositories {
        maven {
            name = "myMaven"

            def releaseRepoUrl   = "https://repo.school.edu/repo/release-repo"
            def releaseRepoUser  = "$mavReleaseUser"
            def releaseRepoPass  = "$mavReleasePass"

            def snapshotRepoUrl  = "https://repo.school.edu/repo/snapshot-repo"
            def snapshotRepoUser = "$mavSnapshotUser"
            def snapshotRepoPass = "$mavSnapshotPass"

            url = project.version.endsWith('SNAPSHOT') ? snapshotRepoUrl : releaseRepoUrl
            credentials {
                username = project.version.endsWith('SNAPSHOT') ? snapshotRepoUser : releaseRepoUser
                password = project.version.endsWith('SNAPSHOT') ? snapshotRepoPass : releaseRepoPass
            }
        }
    }
}
```

The maven-publish plugin _does not_ automatically recognize the Maven `install`
command. To publish to a local Maven repository on your computer, run:

```bash
./gradlew publishToMavenLocal
```

If you run `./gradlew tasks` you will see the following Publishing tasks
that are automatically generated by the maven-publish plugin:

```
publishToMavenLocal
publishWebJarPublicationToMavenLocal
publishWebJarPublicationToMavenLocalRepository
publishWebJarPublicationToMyMavenRepository
```

The above example automatically detects which remote repository to publish to
based on -SNAPSHOT in the name, but you could alternatively define multiple
repositories and explicitly publish to the one you want. See this example.

##### Alternate build.gradle with maven-publish:

```gradle
apply plugin: 'java'

def jsonFile = file("${projectDir}/package.json")
def parsedJson = new groovy.json.JsonSlurper().parseText(jsonFile.text)
project.version = parsedJson.version + '-SNAPSHOT'
/* remove '-SNAPSHOT' for release version */

jar {
    archiveBaseName = project.name
    from '.'
    into "META-INF/resources/webjars/${project.name}/${project.version}"
    include 'META-INF'
    include 'dist/*'
    exclude "dist/demo.html"
    exclude "dist/${project.name}.js"
    exclude "dist/${project.name}.js.map"
    exclude "dist/${project.name}.min.js.map"
}

apply plugin: 'java-library'
apply plugin: 'maven-publish'

publishing {

    publications {
        webJar(MavenPublication) {
            artifact file("$buildDir/libs/${project.name}-${project.version}.jar")
        }
    }

    repositories {
        maven {
            name = "myRelease"
            url  = "https://repo.school.edu/repo/release-repo"
            credentials {
                username = "$mavReleaseUser"
                password = "$mavReleasePass"
            }
        }
        maven {
            name = "mySnapshot"
            url  = "https://repo.school.edu/repo/snapshot-repo"
            credentials {
                username = "$mavSnapshotUser"
                password = "$mavSnapshotPass"
            }
        }
    }
}
```

If you run `./gradlew tasks` you will see the following Publishing tasks
that are automatically generated by the maven-publish plugin:

```
publishToMavenLocal
publishWebJarPublicationToMyReleaseRepository
publishWebJarPublicationToMySnapshotRepository
publishWebJarPublicationToMavenLocal

```

To publish to the release repository, use publishWebJarToMyReleaseRepository.
To publish to the snapshot repository, use publishWebJarToMySnapshotRepository.

#### build.gradle for Windows

Windows has a quirk that the copyFiles and cleanUp tasks in this build.gradle
file works around. This will also work on Mac OS and Linux.

```gradle
apply plugin: 'java'
apply plugin: 'maven'

def jsonFile = file("${projectDir}/package.json")
def parsedJson = new groovy.json.JsonSlurper().parseText(jsonFile.text)
project.version = parsedJson.version + '-SNAPSHOT'

task copyFiles{
    copy{
        from ('.'){
            exclude '*.lock'
            exclude '**/*.lock'
            exclude 'build/*'
            exclude 'node_modules/*'
        }
        into 'build_tmp/target/content'
    }
}

jar {
    archiveBaseName = project.name
    from '.'
    into "META-INF/resources/webjars/${project.name}/${project.version}"
    include 'META-INF'
    include 'dist/*'
    exclude "dist/demo.html"
    exclude "dist/${project.name}.js"
    exclude "dist/${project.name}.js.map"
    exclude "dist/${project.name}.min.js.map"
}

task cleanUp(type: Delete) {
    delete 'build_tmp'
    followSymlinks = true
}

jar.finalizedBy cleanUp
```

### D. Node.js installation

#### Mac OS X

1. [MacPorts](https://www.macports.org/)
2. [HomeBrew](https://brew.sh/)
3. macOS installer (.pkg) from [Node.js website](https://nodejs.org/)

##### With MacPorts

```bash
sudo port list | grep node
sudo port install nodejs10
```

##### With Homebrew

```bash
brew search node
brew install node
```
