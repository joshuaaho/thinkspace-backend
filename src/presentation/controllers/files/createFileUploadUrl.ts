import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "inversify";
import CONSTANTS from "@containers/constants";
import CreateFileUploadUrl from "@application/useCases/files/createFileUploadUrl";

@injectable()
class CreateFileUploadUrlController {
  private createFileUploadUrl: CreateFileUploadUrl;

  constructor(
    @inject(CONSTANTS.CreateFileUploadUrlUseCase)
    createFileUploadUrl: CreateFileUploadUrl
  ) {
    this.createFileUploadUrl = createFileUploadUrl;
  }

  async handleCreateFileUploadUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await this.createFileUploadUrl.execute();

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}


export default CreateFileUploadUrlController;