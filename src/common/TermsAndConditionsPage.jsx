import React from "react";
import { useTranslation } from "react-i18next";

const TermsAndConditionsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t("TermsAndConditionsPage.title")}
      </h1>
      <p>{t("TermsAndConditionsPage.description")}</p>
      <div className="mt-6">
        {/* Insert your detailed terms and conditions content here */}
        <p>{t("TermsAndConditionsPage.content")}</p>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
