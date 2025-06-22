interface IFileUploadService {

  getUploadUrl(): Promise<string>;
}

export default IFileUploadService; 