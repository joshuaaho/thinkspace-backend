
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IFileUploadService from "@application/services/IFileUploadService";




export type CreateFileUploadUrlResponse = {
  uploadUrl: string;
};

@injectable()
class CreateFileUploadUrl {
  private fileUploadService: IFileUploadService;

  constructor(
    @inject(CONSTANTS.FileUploadService) fileUploadService: IFileUploadService
  ) {
    this.fileUploadService = fileUploadService;
  }

  public async execute(
  ): Promise<CreateFileUploadUrlResponse> {
 
      const uploadUrl = await this.fileUploadService.getUploadUrl();
      return { uploadUrl };
    
  }
}

export default CreateFileUploadUrl;
