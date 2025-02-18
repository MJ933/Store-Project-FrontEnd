import React from "react";
import { useTranslation } from "react-i18next";

const FAQsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("FAQsPage.title")}</h1>
      <p>{t("FAQsPage.description")}</p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mt-4">
          {t("FAQsPage.question1.title")}
        </h2>
        <p>{t("FAQsPage.question1.answer")}</p>
        <h2 className="text-xl font-semibold mt-4">
          {t("FAQsPage.question2.title")}
        </h2>
        <p>{t("FAQsPage.question2.answer")}</p>
        {/* Add more FAQs as needed */}
      </div>
    </div>
  );
};

export default FAQsPage;
