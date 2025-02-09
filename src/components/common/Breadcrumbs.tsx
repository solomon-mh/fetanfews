import { Link, useLocation, useSearchParams } from "react-router-dom";
import './Breadcrumbs.scss'
const Breadcrumbs = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Split the path into segments and remove empty parts
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Extract pharmacy name and IDs from the URL
  const pharmacyName = decodeURIComponent(pathnames[1] || "");
  const pharmacyId = searchParams.get("id") || searchParams.get("pham_id");
  const medicationName =
    pathnames.length > 2 ? decodeURIComponent(pathnames[2]) : null;

  return (
    <nav className="breadcrumbs">
      {/* Home breadcrumb */}
      <Link to="/">Home</Link> 

      {/* Pharmacy breadcrumb */}
      {pharmacyName ? (
        medicationName ? (
          <>
            <Link
              to={`/pharmacy/${encodeURIComponent(pharmacyName)}${
                pharmacyId ? `?id=${pharmacyId}` : ""
              }`}
            >
              {pharmacyName}
            </Link>
           
          </>
        ) : (
          <span>{pharmacyName}</span> // ✅ Display pharmacy name without a link
        )
      ) : null}

      {/* Medication breadcrumb */}
      {medicationName && <em>{medicationName}</em>}
    </nav>
  );
};

export default Breadcrumbs;
