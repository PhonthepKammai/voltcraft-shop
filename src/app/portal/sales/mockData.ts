import type { ApplianceCategory, CatalogAppliance, SalesOrder } from "./types";

export const INITIAL_ORDERS: SalesOrder[] = [
  {
    id: "ord-1",
    orderRef: "#VC-9102",
    timestamp: "12 mins ago • Today, 14:22",
    customerName: "Thanaporn S.",
    customerPhone: "089-123-4567",
    deliveryAddress: "The Line Vibe Sukhumvit, Bldg A, 8th Fl, Chatuchak, Bangkok",
    deliveryNotes: [
      "Elevator Available: Yes (8th floor Freight)",
      "Installation Required",
      "Haul-away Old Unit",
    ],
    items: [
      {
        id: "li-101",
        sku: "VC-AC-12K",
        name: "AeroChill Pro 12,000 BTU Dual-Inverter AC",
        quantity: 1,
        unitPriceTHB: 18900,
        thumbnail:
          "https://images.unsplash.com/photo-1631545806609-35d4ae490431?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "li-102",
        sku: "VC-SRV-MNT",
        name: "Wall Mounting & Copper Line Commissioning Service",
        quantity: 1,
        unitPriceTHB: 1200,
        thumbnail:
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
        isServiceAddOn: true,
      },
    ],
    totalAmountTHB: 20100,
    paymentMethod: "PromptPay QR Slip",
    paymentReference: "KBank-PP-2026994812",
    slipBankName: "KASIKORNBANK (K-PLUS)",
    slipTransferredTime: "Today, 14:19:45",
    slipImageUrl:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=700&q=80",
    status: "Pending Verification",
  },
  {
    id: "ord-2",
    orderRef: "#VC-9103",
    timestamp: "28 mins ago • Today, 14:06",
    customerName: "Nattawut K.",
    customerPhone: "081-987-6543",
    deliveryAddress: "98/42 Centro Chaiyaphruek, Detached House, Pakkret, Nonthaburi",
    deliveryNotes: [
      "Ground Floor Kitchen Access",
      "Doorframe Clearance Verified (90cm)",
      "Voltage Stabilizer Check Requested",
    ],
    items: [
      {
        id: "li-201",
        sku: "VC-RF-19D",
        name: "ArcticLinear 4-Door Refrigerator 19.8 cu.ft.",
        quantity: 1,
        unitPriceTHB: 32500,
        thumbnail:
          "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=600&q=80",
      },
    ],
    totalAmountTHB: 32500,
    paymentMethod: "Bank Wire Transfer Slip",
    paymentReference: "SCB-EASY-8837104",
    slipBankName: "SCB Siam Commercial Bank",
    slipTransferredTime: "Today, 14:04:11",
    slipImageUrl:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=700&q=80",
    status: "Pending Verification",
  },
  {
    id: "ord-3",
    orderRef: "#VC-9104",
    timestamp: "45 mins ago • Today, 13:49",
    customerName: "Pimchanok V.",
    customerPhone: "086-441-8890",
    deliveryAddress: "Noble Around Ari, 22nd Fl, Phaya Thai, Bangkok",
    deliveryNotes: [
      "Elevator Available: Yes (22nd floor)",
      "Deliver After 16:00 Only",
    ],
    items: [
      {
        id: "li-301",
        sku: "VC-AP-520",
        name: "PureBreathe Pro H13 HEPA Air Purifier",
        quantity: 2,
        unitPriceTHB: 8900,
        thumbnail:
          "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80",
      },
    ],
    totalAmountTHB: 17800,
    paymentMethod: "Instant Card Auth",
    paymentReference: "AUTH-VISA-4491",
    slipBankName: "2C2P Visa Platinum 3DS Verified",
    slipTransferredTime: "Today, 13:48:52",
    slipImageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=700&q=80",
    status: "Pending Verification",
  },
  {
    id: "ord-4",
    orderRef: "#VC-9098",
    timestamp: "1 hr ago • Today, 13:10",
    customerName: "David Miller",
    customerPhone: "092-555-0192",
    deliveryAddress: "Nichada Thani Premier, Soi Samakee 29, Pakkret, Nonthaburi",
    deliveryNotes: [
      "English-Speaking Technician Preferred",
      "Gate Pass Pre-Registered",
    ],
    items: [
      {
        id: "li-401",
        sku: "VC-RV-600",
        name: "CleanSense LiDAR Robot Vacuum & Wash Dock",
        quantity: 1,
        unitPriceTHB: 16900,
        thumbnail:
          "https://images.unsplash.com/photo-1589894404892-7310b92ea7a2?auto=format&fit=crop&w=600&q=80",
      },
    ],
    totalAmountTHB: 16900,
    paymentMethod: "Instant Card Auth",
    paymentReference: "AUTH-MC-9012",
    slipBankName: "Mastercard World Elite 3DS",
    slipTransferredTime: "Today, 13:09:10",
    slipImageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=700&q=80",
    status: "Approved",
    warehouseQueueTag: "Ready to Pick • Bay #W-03",
    verifiedBy: "Sales Rep #04 (13:18)",
  },
  {
    id: "ord-5",
    orderRef: "#VC-9095",
    timestamp: "2 hrs ago • Today, 12:15",
    customerName: "Siriporn M.",
    customerPhone: "084-332-1100",
    deliveryAddress: "412 Srinakarin Rd, Mueang, Samut Prakan",
    deliveryNotes: [
      "Countertop Cutout Required",
      "20A Dedicated Breaker Check",
    ],
    items: [
      {
        id: "li-501",
        sku: "VC-IC-32D",
        name: "DualZone Induction Cooktop 3200W",
        quantity: 1,
        unitPriceTHB: 6990,
        thumbnail:
          "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80",
      },
    ],
    totalAmountTHB: 6990,
    paymentMethod: "Bank Wire Transfer Slip",
    paymentReference: "BBL-SLIP-77120",
    slipBankName: "Bangkok Bank (Bualuang mBanking)",
    slipTransferredTime: "Today, 12:12:04",
    slipImageUrl:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=700&q=80",
    status: "Payment Issue",
    salesIssueNote:
      "Slip image cropped at bottom — missing ฿990 partial balance & bank reference ID. Called customer to re-upload.",
  },
];

export const INITIAL_CATALOG: CatalogAppliance[] = [
  {
    id: "cat-1",
    sku: "VC-AC-12K",
    name: "VoltCraft AeroChill Pro 12,000 BTU Dual-Inverter AC",
    category: "ACs",
    description:
      "Gen-3 Twin-Rotary Dual Inverter compressor with rapid 45-second turbo cooling, 19dB whisper acoustic profile, and built-in Wi-Fi energy telemetry.",
    priceTHB: 18900,
    originalPriceTHB: 21900,
    wattage: 950,
    inverter: true,
    energyRating: "No. 5 ★★★",
    dimensionsCm: "83.7 x 30.8 x 18.9 cm",
    warehouseStock: 18,
    published: true,
    imageUrl:
      "https://images.unsplash.com/photo-1631545806609-35d4ae490431?auto=format&fit=crop&w=800&q=85",
    updatedAt: "10 mins ago",
  },
  {
    id: "cat-2",
    sku: "VC-RF-19D",
    name: "VoltCraft ArcticLinear 4-Door Refrigerator 19.8 cu.ft.",
    category: "Refrigeration",
    description:
      "Multi-airflow linear inverter refrigeration with zero-clearance matte slate doors, convertible soft-freeze bio zone, and UV-C hygiene filter.",
    priceTHB: 32500,
    originalPriceTHB: 36900,
    wattage: 220,
    inverter: true,
    energyRating: "No. 5 ★★★",
    dimensionsCm: "83.5 x 178.5 x 73.0 cm",
    warehouseStock: 6,
    published: true,
    imageUrl:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=85",
    updatedAt: "1 hr ago",
  },
  {
    id: "cat-3",
    sku: "VC-RV-600",
    name: "VoltCraft CleanSense LiDAR Robot Vacuum & Wash Dock",
    category: "Cleaning",
    description:
      "6,000Pa suction power with DToF 3D LiDAR mapping, dual pressurized rotary mops, and 60°C hot-water auto-washing thermal base station.",
    priceTHB: 16900,
    originalPriceTHB: 19900,
    wattage: 65,
    inverter: false,
    energyRating: "No. 5 ★★",
    dimensionsCm: "35.0 x 9.7 x 35.0 cm",
    warehouseStock: 22,
    published: true,
    imageUrl:
      "https://images.unsplash.com/photo-1589894404892-7310b92ea7a2?auto=format&fit=crop&w=800&q=85",
    updatedAt: "2 hrs ago",
  },
  {
    id: "cat-4",
    sku: "VC-AF-72L",
    name: "VoltCraft VortexFryer Touch XXL 7.2L",
    category: "Kitchen",
    description:
      "360° high-velocity thermo-cyclonic air fryer with double-glazed viewing window, 12 digital PID presets, and ceramic non-stick basket.",
    priceTHB: 4290,
    originalPriceTHB: 5290,
    wattage: 2000,
    inverter: false,
    energyRating: "No. 5 ★",
    dimensionsCm: "32.5 x 31.0 x 39.2 cm",
    warehouseStock: 3,
    published: true,
    imageUrl:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=85",
    updatedAt: "Yesterday",
  },
  {
    id: "cat-5",
    sku: "VC-AP-520",
    name: "VoltCraft PureBreathe Pro H13 HEPA Air Purifier",
    category: "Air Purifiers",
    description:
      "Medical-grade H13 True HEPA 360° drum filter with CADR 520 m³/h coverage, dual PM2.5/VOC laser sensors, and brushless inverter fan.",
    priceTHB: 8900,
    originalPriceTHB: 10500,
    wattage: 48,
    inverter: true,
    energyRating: "No. 5 ★★★",
    dimensionsCm: "29.0 x 58.5 x 29.0 cm",
    warehouseStock: 15,
    published: true,
    imageUrl:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=85",
    updatedAt: "Yesterday",
  },
  {
    id: "cat-6",
    sku: "VC-IC-32D",
    name: "VoltCraft DualZone Induction Cooktop 3200W",
    category: "Kitchen",
    description:
      "Continuous low-wattage inverter induction coils with genuine German Schott Ceran® ceramic glass and dual independent boost zones.",
    priceTHB: 6990,
    originalPriceTHB: 8490,
    wattage: 3200,
    inverter: true,
    energyRating: "No. 5 ★★",
    dimensionsCm: "73.0 x 6.2 x 43.0 cm",
    warehouseStock: 0,
    published: true,
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=85",
    updatedAt: "3 days ago",
  },
];

export const CATEGORIES: ApplianceCategory[] = [
  "All",
  "ACs",
  "Refrigeration",
  "Cleaning",
  "Kitchen",
  "Air Purifiers",
];
