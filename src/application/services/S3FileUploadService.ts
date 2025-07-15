import { injectable } from "inversify";
import aws from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import IFileUploadService from "@application/services/IFileUploadService";

@injectable()
class S3FileUploadService implements IFileUploadService {
  private s3: aws.S3;

  constructor() {
    this.s3 = new aws.S3({
      region: process.env.S3_REGION || "us-east-1",
      s3ForcePathStyle: true,
      endpoint: process.env.S3_ENDPOINT_URL || "https://s3.amazonaws.com",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "default_access_key",
        secretAccessKey:
          process.env.S3_SECRET_ACCESS_KEY || "default_secret_key",
      },
      signatureVersion: "v4",
    });
  }

  public async getUploadUrl(): Promise<string> {
    const params = {
      Bucket: process.env.S3_BUCKETNAME,
      Key: uuidv4(),
      Expires: 240,
    };

    const uploadURL = await this.s3.getSignedUrlPromise("putObject", params);
    return uploadURL;
  }
}

export default S3FileUploadService;
