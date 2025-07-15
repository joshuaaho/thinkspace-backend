import { injectable, inject } from "inversify";
import CONSTANTS from "@containers/constants";
import CreateFileUploadUrl from "@application/useCases/files/createFileUploadUrl";
import {
  Controller,
  Post,
  Route,
  Response,
  SuccessResponse,
  Security,
  Tags,
} from "tsoa";
import { HTTPError } from "@presentation/middleware/errorHandler";

@injectable()
@Tags("Files")
@Route("files")
@Security("bearerAuth")
export class CreateFileUploadUrlController extends Controller {
  private createFileUploadUrl: CreateFileUploadUrl;

  constructor(
    @inject(CONSTANTS.CreateFileUploadUrlUseCase)
    createFileUploadUrl: CreateFileUploadUrl,
  ) {
    super();
    this.createFileUploadUrl = createFileUploadUrl;
  }

  @Post("/upload-url")
  @Response<HTTPError>(401, "Unauthenticated")
  @SuccessResponse("200", "Upload URL Created Successfully")
  async handleCreateFileUploadUrl() {
    const data = await this.createFileUploadUrl.execute();

    this.setStatus(200);
    return data;
  }
}
