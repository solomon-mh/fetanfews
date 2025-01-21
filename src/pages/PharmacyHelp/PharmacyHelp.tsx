import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPhone } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import "./PharmacyHelp.scss";
import { containerVariants,itemVariants } from "../../utils/animateVariant";

const PharmacyHelp: React.FC = () => {
 


  return (
    <motion.div
      className="help-section"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
    >
      <motion.div className="benefits" variants={itemVariants}>
        <h4>Benefits of Registering</h4>
        <motion.ul>
          {[
            "Gain visibility on our platform, reaching a broader customer base.",
            "Enable delivery services for your customers, increasing convenience and sales.",
            "Provide accurate operating details to your customers, ensuring trust and reliability.",
            "Make your pharmacy easily discoverable through location-based drug search functionality.",
            "Allow customers to check real-time availability of medications at your pharmacy.",
            "Build customer loyalty by offering a user-friendly experience through online searches and purchases.",
            "Receive analytics on customer searches to stock high-demand medications effectively.",
            "Reduce unnecessary inquiries by providing comprehensive information about your offerings online.",
            "Boost sales by attracting nearby customers actively looking for specific medications.",
            "Participate in platform promotions and highlight your services, such as free delivery or discounts.",
            "Strengthen your presence in the community by being part of an innovative healthcare network.",
          ].map((benefit, index) => (
            <motion.li key={index} variants={itemVariants}>
              {benefit}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.div className="how-to-register" variants={itemVariants}>
        <h3>How to Register</h3>
        <ol>
          <motion.li variants={itemVariants}>
            Fill out all the required fields in the form.
          </motion.li>
          <motion.li variants={itemVariants}>
            Attach an image of your pharmacy (optional). This image will display on our site as your logo.
          </motion.li>
          <motion.li variants={itemVariants}>
            Provide a precise address, including Kebele, known building, and exact location within Bahir Dar city.
            Avoid general addresses like "Bahir Dar, Ethiopia" as the system supports only Bahir Dar city currently.
          </motion.li>
          <motion.li variants={itemVariants}>Click "Submit" to complete registration.</motion.li>
        </ol>
        <p>
          Ready to register? Go to the <Link to="/pharmacy-registration/form">Registration Form</Link>.
        </p>
      </motion.div>

      <motion.div className="contact-info" variants={itemVariants}>
        <h3>Need Help?</h3>
        <p>
          If you have any questions, feel free to contact our support team at:
        </p>
        <p>
          <FaPhone className="icon" /> 0970345323
        </p>
        <p>
          <MdMarkEmailRead className="icon" /> support@gmail.com
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PharmacyHelp;
