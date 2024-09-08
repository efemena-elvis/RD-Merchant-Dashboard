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
    stepName: "Registration",
    stepLink: "RedstoneRegistrationConfirm",
  },
  {
    stepName: "TPIN",
    stepLink: "RedstoneRegistrationTPIN",
  },
  {
    stepName: "PACRA",
    stepLink: "RedstoneRegistrationPACRA",
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
    id: "registration_verification_tpin",
    title: "TPIN Verification",
    route: "RedstoneRegistrationTPIN",
    completed: false,
  },
  {
    id: "registration_verification_pacra",
    title: "PACRA Verification",
    route: "RedstoneRegistrationPACRA",
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
    id: "merchant_agreement",
    title: "Merchant Agreement",
    route: "RedstoneAgreementSignature",
    completed: false,
  },
];

export const businessSectors: { value: string; name: string }[] = [
  {
    value: "financial_services",
    name: "Financial Services",
  },
  {
    value: "e_commerce",
    name: "E-commerce",
  },
  {
    value: "telecommunications",
    name: "Telecommunications",
  },
  {
    value: "travel_and_hospitality",
    name: "Travel and Hospitality",
  },
  {
    value: "retail",
    name: "Retail",
  },
  {
    value: "gaming_and_gambling",
    name: "Gaming and Gambling",
  },
  {
    value: "subscription_services",
    name: "Subscription Services",
  },
  {
    value: "insurance",
    name: "Insurance",
  },
  {
    value: "healthcare",
    name: "Healthcare",
  },
  {
    value: "utilities",
    name: "Utilities",
  },
  {
    value: "educational_services",
    name: "Educational Services",
  },
  {
    value: "real_estate",
    name: "Real Estate",
  },
  {
    value: "transportation_and_logistics",
    name: "Transportation and Logistics",
  },
  {
    value: "fintech",
    name: "Fintech",
  },
  {
    value: "charity_and_non_profit",
    name: "Charity and Non-Profit",
  },
];
