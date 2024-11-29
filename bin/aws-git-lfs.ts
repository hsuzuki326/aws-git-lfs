#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsGitLfsApiStack as GitLfsApiStack } from '../lib/Api';
import { readFileSync } from 'fs';
import { HostedZoneStack } from '../lib/HostedZone';
import { CertStack } from '../lib/Cert';


const app = new cdk.App();

const environment = app.node.tryGetContext("environment");

const config = JSON.parse(
  readFileSync(`config/${environment}.json`, 'utf8')
);

const envJP: cdk.Environment = {
  region: "ap-northeast-1"
}

const {hostedZone} = new HostedZoneStack(app, 'HostedZone', {
  zoneName: config.zoneName,
  env: envJP
});


const { certificate } = new CertStack(app, `Certificate`, {
  domainName: config.zoneName,
  hostedZone,
  env: envJP
});

new GitLfsApiStack(app, "GitLfsServerless", {
  ...config,
  domainName:`api.${config.zoneName}`,
  hostedZone,
  certificate,
  env: envJP
})