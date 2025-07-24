from aws_cdk import (
    Stack,
    aws_s3,
    aws_cloudfront,
    aws_cloudfront_origins,
    aws_s3_deployment,
    CfnOutput,
)
from constructs import Construct
import os


class PyWebdeplStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        deployment_bucket = aws_s3.Bucket(
            self, "PyWebDeplBucket"
        )  # デプロイ先S3バケットを作成

        ui_dir = os.path.join(
            os.path.dirname(__file__), "..", "..", "web", "dist"
        )  # Webアプリのビルド結果ディレクトリを指定
        if not os.path.exists(ui_dir):  # Webアプリのdistディレクトリが存在するか確認
            print("Ui dir not found: " + ui_dir)  # ディレクトリが存在しない場合の処理
            return

        origin_identity = aws_cloudfront.OriginAccessIdentity(  # CloudFrontオリジンアクセスアイデンティティを作成
            self, "PyOriginAccessIdentity"
        )
        deployment_bucket.grant_read(
            origin_identity
        )  # CloudFrontデプロイメントにS3バケットからの読み取り権限を付与

        distribution = aws_cloudfront.Distribution(  # CloudFrontディストリビューションを作成
            self,
            "PyWebDeploymentDistribution",  # ディストリビューションのID
            default_root_object="index.html",  # デフォルトルートオブジェクト（インデックスページ）
            default_behavior=aws_cloudfront.BehaviorOptions(  # デフォルトのビヘイビア設定
                origin=aws_cloudfront_origins.S3Origin(  # S3オリジンの設定
                    deployment_bucket, origin_access_identity=origin_identity
                )
            ),
        )

        aws_s3_deployment.BucketDeployment(  # S3バケットへのデプロイメント(distをS3バケットに置く)設定
            self,
            "PyWebDeployment",  # デプロイメントのID
            destination_bucket=deployment_bucket,  # デプロイ先のS3バケット
            sources=[
                aws_s3_deployment.Source.asset(ui_dir)
            ],  # デプロイするソースファイル
            distribution=distribution,  # キャッシュ無効化のためのディストリビューション
        )

        CfnOutput(
            self, "PyAppUrl", value=distribution.distribution_domain_name
        )  # アプリのURLを出力
