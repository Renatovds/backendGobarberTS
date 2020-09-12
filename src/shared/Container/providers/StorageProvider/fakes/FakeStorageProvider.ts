import IStorageProvider from '../models/IStorageProvider';

class FakeStorageProvider implements IStorageProvider {
  private storageFiles: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storageFiles.push(file);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const indexFile = this.storageFiles.findIndex(
      storageFile => storageFile === file,
    );
    if (indexFile) {
      this.storageFiles.splice(indexFile, 1);
    }
  }
}
export default FakeStorageProvider;
