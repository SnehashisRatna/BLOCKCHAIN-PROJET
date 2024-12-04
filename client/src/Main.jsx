import { useState } from "react";
import { useEth } from "./contexts/EthContext";
import "./styles.css";

function MainComp() {
  const { state: { contract, accounts } } = useEth();
  const [shipmentData, setShipmentData] = useState({
    recipient: "",
    trackingNumber: "",
    status: "",
    currentLocation: "",
  });
  const [shipmentInfo, setShipmentInfo] = useState(null);

  const ShipmentStatus = ["Created", "InTransit", "Delivered"];

  const handleCreateShipment = async () => {
    try {
      const { recipient, trackingNumber } = shipmentData;
      await contract.methods.createShipment(recipient, trackingNumber).send({ from: accounts[0] });
      alert("Shipment created successfully!");
    } catch (error) {
      console.error("Error creating shipment:", error);
      alert("Failed to create shipment. Please check the inputs.");
    }
  };

  const handleTrackShipment = async () => {
    try {
      const { trackingNumber } = shipmentData;
      const shipment = await contract.methods.getShipmentInfo(trackingNumber).call();
      setShipmentInfo({
        sender: shipment.sender,
        recipient: shipment.recipient,
        timestamp: new Date(parseInt(shipment.timestamp) * 1000).toLocaleString(),
        status: ShipmentStatus[shipment.status],
        currentLocation: shipment.currentLocation,
      });
    } catch (error) {
      console.error("Error tracking shipment:", error);
      alert("Shipment not found.");
    }
  };

  const handleUpdateShipmentStatus = async () => {
    try {
      const { trackingNumber, status, currentLocation } = shipmentData;
      const shipmentStatus = ShipmentStatus.indexOf(status);
      await contract.methods.trackShipment(trackingNumber, shipmentStatus, currentLocation).send({ from: accounts[0] });
      alert("Shipment status updated successfully!");
    } catch (error) {
      console.error("Error updating shipment:", error);
      alert("Failed to update shipment. Please check the inputs.");
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>📦 Shipment Tracker</h1>
        <p className="subheading">Track shipments with ease on the blockchain.</p>
      </header>
      
      <main className="main-content">
        <section className="form-section glass">
          <h2>Create Shipment</h2>
          <input
            placeholder="Recipient Address"
            onChange={(e) => setShipmentData({ ...shipmentData, recipient: e.target.value })}
          />
          <input
            placeholder="Tracking Number"
            onChange={(e) => setShipmentData({ ...shipmentData, trackingNumber: e.target.value })}
          />
          <button onClick={handleCreateShipment}>Create Shipment</button>
        </section>

        <section className="form-section glass">
          <h2>Track Shipment</h2>
          <input
            placeholder="Tracking Number"
            onChange={(e) => setShipmentData({ ...shipmentData, trackingNumber: e.target.value })}
          />
          <button onClick={handleTrackShipment}>Track Shipment</button>
        </section>

        {shipmentInfo && (
          <section className="shipment-info glass">
            <h2>Shipment Info</h2>
            <p><strong>Sender:</strong> {shipmentInfo.sender}</p>
            <p><strong>Recipient:</strong> {shipmentInfo.recipient}</p>
            <p><strong>Timestamp:</strong> {shipmentInfo.timestamp}</p>
            <p><strong>Status:</strong> {shipmentInfo.status}</p>
            <p><strong>Current Location:</strong> {shipmentInfo.currentLocation}</p>
          </section>
        )}

        <section className="update-section glass">
          <h2>Update Shipment</h2>
          <input
            placeholder="Tracking Number"
            onChange={(e) => setShipmentData({ ...shipmentData, trackingNumber: e.target.value })}
          />
          <input
            placeholder="Current Location"
            onChange={(e) => setShipmentData({ ...shipmentData, currentLocation: e.target.value })}
          />
          <select
            onChange={(e) => setShipmentData({ ...shipmentData, status: e.target.value })}
          >
            <option value="">Select Status</option>
            {ShipmentStatus.map((status, index) => (
              <option key={index} value={status}>{status}</option>
            ))}
          </select>
          <button onClick={handleUpdateShipmentStatus}>Update Status</button>
        </section>
      </main>
    </div>
  );
}

export default MainComp;
