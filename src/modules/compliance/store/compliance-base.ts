export interface IComplianceBusiness {
  legal_name: string;
  trading_name: string;
  description: string;
  registration_date: string;
  legal_form: string;
  email: string;
  phone_number: string;
  website?: string | null;
  facebook_username?: string | null;
  twitter_username?: string | null;
  instagram_username?: string | null;
  first_address: string;
  second_address?: string | null;
  city: string;
  state: string;
  doc_type: string;
  doc_url: string;
}

export interface IComplianceRegistration {
  number: string;
  doc_url: string;
}

export interface IComplianceRepresentative {
  legal_first_name: string;
  legal_last_name: string;
  dob: string;
  nationality: string;
  business_role: string[];
  percentage_ownership?: string | null;
  doc: {
    type: string;
    value: string;
    url: string;
  };
  first_address: string;
  second_address?: string | null;
  city: string;
  state: string;
  address_doc: {
    type: string;
    url: string;
  };
}

export interface IComplianceBankAcoount {
  name: string;
  account_number: string | number;
  code: string;
  account_holder_name: string;
}

export interface IComplianceSignatory {
  legal_first_name: string;
  legal_last_name: string;
  dob: string;
  nationality: string;
  job_title: string;
  doc: {
    type: string;
    value: string;
    url: string;
  };
  first_address: string;
  second_address?: string | null;
  city: string;
  state: string;
  address_doc: {
    type: string;
    url: string;
  };
}

export interface IComplianceTerms {
  signed_agreement: boolean;
}

interface IComplianceBaseType {
  id: string;
  business: IComplianceBusiness;
  registration: IComplianceRegistration;
  representatives: IComplianceRepresentative[];
  bank_account: IComplianceBankAcoount;
  business_signatory: IComplianceSignatory;
  terms: IComplianceTerms;
}

export const complianceBase: IComplianceBaseType = {
  id: "",

  business: {
    legal_name: "",
    trading_name: "",
    description: "",
    registration_date: "",
    legal_form: "",
    email: "",
    phone_number: "",
    website: "",
    facebook_username: "",
    twitter_username: "",
    instagram_username: "",
    first_address: "",
    second_address: "",
    city: "",
    state: "",
    doc_type: "",
    doc_url: "",
  },

  registration: {
    number: "",
    doc_url: "",
  },

  representatives: [
    {
      legal_first_name: "",
      legal_last_name: "",
      dob: "",
      nationality: "",
      business_role: [],
      percentage_ownership: "",
      doc: {
        type: "",
        value: "",
        url: "",
      },
      first_address: "",
      second_address: "",
      city: "",
      state: "",
      address_doc: {
        type: "",
        url: "",
      },
    },
  ],

  bank_account: {
    name: "",
    account_number: "",
    code: "",
    account_holder_name: "",
  },

  business_signatory: {
    legal_first_name: "",
    legal_last_name: "",
    dob: "",
    nationality: "",
    job_title: "",
    doc: {
      type: "",
      value: "",
      url: "",
    },
    first_address: "",
    second_address: "",
    city: "",
    state: "",
    address_doc: {
      type: "",
      url: "",
    },
  },

  terms: {
    signed_agreement: false,
  },
};
