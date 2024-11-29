import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';

export interface HostedZoneStackProps extends cdk.StackProps {
  zoneName: string;
}

export class HostedZoneStack extends cdk.Stack {
  public readonly hostedZone: route53.IHostedZone;
  constructor(scope: cdk.App, id: string, props: HostedZoneStackProps) {
    super(scope, id, props);

    const { zoneName } = props;

    // 1. ホストゾーン作成 (sub.example.com)
    this.hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: zoneName,
    });

    // 2. 親ドメインに追加するためのNSレコード情報を取得
    const nsRecords = this.hostedZone.hostedZoneNameServers || [];

    new cdk.CfnOutput(this, "HostedZoneId", {value: this.hostedZone.hostedZoneId});
    new cdk.CfnOutput(this, "HostedZoneName", {value: zoneName});
    new cdk.CfnOutput(this, "HostedZoneNameServers", {value: cdk.Fn.join('\n', nsRecords)});
  }
}