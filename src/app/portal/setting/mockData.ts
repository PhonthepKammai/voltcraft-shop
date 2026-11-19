import type {
  ApplianceDeliveryAddress,
  CustomerApplianceOrder,
  DigitalApplianceWarranty,
  UserProfileData,
} from "./types";

export const INITIAL_USER_PROFILE: UserProfileData = {
  id: "usr-vc-7741",
  fullName: "Alex Vance",
  email: "alex.vance@voltcraft.com",
  phone: "089-452-8810",
  memberId: "VC-PRO-88412",
  joinedDate: "March 2025",
  preferredInstallationWindow: "Morning Slot (09:00 - 12:00)",
  lineNotificationEnabled: true,
  smsDispatchAlerts: true,
  roles: ["customer", "sales", "warehouse"],
  activeStaffDepartment: "Senior Showroom & Sales Operations",
};

export const INITIAL_ADDRESSES: ApplianceDeliveryAddress[] = [
  {
    id: "addr-1",
    label: "Condo",
    recipientName: "Alex Vance",
    recipientPhone: "089-452-8810",
    streetAddress: "The Line Vibe Sukhumvit, Bldg A, Unit 1804, Phahonyothin Rd",
    districtAndCity: "Chatuchak, Bangkok",
    postalCode: "10900",
    floorNumber: "18th Floor",
    freightElevatorAvailable: true,
    doorframeWidthCm: 92,
    gateAccessNotes:
      "Juristic office freight lift pass pre-approved (09:00-17:00). Loading bay B2 height clearance 3.2m.",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Home",
    recipientName: "Alex Vance (Family Residence)",
    recipientPhone: "081-904-3321",
    streetAddress: "142/19 Centro Chaiyaphruek, Soi 4 (Detached 2-Storey House)",
    districtAndCity: "Pakkret, Nonthaburi",
    postalCode: "11120",
    floorNumber: "1st Floor (Ground Level Kitchen & Living)",
    freightElevatorAvailable: false,
    doorframeWidthCm: 115,
    gateAccessNotes:
      "Present VoltCraft delivery QR at security guardhouse #2. Wide driveway for 4-wheel air-ride box truck.",
    isDefault: false,
  },
];

export const INITIAL_ORDERS: CustomerApplianceOrder[] = [
  {
    id: "ord-vc-01",
    orderRef: "#VC-ORD-8841",
    purchaseDate: "04 Nov 2026",
    deliverySlot: "Completed • 06 Nov 2026 (10:15)",
    status: "Delivered & Installed",
    totalAmountTHB: 52600,
    paymentMethod: "PromptPay QR Verified • Tax Invoice #INV-2026-8841",
    shippingAddressSummary: "The Line Vibe Sukhumvit (18th Fl • Freight Lift)",
    technicianTeam: "VoltCraft White-Glove Team #04 (Lead: Prasert J.)",
    items: [
      {
        sku: "VC-AC-12K",
        name: "VoltCraft AeroChill Pro 12,000 BTU Dual-Inverter AC",
        qty: 1,
        priceTHB: 18900,
        serialNumber: "SN-AC-992184",
        includesProInstall: true,
      },
      {
        sku: "VC-RF-19D",
        name: "VoltCraft ArcticLinear 4-Door Refrigerator 19.8 cu.ft.",
        qty: 1,
        priceTHB: 32500,
        serialNumber: "SN-RF-440912",
        includesProInstall: true,
      },
      {
        sku: "VC-SRV-MNT",
        name: "Certified Wall Mounting & Vacuum Line Purge",
        qty: 1,
        priceTHB: 1200,
        includesProInstall: true,
      },
    ],
  },
  {
    id: "ord-vc-02",
    orderRef: "#VC-ORD-9145",
    purchaseDate: "13 Nov 2026",
    deliverySlot: "Today • Estimated Arrival 14:30 - 16:30",
    status: "Out for Delivery",
    totalAmountTHB: 25800,
    paymentMethod: "Visa Platinum 3DS Auth • Tax Invoice #INV-2026-9145",
    shippingAddressSummary: "142/19 Centro Chaiyaphruek, Pakkret, Nonthaburi",
    technicianTeam: "Fleet Truck #02 (Driver: Chaiwat S. • 089-442-9910)",
    items: [
      {
        sku: "VC-RV-600",
        name: "VoltCraft CleanSense LiDAR Robot Vacuum & Wash Dock",
        qty: 1,
        priceTHB: 16900,
        serialNumber: "SN-RV-883019",
        includesProInstall: false,
      },
      {
        sku: "VC-AP-520",
        name: "VoltCraft PureBreathe Pro H13 HEPA Air Purifier",
        qty: 1,
        priceTHB: 8900,
        serialNumber: "SN-AP-774102",
        includesProInstall: false,
      },
    ],
  },
];

export const INITIAL_WARRANTIES: DigitalApplianceWarranty[] = [
  {
    id: "war-1",
    applianceName: "VoltCraft AeroChill Pro 12,000 BTU Dual-Inverter AC",
    modelSku: "VC-AC-12K",
    serialNumber: "SN-AC-992184",
    category: "Climate Control",
    installedDate: "06 Nov 2026",
    expiryDate: "06 Nov 2031",
    countdownLabel: "4 Years 11 Months Remaining",
    coveragePercentRemaining: 98,
    compressorWarrantyYears: 5,
    installingTechnician: "Prasert Jongrak (Cert #HVAC-809)",
    breakerSpec: "15A Dedicated Circuit (220-240V)",
    imageUrl:
      "https://images.unsplash.com/photo-1631545806609-35d4ae490431?auto=format&fit=crop&w=800&q=85",
    lastServiceStatus: "Factory Vacuum & Pressure Test Passed (19dB Spec)",
  },
  {
    id: "war-2",
    applianceName: "VoltCraft ArcticLinear 4-Door Refrigerator 19.8 cu.ft.",
    modelSku: "VC-RF-19D",
    serialNumber: "SN-RF-440912",
    category: "Refrigeration",
    installedDate: "06 Nov 2026",
    expiryDate: "06 Nov 2031",
    countdownLabel: "4 Years 11 Months Remaining",
    coveragePercentRemaining: 98,
    compressorWarrantyYears: 5,
    installingTechnician: "Prasert Jongrak (Cert #HVAC-809)",
    breakerSpec: "15A Grounded Outlet (Surge Protected)",
    imageUrl:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=85",
    lastServiceStatus: "Linear Inverter Core & Bio-Zone Calibration Verified",
  },
];
