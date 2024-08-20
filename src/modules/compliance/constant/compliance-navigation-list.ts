export interface INavigationType {
  stepName: string;
  stepLink: string;
}

export interface IComplianceSectionType {
  id: string;
  title: string;
  route: string;
  completed: boolean;
}

export const businessNavList: INavigationType[] = [
  {
    stepName: "Profile",
    stepLink: "RedstoneBusinessProfile",
  },
  {
    stepName: "Contact",
    stepLink: "RedstoneBusinessContact",
  },
  {
    stepName: "Address",
    stepLink: "RedstoneBusinessAddress",
  },
  {
    stepName: "Confirm",
    stepLink: "RedstoneBusinessConfirm",
  },
];

export const registrationNavList: INavigationType[] = [
  {
    stepName: "Information",
    stepLink: "RedstoneRegistrationInformation",
  },
  {
    stepName: "Confirm",
    stepLink: "RedstoneRegistrationConfirm",
  },
];

export const representativeNavList: INavigationType[] = [
  {
    stepName: "Profile",
    stepLink: "RedstoneRepresentativeProfile",
  },
  {
    stepName: "Identity",
    stepLink: "RedstoneRepresentativeIdentity",
  },
  {
    stepName: "Address",
    stepLink: "RedstoneRepresentativeAddress",
  },
  {
    stepName: "Confirm",
    stepLink: "RedstoneRepresentativeConfirm",
  },
];

export const signatoryNavList: INavigationType[] = [
  {
    stepName: "Profile",
    stepLink: "RedstoneSignatoryProfile",
  },
  {
    stepName: "Identity",
    stepLink: "RedstoneSignatoryIdentity",
  },
  {
    stepName: "Address",
    stepLink: "RedstoneSignatoryAddress",
  },
  {
    stepName: "Confirm",
    stepLink: "RedstoneSignatoryConfirm",
  },
];

export const complianceSections: IComplianceSectionType[] = [
  {
    id: "business_profile",
    title: "Business Profile",
    route: "RedstoneBusinessProfile",
    completed: false,
  },
  {
    id: "business_contact",
    title: "Business Contact",
    route: "RedstoneBusinessContact",
    completed: false,
  },
  {
    id: "business_address",
    title: "Business Address",
    route: "RedstoneBusinessAddress",
    completed: false,
  },
  {
    id: "business_verification",
    title: "Business Verification",
    route: "RedstoneBusinessConfirm",
    completed: false,
  },
  {
    id: "registration_information",
    title: "Registration Information",
    route: "RedstoneRegistrationInformation",
    completed: false,
  },
  {
    id: "registration_verification",
    title: "Registration Verification",
    route: "RedstoneRegistrationConfirm",
    completed: false,
  },
  {
    id: "representative_profile",
    title: "Representative Profile",
    route: "RedstoneRepresentativeProfile",
    completed: false,
  },
  {
    id: "representative_identity",
    title: "Representative Identity",
    route: "RedstoneRepresentativeIdentity",
    completed: false,
  },
  {
    id: "representative_address",
    title: "Representative Address",
    route: "RedstoneRepresentativeAddress",
    completed: false,
  },
  {
    id: "bank_account",
    title: "Bank Account",
    route: "RedstoneBankAccount",
    completed: false,
  },
  {
    id: "signatory_profile",
    title: "Signatory Profile",
    route: "RedstoneSignatoryProfile",
    completed: false,
  },
  {
    id: "signatory_identity",
    title: "Signatory Identity",
    route: "RedstoneSignatoryIdentity",
    completed: false,
  },
  {
    id: "signatory_address",
    title: "Signatory Address",
    route: "RedstoneSignatoryAddress",
    completed: false,
  },
  {
    id: "signatory_verification",
    title: "Signatory Verification",
    route: "RedstoneSignatoryConfirm",
    completed: false,
  },
  {
    id: "merchant_agreement",
    title: "Merchant Agreement",
    route: "RedstoneAgreementSignature",
    completed: false,
  },
];

export const businessForms: { value: string; name: string }[] = [
  {
    value: "limited_lianility_company",
    name: "Limited liability company",
  },
  {
    value: "joint_stock_venture",
    name: "Joint stock venture",
  },
  {
    value: "self_employed",
    name: "Self employed",
  },
  {
    value: "general_partnership",
    name: "General partnership",
  },
  {
    value: "limited_partnership",
    name: "Limited partnership",
  },
  {
    value: "society",
    name: "Society",
  },
  {
    value: "government_llc",
    name: "Government LLC",
  },
  {
    value: "foundation",
    name: "Foundation",
  },
  {
    value: "other",
    name: "Other",
  },
];
