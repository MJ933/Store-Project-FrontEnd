import React, { useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import { socialMediaLinks } from "../config"; // Make sure this path is correct
import { useTranslation } from "react-i18next";
import Alert from "../components/Alert"; // Import the Alert component
const ContactPage = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [contactType, setContactType] = useState("email");
  const { t } = useTranslation();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const closeAlert = () => {
    setAlertMessage("");
  };

  const sendViaWhatsApp = (e) => {
    e.preventDefault();
    sendMessage("whatsapp");
  };

  const sendViaTelegram = (e) => {
    e.preventDefault();
    sendMessage("telegram");
  };

  const sendMessage = (platform) => {
    if (!name || !contact || !message) {
      setAlertMessage(t("ContactPage.alerts.fillAllFields"));
      setAlertType("error");
      return; // Stop execution
    }
    if (
      contactType === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
    ) {
      setAlertMessage(t("ContactPage.alerts.validEmail"));
      setAlertType("error");
      return; // Stop execution
    }
    if (contactType === "phone" && !/^\+?[0-9]{8,15}$/.test(contact)) {
      setAlertMessage(t("ContactPage.alerts.validPhone"));
      setAlertType("error");
      return; // Stop execution
    }

    const formattedMessage = `${t("ContactPage.form.nameLabel")}: ${name}\n${
      contactType === "email"
        ? t("ContactPage.form.emailLabel")
        : t("ContactPage.form.phoneLabel")
    }: ${contact}\n${t("ContactPage.form.messageLabel")}: ${message}`;
    const encodedMessage = encodeURIComponent(formattedMessage);
    let url = "";
    if (platform === "whatsapp") {
      url = `${socialMediaLinks.whatsapp}?text=${encodedMessage}`;
    } else if (platform === "telegram") {
      url = `${socialMediaLinks.telegram}?text=${encodedMessage}`;
    }
    window.open(url, "_blank");
    // Reset the form AND show success alert
    setName("");
    setContact("");
    setMessage("");
    setAlertMessage(t("ContactPage.alerts.success"));
    setAlertType("success");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("ContactPage.title")}</h1>
      <p>{t("ContactPage.description")}</p>

      {/* Social Media Links */}
      <div className="flex gap-4 mt-4">
        <a
          href={socialMediaLinks.facebook}
          className="hover:text-blue-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook size={24} />
        </a>
        <a
          href={socialMediaLinks.instagram}
          className="hover:text-pink-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={24} />
        </a>
        <a
          href={socialMediaLinks.telegram}
          className="hover:text-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTelegram size={24} />
        </a>
        <a
          href={`https://wa.me/${socialMediaLinks.whatsapp}`}
          className="hover:text-green-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp size={24} />
        </a>
        <a
          href={socialMediaLinks.twitter}
          className="hover:text-blue-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter size={24} />
        </a>
      </div>

      <form className="mt-6 max-w-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            {t("ContactPage.form.nameLabel")}
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border rounded"
            placeholder={t("ContactPage.form.namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="contact" className="block mb-2">
            {contactType === "email"
              ? t("ContactPage.form.emailLabel")
              : t("ContactPage.form.phoneLabel")}
          </label>
          <div className="flex flex-col sm:flex-row gap-2 items-start">
            <select
              value={contactType}
              onChange={(e) => setContactType(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="email">{t("ContactPage.form.emailLabel")}</option>
              <option value="phone">{t("ContactPage.form.phoneLabel")}</option>
            </select>
            <input
              type={contactType === "email" ? "email" : "tel"}
              id="contact"
              className="w-full p-2 border rounded"
              placeholder={
                contactType === "email"
                  ? t("ContactPage.form.emailPlaceholder")
                  : t("ContactPage.form.phonePlaceholder")
              }
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <small className="text-gray-500">
            {contactType === "phone" && t("ContactPage.form.phoneNotice")}
          </small>
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block mb-2">
            {t("ContactPage.form.messageLabel")}
          </label>
          <textarea
            id="message"
            className="w-full p-2 border rounded"
            rows="5"
            placeholder={t("ContactPage.form.messagePlaceholder")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={sendViaWhatsApp}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {t("ContactPage.form.sendViaWhatsApp")}
          </button>
          <button
            type="button"
            onClick={sendViaTelegram}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t("ContactPage.form.sendViaTelegram")}
          </button>
        </div>
      </form>
      {/* Conditionally render the Alert component */}
      {alertMessage && (
        <Alert message={alertMessage} type={alertType} onClose={closeAlert} />
      )}
    </div>
  );
};

export default ContactPage;
