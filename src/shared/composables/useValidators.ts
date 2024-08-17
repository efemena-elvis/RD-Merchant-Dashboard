import { ref } from "vue";

export function useValidator() {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const trimInput = (inputText: string | number) => {
    return typeof inputText === "number"
      ? inputText.toString().trim()
      : inputText.trim();
  };

  const inputContainsNumber = (input: string) => {
    const numbers = "0123456789";
    return [...input].some((value) => [...numbers].includes(value));
  };

  const validateRequired = (
    input: string | number,
    message: string = "This input field is required"
  ) => {
    const trimmedInput = trimInput(input);
    return trimmedInput.length ? "" : message;
  };

  const validateEmail = (
    input: string,
    message: string = "Please provide a valid email address"
  ) => {
    const trimmedInput = trimInput(input);
    return emailRegex.test(trimmedInput) ? "" : message;
  };

  const validatePhone = (
    input: string | number,
    message: string = "Please provide a valid phone number"
  ) => {
    const trimmedInput = trimInput(input);
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(trimmedInput) ? "" : message;
  };

  const validatePasswordStrength = (input: string) => {
    const trimmedInput = trimInput(input);

    // Check for minimum length
    if (trimmedInput.length < 8) {
      return "Password must be at least 8 characters long";
    }

    // Check for an uppercase letter
    if (!/[A-Z]/.test(trimmedInput)) {
      return "Password must contain at least one uppercase letter";
    }

    // Check for a lowercase letter
    if (!/[a-z]/.test(trimmedInput)) {
      return "Password must contain at least one lowercase letter";
    }

    // Check for a special character (e.g., !, @, #, etc.)
    if (!/[-!$%^&*()_+|~=`{}\[\]:";'<>?#@,.\/]/.test(trimmedInput)) {
      return "Password must contain at least one special character";
    }

    // Check for a number
    if (!/\d/.test(trimmedInput)) {
      return "Password must contain at least one number.";
    }

    return "";
  };

  const validateFullName = (input: string) => {
    const trimmedInput = trimInput(input);
    const wordLimit = trimmedInput.split(" ");

    // CHECK FOR FIRST NUMBER ENTRY
    if (trimmedInput.length <= 2) return "Enter a minimum of 2 characters";
    else if (wordLimit.length === 1)
      return "Both first and last names are required";
    else if (wordLimit.length > 2) return "Enter only first and last names";
    else if (inputContainsNumber(trimmedInput))
      return "Fullname should not contain any number";
    else return "";
  };

  const validateSingleName = (
    input: string,
    message: string = "Input field should not contain any number"
  ) => {
    const trimmedInput = trimInput(input);

    if (trimmedInput.length <= 2) return "Enter a minimum of 2 characters";
    else if (inputContainsNumber(trimmedInput)) return message;
    else return "";
  };

  return {
    validateRequired,
    validateEmail,
    validatePhone,
    validatePasswordStrength,
    validateFullName,
    validateSingleName,
  };
}
