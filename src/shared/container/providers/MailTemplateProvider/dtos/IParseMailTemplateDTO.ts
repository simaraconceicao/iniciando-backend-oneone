interface ITemplateVariables {
    [Key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
    template: string;
    variables: ITemplateVariables
}