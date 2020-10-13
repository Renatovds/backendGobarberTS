import { container } from 'tsyringe';
import mailConfig from '@config/mailConfig';
import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStrorageProvider from './StorageProvider/implementations/DiskStorageProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import SESMailProvider from './MailProvider/implementations/SESMailProvider';
import IMailProvider from './MailProvider/models/IMailProvider';
import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandleBarsMailTemplateProvider from './MailTemplateProvider/implementations/HandleBarsMailTemplateProvider';
import './CacheProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStrorageProvider,
);
container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandleBarsMailTemplateProvider,
);
container.registerInstance<IMailProvider>(
  'MailProvider',
  mailConfig.driver === 'ethereal'
    ? container.resolve(EtherealMailProvider)
    : container.resolve(SESMailProvider),
);
