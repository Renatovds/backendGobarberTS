import { container } from 'tsyringe';
import IStorageProvider from './models/IStorageProvider';
import DiskStrorageProvider from './implementations/DiskStrorageProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStrorageProvider,
);
