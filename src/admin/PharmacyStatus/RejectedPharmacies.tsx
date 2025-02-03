import React from "react";
import PharmacyTable from "../tableList/PharmacyTable";
import ItemLists from "../ItemList/ItemList";

const RejectedPharmacies = () => {
  return (
    <>
      <div className="home_items">
        <ItemLists type="totalPharmacies" />
        <ItemLists type="approvedPharmacies" />
        <ItemLists type="pendingPharmacies" />
        <ItemLists type="rejectedPharmacies" />
      </div>
      <div>
        <h2>Rejected Pharmacies</h2>
        <PharmacyTable status="Rejected" />
      </div>
    </>
  );
};

export default RejectedPharmacies;
