import { registerDecorator, ValidationOptions } from 'class-validator';
import { cpf } from 'cpf-cnpj-validator';
import { differenceInYears } from 'date-fns';

export function ValidateBirthDate(
  minAge: number,
  maxAge: number,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidateBirthDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return false;
          const today = new Date();
          const birthDate = new Date(value);
          const age = differenceInYears(today, birthDate);
          return age >= minAge && age <= maxAge;
        },
        defaultMessage() {
          return `A idade deve estar entre ${minAge} e ${maxAge} anos`;
        },
      },
    });
  };
}

export function ValidateCPF(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidateCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (!value) {
            return false;
          }
          if (cpf.isValid(value)) {
            cpf.format(value);
            return true;
          }
        },
        defaultMessage() {
          return 'CPF inválido';
        },
      },
    });
  };
}

export const regexPhoneNumberBR = /^\(\d{2}\) \d{5}-\d{4}$/;

export const BRStates: string[] = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PE',
  'PI',
  'PR',
  'RJ',
  'RN',
  'RO',
  'RR',
  'SC',
  'SE',
  'SP',
  'TO',
];

export const customerGoalOptions: string[] = [
  'Empréstimo',
  'Financiamento de Imóvel',
  'Portabilidade',
];

export const propertyTypeOptions: string[] = ['Residencial', 'Comercial'];

export const periodIntendPurchaseOptions: string[] = [
  'EM ATÉ 3 MESES',
  'EM ATÉ 6 MESES',
  'APÓS 6 MESES',
];

export const minimumPropertyValue = 90000; //90k

export const minimumAmountFinance = 60000; //60k

export const segmentOptions: string[] = [
  'SELECT',
  'VAN GOGH',
  'SEGMENTO ESPECIAL',
  'PRIVATE',
];

export const insuranceOptions: string[] = [
  'ZURICH SANTANDER BRASIL SEGUROS S.A',
  'HDI SEGUROS S.A',
];

export const offerOptions: string[] = [
  'C/ RELAC POUP ASSALARIADO',
  'C/ RELAC POUP AUTONOMO',
  'SEM RELACIONAMENTO',
];

export const installmentTypeOptions: string[] = [
  'ATUALIZÁVEL TR/SAC',
  'SEM ATUALIZAÇÃO/PRICE',
];

export const campaignOptions: string[] = ['NENHUM'];
