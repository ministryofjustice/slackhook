# Studio Slack Hook Handler

A basic node add which translates incoming webhook notifications into useful slack messages.

Authentication is backed by usernames and passwords stored in an azure keyvault.

Originally based on [KuduPostDeploymentSlackHook](https://raw.githubusercontent.com/WCOMAB/KuduPostDeploymentSlackHook).

## Requirements

* Node.js 8+
* npm 5+

## Configuration

* `SLACK_WEBHOOK` - an incoming hook configured from slack
* `KEYVAULT_URI` - the location of the keyvault
* `KEYVAULT_USER_PREFIX` - prefix for keyvault secrets used by this app
* `KEYVAULT_CLIENT_ID` - the client id for accessing the keyvault
* `KEYVAULT_CLIENT_SECRET` - the client secret for accessing the keyvault
* `LOCAL_USERS` - comma separated username:password combos for local testing

## Testing

Visit the homepage for some testing buttons

## Usage

Auth must be provided using HTTP Basic Auth

#### POST /kudu

Handles incoming webhooks from kudu deployments.

Can specify `channel` in the querystring to route to a different channel.

example payload

```json
{
  "id": "2bdc42572263361fef1a3334c562be57dfb06c27",
  "status": "success",
  "statusText": "",
  "authorEmail": "test@test.com",
  "author": "John Doe",
  "message": "Epic new feature!",
  "progress": "",
  "deployer": "",
  "receivedTime": "2015-06-11T09:58:46.9983824Z",
  "startTime": "2015-06-11T10:39:02.1322211Z",
  "endTime": "2015-06-11T10:39:07.555094Z",
  "lastSuccessEndTime": "2015-06-11T10:39:07.555094Z",
  "complete": true,
  "siteName": "azure-dummy-site"
}
```
