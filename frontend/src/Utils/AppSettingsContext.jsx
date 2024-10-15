/* eslint-disable no-undef */
import { createContext, useState } from "react";

export const AppSettings = createContext();

export default function AppSettingsProvider({ children }) {
  const [reCaptchaV2, setreCaptchaV2] = useState(
    // eslint-disable-next-line no-undef
    iklaviyoef?.allFormSettings?.gReCaptcha
      ? iklaviyoef.allFormSettings.gReCaptcha
      : {
          siteKey: "",
          secretKey: "",
        }
  );
  const [reCaptchaV3, setreCaptchaV3] = useState(
    // eslint-disable-next-line no-undef
    iklaviyoef?.allFormSettings?.gReCaptchaV3
      ? iklaviyoef.allFormSettings.gReCaptchaV3
      : {
          siteKey: "",
          secretKey: "",
        }
  );

  const paymentsState = () => {
    if (iklaviyoef?.allFormSettings?.payments) {
      const pays = iklaviyoef.allFormSettings.payments;
      if (Array.isArray(pays)) return pays;
      return [pays];
    }
    return [];
  };

  const [payments, setPayments] = useState(paymentsState());
  return (
    <AppSettings.Provider
      value={{
        reCaptchaV2,
        setreCaptchaV2,
        reCaptchaV3,
        setreCaptchaV3,
        payments,
        setPayments,
      }}
    >
      {children}
    </AppSettings.Provider>
  );
}
