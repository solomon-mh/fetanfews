import {
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="bg-slate-100 dark:bg-slate-900 text-gray-800 dark:text-white py-10 px-6 md:px-16">
			<div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
				<div>
					<h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
						Explore
					</h3>
					<ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
						<li>
							<Link
								to="/find-drugs"
								className="hover:text-green-600 dark:hover:text-white transition"
							>
								Find Nearby Drugs
							</Link>
						</li>
						<li>
							<Link
								to="/pharmacy-locator"
								className="hover:text-green-600 dark:hover:text-white transition"
							>
								Pharmacy Locator
							</Link>
						</li>
						<li>
							<Link
								to="/order-online"
								className="hover:text-green-600 dark:hover:text-white transition"
							>
								Order Online
							</Link>
						</li>
						<li>
							<Link
								to="/consultation"
								className="hover:text-green-600 dark:hover:text-white transition"
							>
								Consult with Experts
							</Link>
						</li>
					</ul>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
						Quick Links
					</h3>
					<ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
						<li>
							<Link
								to="/about"
								className="hover:text-green-600 dark:hover:text-white transition"
							>
								About Us
							</Link>
						</li>
						<li>
							<Link
								to="/contact"
								className="hover:text-green-600 dark:hover:text-white transition"
							>
								Contact
							</Link>
						</li>
						<li>
							<Link
								to="/services"
								className="hover:text-green-600 dark:hover:text-white transition"
							>
								Services
							</Link>
						</li>
						<li>
							<Link
								to="/privacy"
								className="hover:text-green-600 dark:hover:text-white transition"
							>
								Privacy Policy
							</Link>
						</li>
					</ul>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
						Contact Us
					</h3>
					<p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
						Email: support@fetanfews.com
					</p>
					<p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
						Phone: +251965861647
					</p>
					<p className="text-sm text-slate-600 dark:text-slate-400">
						Address: Bahir Dar, Ethiopia
					</p>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
						Follow Us
					</h3>
					<div className="flex space-x-4 text-xl">
						<a
							href="https://facebook.com/fetanfews"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-blue-600 dark:hover:text-blue-400 transition"
						>
							<FaFacebookF />
						</a>
						<a
							href="https://twitter.com/fetanfews"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-sky-500 dark:hover:text-sky-300 transition"
						>
							<FaTwitter />
						</a>
						<a
							href="https://instagram.com/fetanfews"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-pink-500 dark:hover:text-pink-400 transition"
						>
							<FaInstagram />
						</a>
						<a
							href="https://www.linkedin.com/in/fetanfews"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-blue-500 dark:hover:text-blue-300 transition"
						>
							<FaLinkedinIn />
						</a>
					</div>
				</div>
			</div>

			<div className="mt-10 border-t border-slate-300 dark:border-slate-700 pt-4 text-center text-sm text-slate-500 dark:text-slate-400">
				&copy; {new Date().getFullYear()} FetanFews. All rights reserved.
			</div>
		</footer>
	);
};

export default Footer;
