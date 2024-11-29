# AWS Git LFS Backend

This is a sample project that uses CDK to build a serverless Git LFS server on AWS.  

The original idea comes from the following blog post:  
[Serverless Git LFS for Game Development](https://alanedwardes.com/blog/posts/serverless-git-lfs-for-game-dev/)

However, this project includes the following enhancements:  
- Avoids the risks of directly running CloudFormation code found online.  
- Adds a custom domain to the API endpoint.  

These improvements are implemented using AWS CDK.

---

## Deployment Steps

1. **Create a config file**  
   Create a configuration file under the `config` folder, using `.example.json` as a reference.

   Example: `config.json`  
   ```json
   {
       "zoneName": "git-lfs.example.com"
   }

2. Install dependencies and bootstrap the environment
    Install all required Node.js dependencies and bootstrap the CDK environment if necessary.

    ```bash
    npm install
    npx cdk bootstrap
    ```

3. Deploy the Hosted Zone stack
    Deploy the Hosted Zone stack.

    ```bash
    npx cdk deploy HostedZone -c config --require-approval never
    ```

4.  Register NS records
    Register the NS (Name Server) records to the parent Hosted Zone.

5. Deploy all stacks
    Deploy all stacks defined in the application.

    ```bash
    npx cdk deploy --all -c config --require-approval never
    ```

## Deleting the Stacks

To delete all the deployed stacks, run the following command:

```bash
npx cdk destroy --all
```


