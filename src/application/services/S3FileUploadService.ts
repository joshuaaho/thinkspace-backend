import { injectable } from "inversify";
import aws from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import IFileUploadService from "@application/services/IFileUploadService";

@injectable()
class S3FileUploadService implements IFileUploadService {
  private s3: aws.S3;

  constructor() {
    this.s3 = new aws.S3({
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESSKEYID,
      secretAccessKey: process.env.S3_SECRETACCESSKEY,
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
