interface ITemplateVariables {
    [Key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
    file: string;
    variables: ITemplateVariables
}