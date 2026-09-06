export const BRAND = {
  name: "Pizza Box Peshawar",
  shortName: "Pizza Box",
  primary: "#D32F2F", // brand red
  primaryDark: "#B71C1C",
};

export const BRANCH_SEED = [
  { name: "Hayatabad", slug: "hayatabad" },
  { name: "University Town", slug: "university-town" },
  { name: "Shami Road", slug: "shami-road" },
  { name: "Gulbahar", slug: "gulbahar" },
  { name: "DHA", slug: "dha" },
];

export const FEEDBACK_CATEGORY_LABELS: Record<string, string> = {
  FOOD_QUALITY: "Food Quality",
  DELIVERY: "Delivery",
  STAFF_BEHAVIOR: "Staff Behavior",
  CLEANLINESS: "Cleanliness",
  PACKAGING: "Packaging",
  WAITING_TIME: "Waiting Time",
  OVERALL_EXPERIENCE: "Overall Experience",
};

export const TOPIC_LABELS: Record<string, string> = {
  FOOD_QUALITY: "Food Quality",
  TASTE: "Taste",
  DELIVERY: "Delivery",
  DELIVERY_TIME: "Delivery Time",
  STAFF: "Staff",
  CUSTOMER_SERVICE: "Customer Service",
  CLEANLINESS: "Cleanliness",
  PACKAGING: "Packaging",
  PRICE: "Price",
  VALUE: "Value",
  QUANTITY: "Quantity",
  PIZZA: "Pizza",
  BURGER: "Burger",
  PASTA: "Pasta",
  WINGS: "Wings",
  SAUCES: "Sauces",
  OTHER: "Other",
};

export const ALERT_TYPE_LABELS: Record<string, string> = {
  NEW_ONE_STAR: "New 1-Star Review",
  NEW_TWO_STAR: "New 2-Star Review",
  NEW_THREE_STAR: "New 3-Star Review",
  RATING_DROP: "Sudden Rating Drop",
  NEGATIVE_SPIKE: "Multiple Negative Reviews",
  BRANCH_BELOW_TARGET: "Branch Below Target Rating",
  STALE_UNANSWERED: "Unanswered Review Aging",
  DELIVERY_COMPLAINT_SPIKE: "Delivery Complaint Spike",
};

export const DATE_RANGE_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "6 Months", value: "6m" },
  { label: "12 Months", value: "12m" },
  { label: "Custom", value: "custom" },
] as const;

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  BRANCH_MANAGER: "Branch Manager",
  ANALYST: "Analyst",
};
