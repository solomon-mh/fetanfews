import React from "react";
import PharmacyTable from "../tableList/PharmacyTable";
import ItemLists from "../ItemList/ItemList";

const PendingPharmacies = () => {
  return (
    <>
        <div className="home_items">
        <ItemLists type="totalPharmacies" />
        <ItemLists type="approvedPharmacies" />
        <ItemLists type="pendingPharmacies" />
        <ItemLists type="rejectedPharmacies" />
      </div>
    <div>
      <h2>Pending Pharmacies</h2>
      <PharmacyTable status="Pending"/>
    </div>
    </>
  );
};

export default PendingPharmacies;
