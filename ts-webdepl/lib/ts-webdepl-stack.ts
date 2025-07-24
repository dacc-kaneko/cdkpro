import * as cdk from 'aws-cdk-lib';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { existsSync } from 'fs';
import { join } from 'path';

export class TsWebdeplStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const deploymentBucket = new Bucket(this, 'TsWebDeploymentBucket')	// デプロイ先S3バケットの定義

		const uiDir = join(__dirname, '..', '..', 'web', 'dist');	// Webアプリケーションのビルドディレクトリ
		if (!existsSync(uiDir)) {	// ビルドディレクトリが存在しない場合のチェック
			console.warn('Ui dir not found: ' + uiDir);	// ビルドディレクトリが存在しない場合の警告
			return;
		}

		const originIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');	// CloudFrontのオリジンアクセスアイデンティティを作成
		deploymentBucket.grantRead(originIdentity);	// S3バケットに対してCloudFrontのオリジンアクセスアイデンティティに読み取り権限を付与

		const distribution = new Distribution(this, 'WebDeploymentDistribution', {	// CloudFrontディストリビューションの定義
			defaultRootObject: 'index.html',	// デフォルトのルートオブジェクトを設定
			defaultBehavior: {	// デフォルトのビヘイビアを設定
				origin: new S3Origin(deploymentBucket, {	// S3オリジンを設定
					originAccessIdentity: originIdentity	// オリジンアクセスアイデンティティを指定
				}),
			},
		});

		new BucketDeployment(this, 'WebDeployment', {	// S3バケットへのデプロイメントを定義
			destinationBucket: deploymentBucket,	// デプロイ先のS3バケット
			sources: [Source.asset(uiDir)],	// デプロイするソースを指定
			distribution: distribution	// キャッシュ無効化のためのディストリビューション
		});

		new cdk.CfnOutput(this, 'TsAppUrl', {	// CloudFrontディストリビューションのURLを出力
			value: distribution.distributionDomainName	// ディストリビューションのドメイン名を出力
		})
	}
}
