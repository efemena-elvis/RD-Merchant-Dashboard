import { useStorage } from "@/shared/composables/useStorage";
import constants from "@/utilities/constants";

const { getStorage, setStorage, removeStorage } = useStorage();

export function useString() {
  const logOutUser = () => {
    let storage_exception_key = "identifier_token";

    // PRIORITY REMOVALS ON LOGOUT
    removeStorage(constants.REDSTONE_AUTH_USER);
    removeStorage(constants.REDSTONE_AUTH_TOKEN);
    removeStorage("timestamp");

    for (let i = 0; i < localStorage.length; i++) {
      const local_key = localStorage.key(i) as string;

      if (local_key !== storage_exception_key) {
        removeStorage(local_key);
      }
    }

    // REDIRECT TO LOGIN PAGE
    location.href = "/login";
  };

  const checkAuthTimeout = (minutes: number) => {
    const timeout = Number(minutes) * 60000;
    const entry_time = Number(getStorage({ storage_name: "timestamp" }) ?? 0);
    const current_time = Number(+new Date());

    if (current_time - entry_time > timeout) {
      return true;
    } else {
      setStorage({ storage_name: "timestamp", storage_value: +new Date() });
      return false;
    }
  };

  const urlHash = (url: string): string => {
    return url.includes("?")
      ? `${url}&timestamp=${new Date().getTime()}`
      : `${url}?timestamp=${new Date().getTime()}`;
  };

  const getRandomString = (length: number) => {
    let randomstring = "";
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

    for (let i = 0; i < length; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  };

  const encodeString = (string: string): string => {
    return btoa(`${getRandomString(5)}+${string}+${getRandomString(5)}`);
  };

  const decodeString = (encoded_string: string): string => {
    return atob(encoded_string).split("+")[1];
  };

  const renderImg = (src: string) => {
    return require(`@/shared/assets/images/${src}`);
  };

  const getStringInitials = (text: string) => {
    //@ts-ignore
    const string_list = text?.replace(/\s+/g, " ")?.split(" ");

    return string_list?.length === 1
      ? string_list[0]?.slice(0, 1)?.toUpperCase()
      : `${string_list[0]?.slice(0, 1)?.toUpperCase()}${string_list[1]
          ?.slice(0, 1)
          ?.toUpperCase()}`;
  };

  const capitalizeFirstLetter = (string: string) => {
    const words = string.split(" ");

    if (words.length > 0) {
      words[0] = words[0][0]?.toUpperCase() + words[0]?.substring(1);
      return words?.join(" ");
    }

    return string;
  };

  const formatPhoneNumber = (
    phoneNumber: string,
    countryCode: string
  ): string => {
    // Ensure phoneNumber is a string
    phoneNumber = String(phoneNumber);

    // Check if the phone number starts with +
    if (phoneNumber.startsWith("+")) {
      // Remove the + sign
      phoneNumber = phoneNumber.slice(1);
    }

    // Check if the phone number starts with the country code
    if (phoneNumber.startsWith(countryCode)) {
      return phoneNumber.slice(countryCode.length);
    } else {
      // Catenate the country code with the phone number
      return `${countryCode}-${phoneNumber}`;
    }
  };

  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      // Format for 1 million and above
      const millions = value / 1000000;
      //@ts-ignore
      return millions.toFixed(1) + "M";
    } else if (value >= 1_000) {
      // Format for thousands
      //@ts-ignore
      return value.toLocaleString();
    } else {
      // Format for less than 1000
      //@ts-ignore
      return value.toString();
    }
  };

  const getBoldTableText = (text: string) => {
    return `<span class='font-semibold'>${text}</span>`;
  };

  const getStatus = (status: string): string => {
    const statusData: Record<string, string> = {
      success: "bg-green-400",
      pending: "bg-yellow-400",
      failed: "bg-red-400",
    };

    return `<div class='relative left-2.5 size-[9px] min-w-[9px] min-h-[9px] rounded-full ${statusData[status]}'></div>`;
  };

  const transactionFlowIcon = (status: string): string => {
    const statusData: Record<string, string> = {
      send: "text-red-600 icon-send",
      receive: "text-green-600 icon-receive",
    };

    return `<div class='relative left-2.5 text-[16.5px] ${statusData[status]}'></div>`;
  };

  const notAvailable = (text: string): string => {
    return `<div class='text-grey-600/40'>${text}</div>`;
  };

  const getActionBtn = (actionText: string): string => {
    return `<button class='py-[7px] px-3.5 text-grey-800/80 font-medium rounded-lg border border-grey-300/70 text-[12.75px]'>${actionText}</button>`;
  };

  return {
    logOutUser,
    checkAuthTimeout,
    urlHash,
    getRandomString,
    encodeString,
    decodeString,
    renderImg,
    getStringInitials,
    capitalizeFirstLetter,
    formatPhoneNumber,
    formatNumber,
    getBoldTableText,
    getStatus,
    transactionFlowIcon,
    notAvailable,
    getActionBtn,
  };
}
