import React from "react";

const PharmacyConfrimation: React.FC = () => {
	return (
		<div className="confirmation-wrapper">
			<div className="confirmation-content">
				<h1>Registration Successful!</h1>
				<p>Thank you for registering your pharmacy with us.</p>
				<p>We will review the details and notify you of any updates.</p>
				<div className="actions">
					<button onClick={() => (window.location.href = "/")}>
						Go to Home
					</button>
					<button onClick={() => (window.location.href = "/register")}>
						Register Another Pharmacy
					</button>
				</div>
			</div>
		</div>
	);
};

export default PharmacyConfrimation;
