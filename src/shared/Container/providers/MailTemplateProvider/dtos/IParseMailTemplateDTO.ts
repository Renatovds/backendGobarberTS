interface IVarialblesTemplate {
  [key: string]: string | number;
}
export default interface IParseMailTemplateDTO {
  file: string;
  variables: IVarialblesTemplate;
}
