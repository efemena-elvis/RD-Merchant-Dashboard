export const orderStatuses = [
  {
    id: 1,
    name: "Order Received",
    description:
      "The order has been successfully placed and logged in the system.",
  },
  {
    id: 2,
    name: "Preparing Order",
    description: "The order is being packed or prepared for dispatch.",
  },
  {
    id: 3,
    name: "Ready for Pickup",
    description:
      "The order is ready for customer collection at the specified location.",
  },
  {
    id: 4,
    name: "Shipped",
    description:
      "The order has been dispatched to the delivery carrier and is in transit.",
  },
  {
    id: 5,
    name: "Out for Delivery",
    description: "The order is currently on its way to the customer.",
  },
  {
    id: 6,
    name: "Delivered",
    description: "The customer has successfully received the order.",
  },
  {
    id: 7,
    name: "Cancelled",
    description: "The order was cancelled before or during processing.",
  },
  {
    id: 8,
    name: "Return Requested",
    description:
      "The customer has requested to return the product for a refund or replacement.",
  },
  {
    id: 9,
    name: "Exchange Requested",
    description:
      "The customer has requested a product exchange due to size, color, or defect.",
  },
  {
    id: 10,
    name: "Order Completed",
    description:
      "The transaction has been finalized, and the order is officially closed.",
  },
  {
    id: 11,
    name: "Awaiting Stock",
    description:
      "The item is temporarily unavailable and will be fulfilled once restocked.",
  },
  {
    id: 12,
    name: "Partially Fulfilled",
    description: "Only part of the order has been processed or shipped.",
  },
  {
    id: 13,
    name: "Custom Order in Progress",
    description:
      "The order requires additional time due to customizations or special requests.",
  },
  {
    id: 14,
    name: "Awaiting Pickup by Carrier",
    description:
      "The package is prepared and waiting for the carrier to collect it.",
  },
  {
    id: 15,
    name: "Rescheduled Delivery",
    description:
      "The delivery has been rescheduled due to unforeseen circumstances.",
  },
];
