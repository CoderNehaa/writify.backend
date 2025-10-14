import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
} from "../config/environment";
import { ReadStream } from "fs";

interface S3Response {
  success: boolean;
  url?: string;
  key?: string;
  error?: any;
}

export class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  uploadFileToS3 = async (
    fileContent: Buffer | ReadStream,
    bucketName: string,
    key: string,
    contentType: string
  ): Promise<S3Response> => {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
    });

    try {
      await this.s3Client.send(command);
      const url = this.getPublicUrlFromS3(bucketName, key);
      return { success: true, url, key };
    } catch (error) {
      console.error("Error uploading file:", error);
      return { success: false, error };
    }
  };

  deleteFileFromS3 = async (
    bucketName: string,
    key: string
  ): Promise<S3Response> => {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
      return { success: true, key };
    } catch (error) {
      console.error("Error deleting file:", error);
      return { success: false, error };
    }
  };

  getPublicUrlFromS3 = (bucketName: string, key: string): string => {
    return `https://s3.${AWS_REGION}.amazonaws.com/${bucketName}/${key}`;
  };

  async convertImageToUrl(imgFile: any, moduleName: string): Promise<string> {
    let url = "";
    const contentType = imgFile.mimetype;
    const key = `${moduleName}/${Date.now()}_${imgFile.originalname}`;
    const uploadResult = await this.uploadFileToS3(
      imgFile.buffer,
      process.env.AWS_S3_BUCKET_NAME as string,
      key,
      contentType
    );
    if (uploadResult.success) {
      url = uploadResult.url || "";
    }
    return url;
  }
}
