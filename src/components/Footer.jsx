import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import { socialMediaLinks } from "../config";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="text-[calc(0.6rem+1vw)] sm:text-sm bg-gray-900 text-gray-300 sm:py-8 py-4 border-t border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-8 gap-4 sm:mb-8 mb-4">
          {/* Section 1: Help & Contact */}
          <div>
            <h4 className="text-[calc(0.8rem+1vw)] sm:text-lg font-semibold text-white mb-4">
              {t("footer.helpContactTitle")}
            </h4>
            <ul className="gap-y-2">
              <li>
                <Link to="/faqs" className="hover:text-gray-100">
                  {t("footer.faqsLink")}
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-gray-100">
                  {t("footer.contactUsLink")}
                </Link>
              </li>
              {/* <li>
                <Link to="/track-order" className="hover:text-gray-100">
                  {t("footer.trackOrderLink")}
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Section 2: Stay Connected */}
          <div>
            <h4 className="text-[calc(0.8rem+1vw)] sm:text-lg font-semibold text-white sm:mb-4 mb-2">
              {t("footer.stayConnectedTitle")}
            </h4>
            <p className="mb-4">{t("footer.stayConnectedDescription")}</p>
            <div className="flex gap-2 sm:gap-4 mt-2 footer-icons-container">
              <a
                href={socialMediaLinks.facebook}
                className="hover:text-white facebook-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href={socialMediaLinks.instagram}
                className="hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href={socialMediaLinks.telegram}
                className="hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTelegram size={24} />
              </a>
              <a
                href={socialMediaLinks.whatsapp}
                className="hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp size={24} />
              </a>
              <a
                href={socialMediaLinks.twitter}
                className="hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 sm:pt-6 pt-4">
          <div className="md:flex md:justify-between items-center text-center md:text-left">
            <p className="text-[calc(0.6rem+1vw)] sm:text-sm">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </p>
            <div className="mt-2 md:mt-0">
              <ul className="text-[calc(0.6rem+1vw)] sm:text-sm flex gap-2 sm:gap-4 justify-center md:justify-start">
                <li>
                  <Link to="/privacy" className="mx-4 hover:text-gray-100">
                    {t("footer.privacyLink")}
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-gray-100">
                    {t("footer.termsLink")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
