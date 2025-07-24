# CDK Python プロジェクトへようこそ！

これはPythonを使用したCDK開発のためのプロジェクトです。

`cdk.json` ファイルは、CDK Toolkitにアプリケーションの実行方法を指示します。

このプロジェクトは標準的なPythonプロジェクトとして設定されています。初期化
プロセスでは、このプロジェクト内の `.venv` ディレクトリ下に仮想環境も作成されます。
仮想環境を作成するために、パスに `python3`（WindowsではPython）実行ファイルがあり、
`venv` パッケージにアクセスできることを前提としています。何らかの理由で
仮想環境の自動作成が失敗した場合は、手動で仮想環境を作成できます。

macOSとLinuxで手動で仮想環境を作成するには：

```
$ python -m venv .venv
```

初期化プロセスが完了し、仮想環境が作成された後、以下の
手順で仮想環境をアクティベートできます。

```
$ source .venv/bin/activate
```

Windowsプラットフォームをお使いの場合は、以下のように仮想環境をアクティベートします：

```
% .venv\Scripts\activate.bat
```

仮想環境がアクティベートされたら、必要な依存関係をインストールできます。

```
$ pip install -r requirements.txt
```

この時点で、このコードのCloudFormationテンプレートを合成できます。

```
$ cdk synth
```

追加の依存関係（例：他のCDKライブラリ）を追加するには、
`setup.py` ファイルに追加して、`pip install -r requirements.txt`
コマンドを再実行してください。

## 便利なコマンド

 * `cdk ls`          アプリ内のすべてのスタックを一覧表示
 * `cdk synth`       合成されたCloudFormationテンプレートを出力
 * `cdk deploy`      このスタックをデフォルトのAWSアカウント/リージョンにデプロイ
 * `cdk diff`        デプロイ済みスタックと現在の状態を比較
 * `cdk docs`        CDKドキュメントを開く

お楽しみください！
