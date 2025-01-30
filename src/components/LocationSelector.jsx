import React, { useState } from "react";
import data from "../../iraq_geodata.json"; // Assuming data is in the correct path
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const LocationSelector = ({ onLocationSelect, onClose }) => {
  const { t } = useTranslation(); // Get the translation function
  const [geoData, setGeoData] = useState(data);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedGovernorate(null);
    setSelectedDistrict(null);
    setSelectedSubDistrict(null);
  };

  const handleGovernorateSelect = (governorate) => {
    setSelectedGovernorate(governorate);
    setSelectedDistrict(null);
    setSelectedSubDistrict(null);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setSelectedSubDistrict(null);
  };

  const handleSubDistrictSelect = (subDistrict) => {
    setSelectedSubDistrict(subDistrict);
  };

  const handleConfirmSelection = () => {
    const fullLocation = [
      selectedCountry,
      selectedGovernorate,
      selectedDistrict,
      selectedSubDistrict,
    ]
      .filter(Boolean)
      .join(", ");
    onLocationSelect(fullLocation);
    setShowDropdown(false);
    onClose();
  };

  const currentSelectionText = () => {
    const parts = [];
    if (selectedCountry) parts.push(selectedCountry);
    if (selectedGovernorate) parts.push(selectedGovernorate);
    if (selectedDistrict) parts.push(selectedDistrict);
    if (selectedSubDistrict) parts.push(selectedSubDistrict);

    if (parts.length > 0) {
      return parts.join(", ");
    } else {
      const firstCountry = Object.keys(geoData)[0];
      return firstCountry || t("locationSelector.selectLocationPlaceholder"); // Use translation here
    }
  };

  const handleBackToCountries = () => {
    setSelectedCountry(null);
    setSelectedGovernorate(null);
    setSelectedDistrict(null);
    setSelectedSubDistrict(null);
  };

  const handleBackToGovernorates = () => {
    setSelectedGovernorate(null);
    setSelectedDistrict(null);
    setSelectedSubDistrict(null);
  };

  const handleBackToDistricts = () => {
    setSelectedDistrict(null);
    setSelectedSubDistrict(null);
  };

  return (
    <div className="relative">
      {/* Button to open dropdown - Modern and Sleek */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left hover:border-blue-300 transition-colors duration-200 ease-in-out"
      >
        {currentSelectionText()}
      </button>

      {showDropdown && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-xl z-10 overflow-hidden">
          {/* Dropdown Container - Modern and Sleek */}
          <div className="py-2">
            {/* Country Selection */}
            {!selectedCountry && geoData && (
              <div className="px-2 mb-2">
                <h3 className="font-semibold text-gray-700 px-2 py-1 flex items-center justify-between">
                  {t("locationSelector.selectCountryTitle")}
                </h3>
                <ul className="border border-gray-200 rounded-md overflow-auto max-h-48 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
                  {Object.keys(geoData).map((country) => (
                    <li
                      key={country}
                      onClick={() => handleCountrySelect(country)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ease-in-out text-gray-700"
                    >
                      {country}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Governorate Selection */}
            {selectedCountry && !selectedGovernorate && geoData && (
              <div className="px-2 mb-2">
                <h3 className="font-semibold text-gray-700 px-2 py-1 flex items-center justify-between">
                  {t("locationSelector.selectGovernorateTitle")}
                  <button
                    onClick={handleBackToCountries}
                    className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    {t("locationSelector.backToCountriesButton")}
                  </button>
                </h3>
                <ul className="border border-gray-200 rounded-md overflow-auto max-h-48 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
                  {geoData[selectedCountry]?.["المحافظات"]?.map((gov) => (
                    <li
                      key={Object.keys(gov)[0]}
                      onClick={() =>
                        handleGovernorateSelect(Object.keys(gov)[0])
                      }
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ease-in-out text-gray-700"
                    >
                      {Object.keys(gov)[0]}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* District Selection */}
            {selectedGovernorate && !selectedDistrict && geoData && (
              <div className="px-2 mb-2">
                <h3 className="font-semibold text-gray-700 px-2 py-1 flex items-center justify-between">
                  {t("locationSelector.selectDistrictTitle")}
                  <button
                    onClick={handleBackToGovernorates}
                    className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    {t("locationSelector.backToGovernoratesButton")}
                  </button>
                </h3>
                <ul className="border border-gray-200 rounded-md overflow-auto max-h-48 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
                  {geoData[selectedCountry]?.["المحافظات"]
                    ?.find((gov) => Object.keys(gov)[0] === selectedGovernorate)
                    ?.[selectedGovernorate]?.["الاقضية"]?.map((dist) => (
                      <li
                        key={Object.keys(dist)[0]}
                        onClick={() =>
                          handleDistrictSelect(Object.keys(dist)[0])
                        }
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ease-in-out text-gray-700"
                      >
                        {Object.keys(dist)[0]}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Sub-District Selection */}
            {selectedDistrict && geoData && (
              <div className="px-2 mb-2">
                <h3 className="font-semibold text-gray-700 px-2 py-1 flex items-center justify-between">
                  {t("locationSelector.selectSubDistrictTitle")}
                  <button
                    onClick={handleBackToDistricts}
                    className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    {t("locationSelector.backToDistrictsButton")}
                  </button>
                </h3>
                <ul className="border border-gray-200 rounded-md overflow-auto max-h-48 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
                  {geoData[selectedCountry]?.["المحافظات"]
                    ?.find((gov) => Object.keys(gov)[0] === selectedGovernorate)
                    ?.[selectedGovernorate]?.["الاقضية"]?.find(
                      (dist) => Object.keys(dist)[0] === selectedDistrict
                    )
                    ?.[selectedDistrict]?.["النواحي"]?.map((subDist) => (
                      <li
                        key={subDist}
                        onClick={() => handleSubDistrictSelect(subDist)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ease-in-out text-gray-700"
                      >
                        {subDist}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Confirm and Close Buttons - Modern Style */}
            <div className=" px-4 py-3 bg-gray-50 flex justify-end gap-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onClose();
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 ease-in-out"
              >
                {t("locationSelector.closeButton")}
              </button>
              <button
                onClick={handleConfirmSelection}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
              >
                {t("locationSelector.confirmButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
