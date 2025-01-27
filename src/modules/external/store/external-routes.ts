const paymentNameSpace: string = "payment";

export const externalRoutes = {
  getPaymentDetails: `${paymentNameSpace}`,
  makePayment: `${paymentNameSpace}/pay`,
  generateCardContext: `${paymentNameSpace}/get-capture-context`,
  continuePayment: `${paymentNameSpace}/pay`,
  completePayment: `${paymentNameSpace}/complete`,
};
