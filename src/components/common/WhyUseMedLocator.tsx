import React from "react";
import "./WhyUseMedLocator.scss";
import { FaMapMarkerAlt, FaClock, FaMedkit, FaSearch } from "react-icons/fa";

const WhyUseMedLocator: React.FC = () => {
  const benefits = [
    {
      icon: <FaMapMarkerAlt />,
      title: "Locate Nearby Pharmacies",
      description:
        "Find pharmacies near you quickly with accurate location details.",
    },
    {
      icon: <FaClock />,
      title: "Save Time",
      description:
        "Get instant access to pharmacy information and available medicines.",
    },
    {
      icon: <FaMedkit />,
      title: "Comprehensive Drug Data",
      description:
        "Access a wide range of medications, categorized for your convenience.",
    },
    {
      icon: <FaSearch />,
      title: "Effortless Search",
      description:
        "Easily search by medication category or pharmacy name with advanced filters.",
    },
  ];

  return (
    <section className="why-use-medlocator">
      <h2 className="section-title">Why Use MedLocator?</h2>
      <div className="benefits-grid">
        {benefits.map((benefit, index) => (
          <div key={index} className="benefit-item">
            <div className="icon-container">{benefit.icon}</div>
            <h3 className="benefit-title">{benefit.title}</h3>
            <p className="benefit-description">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyUseMedLocator;
