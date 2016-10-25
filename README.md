Node.js Cloudant Example
====================================

### Cloudant in BlueMix

This repository is an example Cloudant application that can be deployed into
Bluemix with only a couple clicks. Try it out for yourself right now by clicking:

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/snippet-java/nodejs-cloudant-example.git)

### How does this work?

When you click the button, you are taken to Bluemix where you get a pick a name
for your application at which point the platform takes over, grabs the code from
this repository and gets it deployed.

It will automatically create an instance of the Cloudant service, call it
`sample-cloudantNoSQLDB` and bind it to your app. This is where your
app will store its data. If you deploy multiple instances of
app from this repository, they will share the same Cloudant instance.


### Create, Read, Update, Delete (CRUD)

This repository includes examples on the CRUD operations. You should be able to
create database, create documents, list all documents, read single document, 
update single document, and delete single document.

The web content you get when you go to the application's URL is stored under the
`public` directory.

If you do clone this repository, make sure you update this `README.md` file to point
the `Deploy to Bluemix` button at your repository.

If you want to change the name of the Cloudant instance that gets created, the memory
allocated to the application or other deploy-time options, have a look in `manifest.yml`.

### Privacy Notice

This package is configured to track deployments to IBM Bluemix and other Cloud Foundry platforms. The following information is sent to a Deployment Tracker service on each deployment:

* Node.js package version
* Node.js repository URL
* Application Name (application_name)
* Space ID (space_id)
* Application Version (application_version)
* Application URIs (application_uris)
* Labels of bound services
* Number of instances for each bound service and associated plan information

This data is collected from the package.json file in this application and the VCAP_APPLICATION and VCAP_SERVICES environment variables in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of this applications to IBM Bluemix to measure the usefulness of our examples, so that we can continuously improve the content we offer to you. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.
