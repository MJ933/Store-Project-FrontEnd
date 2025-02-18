import React from "react";
import { useTranslation } from "react-i18next";

const PrivacyPolicyPage = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t("PrivacyPolicyPage.title")}
      </h1>
      <p>{t("PrivacyPolicyPage.description")}</p>
      <div className="mt-6">
        {/* Insert your detailed privacy policy content here */}
        <p>{t("PrivacyPolicyPage.content")}</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
