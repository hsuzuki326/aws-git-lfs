import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';

export interface CertStackProps extends cdk.StackProps {
  domainName: string;
  hostedZone: IHostedZone;
}


export class CertStack extends cdk.Stack {
  public readonly certificate: acm.ICertificate;

  constructor(scope: cdk.App, id: string, props: CertStackProps) {
    super(scope, id, { ...props });

    const {domainName, hostedZone} = props;

    this.certificate = new acm.Certificate(this, 'Cert', {
      domainName,
      subjectAlternativeNames: [`*.${domainName}`],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });
  }
}