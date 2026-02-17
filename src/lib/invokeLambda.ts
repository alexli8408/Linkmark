import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const lambdaClient = process.env.LAMBDA_METADATA_FUNCTION_NAME
  ? new LambdaClient({ region: process.env.AWS_REGION ?? "us-east-1" })
  : null;

export async function invokeMetadataFetcher(
  bookmarkId: string,
  url: string
): Promise<boolean> {
  if (!lambdaClient) return false;

  await lambdaClient.send(
    new InvokeCommand({
      FunctionName: process.env.LAMBDA_METADATA_FUNCTION_NAME!,
      InvocationType: "Event", // async fire-and-forget
      Payload: JSON.stringify({ bookmarkId, url }),
    })
  );

  return true;
}
