import * as cdk from 'aws-cdk-lib';
import { ContentHandling, PassthroughBehavior, LambdaRestApi, DomainName } from 'aws-cdk-lib/aws-apigateway';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { ARecord, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGatewayDomain } from 'aws-cdk-lib/aws-route53-targets';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface ApiStackProps extends cdk.StackProps {
  githubOrganization: string;
  githubRepository: string;
  domainName: string;
  hostedZone: IHostedZone;
  certificate: ICertificate;
}

export class AwsGitLfsApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { domainName, hostedZone, certificate } = props;

    const storageBucket = new Bucket(this, "StorageBucket", {
      removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE
    });

    const signingLambda = new Function(this, "SigningLambda", {
      runtime: Runtime.DOTNET_8,
      code: Code.fromAsset("lambda/Estranged.Lfs.Hosting.Lambda.zip"),
      handler: "Estranged.Lfs.Hosting.Lambda::Estranged.Lfs.Hosting.Lambda.LambdaEntryPoint::FunctionHandlerAsync",
      description: "Generates S3 signed URLs for Git LFS",
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      environment: {
        LFS_BUCKET: storageBucket.bucketName,
        GITHUB_ORGANISATION: props.githubOrganization,
        GITHUB_REPOSITORY: props.githubRepository
      }
    });
    storageBucket.grantReadWrite(signingLambda);

    const api = new LambdaRestApi(this, "RestApi", {
      handler: signingLambda,
      integrationOptions: {
        passthroughBehavior: PassthroughBehavior.WHEN_NO_MATCH,
        contentHandling: ContentHandling.CONVERT_TO_TEXT,
        integrationResponses: [{
          statusCode: "200"
        }],
      }
    });

    const domain = new DomainName(this, "ApiDomain", {
      domainName,
      certificate
    });

    domain.addBasePathMapping(api, {
      basePath: '',  
    });

    new ARecord(this, 'ApiAliasRecord', {
      zone: hostedZone,
      target: RecordTarget.fromAlias(new ApiGatewayDomain(domain)),
      recordName: domainName
    });
    
    new cdk.CfnOutput(this, "StorageBucketName", {value: storageBucket.bucketName});
    new cdk.CfnOutput(this, "ApiDomainName", {value: `https://${domainName}`});
  }
}
