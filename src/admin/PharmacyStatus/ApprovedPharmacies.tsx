import React from "react";
import PharmacyTable from "../tableList/PharmacyTable";
import ItemLists from "../ItemList/ItemList";
const ApprovedPharmacies = () => {
  return (
    <>
      <div className="home_items">
        <ItemLists type="totalPharmacies" />
        <ItemLists type="approvedPharmacies" />
        <ItemLists type="pendingPharmacies" />
        <ItemLists type="rejectedPharmacies" />
      </div>
    <div>
      <h2>Approved Pharmacies</h2>
      <PharmacyTable status="Approved"/>
      </div>
      </>
  );
};

export default ApprovedPharmacies;
