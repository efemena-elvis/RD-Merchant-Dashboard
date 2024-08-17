export interface INavigationType {
  stepName: string;
  stepLink: string;
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
