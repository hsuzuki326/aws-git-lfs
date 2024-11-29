# AWS Git LFS Backend
cdkによってサーバーレスなLFSサーバをAWSに構築するサンプルになります。

https://alanedwardes.com/blog/posts/serverless-git-lfs-for-game-dev/

元ネタはこちらの記事になりますが、
- インターネット上に落ちているcloudformationのコードをいきなり実行するのは怖い
- ついでなのでApiエンドポイントにカスタムドメインを付与したい

をcdkによって実装しています。


## Deploy

0. Create a config file under the config folder based on the .example.json file.

ex) config.json
```json
{
    "zoneName": "git-lfs.example.com"
}
```

2. Install all Node dependencies and bootstrap the CDK environment, if required.
```
npm install
npx cdk bootstrap 
```

2. Deploy HostedZone Stack
```
npx cdk deploy HostedZone　-c config --require-approval never
```

3. Register NS records to parent HostedZone

4. Then deploy all stacks defines in the application.
```
npx cdk deploy --all -c config --require-approval never
```

## Deleting all the stacks
You can delete the deployed environment with the following command. 
```
npx cdk destroy --all
```
