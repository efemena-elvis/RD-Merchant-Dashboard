import { useAuthStore } from "@/modules/auth/store";
import { useString } from "@/shared/composables/useString";

const { decodeString } = useString();
const { getAuthUser, getAuthBusiness, getAuthBusinessToken } = useAuthStore();

interface IUserProfile {
  id: string;
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  currentBusiness: string;
}

interface IBusinessProfile {
  businessAddress: string;
  bankAccountNumber: string;
  bankName: string;
  disputeEmailAddress: string;
  generalEmailAddress: string;
  businessId: string;
  businessLogo: string;
  businessMode: string;
  businessName: string;
  businessSector: string;
  supportEmailAddress: string;
}

interface IAPIKeys {
  playground: any;
  alcatraz: any;
}

export function useProfile() {
  const getUser = () => {
    return getAuthUser as IUserProfile;
  };

  const getBusiness = () => {
    const { bankAccountNumber, bankName, ...business } =
      getAuthBusiness as IBusinessProfile;

    return {
      bankAccountNumber: decodeString(bankAccountNumber),
      bankName: decodeString(bankName),
      ...business,
    };
  };

  const getAPIKeys = (): {
    test: { public: string; secret: string };
    live: { public: string; secret: string };
  } => {
    const { playground, alcatraz } = getAuthBusinessToken as IAPIKeys;

    return {
      test: {
        public: decodeString(playground.nigeria),
        secret: decodeString(playground.unitedKingdom),
      },
      live: {
        public: decodeString(alcatraz.nigeria),
        secret: decodeString(alcatraz.unitedKingdom),
      },
    };
  };

  return {
    getUser,
    getBusiness,
    getAPIKeys,
  };
}
