pragma solidity ^0.8.0;

contract ShipmentTrackingSystem {
    enum ShipmentStatus { Created, InTransit, Delivered }
    
    struct Shipment {
        address sender;
        address recipient;
        uint256 timestamp;
        ShipmentStatus status;
        string trackingNumber;
        string currentLocation;
    }
    
    mapping(string => Shipment) public shipments;
    uint256 public shipmentCount;
    
    event ShipmentCreated(string trackingNumber, address sender, address recipient);
    event ShipmentTracked(string trackingNumber, ShipmentStatus status, string location);
    
    function createShipment(address _recipient, string memory _trackingNumber) public {
        require(shipments[_trackingNumber].sender == address(0), "Shipment already exists");
        
        shipments[_trackingNumber] = Shipment({
            sender: msg.sender,
            recipient: _recipient,
            timestamp: block.timestamp,
            status: ShipmentStatus.Created,
            trackingNumber: _trackingNumber,
            currentLocation: "Origin"
        });
        
        shipmentCount++;
        
        emit ShipmentCreated(_trackingNumber, msg.sender, _recipient);
    }
    
    function trackShipment(string memory _trackingNumber, ShipmentStatus _status, string memory _location) public {
        require(shipments[_trackingNumber].sender != address(0), "Shipment does not exist");
        require(msg.sender == shipments[_trackingNumber].sender, "Only sender can track shipment");
        
        shipments[_trackingNumber].status = _status;
        shipments[_trackingNumber].currentLocation = _location;
        
        emit ShipmentTracked(_trackingNumber, _status, _location);
    }
    
    function getShipmentInfo(string memory _trackingNumber) public view returns (
        address sender,
        address recipient,
        uint256 timestamp,
        ShipmentStatus status,
        string memory currentLocation
    ) {
        Shipment memory shipment = shipments[_trackingNumber];
        require(shipment.sender != address(0), "Shipment does not exist");
        
        return (
            shipment.sender,
            shipment.recipient,
            shipment.timestamp,
            shipment.status,
            shipment.currentLocation
        );
    }
}