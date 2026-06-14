import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Building,
  FileText,
  BarChart3,
  QrCode,
  LogOut,
  Settings,
  Shield,
  Activity,
  Check,
  User,
  Users,
  AlertOctagon,
  Printer,
  ArrowLeft,
  X,
  MapPin,
  Calendar,
  Phone,
  AlertTriangle,
  Flame,
  MousePointer,
  HelpCircle,
  Hash,
  Download,
  CheckSquare,
  Wrench,
  Clock3,
  ListFilter,
  Monitor,
  CheckSquare2,
  FileSpreadsheet,
  ChevronRight,
  MessageSquare,
  Mail,
  Smartphone,
  Network,
  Share2,
  Building2
} from "lucide-react";

// Types
export interface BrandContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface BrandServiceCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface BrandProfile {
  id: string;
  brandName: string;
  tollFree: string;
  marking: string;
  autoSendIssuesAfterHours: number;
  centers: BrandServiceCenter[];
  contacts: BrandContact[];
}

export interface CustomerAsset {
  id: string;
  productName: string;
  brand: string;
  model: string;
  serialNo: string;
  purchaseDate: string;
  warrantyFull: string;
  warrantyParts: string; // e.g., "5 year board, 10 year compressor"
  freeServicesTotal: number;
  freeServicesUsed: number;
  freeServicePeriod: string;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  phone: string;
  altPhone?: string;
  email?: string;
  address?: string;
  assets: CustomerAsset[];
  ticketHistory: string[];
}

export interface Ticket {
  id: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  productName: string;
  brand: string;
  model: string;
  type: "Site" | "Store";
  status: "New" | "Registration Pending" | "Brand Registered" | "In Progress" | "Waiting on Part" | "Ready for Pickup" | "Closed";
  warrantyStatus?: "In Warranty" | "Out of Warranty" | "Unknown";
  crmAutoCreated?: boolean;
  followUpDate: string;
  followUpStatus: string;
  serialNo?: string;
  problemDescription: string;
  assignedAgent: string;
  physicalLocation?: string;
  expectedPartArrival?: string;
  componentsRequested?: string;
  vendorName?: string;
  isRepeat?: boolean;
  resolutionDetails?: string;
  chargeCollected?: number;
  materialCode?: string;
  purchaseDate?: string;
  invoiceStatus?: "Found" | "Missing" | "Overridden";
  followUpTime?: string;
  notificationSent?: "WhatsApp" | "Email" | "Both" | "None";
}

const BrandLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="logoMask">
        <rect width="100" height="100" fill="white" />
        <rect x="0" y="32" width="100" height="11" fill="black" />
        <rect x="0" y="64" width="100" height="11" fill="black" />
      </mask>
    </defs>
    <g mask="url(#logoMask)" fill="currentColor">
      <circle cx="55" cy="53" r="43" />
      <rect x="5" y="43" width="55" height="21" rx="10" />
    </g>
  </svg>
);

export default function App() {
  // CRM State
  const [customerProfiles, setCustomerProfiles] = useState<CustomerProfile[]>([
    {
      id: "CUST-1001",
      fullName: "Aditya Sharma",
      phone: "+91 98765 43210",
      altPhone: "",
      email: "aditya@example.com",
      address: "Sector 4, HSR Layout, Bangalore",
      assets: [
        {
          id: "AST-1001",
          productName: "Mixer Grinder",
          brand: "Prestige",
          model: "Delight Plus",
          serialNo: "PR-MIX-9912",
          purchaseDate: "2025-01-10",
          warrantyFull: "1 Year",
          warrantyParts: "5 year motor warranty",
          freeServicesTotal: 2,
          freeServicesUsed: 1,
          freeServicePeriod: "First Year"
        }
      ],
      ticketHistory: ["SRV-1042"]
    }
  ]);

  // Live State
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "SRV-1042",
      customerName: "Aditya Sharma",
      phone: "+91 98765 43210",
      productName: "Mixer Grinder",
      brand: "Prestige",
      model: "Delight Plus",
      type: "Site",
      status: "Brand Registered",
      followUpDate: "Today",
      followUpStatus: "Wait: Approval",
      serialNo: "PR-MIX-9912",
      problemDescription: "Burning smell from motor when running under heavy load.",
      assignedAgent: "Suresh Kumar",
      physicalLocation: "Rack B-3",
      purchaseDate: "2025-01-10",
      invoiceStatus: "Found"
    },
    {
      id: "SRV-1043",
      customerName: "Meena Kumari",
      phone: "+91 91234 56789",
      productName: "LED Smart TV",
      brand: "Sony",
      model: "Bravia 43\"",
      type: "Store",
      status: "Ready for Pickup",
      followUpDate: "Completed",
      followUpStatus: "Wait: Cust",
      serialNo: "SN-TV-8841-B",
      problemDescription: "Display panel flickering intermittently after 2 hours use.",
      assignedAgent: "Suresh Kumar",
      physicalLocation: "Rack B-4",
      purchaseDate: "2024-11-20",
      invoiceStatus: "Found"
    },
    {
      id: "SRV-1044",
      customerName: "Ravi Teja",
      phone: "+91 94400 11223",
      productName: "Washing Machine",
      brand: "LG",
      model: "7.5kg Front Load",
      type: "Site",
      status: "In Progress",
      followUpDate: "Oct 24, 2023",
      followUpStatus: "Local Srv",
      serialNo: "LG-WM-75-XYZ",
      problemDescription: "Water in drum not draining out at cycle conclusion.",
      assignedAgent: "Deepak Rao",
      physicalLocation: "Bay A-1",
      purchaseDate: "2024-05-15",
      invoiceStatus: "Missing"
    },
    {
      id: "SRV-1045",
      customerName: "S. Murali",
      phone: "+91 94440 22334",
      productName: "Ceiling Fan",
      brand: "Crompton",
      model: "High Breeze",
      type: "Store",
      status: "Waiting on Part",
      followUpDate: "URGENT",
      followUpStatus: "Escalated",
      serialNo: "CR-FAN-HB-89",
      problemDescription: "Vibrations and high pitch humming sound at speed 4 (Repeat Complaint).",
      assignedAgent: "Suresh Kumar",
      physicalLocation: "Rack C-1",
      isRepeat: true,
      purchaseDate: "2025-03-01",
      invoiceStatus: "Found"
    },
    {
      id: "SRV-1011",
      customerName: "Venkatesh Prasad",
      phone: "+91 90001 22334",
      productName: "Hair Dryer",
      brand: "Philips",
      model: "HP8120",
      type: "Store",
      status: "In Progress",
      followUpDate: "Overdue",
      followUpStatus: "4h Breach",
      serialNo: "PH-HD-443",
      problemDescription: "No hot air, only blower fan is working.",
      assignedAgent: "Suresh Kumar",
      physicalLocation: "Rack A-2",
      purchaseDate: "2024-12-14",
      invoiceStatus: "Found"
    },
    {
      id: "SRV-1025",
      customerName: "Ananya Iyer",
      phone: "+91 91122 33445",
      productName: "Coffee Maker",
      brand: "Morphy Richards",
      model: "Europa 800W",
      type: "Site",
      status: "Brand Registered",
      followUpDate: "In 52m",
      followUpStatus: "SLA Warning",
      serialNo: "MR-CM-EU-11",
      problemDescription: "Water leakage from underside water container gasket.",
      assignedAgent: "Deepak Rao",
      physicalLocation: "Rack A-3",
      purchaseDate: "2025-02-12",
      invoiceStatus: "Found"
    },
    {
      id: "SRV-0988",
      customerName: "Rajesh Kanna",
      phone: "+91 92233 44556",
      productName: "Induction Cooker",
      brand: "Bajaj",
      model: "Majesty ICX",
      type: "Store",
      status: "Registration Pending",
      followUpDate: "Pending",
      followUpStatus: "Awaiting Mgr",
      serialNo: "BJ-IC-MJ-200",
      problemDescription: "E2 error code displayed immediately on power connection.",
      assignedAgent: "Deepak Rao",
      physicalLocation: "Rack B-2",
      purchaseDate: "2025-04-18",
      invoiceStatus: "Missing"
    }
  ]);

  // View States
  // Matches 13 primary views/consoles
  const [currentScreen, setCurrentScreen] = useState<
    | "login"
    | "agent_work"
    | "dashboard"
    | "ready_pickup"
    | "work_center"
    | "ticket_detail"
    | "reports"
    | "custody_detail"
    | "qr_form"
    | "manager_dashboard"
    | "new_ticket"
    | "viewer_console"
    | "create_receipt"
    | "app_settings"
    | "brand_directory"
    | "crm_database"
  >("dashboard");

  // Viewer Console Auto-Scroll Ref
  const viewerScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentScreen !== "viewer_console") return;

    let animationFrameId: number;
    let scrollPos = 0;
    let scrollDirection = 1;
    let isPaused = false;
    let pauseTimeout: ReturnType<typeof setTimeout>;

    const scrollTask = () => {
      if (!isPaused && viewerScrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = viewerScrollRef.current;
        
        // Only scroll if content is scrollable
        if (scrollHeight > clientHeight) {
          scrollPos += 0.3 * scrollDirection;
          viewerScrollRef.current.scrollTop = scrollPos;

          // Reached bottom
          if (scrollPos >= scrollHeight - clientHeight - 1) {
            scrollDirection = -1;
            scrollPos = scrollHeight - clientHeight - 1;
            
            isPaused = true;
            clearTimeout(pauseTimeout);
            pauseTimeout = setTimeout(() => {
              isPaused = false;
            }, 3000); // 3 seconds pause at bottom
          } 
          // Reached top
          else if (scrollPos <= 0) {
            scrollDirection = 1;
            scrollPos = 0;

            isPaused = true;
            clearTimeout(pauseTimeout);
            pauseTimeout = setTimeout(() => {
              isPaused = false;
            }, 3000); // 3 seconds pause at top
          }
        }
      }
      animationFrameId = requestAnimationFrame(scrollTask);
    };

    // Initial pause before scrolling starts
    isPaused = true;
    pauseTimeout = setTimeout(() => {
      isPaused = false;
      animationFrameId = requestAnimationFrame(scrollTask);
    }, 2000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(pauseTimeout);
    };
  }, [currentScreen]);

  const [brands, setBrands] = useState<BrandProfile[]>([
    {
      id: "BRD-1",
      brandName: "Prestige",
      tollFree: "1800-425-5000",
      marking: "Premium Focus",
      autoSendIssuesAfterHours: 24,
      centers: [{ id: "SC-1", name: "Prestige Hub", address: "City Center", phone: "9876543210" }],
      contacts: [{ id: "C-1", name: "Arun", role: "Service Manager", phone: "9876543210", email: "arun@prestige.invalid" }]
    },
    {
      id: "BRD-2",
      brandName: "Sony",
      tollFree: "1800-103-7799",
      marking: "Standard",
      autoSendIssuesAfterHours: 48,
      centers: [],
      contacts: []
    }
  ]);

  // App Settings State
  const [appSettings, setAppSettings] = useState({
    whatsappEnabled: true,
    whatsappApiEndpoint: "https://api.whatsapp.cloud/v1/send",
    emailRegistration: true,
    emailSmtp: "smtp.emart.invalid",
    frappeEnabled: false,
    frappeUrl: "https://frappe.invalid",
    frappeApiKey: "",
    frappeApiSecret: "",
    workflowAutoEscalate: true,
    workflowEscalateHours: 48,
    brandNumbers: [
      { brand: "Prestige", number: "1800-425-5000" },
      { brand: "Sony", number: "1800-103-7799" },
      { brand: "LG", number: "1800-315-9999" },
      { brand: "Crompton", number: "1800-419-0505" },
      { brand: "Philips", number: "1800-102-2929" },
      { brand: "Morphy Richards", number: "1800-103-5963" },
      { brand: "Bajaj", number: "1800-102-5963" },
    ]
  });

  // Modals States
  const [activeModal, setActiveModal] = useState<
    | null
    | "register_complaint"
    | "need_invoice"
    | "service_follow_up"
    | "close_ticket"
    | "waiting_on_part"
  >(null);

  // Active / Selected states
  const [selectedTicketId, setSelectedTicketId] = useState<string>("SRV-1042");
  const [searchQuery, setSearchQuery] = useState("");
  const [queueFilter, setQueueFilter] = useState<string>("all");
  const [currentUser, setCurrentUser] = useState({
    name: "Suresh Kumar",
    role: "Service Coordinator",
    seed: "Suresh"
  });

  // Intake Form State (for "Front Desk: New Ticket")
  const [newTicketForm, setNewTicketForm] = useState({
    customerName: "",
    phone: "",
    altPhone: "",
    productName: "",
    brand: "Prestige",
    model: "",
    type: "Store" as "Site" | "Store",
    warrantyStatus: "Unknown" as "In Warranty" | "Out of Warranty" | "Unknown",
    serialNo: "",
    problemDescription: "",
    assignedAgent: "Suresh Kumar",
    purchaseDate: "",
    physicalLocation: "Rack A-1"
  });

  // Modal Inputs state helpers
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [followUpStatusValue, setFollowUpStatusValue] = useState("Wait: Approval");
  const [nextFollowUpDateValue, setNextFollowUpDateValue] = useState("");
  const [nextFollowUpTimeValue, setNextFollowUpTimeValue] = useState("");
  const [notifyCustomerMethod, setNotifyCustomerMethod] = useState("None");
  const [brandTicketIdInput, setBrandTicketIdInput] = useState("");
  const [partsRequestedInput, setPartsRequestedInput] = useState("");
  const [expectedPartArrivalInput, setExpectedPartArrivalInput] = useState("");
  const [vendorNameInput, setVendorNameInput] = useState("");
  const [resolutionDetailsInput, setResolutionDetailsInput] = useState("");
  const [chargeCollectedInput, setChargeCollectedInput] = useState(0);
  const [materialCodeInput, setMaterialCodeInput] = useState("");

  // Target Ticket Helper
  const selectedTicket = useMemo(() => {
    return tickets.find(t => t.id === selectedTicketId) || tickets[0];
  }, [tickets, selectedTicketId]);

  // Statistics calculation
  const stats = useMemo(() => {
    const open = tickets.filter(t => t.status !== "Closed").length;
    const readyPic = tickets.filter(t => t.status === "Ready for Pickup").length;
    const partsPending = tickets.filter(t => t.status === "Waiting on Part").length;
    const closed = tickets.filter(t => t.status === "Closed").length;
    const pendingFollowUps = tickets.filter(t => t.followUpStatus !== "Completed").length;
    return { open, readyPic, partsPending, closed, pendingFollowUps };
  }, [tickets]);

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      // Queue sidebar filters
      if (queueFilter === "ready_pickup" && t.status !== "Ready for Pickup") return false;
      if (queueFilter === "reg_pending" && t.status !== "Registration Pending") return false;
      if (queueFilter === "brand_reg" && t.status !== "Brand Registered") return false;
      if (queueFilter === "waiting_cust" && t.followUpStatus === "Wait: Cust") return true; 
      if (queueFilter === "waiting_parts" && t.status !== "Waiting on Part") return false;
      if (queueFilter === "new" && t.status !== "New" && t.status !== "Registration Pending") return false;
      if (queueFilter === "repeat" && !t.isRepeat) return false;

      // Search match
      const query = searchQuery.toLowerCase();
      if (!query) return true;
      return (
        t.id.toLowerCase().includes(query) ||
        t.customerName.toLowerCase().includes(query) ||
        t.phone.includes(query) ||
        t.productName.toLowerCase().includes(query) ||
        t.brand.toLowerCase().includes(query)
      );
    });
  }, [tickets, queueFilter, searchQuery]);

  // Helpers to simulate operations
  const handleAddNewTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketForm.customerName || !newTicketForm.phone) {
      alert("Please fill in main details (Name & Phone).");
      return;
    }
    const nextId = `SRV-${1000 + tickets.length + 1}`;
    const autoCreatedCRM = appSettings.frappeEnabled ? true : false;
    const entry: Ticket = {
      id: nextId,
      customerName: newTicketForm.customerName,
      phone: newTicketForm.phone,
      altPhone: newTicketForm.altPhone,
      productName: newTicketForm.productName,
      brand: newTicketForm.brand,
      model: newTicketForm.model,
      type: newTicketForm.type,
      warrantyStatus: newTicketForm.warrantyStatus,
      crmAutoCreated: autoCreatedCRM,
      status: "New",
      followUpDate: "Today",
      followUpStatus: "New Intake",
      serialNo: newTicketForm.serialNo,
      problemDescription: newTicketForm.problemDescription,
      assignedAgent: newTicketForm.assignedAgent,
      physicalLocation: newTicketForm.physicalLocation || "Rack A-1",
      purchaseDate: newTicketForm.purchaseDate,
      invoiceStatus: "Found"
    };

    // Auto-create / Update CRM
    const existingCustomerIdx = customerProfiles.findIndex(c => c.phone === newTicketForm.phone);
    
    const newAsset: CustomerAsset = {
      id: `AST-${1000 + Math.random().toString().substr(2, 4)}`,
      productName: newTicketForm.productName,
      brand: newTicketForm.brand,
      model: newTicketForm.model,
      serialNo: newTicketForm.serialNo,
      purchaseDate: newTicketForm.purchaseDate || "",
      warrantyFull: newTicketForm.warrantyStatus === "In Warranty" ? "1 Year (Assumed)" : "None",
      warrantyParts: "",
      freeServicesTotal: 0,
      freeServicesUsed: 0,
      freeServicePeriod: ""
    };

    if (existingCustomerIdx >= 0) {
      const updatedProfiles = [...customerProfiles];
      // Check if asset already exists using serial or matching product/model (simplified wrapper)
      const existingAsset = updatedProfiles[existingCustomerIdx].assets.find(a => 
        (a.serialNo && a.serialNo === newAsset.serialNo) || 
        (a.brand === newAsset.brand && a.model === newAsset.model && !a.serialNo)
      );

      if (!existingAsset) {
        updatedProfiles[existingCustomerIdx].assets.push(newAsset);
      }
      updatedProfiles[existingCustomerIdx].ticketHistory.push(nextId);
      setCustomerProfiles(updatedProfiles);
      // Mark entry as CRM mapped if we update
      entry.crmAutoCreated = true;
    } else {
      const newCustomer: CustomerProfile = {
        id: `CUST-${1000 + customerProfiles.length + 1}`,
        fullName: newTicketForm.customerName,
        phone: newTicketForm.phone,
        altPhone: newTicketForm.altPhone,
        assets: [newAsset],
        ticketHistory: [nextId]
      };
      setCustomerProfiles([newCustomer, ...customerProfiles]);
      entry.crmAutoCreated = true;
    }

    setTickets([entry, ...tickets]);
    // Clear Form
    setNewTicketForm({
      customerName: "",
      phone: "",
      altPhone: "",
      productName: "",
      brand: "Prestige",
      model: "",
      type: "Store",
      warrantyStatus: "Unknown",
      serialNo: "",
      problemDescription: "",
      assignedAgent: "Suresh Kumar",
      purchaseDate: "",
      physicalLocation: "Rack A-1"
    });
    // Jump to dashboard
    setCurrentScreen("dashboard");
    alert(`Success: Ticket ${nextId} created for ${entry.customerName}!`);
  };

  const handleUpdateFollowUp = () => {
    setTickets(prev =>
      prev.map(t =>
        t.id === selectedTicketId
          ? {
              ...t,
              followUpStatus: followUpStatusValue,
              followUpDate: nextFollowUpDateValue || t.followUpDate,
              followUpTime: nextFollowUpTimeValue || t.followUpTime,
              notificationSent: notifyCustomerMethod as "WhatsApp" | "Email" | "Both" | "None",
              problemDescription: `${t.problemDescription}\n[Update]: ${followUpNotes}`
            }
          : t
      )
    );
    setActiveModal(null);
    setFollowUpNotes("");
    setNextFollowUpDateValue("");
    setNextFollowUpTimeValue("");
    setNotifyCustomerMethod("None");
    
    if (notifyCustomerMethod !== "None") {
      alert(`Follow-up logs updated successfully. Automated ${notifyCustomerMethod} update queued for dispatch.`);
    } else {
      alert("Follow-up logs updated successfully.");
    }
  };

  const handleRegisterComplaint = () => {
    setTickets(prev =>
      prev.map(t =>
        t.id === selectedTicketId
          ? {
              ...t,
              status: "Brand Registered",
              componentsRequested: partsRequestedInput || "Main Motor Gasket",
              serialNo: brandTicketIdInput || t.serialNo
            }
          : t
      )
    );
    setActiveModal(null);
    setBrandTicketIdInput("");
    setPartsRequestedInput("");
    alert(`Brand registered on service partner desk! Status altered to 'Brand Registered'.`);
  };

  const handleSetWaitingOnPart = () => {
    setTickets(prev =>
      prev.map(t =>
        t.id === selectedTicketId
          ? {
              ...t,
              status: "Waiting on Part",
              expectedPartArrival: expectedPartArrivalInput || "2026-06-25",
              vendorName: vendorNameInput || "National Spares Corp"
            }
          : t
      )
    );
    setActiveModal(null);
    setExpectedPartArrivalInput("");
    setVendorNameInput("");
    alert(`Parts ordered. Ticket set to 'Waiting on Part'.`);
  };

  const handleCloseTicket = () => {
    setTickets(prev =>
      prev.map(t =>
        t.id === selectedTicketId
          ? {
              ...t,
              status: "Closed",
              resolutionDetails: resolutionDetailsInput || "Replaced brush gear and test-ran successfully.",
              chargeCollected: chargeCollectedInput || 450,
              materialCode: materialCodeInput || "MC-99120-PR"
            }
          : t
      )
    );
    setActiveModal(null);
    setResolutionDetailsInput("");
    setChargeCollectedInput(0);
    setMaterialCodeInput("");
    alert(`Ticket ${selectedTicketId} has been resolved and successfully closed! Collection printed.`);
  };

  const handleOverrideInvoice = (ticketId: string) => {
    setTickets(prev => prev.map(t => (t.id === ticketId ? { ...t, invoiceStatus: "Overridden" as const } : t)));
    setActiveModal(null);
    alert("Invoice verification requirement bypassed for this workflow.");
  };

  return (
    <div id="emart-root-layout" className="flex flex-col h-screen w-full bg-[#f8f9ff] text-slate-900 font-sans overflow-hidden">
      
      {/* Top Header Navigation */}
      <header id="main-header" className="h-14 bg-[#2563eb] text-white flex items-center justify-between px-4 shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 font-bold tracking-tight cursor-pointer" onClick={() => setCurrentScreen("dashboard")}>
            <BrandLogo className="w-8 h-8 text-white" />
            <div className="flex flex-col leading-none">
              <span className="text-[12px] font-semibold text-blue-100 tracking-tight">Lavanya</span>
              <span className="text-[18px] font-black text-white tracking-tighter" style={{ marginTop: '-2px' }}>mart</span>
            </div>
            <span className="ml-2 text-blue-100 font-normal text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-blue-700 rounded shadow-inner">Helpdesk ERP v2.4</span>
          </div>

          <nav className="hidden md:flex gap-1.5 h-full items-center">
            {currentUser.role !== "Viewer" && (
              <button
                onClick={() => { setCurrentScreen("dashboard"); setQueueFilter("all"); }}
                className={`px-3 py-1.5 text-xs font-semibold flex items-center rounded-md transition-all ${
                  currentScreen === "dashboard" ? "bg-white text-blue-700 shadow-sm" : "text-blue-100 hover:bg-blue-500/50 hover:text-white"
                }`}
              >
                <Activity className="w-3.5 h-3.5 mr-1.5" />
                Today's Work
              </button>
            )}
            {["Service Manager", "Service Coordinator", "Front Desk"].includes(currentUser.role) && (
              <button
                onClick={() => setCurrentScreen("new_ticket")}
                className={`px-3 py-1.5 text-xs font-semibold flex items-center rounded-md transition-all ${
                  currentScreen === "new_ticket" ? "bg-white text-blue-700 shadow-sm" : "text-blue-100 hover:bg-blue-500/50 hover:text-white"
                }`}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                New Ticket
              </button>
            )}
            {["Service Manager"].includes(currentUser.role) && (
              <button
                onClick={() => setCurrentScreen("reports")}
                className={`px-3 py-1.5 text-xs font-semibold flex items-center rounded-md transition-all ${
                  currentScreen === "reports" ? "bg-white text-blue-700 shadow-sm" : "text-blue-100 hover:bg-blue-500/50 hover:text-white"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                Reports Center
              </button>
            )}
            <button
              onClick={() => setCurrentScreen("agent_work")}
              className={`px-3 py-1.5 text-xs font-semibold flex items-center rounded-md transition-all ${
                currentScreen === "agent_work" ? "bg-white text-blue-700 shadow-sm" : "text-blue-100 hover:bg-blue-500/50 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5 mr-1.5" />
              My Work Queue
            </button>
            {["Service Manager", "Service Coordinator"].includes(currentUser.role) && (
              <button
                onClick={() => setCurrentScreen("custody_detail")}
                className={`px-3 py-1.5 text-xs font-semibold flex items-center rounded-md transition-all ${
                  currentScreen === "custody_detail" ? "bg-white text-blue-700 shadow-sm" : "text-blue-100 hover:bg-blue-500/50 hover:text-white"
                }`}
              >
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                Custody Tracking
              </button>
            )}
          </nav>
        </div>

        {/* User profile dropdown and Simulator Selector */}
        <div className="flex items-center gap-4">
          {/* Quick simulator screen jumper box */}
          <div className="bg-blue-800 text-blue-100 flex items-center px-3 py-1.5 rounded-md shadow-inner text-[10px] gap-2 font-mono">
            <span className="text-blue-200 uppercase font-bold tracking-widest hidden lg:inline">Simulator Role:</span>
            <select
              value={currentScreen}
              onChange={(e) => setCurrentScreen(e.target.value as any)}
              className="bg-blue-700 text-white border-none py-0.5 px-1 rounded outline-none text-[11px] font-sans font-medium appearance-none cursor-pointer"
            >
              <option value="login">1. Login Page</option>
              <option value="dashboard">2. Today's Work Dashboard</option>
              <option value="ready_pickup">3. Ready for Pickup View</option>
              <option value="new_ticket">4. Front Desk: New Ticket</option>
              <option value="agent_work">5. Helpdesk Agent: My Work</option>
              <option value="ticket_detail">6. Ticket Detail View</option>
              <option value="work_center">7. Front Desk: Work Center</option>
              <option value="reports">8. Reports Center</option>
              <option value="custody_detail">9. Product Custody Detail</option>
              <option value="qr_form">10. Customer QR Form</option>
              <option value="manager_dashboard">11. Manager Dashboard</option>
              <option value="viewer_console">12. Viewer Console</option>
              <option value="create_receipt">13. Front Desk: Create Receipt</option>
              <option value="app_settings">14. System: App Settings</option>
              <option value="brand_directory">15. Brand Directory</option>
              <option value="crm_database">16. CRM Customer Database</option>
            </select>
          </div>

          <div className="flex items-center gap-3 border-l border-blue-500 pl-4">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-semibold text-white leading-none mb-0.5">{currentUser.name}</span>
              <span className="text-[9px] text-blue-200 font-bold uppercase tracking-wider">{currentUser.role}</span>
            </div>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.seed}`}
              alt="User profile seed"
              className="w-9 h-9 rounded-full bg-blue-100 border-2 border-blue-400 cursor-pointer hover:border-white shadow-sm"
              onClick={() => {
                if (currentUser.name === "Suresh Kumar") {
                  setCurrentUser({ name: "Ramesh Nair", role: "Service Manager", seed: "Ramesh" });
                } else {
                  setCurrentUser({ name: "Suresh Kumar", role: "Service Coordinator", seed: "Suresh" });
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div id="main-frame" className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR QUEUES - Only visible if not in client/viewer specific views (qr_form, viewer_console, login) */}
        {currentScreen !== "login" && currentScreen !== "qr_form" && currentScreen !== "viewer_console" && (
          <aside className="hidden md:flex w-[260px] bg-white border-r border-slate-200 p-4 overflow-y-auto flex-col gap-1.5 shrink-0 shadow-sm z-0">
            <div className="px-2 py-1 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Main Queues</div>
            
            <button
              onClick={() => { setQueueFilter("all"); setCurrentScreen("dashboard"); }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                queueFilter === "all" && currentScreen === "dashboard" ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-slate-100 text-slate-600 font-medium"
              }`}
            >
              <span className="flex items-center gap-2.5"><ClipboardList className={`w-4 h-4 ${queueFilter === "all" && currentScreen === "dashboard" ? "text-blue-600" : "text-slate-400"}`} /> All Queries</span>
              <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-xs text-slate-600">{tickets.length}</span>
            </button>

            <button
              onClick={() => { setQueueFilter("new"); setCurrentScreen("dashboard"); }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                queueFilter === "new" ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-slate-100 text-slate-600 font-medium"
              }`}
            >
              <span className="flex items-center gap-2.5"><Plus className={`w-4 h-4 ${queueFilter === "new" ? "text-blue-600" : "text-blue-500"}`} /> New Complaints</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-bold">{tickets.filter(t => t.status === "New" || t.status === "Registration Pending").length}</span>
            </button>

            <button
              onClick={() => { setQueueFilter("reg_pending"); setCurrentScreen("dashboard"); }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                queueFilter === "reg_pending" ? "bg-orange-50 text-orange-700 font-bold" : "hover:bg-slate-100 text-slate-600 font-medium"
              }`}
            >
              <span className="flex items-center gap-2.5"><Clock className={`w-4 h-4 ${queueFilter === "reg_pending" ? "text-orange-600" : "text-orange-500"}`} /> Pending Wait</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-bold">{tickets.filter(t => t.status === "Registration Pending").length}</span>
            </button>

            <button
              onClick={() => { setQueueFilter("brand_reg"); setCurrentScreen("dashboard"); }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                queueFilter === "brand_reg" ? "bg-purple-50 text-purple-700 font-bold" : "hover:bg-slate-100 text-slate-600 font-medium"
              }`}
            >
              <span className="flex items-center gap-2.5"><Shield className={`w-4 h-4 ${queueFilter === "brand_reg" ? "text-purple-600" : "text-purple-500"}`} /> Brand / Registration</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-bold">{tickets.filter(t => t.status === "Brand Registered").length}</span>
            </button>

            <button
              onClick={() => { setQueueFilter("waiting_parts"); setCurrentScreen("dashboard"); }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                queueFilter === "waiting_parts" ? "bg-orange-50 text-orange-700 font-bold" : "hover:bg-slate-100 text-slate-600 font-medium"
              }`}
            >
              <span className="flex items-center gap-2.5"><Wrench className={`w-4 h-4 ${queueFilter === "waiting_parts" ? "text-orange-600" : "text-slate-400"}`} /> Waiting on Part</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-bold">{tickets.filter(t => t.status === "Waiting on Part").length}</span>
            </button>

            <button
              onClick={() => { setQueueFilter("ready_pickup"); setCurrentScreen("ready_pickup"); }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                currentScreen === "ready_pickup" ? "bg-green-50 text-green-700 font-bold" : "hover:bg-slate-100 text-slate-600 font-medium"
              }`}
            >
              <span className="flex items-center gap-2.5"><CheckCircle className={`w-4 h-4 ${currentScreen === "ready_pickup" ? "text-green-600" : "text-green-500"}`} /> Ready for Pickup</span>
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">{stats.readyPic}</span>
            </button>

            <div className="px-2 py-1 mt-4 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Alerts</div>
            <button
              onClick={() => { setQueueFilter("repeat"); setCurrentScreen("dashboard"); }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                queueFilter === "repeat" ? "bg-red-50 text-red-700 font-bold" : "hover:bg-slate-100 text-slate-600 font-medium"
              }`}
            >
              <span className="flex items-center gap-2.5"><AlertTriangle className={`w-4 h-4 ${queueFilter === "repeat" ? "text-red-600" : "text-red-500"}`} /> Overdue / Urgent</span>
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">{tickets.filter(t => t.isRepeat).length}</span>
            </button>

            <div className="px-2 py-1 mt-4 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Terminal Config</div>
            {currentUser.role === "Service Manager" && (
              <button
                onClick={() => setCurrentScreen("manager_dashboard")}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentScreen === "manager_dashboard" ? "bg-slate-800 text-white font-bold" : "hover:bg-slate-100 text-slate-600 font-medium"
                }`}
              >
                <Shield className={`w-4 h-4 ${currentScreen === "manager_dashboard" ? "text-white" : "text-slate-400"}`} /> Manager Console
              </button>
            )}

            <button
              onClick={() => setCurrentScreen("qr_form")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentScreen === "qr_form" ? "bg-slate-800 text-white font-bold" : "hover:bg-slate-100 text-slate-600 font-medium"
              }`}
            >
              <QrCode className={`w-4 h-4 ${currentScreen === "qr_form" ? "text-white" : "text-slate-400"}`} /> Show Web Form
            </button>
            
            {currentUser.role === "Service Manager" && (
              <button
                onClick={() => setCurrentScreen("app_settings")}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentScreen === "app_settings" ? "bg-slate-800 text-white font-bold" : "hover:bg-slate-100 text-slate-600 font-medium"
                }`}
              >
                <Settings className={`w-4 h-4 ${currentScreen === "app_settings" ? "text-white" : "text-slate-400"}`} /> Platform Config
              </button>
            )}

            <button
              onClick={() => setCurrentScreen("login")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-red-600 hover:bg-red-50 font-bold mt-auto`}
            >
              <LogOut className="w-4 h-4 text-red-500" /> Switch Profile
            </button>
          </aside>
        )}

        {/* PRIMARY VIEW CONTENT */}
        <main className="flex-1 flex flex-col p-3 gap-3 overflow-y-auto min-w-0">

          {/* ==================== 1. LOGIN SCREEN ==================== */}
          {currentScreen === "login" && (
            <div id="screen-login" className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-sm bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
                <div className="bg-blue-700 text-white p-6 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-3">
                    <BrandLogo className="w-12 h-12 text-white" />
                    <div className="flex flex-col leading-none text-left">
                      <span className="text-[16px] font-semibold text-white tracking-tight">Lavanya</span>
                      <span className="text-[26px] font-black text-white tracking-tighter" style={{ marginTop: '-2px' }}>mart</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-blue-200 uppercase mt-4 tracking-widest font-bold">Solutions for modern living</p>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select User Profile</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setCurrentUser({ name: "Suresh Kumar", role: "Service Coordinator", seed: "Suresh" })}
                        className={`p-2 border rounded text-left text-xs flex flex-col ${
                          currentUser.name === "Suresh Kumar" ? "border-blue-500 bg-blue-50/40 font-bold" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span>Suresh Kumar</span>
                        <span className="text-[9px] text-slate-400 font-normal">Service Coordinator</span>
                      </button>
                      <button
                        onClick={() => setCurrentUser({ name: "Ramesh Nair", role: "Service Manager", seed: "Ramesh" })}
                        className={`p-2 border rounded text-left text-xs flex flex-col ${
                          currentUser.name === "Ramesh Nair" ? "border-blue-500 bg-blue-50/40 font-bold" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span>Ramesh Nair</span>
                        <span className="text-[9px] text-slate-400 font-normal">Service Manager</span>
                      </button>
                      <button
                        onClick={() => setCurrentUser({ name: "Anita Sharma", role: "Front Desk", seed: "Anita" })}
                        className={`p-2 border rounded text-left text-xs flex flex-col ${
                          currentUser.name === "Anita Sharma" ? "border-blue-500 bg-blue-50/40 font-bold" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span>Anita Sharma</span>
                        <span className="text-[9px] text-slate-400 font-normal">Front Desk</span>
                      </button>
                      <button
                        onClick={() => setCurrentUser({ name: "Vikram Gupta", role: "Helpdesk Agent", seed: "Vikram" })}
                        className={`p-2 border rounded text-left text-xs flex flex-col ${
                          currentUser.name === "Vikram Gupta" ? "border-blue-500 bg-blue-50/40 font-bold" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span>Vikram Gupta</span>
                        <span className="text-[9px] text-slate-400 font-normal">Helpdesk Agent</span>
                      </button>
                      <button
                        onClick={() => setCurrentUser({ name: "Live Display", role: "Viewer", seed: "Viewer" })}
                        className={`p-2 border rounded text-left text-xs flex flex-col ${
                          currentUser.name === "Live Display" ? "border-blue-500 bg-blue-50/40 font-bold" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span>Live Display</span>
                        <span className="text-[9px] text-slate-400 font-normal">Viewer / Read Only</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Terminal Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value="password-preloaded"
                      disabled
                      className="w-full p-2 border border-slate-200 bg-slate-100 rounded text-xs text-slate-600 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (currentUser.role === "Viewer") setCurrentScreen("viewer_console");
                      else setCurrentScreen("dashboard");
                      alert(`Successfully Authenticated as ${currentUser.name} (${currentUser.role})`);
                    }}
                    className="w-full py-2 bg-slate-900 text-white font-bold text-xs uppercase rounded hover:bg-slate-800 transition-colors"
                  >
                    Enter System Workspace
                  </button>
                  <div className="text-center pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setCurrentScreen("qr_form")}
                      className="text-[10px] text-blue-600 font-bold uppercase tracking-wider hover:underline"
                    >
                      Open Public QR Complaint Kiosk Form
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 2. TODAY'S WORK DASHBOARD ==================== */}
          {currentScreen === "dashboard" && (
            <div id="screen-dashboard" className="flex flex-col gap-3 flex-1 overflow-hidden">
              
              {/* Dense Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
                <div className="bg-white border border-slate-200 rounded p-2.5 shadow-sm">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Open Complaints</div>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">{stats.open}</div>
                  <div className="text-[10px] text-green-600 font-semibold flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span> Active Live Intake
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded p-2.5 shadow-sm">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Follow-ups Waiting</div>
                  <div className="text-xl font-bold text-amber-600 mt-0.5">{stats.pendingFollowUps}</div>
                  <button
                    onClick={() => { setQueueFilter("waiting_cust"); }}
                    className="text-[10px] text-blue-600 font-semibold hover:underline mt-1 block text-left"
                  >
                    Check Customer Actions &rarr;
                  </button>
                </div>
                <div className="bg-white border border-slate-200 rounded p-2.5 shadow-sm">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Ready for Delivery</div>
                  <div className="text-xl font-bold text-green-600 mt-0.5">{stats.readyPic}</div>
                  <button
                    onClick={() => setCurrentScreen("ready_pickup")}
                    className="text-[10px] text-slate-500 font-medium underline hover:text-slate-900 mt-1 block text-left"
                  >
                    View Ready Items list
                  </button>
                </div>
                <div className="bg-slate-900 border border-slate-900 rounded p-2.5 shadow-sm text-white">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Closed Completed Today</div>
                  <div className="text-xl font-bold text-orange-400 mt-0.5">{stats.closed}</div>
                  <div className="text-[9px] text-slate-300 font-mono tracking-wide italic mt-1">Helpdesk Target SLA: 15 / day</div>
                </div>
              </div>

              {/* Central Active work table */}
              <div className="bg-white border border-slate-200 rounded-lg flex-1 flex flex-col overflow-hidden shadow-sm">
                
                {/* Secondary Table Actions Area */}
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Active Work Dashboard: {queueFilter.toUpperCase()} QUEUE
                    </h3>
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-black font-mono">
                      {filteredTickets.length} Items Listed
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                      <input
                        type="text"
                        placeholder="Search customer, ID, model..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-xs pl-7 pr-2 py-1.5 border border-slate-300 rounded w-48 bg-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <button
                      onClick={() => setCurrentScreen("new_ticket")}
                      className="px-2.5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> + New Ticket Intake
                    </button>
                  </div>
                </div>

                {/* Table Element */}
                <div className="overflow-auto flex-1">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-500 uppercase text-[9px] font-black tracking-wider sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Ticket ID</th>
                        <th className="px-3 py-2">Customer / Dial</th>
                        <th className="px-3 py-2">Brand Product Name</th>
                        <th className="px-3 py-2 text-center">Inlet Type</th>
                        <th className="px-3 py-2">Repair Status</th>
                        <th className="px-3 py-2">Follow-up SLA</th>
                        <th className="px-3 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {filteredTickets.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-6 text-slate-400 font-medium italic">
                            No active tickets match the search query / selected queue category.
                          </td>
                        </tr>
                      ) : (
                        filteredTickets.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-3 py-2 font-bold text-blue-600">
                              <button
                                onClick={() => {
                                  setSelectedTicketId(t.id);
                                  setActiveModal("ticket_detail_drawer");
                                }}
                                className="underline hover:text-blue-800 text-left font-mono font-bold"
                              >
                                {t.id}
                              </button>
                            </td>
                            <td className="px-3 py-2">
                              <div className="font-semibold text-slate-900">{t.customerName}</div>
                              <div className="text-[9px] text-slate-400">{t.phone}</div>
                            </td>
                            <td className="px-3 py-2">
                              <div className="font-semibold text-slate-800">
                                {t.productName} {t.isRepeat && (
                                  <span className="bg-red-100 text-red-700 text-[8px] font-black px-1 rounded ml-1 tracking-widest uppercase">
                                    Repeat Case
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 italic">
                                {t.brand} / {t.model || "Universal Warranty"}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                                t.type === "Site"
                                  ? "bg-slate-100 border-slate-200 text-slate-700"
                                  : "bg-indigo-50 border-indigo-150 text-indigo-700"
                              }`}>
                                {t.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                                t.status === "Ready for Pickup" || t.status === "Closed"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : t.status === "Waiting on Part" || t.status === "Waiting on Customer"
                                  ? "bg-orange-100 text-orange-700 border-orange-200"
                                  : t.status === "Brand Registered" || t.status === "Registration Pending"
                                  ? "bg-purple-100 text-purple-700 border-purple-200"
                                  : t.status === "New" || t.status === "In Progress"
                                  ? "bg-blue-100 text-blue-700 border-blue-200"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}>
                                {t.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 font-medium">
                              <div className={`${
                                t.followUpDate === "URGENT" || t.followUpDate === "Overdue"
                                  ? "text-red-600 font-bold"
                                  : "text-slate-700"
                              }`}>
                                {t.followUpDate}
                              </div>
                              <div className="text-[9px] text-slate-400 uppercase font-mono">{t.followUpStatus}</div>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <div className="flex gap-1 justify-end">
                                <button
                                  onClick={() => {
                                    setSelectedTicketId(t.id);
                                    setActiveModal("ticket_detail_drawer");
                                  }}
                                  className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded hover:bg-slate-200 transition-all font-semibold"
                                >
                                  Process
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedTicketId(t.id);
                                    setCurrentScreen("create_receipt");
                                  }}
                                  className="p-1 text-slate-500 border border-slate-200 rounded hover:bg-slate-100"
                                  title="Print job receipt"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* ==================== 3. READY FOR PICKUP VIEW ==================== */}
          {currentScreen === "ready_pickup" && (
            <div id="screen-ready-pickup" className="bg-white border border-slate-200 rounded p-4 flex-1 flex flex-col overflow-hidden shadow-sm">
              <div className="border-b border-slate-200 pb-2 mb-3 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-sm font-bold text-green-700 uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle className="w-4.5 h-4.5 text-green-600" />
                    Pending Collection: Customer Delivery Queue
                  </h3>
                  <p className="text-[10px] text-slate-400">Products repaired, quality-checked and awaiting customer pick up</p>
                </div>
                <button
                  onClick={() => { setCurrentScreen("dashboard"); setQueueFilter("all"); }}
                  className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs hover:bg-slate-200 flex items-center gap-1 border border-slate-150"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                </button>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
                  {tickets.filter(t => t.status === "Ready for Pickup").length === 0 ? (
                    <div className="col-span-2 text-center py-10 italic text-slate-400">
                      No items currently marked with Ready for Pickup status.
                    </div>
                  ) : (
                    tickets.filter(t => t.status === "Ready for Pickup").map(t => (
                      <div key={t.id} className="bg-green-50/20 border border-green-150 rounded p-3 flex flex-col gap-2 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-xs font-bold text-blue-600 underline block">{t.id}</span>
                            <span className="text-xs font-bold text-slate-800">{t.customerName} ({t.phone})</span>
                          </div>
                          <span className="bg-green-200 text-green-800 text-[9px] font-bold px-2 py-0.5 rounded border border-green-300 uppercase">
                            Ready Collection
                          </span>
                        </div>
                        <div className="border-t border-dotted border-green-150 pt-2 text-xs text-slate-650 font-mono space-y-1">
                          <div><span className="font-bold text-slate-400 uppercase text-[9px]">Product:</span> {t.brand} {t.productName} ({t.model})</div>
                          <div><span className="font-bold text-slate-400 uppercase text-[9px]">Loc:</span> {t.physicalLocation || "Not set - Rack B-4"}</div>
                          <div><span className="font-bold text-slate-400 uppercase text-[9px]">Fault:</span> {t.problemDescription.slice(0, 80)}...</div>
                        </div>
                        <div className="flex justify-between gap-2 mt-2 pt-2 border-t border-green-150/50">
                          <button
                            onClick={() => {
                              setSelectedTicketId(t.id);
                              setActiveModal("service_follow_up");
                            }}
                            className="px-2.5 py-1 bg-amber-600 text-white text-[10px] font-bold rounded hover:bg-amber-700"
                          >
                            Send SMS / Ring Up
                          </button>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setSelectedTicketId(t.id);
                                setActiveModal("ticket_detail_drawer");
                              }}
                              className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] text-slate-700 hover:bg-slate-100"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTicketId(t.id);
                                setActiveModal("close_ticket");
                              }}
                              className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-bold rounded hover:bg-green-700 shadow-sm"
                            >
                              Deliver & Close Ticket
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 4. FRONT DESK: NEW TICKET FORM ==================== */}
          {currentScreen === "new_ticket" && (
            <div id="screen-new-ticket" className="bg-white border border-slate-200 rounded p-4 flex-1 flex flex-col shadow-sm">
              <div className="border-b border-slate-200 pb-2 mb-3 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5ClassName">
                    <Plus className="w-4.5 h-4.5 text-blue-600" />
                    New Ticket Intake Form
                  </h3>
                  <p className="text-[10px] text-slate-400">Register brand walk-ins and field service dispatch requests</p>
                </div>
              </div>

              <form onSubmit={handleAddNewTicket} className="flex-1 space-y-3 max-w-2xl text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={newTicketForm.customerName}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, customerName: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mobile Line *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 99000 88775"
                      value={newTicketForm.phone}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, phone: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Alternative Phone</label>
                    <input
                      type="tel"
                      placeholder="Secondary Number"
                      value={newTicketForm.altPhone}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, altPhone: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Product Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Mixer Grinder, Smart LED TV"
                      value={newTicketForm.productName}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, productName: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Product Brand</label>
                    <select
                      value={newTicketForm.brand}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, brand: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-medium"
                    >
                      {brands.map(b => <option key={b.id} value={b.brandName}>{b.brandName}</option>)}
                      {!brands.find(b => b.brandName === "Prestige") && <option value="Prestige">Prestige</option>}
                      <option value="Sony">Sony</option>
                      <option value="LG">LG</option>
                      <option value="Crompton">Crompton</option>
                      <option value="Bajaj">Bajaj</option>
                      <option value="Philips">Philips</option>
                      <option value="Morphy Richards">Morphy Richards</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Model ID Number</label>
                    <input
                      type="text"
                      placeholder="e.g. Mixer Grinder, Smart LED TV"
                      value={newTicketForm.model}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, model: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Warranty Status</label>
                    <select
                      value={newTicketForm.warrantyStatus}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, warrantyStatus: e.target.value as "In Warranty" | "Out of Warranty" | "Unknown" })}
                      className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-medium"
                    >
                      <option value="Unknown">Unknown</option>
                      <option value="In Warranty">In Warranty</option>
                      <option value="Out of Warranty">Out of Warranty</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Serial Tag No.</label>
                    <input
                      type="text"
                      placeholder="e.g. SN-8910-AA"
                      value={newTicketForm.serialNo}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, serialNo: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Service Inlet Method</label>
                    <select
                      value={newTicketForm.type}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, type: e.target.value as any })}
                      className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-medium"
                    >
                      <option value="Store">Store Carry-in (In-ward)</option>
                      <option value="Site">Field Service (Site Visit)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Warehouse Storage Locator</label>
                    <input
                      type="text"
                      placeholder="e.g. Rack A-4"
                      value={newTicketForm.physicalLocation}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, physicalLocation: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Detailed Fault Symptom Description *</label>
                  <textarea
                    rows={3}
                    placeholder="Describe problem observed or reported by the client in detail..."
                    value={newTicketForm.problemDescription}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, problemDescription: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none font-sans"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-slate-250">
                  <button
                    type="button"
                    onClick={() => { setCurrentScreen("dashboard"); }}
                    className="px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-150 rounded text-xs uppercase font-bold"
                  >
                    Cancel Intake
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 rounded font-bold text-xs uppercase tracking-wider"
                  >
                    Create & Print Service Job Token
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================== 5. HELPDESK AGENT: MY WORK ==================== */}
          {currentScreen === "agent_work" && (
            <div id="screen-agent-work" className="flex flex-col gap-3 flex-1 overflow-hidden">
              <div className="bg-slate-900 text-white p-3 rounded-lg flex justify-between items-center shrink-0 shadow">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Agent Command Center</h3>
                  <div className="text-lg font-bold">Personal Repair Pipeline: Suresh Kumar</div>
                </div>
                <div className="text-right text-[11px] font-mono">
                  <div>Assigned Load: <span className="text-green-400 font-bold font-sans">
                    {tickets.filter(t => t.assignedAgent === "Suresh Kumar" && t.status !== "Closed").length} active repairs
                  </span></div>
                </div>
              </div>

              {/* Agent Grid filters */}
              <div className="bg-white border border-slate-205 p-3 rounded-lg shadow-sm">
                <h4 className="text-xs font-bold text-slate-405 uppercase mb-2">My Work list</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {tickets
                    .filter(t => t.assignedAgent === "Suresh Kumar" && t.status !== "Closed")
                    .map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedTicketId(t.id);
                          setActiveModal("ticket_detail_drawer");
                        }}
                        className={`border p-3 rounded cursor-pointer transition-all hover:shadow-md ${
                          t.followUpDate === "URGENT" || t.followUpDate === "Overdue"
                            ? "bg-red-50/20 border-red-200"
                            : "bg-slate-50/50 border-slate-225"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-mono text-xs font-bold text-blue-600 underline">{t.id}</span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                            t.status === "Ready for Pickup" ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-800"
                          }`}>
                            {t.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="font-semibold text-xs text-slate-900 leading-tight">{t.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono italic mt-0.5">{t.brand} {t.productName}</div>
                        <p className="text-[10px] text-slate-400 font-sans line-clamp-2 mt-1.5 leading-normal">
                          {t.problemDescription}
                        </p>
                        <div className="border-t border-slate-200 mt-2.5 pt-2 flex justify-between items-center text-[9px] text-slate-400 font-black tracking-wider uppercase">
                          <span>SLA: <strong className="text-orange-500">{t.followUpDate}</strong></span>
                          <span>LOC: {t.physicalLocation || "RACK"}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 6. TICKET DETAIL VIEW DELETED ==================== */}
          {/* Note: ticket_detail is now a drawer overlay at the end of the file */}

          {/* ==================== 7. FRONT DESK: WORK CENTER (BULK) ==================== */}
          {currentScreen === "work_center" && (
            <div id="screen-work-center" className="flex flex-col gap-3 flex-1 overflow-hidden">
              <div className="bg-slate-900 p-3 rounded text-white flex justify-between items-center shrink-0 shadow-sm">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Front Desk Work Center</h3>
                  <div className="text-base font-bold">Counter Queue Operations: Walk-in Traffic Tracker</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200 rounded p-3 text-xs shadow-sm">
                  <h4 className="font-bold text-slate-800 border-b pb-1.5 mb-2 uppercase tracking-wide">Live Counters</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-blue-50/50 border border-blue-150 rounded">
                      <span className="font-bold">Counter 1 (Intake)</span>
                      <span className="bg-blue-600 text-white px-2 rounded-full font-bold">Suresh (Active)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 border rounded">
                      <span className="font-medium text-slate-600">Counter 2 (Inward Desk)</span>
                      <span className="bg-slate-350 text-slate-800 px-2 rounded-full">Anand (On break)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50/50 border border-green-150 rounded">
                      <span className="font-bold">Counter 3 (Collection)</span>
                      <span className="bg-green-600 text-white px-2 rounded-full font-bold font-mono">2 Ready</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded p-3 text-xs col-span-2">
                  <h4 className="font-bold text-slate-801 border-b pb-12 mb-2 uppercase tracking-wide">Active Walk-In Infiltration Status</h4>
                  <p className="text-[11px] text-slate-500 mb-2">Service desk capacity tracking stats</p>
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="bg-slate-50 border p-2 rounded">
                      <div className="text-xl font-bold">8 mins</div>
                      <div className="text-[9px] text-slate-450 uppercase font-black">Average Wait Time</div>
                    </div>
                    <div className="bg-slate-50 border p-2 rounded">
                      <div className="text-xl font-bold">4.8 / 5.0</div>
                      <div className="text-[9px] text-slate-450 uppercase font-black">CSAT Score</div>
                    </div>
                    <div className="bg-slate-50 border p-2 rounded">
                      <div className="text-xl font-bold">42 Tokens</div>
                      <div className="text-[9px] text-slate-450 uppercase font-black">Intakes cleared today</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 8. REPORTS CENTER ==================== */}
          {currentScreen === "reports" && (
            <div id="screen-reports" className="bg-white border border-slate-202 rounded p-4 flex-1 flex flex-col overflow-auto font-sans">
              <div className="border-b border-slate-202 pb-2 mb-3.5 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-sm font-black text-slate-850 uppercase tracking-widest flex items-center gap-1.5">
                    <BarChart3 className="w-4.5 h-4.5 text-blue-600" />
                    Helpdesk Statistics & Performance Audit Room
                  </h3>
                  <p className="text-[10px] text-slate-400">Average resolution turnaround timelines (TAT) and manufacturer fault analytics</p>
                </div>
                <button
                  onClick={() => setCurrentScreen("dashboard")}
                  className="px-2 py-1 bg-slate-900 text-white text-xs rounded hover:bg-slate-850 uppercase font-bold"
                >
                  Dashboard
                </button>
              </div>

              {/* Analytic Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-4 text-xs">
                <div className="bg-slate-50 border border-slate-220 p-2.5 rounded">
                  <div className="text-[9px] font-black text-slate-450 uppercase">SLA Compliance Ratio</div>
                  <div className="text-xl font-black text-green-750">94.2 %</div>
                  <div className="text-[9px] text-slate-400">+1.2% this quarter</div>
                </div>
                <div className="bg-slate-50 border border-slate-220 p-2.5 rounded">
                  <div className="text-[9px] font-black text-slate-450 uppercase">Average Ticket Age</div>
                  <div className="text-xl font-black text-slate-850">21.4 Hours</div>
                  <div className="text-[9px] text-slate-400">Target SLA: Under 24h</div>
                </div>
                <div className="bg-slate-50 border border-slate-220 p-2.5 rounded">
                  <div className="text-[9px] font-black text-slate-450 uppercase">Volume of Repeat Failures</div>
                  <div className="text-xl font-black text-red-650">3.8 %</div>
                  <div className="text-[9px] text-red-600 font-bold">Action Needed</div>
                </div>
                <div className="bg-slate-50 border border-slate-220 p-2.5 rounded">
                  <div className="text-[9px] font-black text-slate-450 uppercase">Customer Sentiment rating</div>
                  <div className="text-xl font-black text-blue-800">4.75 / 5.0</div>
                  <div className="text-[9px] text-slate-400">920 sample feedback surveys</div>
                </div>
              </div>

              {/* Stylized Visual Bar Chart representations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-205 rounded p-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Manufacturers Claims Share</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="font-semibold text-slate-705">Prestige Mixer Grinders</span>
                        <span className="font-mono text-slate-705">35% of total claims</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                        <div className="bg-orange-500 h-2" style={{ width: "35%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="font-semibold text-slate-705">Sony LED Bravia TVs</span>
                        <span className="font-mono text-slate-750">25% of total claims</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                        <div className="bg-blue-600 h-2" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="font-semibold text-slate-705">LG Laundry Units</span>
                        <span className="font-mono text-slate-750">20% of total claims</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                        <div className="bg-indigo-600 h-2" style={{ width: "20%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="font-semibold text-slate-705">Crompton Cooling Fans</span>
                        <span className="font-mono text-slate-750">15% of total claims</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                        <div className="bg-teal-600 h-2" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-205 rounded p-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Key Escalations Status Log</h4>
                    <span className="text-[11px] text-slate-450 block leading-tight mb-2">Urgent manufacturer service approvals flagged</span>
                  </div>
                  <div className="bg-slate-900 text-white rounded p-3 text-[11px] font-mono leading-relaxed space-y-1">
                    <div>[SYS] SLA warning active for: <span className="text-orange-400">SRV-1025</span> (Morphy Richards)</div>
                    <div>[SYS] BREACH ALARM logged for: <span className="text-red-500">SRV-1011</span> (Philips Hair Dryer)</div>
                    <div>[SYS] Spares requested from national depot today: <span className="text-green-400">Value Rs. 14,800</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 9. PRODUCT CUSTODY DETAIL ==================== */}
          {currentScreen === "custody_detail" && (
            <div id="screen-custody" className="bg-white border border-slate-200 rounded p-4 flex-1 flex flex-col overflow-auto shadow-sm text-xs font-sans">
              <div className="border-b pb-2 mb-3 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-1.5">
                    <MapPin className="text-pink-500 w-4.5 h-4.5" /> Physical Storage Warehouse Rack Custody Map
                  </h3>
                  <p className="text-[10px] text-slate-400">Locating repairs easily to avoid customer delays during checkout</p>
                </div>
                <button
                  onClick={() => setCurrentScreen("dashboard")}
                  className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs hover:bg-slate-200 text-slate-700"
                >
                  Close Map
                </button>
              </div>

              {/* Racks grid visualization */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {["Rack A-1", "Rack A-2", "Rack A-3", "Rack A-4", "Rack B-1", "Rack B-2", "Rack B-3", "Rack B-4", "Rack C-1", "Rack C-2", "Rack C-3", "Rack-Ready Shelf"].map((rack) => {
                  const itemsInRack = tickets.filter(t => t.physicalLocation === rack || (rack === "Rack-Ready Shelf" && t.status === "Ready for Pickup"));
                  return (
                    <div key={rack} className="bg-slate-50 border p-2.5 rounded flex flex-col justify-between hover:border-slate-400 transition-colors">
                      <span className="font-mono text-slate-700 font-bold block bg-slate-200 px-1 py-0.5 rounded text-[10px] uppercase w-fit mb-2">
                        {rack}
                      </span>
                      {itemsInRack.length === 0 ? (
                        <div className="text-[10px] text-slate-400 italic">No assigned assets. Space Vacant.</div>
                      ) : (
                        <div className="space-y-1">
                          {itemsInRack.map(item => (
                            <div key={item.id} className="text-[11px] p-1 border border-blue-150 bg-blue-50/20 rounded font-semibold text-blue-900 flex justify-between items-center">
                              <span>{item.id} ({item.brand})</span>
                              <span className="text-[8px] bg-blue-105 text-blue-805 px-1 rounded uppercase font-black">{item.status.slice(0, 5)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== 10. CUSTOMER QR COMPLAINT FORM ==================== */}
          {currentScreen === "qr_form" && (
            <div id="screen-qr-form" className="flex-1 flex justify-center p-3">
              <div className="w-full max-w-sm border-4 border-slate-900 rounded-2xl shadow-2xl bg-white overflow-hidden flex flex-col">
                <div className="bg-blue-700 text-white p-4 flex flex-col items-center justify-center shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <BrandLogo className="w-8 h-8 text-white" />
                    <div className="flex flex-col leading-none text-left">
                      <span className="text-[12px] font-semibold text-white tracking-tight">Lavanya</span>
                      <span className="text-[18px] font-black text-white tracking-tighter" style={{ marginTop: '-2px' }}>mart</span>
                    </div>
                  </div>
                  <div className="text-[9px] uppercase font-black tracking-widest text-blue-200">Self Service Registration Scan</div>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto font-sans leading-normal space-y-3 text-xs">
                  <div className="bg-orange-50 border border-orange-200 text-orange-900 p-2.5 rounded font-medium">
                    We'll register your complaint. Simply put details and we will initialize a token ID instantly!
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Your Full Customer Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-slate-300 rounded focus:border-orange-500 outline-none"
                      placeholder="e.g. Anand Sharma"
                      id="qr-cust-name"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Your Active Calling Phone No.</label>
                    <input
                      type="tel"
                      className="w-full p-2 border border-slate-300 rounded focus:border-orange-500 outline-none"
                      placeholder="e.g. +91 99000 77112"
                      id="qr-cust-phone"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">Category</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-slate-300 rounded focus:border-orange-500 outline-none"
                        placeholder="e.g. Ceiling Fan, Induction"
                        id="qr-prod-name"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">Brand</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-slate-300 rounded"
                        placeholder="e.g. Prestige"
                        id="qr-prod-brand"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">What is the problem? Describe clearly</label>
                    <textarea
                      rows={2}
                      className="w-full p-2 border border-slate-300 rounded focus:border-orange-500 outline-none"
                      placeholder="Motor not switching on, broken plug wire..."
                      id="qr-prod-desc"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const nameEl = document.getElementById("qr-cust-name") as HTMLInputElement;
                      const phoneEl = document.getElementById("qr-cust-phone") as HTMLInputElement;
                      const prodEl = document.getElementById("qr-prod-name") as HTMLInputElement;
                      const brandEl = document.getElementById("qr-prod-brand") as HTMLInputElement;
                      const descEl = document.getElementById("qr-prod-desc") as HTMLTextAreaElement;

                      if (!nameEl?.value || !phoneEl?.value) {
                        alert("Please fill your Name and Mobile number.");
                        return;
                      }

                      // Append to live list
                      const mockId = `SRV-${1000 + tickets.length + 1}`;
                      const entry: Ticket = {
                        id: mockId,
                        customerName: nameEl.value,
                        phone: phoneEl.value,
                        productName: prodEl?.value || "Uncoded Item",
                        brand: brandEl?.value || "Generic",
                        model: "QR Form Submission",
                        type: "Store",
                        status: "New",
                        followUpDate: "Today",
                        followUpStatus: "Self Intake",
                        problemDescription: descEl?.value || "Fault not specified",
                        assignedAgent: "Suresh Kumar",
                        physicalLocation: "Counter Queue Area",
                        purchaseDate: new Date().toISOString().split("T")[0],
                        invoiceStatus: "Found"
                      };

                      setTickets([entry, ...tickets]);
                      alert(`Thank You! Your service request has been logged successfully as ${mockId}. Please report to the Service Coordinator desk now.`);
                      
                      // navigate
                      setCurrentScreen("dashboard");
                    }}
                    className="w-full py-2 bg-orange-500 text-white font-bold uppercase rounded hover:bg-orange-600 transition-colors shadow-md"
                  >
                    Submit Self-Service Ticket
                  </button>
                </div>
                <div className="bg-slate-100 p-2 text-center text-[9px] text-slate-400 shrink-0 uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
                  <BrandLogo className="w-3.5 h-3.5 text-blue-400" /> Lavanya mart In-Store POS &copy; 2026
                </div>
              </div>
            </div>
          )}

          {/* ==================== 11. MANAGER OVERVIEW DASHBOARD ==================== */}
          {currentScreen === "manager_dashboard" && (
            <div id="screen-manager" className="flex flex-col gap-3 flex-1 overflow-hidden font-sans">
              <div className="bg-slate-900 text-white p-3.5 rounded-lg flex justify-between items-center shrink-0">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Restricted Administration</span>
                  <div className="text-base font-bold">Service Manager Command Dashboard</div>
                </div>
                <span className="text-orange-400 font-bold font-mono text-xs px-2 py-0.5 bg-slate-800 rounded border border-slate-700">Administrator Console Mode</span>
              </div>

              {/* SLA escalations alerts widget built-in */}
              <div id="sla-alert-widget" className="bg-white border border-red-200 rounded p-3 text-xs shadow-sm">
                <span className="text-[9px] font-black text-red-650 bg-red-100 px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-2">
                  CRITICAL: IMMEDIATE SLA BREACH CANDIDATES (SLA Breach Watch)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono leading-relaxed">
                  <div className="border border-slate-205 p-2 rounded flex justify-between items-center bg-red-50/20">
                    <div>
                      <span className="font-bold text-slate-800 text-xs">SRV-1011</span>
                      <span className="text-slate-400 font-sans ml-1">(Philips Hair Dryer)</span>
                    </div>
                    <span className="text-red-650 font-bold font-sans uppercase">⚡ Overdue by 4 Hours</span>
                  </div>
                  <div className="border border-slate-205 p-2 rounded flex justify-between items-center bg-orange-50/20">
                    <div>
                      <span className="font-bold text-slate-800 text-xs">SRV-1025</span>
                      <span className="text-slate-400 font-sans ml-1">(Morphy Richards Coffee Maker)</span>
                    </div>
                    <span className="text-orange-500 font-bold font-sans uppercase">⏱️ 52 Minutes remaining</span>
                  </div>
                </div>
              </div>

              {/* Management Metrics Table */}
              <div className="bg-white border border-slate-200 rounded flex-1 flex flex-col overflow-hidden shadow-sm">
                <div className="px-3 py-1.5 border-b bg-slate-50 flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-700">Repair Pipeline Coordinator Loading Sheet</span>
                </div>
                <div className="overflow-auto flex-1 text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold sticky top-0 border-b">
                      <tr>
                        <th className="p-2">Name of Service Personnel</th>
                        <th className="p-2">Role Status</th>
                        <th className="p-2 text-center">Unresolved tickets assigned</th>
                        <th className="p-2 text-center">Closed resolutions today</th>
                        <th className="p-2 text-right">Escalation Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      <tr>
                        <td className="p-2 font-bold font-sans">Suresh Kumar</td>
                        <td className="p-2 text-slate-550">Senior Coordinator</td>
                        <td className="p-2 text-center font-bold">4</td>
                        <td className="p-2 text-center text-green-700 font-bold">12</td>
                        <td className="p-2 text-right text-green-600 font-bold">0.0 %</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold font-sans">Deepak Rao</td>
                        <td className="p-2 text-slate-550">Field Engineer</td>
                        <td className="p-2 text-center font-bold">3</td>
                        <td className="p-2 text-center text-green-700 font-bold">6</td>
                        <td className="p-2 text-right text-orange-500">14.2 %</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 12. VIEWER: READ-ONLY CONSOLE ==================== */}
          {currentScreen === "viewer_console" && (
            <div id="screen-viewer-display" className="bg-slate-950 text-white rounded p-4 flex-1 flex flex-col overflow-hidden font-sans border-2 border-slate-850">
              <div className="border-b border-slate-800 pb-2 mb-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <BrandLogo className="w-10 h-10 text-blue-500" />
                  <div>
                    <h3 className="text-base font-black tracking-widest text-blue-400 uppercase flex items-center gap-2">
                       LAVANYA MART REPARATIONS BOARD
                    </h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Awaiting Collection - Please notice your token ID</p>
                  </div>
                </div>
                <div className="text-[11px] bg-slate-905 px-2 py-1 rounded text-green-400 font-bold font-mono">
                  &bull; LIVE DISPLAY BOARD
                </div>
              </div>

              <div ref={viewerScrollRef} className="grid grid-cols-1 md:grid-cols-2 gap-3.5 flex-1 overflow-auto">
                {/* Board Column: Testing & Repairing */}
                <div className="bg-slate-900 border border-slate-800 rounded p-3 flex flex-col">
                  <h4 className="text-xs font-black uppercase text-amber-500 border-b border-slate-800 pb-1.5 mb-2 tracking-widest">
                    REPAIR CENTER PIPELINE
                  </h4>
                  <div className="space-y-2 flex-1">
                    {tickets.filter(t => t.status !== "Closed" && t.status !== "Ready for Pickup").map(t => (
                      <div key={t.id} className="p-2 border border-slate-800 bg-slate-950/40 rounded flex justify-between items-center font-mono">
                        <div>
                          <span className="font-bold text-white text-sm block">{t.id}</span>
                          <span className="text-[9px] text-slate-400 font-sans">{t.brand} {t.productName}</span>
                        </div>
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded font-sans uppercase">
                          {t.status.slice(0, 15)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Board Column: Ready for Pickup */}
                <div className="bg-slate-900 border border-slate-800 rounded p-3 flex flex-col">
                  <h4 className="text-xs font-black uppercase text-green-500 border-b border-slate-800 pb-1.5 mb-2 tracking-widest">
                    COLLECTION COUNTER (READY READY)
                  </h4>
                  <div className="space-y-2 flex-1">
                    {tickets.filter(t => t.status === "Ready for Pickup").map(t => (
                      <div key={t.id} className="p-2 border border-green-900 bg-green-950/20 rounded flex justify-between items-center font-mono animate-pulse">
                        <div>
                          <span className="font-black text-green-400 text-base block">{t.id}</span>
                          <span className="text-[9px] text-slate-400 font-sans">{t.customerName.toUpperCase()}</span>
                        </div>
                        <span className="bg-green-655 text-green-150 text-[10px] font-black px-2 py-1 rounded font-sans uppercase">
                          Counters ready!
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 13. FRONT DESK: CREATE RECEIPT (PRINT PREVIEW) ==================== */}
          {currentScreen === "create_receipt" && (
            <div id="screen-receipt-print" className="bg-white border border-slate-350 rounded p-4 flex-1 flex flex-col overflow-auto items-center shadow-lg font-sans">
              
              <div className="w-full max-w-xl shrink-0 flex justify-between items-center border-b pb-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Service token receipt printable</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => { window.print(); }}
                    className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Layout
                  </button>
                  <button
                    onClick={() => setCurrentScreen("dashboard")}
                    className="px-2 py-1 bg-slate-100 border rounded text-xs text-slate-600"
                  >
                    Exit Receipt view
                  </button>
                </div>
              </div>

              {/* Actual paper copy mockup */}
              <div className="w-full max-w-md p-5 border bg-amber-50/10 border-slate-200 text-xs font-mono space-y-4">
                <div className="text-center font-sans">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <BrandLogo className="w-5 h-5 text-slate-800" />
                    <div className="font-black text-sm uppercase">Lavanya Mart Helpdesk Repair Unit</div>
                  </div>
                  <div className="text-[10px] text-slate-500">Service Plaza, Bangalore, India | Ph: +91 99888 77777</div>
                  <div className="text-xs font-bold border rounded px-2 py-0.5 mt-2 inline-block">
                    Inward Intake Receipt Copy
                  </div>
                </div>

                <div className="border-t border-b border-dashed py-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Job Token ID:</span>
                    <strong className="font-bold underline">{selectedTicket.id}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Inward Intake Date:</span>
                    <span>14th June, 2026 (07:09 PDT)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Coordinator:</span>
                    <span>{selectedTicket.assignedAgent}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold italic uppercase underline font-sans text-[10px] text-slate-500 mb-1">Customer metadata</div>
                  <div><span className="text-slate-450 uppercase text-[9px] font-bold">Client:</span> {selectedTicket.customerName}</div>
                  <div><span className="text-slate-450 uppercase text-[9px] font-bold">Telephone:</span> {selectedTicket.phone}</div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold italic uppercase underline font-sans text-[10px] text-slate-500 mb-1">Equipment check list parameters</div>
                  <div><span className="text-slate-450 uppercase text-[9px] font-bold">Item details:</span> {selectedTicket.brand} {selectedTicket.productName} ({selectedTicket.model || "Universal"})</div>
                  <div><span className="text-slate-450 uppercase text-[9px] font-bold">Serial Tag No:</span> {selectedTicket.serialNo || "Not specified"}</div>
                  <div><span className="text-slate-450 uppercase text-[9px] font-bold">Diagnosed Issue:</span> {selectedTicket.problemDescription}</div>
                  <div><span className="text-slate-450 uppercase text-[9px] font-bold">Proof of Invoice:</span> {selectedTicket.invoiceStatus || "Available"}</div>
                </div>

                <div className="border-t pt-2 space-y-1 bg-slate-50 p-2 border rounded font-sans text-[10px] text-slate-500 leading-normal">
                  <div className="font-bold uppercase text-slate-600 mb-0.5">TERMS AND CONDITIONS SUMMARY</div>
                  <p>1. Estimate cost will be validated post engineer inspection check.</p>
                  <p>2. Customer to collect goods in 15 days of pick up SMS reminder.</p>
                </div>

                <div className="pt-6 flex justify-between items-end border-t border-dashed">
                  <div className="text-center w-24">
                    <div className="h-6 border-b border-slate-300"></div>
                    <span className="text-[8px] font-sans">CUSTOMER HAND</span>
                  </div>
                  <div className="text-center w-28">
                    <div className="h-6 border-b border-slate-300"></div>
                    <span className="text-[8px] font-sans">COORDINATOR SIGN</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==================== 14. APP SETTINGS SCREEN ==================== */}
          {currentScreen === "app_settings" && (
            <div id="screen-app-settings" className="bg-white border border-slate-200 rounded p-4 flex-1 flex flex-col overflow-hidden shadow-sm">
              <div className="border-b border-slate-200 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Settings className="w-4.5 h-4.5 text-slate-600" />
                  System & Integration Settings
                </h3>
                <p className="text-[10px] text-slate-400">Configure WhatsApp automation, Email servers, and Brand registrations</p>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                
                {/* Communication Settings */}
                <section>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-500" /> Customer Communication Automations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="border border-slate-200 rounded p-3 bg-slate-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-[11px] text-slate-800 uppercase flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-green-600" /> WhatsApp API
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={appSettings.whatsappEnabled} onChange={(e) => setAppSettings({...appSettings, whatsappEnabled: e.target.checked})} />
                          <div className="w-7 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase">API Endpoint URL</label>
                          <input type="text" value={appSettings.whatsappApiEndpoint} onChange={(e) => setAppSettings({...appSettings, whatsappApiEndpoint: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 text-xs outline-none focus:border-green-500" disabled={!appSettings.whatsappEnabled} />
                        </div>
                        <p className="text-[9px] text-slate-400 leading-tight">Enables automated WhatsApp updates on ticket status changes, and followup notifications to customers.</p>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded p-3 bg-slate-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-[11px] text-slate-800 uppercase flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-blue-600" /> Email Registration Mailer
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={appSettings.emailRegistration} onChange={(e) => setAppSettings({...appSettings, emailRegistration: e.target.checked})} />
                          <div className="w-7 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase">SMTP Server Alias</label>
                          <input type="text" value={appSettings.emailSmtp} onChange={(e) => setAppSettings({...appSettings, emailSmtp: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" disabled={!appSettings.emailRegistration} />
                        </div>
                        <p className="text-[9px] text-slate-400 leading-tight">Sends confirmation receipts and warranty registration emails directly to customers upon intake.</p>
                      </div>
                    </div>

                  </div>
                </section>

                {/* Frappe ERPNext Integration Settings */}
                <section>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100 flex items-center gap-2">
                    <Network className="w-4 h-4 text-indigo-500" /> Frappe ERPNext & Helpdesk Integration
                  </h4>
                  <div className="border border-slate-200 rounded p-3 bg-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 py-1 px-3 bg-indigo-100 text-indigo-800 text-[9px] font-bold rounded-bl-lg uppercase tracking-wider">Early Preview</div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-bold text-xs text-slate-800 uppercase flex items-center gap-1">
                          <Network className="w-3.5 h-3.5 text-indigo-600" /> Connect Frappe Backend
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 max-w-lg">Enable two-way sync for Tickets and Customers into Frappe core modules (Helpdesk & ERPNext Service).</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={appSettings.frappeEnabled} onChange={(e) => setAppSettings({...appSettings, frappeEnabled: e.target.checked})} />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 transition-opacity duration-300 ${appSettings.frappeEnabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Frappe Site URL</label>
                        <input type="url" value={appSettings.frappeUrl} onChange={(e) => setAppSettings({...appSettings, frappeUrl: e.target.value})} placeholder="https://myerp.frappe.cloud" className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-500 bg-white" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">API Key</label>
                        <input type="text" value={appSettings.frappeApiKey} onChange={(e) => setAppSettings({...appSettings, frappeApiKey: e.target.value})} placeholder="a1b2c3d4e5f6" className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-500 bg-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">API Secret</label>
                        <input type="password" value={appSettings.frappeApiSecret} onChange={(e) => setAppSettings({...appSettings, frappeApiSecret: e.target.value})} placeholder="••••••••••••••" className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-500 bg-white font-mono" />
                      </div>
                    </div>
                    {appSettings.frappeEnabled && (
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => {
                            if (!appSettings.frappeUrl || !appSettings.frappeApiKey || !appSettings.frappeApiSecret) {
                              alert("Please fill in Frappe URL, API Key, and Secret to test connection.");
                              return;
                            }
                            alert("Attempting to connect to Frappe Helpdesk API... Connection simulated. ERPNext Sync ready.");
                          }}
                          className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-[10px] uppercase font-bold rounded flex items-center gap-1.5 transition-colors">
                          <Network className="w-3 h-3" /> Test Frappe Connection
                        </button>
                      </div>
                    )}
                  </div>
                </section>

                {/* Business Workflow Settings */}
                <section>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500" /> Business Workflow Automations
                  </h4>
                  <div className="border border-slate-200 rounded p-3 bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-[11px] text-slate-800 uppercase flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-rose-600" /> SLA Overdue Manager Auto-Escalation
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={appSettings.workflowAutoEscalate} onChange={(e) => setAppSettings({...appSettings, workflowAutoEscalate: e.target.checked})} />
                        <div className="w-7 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rose-500"></div>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Escalate if pending over (Hours)</label>
                        <input type="number" value={appSettings.workflowEscalateHours} onChange={(e) => setAppSettings({...appSettings, workflowEscalateHours: parseInt(e.target.value) || 0})} className="w-full max-w-[200px] border border-slate-300 rounded px-2 py-1 flex-1 text-xs outline-none focus:border-rose-500" disabled={!appSettings.workflowAutoEscalate} />
                      </div>
                      <p className="text-[9px] text-slate-400 leading-tight">If a ticket stays unresolved past this hour limit, it will automatically notify the regional service manager and tag the ticket as Urgent.</p>
                      <p className="text-[9px] text-slate-400 leading-tight">For Brand-specific SLAs (Auto-Send limits), manage them via the Brand Directory.</p>
                    </div>
                  </div>
                </section>

                {/* Toll Free Brand Numbers */}
                <section>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100 flex items-center gap-2">
                    <Building className="w-4 h-4 text-orange-500" /> Brand Registration Toll-Free Numbers
                  </h4>
                  <p className="text-[10px] text-slate-500 mb-3 block">Saved directory of priority support hotlines for direct brand interactions and RMAs.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {appSettings.brandNumbers.map((b, idx) => (
                      <div key={idx} className="flex flex-col border border-slate-200 rounded p-2 bg-white shadow-sm">
                        <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{b.brand}</label>
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <input 
                            type="text" 
                            className="flex-1 text-xs font-bold text-slate-800 outline-none w-full"
                            value={b.number}
                            onChange={(e) => {
                              const newBrands = [...appSettings.brandNumbers];
                              newBrands[idx].number = e.target.value;
                              setAppSettings({...appSettings, brandNumbers: newBrands});
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-center border border-dashed border-slate-300 rounded p-2 bg-slate-50 cursor-pointer hover:bg-slate-100" onClick={() => {
                      const brandName = prompt("Enter new brand name:");
                      const brandPhone = prompt("Enter brand phone number:");
                      if (brandName && brandPhone) {
                        setAppSettings({...appSettings, brandNumbers: [...appSettings.brandNumbers, { brand: brandName, number: brandPhone }]});
                      }
                    }}>
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Toll-Free Record</span>
                    </div>
                  </div>
                </section>

              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                 <button onClick={() => alert("Settings saved globally.")} className="px-5 py-2 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded shadow-sm hover:bg-slate-800 transition-colors">
                   Save Application Settings
                 </button>
              </div>

            </div>
          )}

          {/* ==================== 15. BRAND & SERVICE DIRECTORY ==================== */}
          {currentScreen === "brand_directory" && (
            <div id="screen-brand-directory" className="bg-white border border-slate-200 rounded p-4 flex-1 flex flex-col overflow-hidden shadow-sm">
              <div className="border-b border-slate-200 pb-3 mb-4 flex justify-between items-end">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <Building2 className="w-4.5 h-4.5 text-blue-600" />
                    Brand Service Network Directory
                  </h3>
                  <p className="text-[10px] text-slate-400">Manage service centers, contacts, auto-forward SLAs, and tier markings</p>
                </div>
                <button
                  onClick={() => {
                    const newBrand = prompt("Enter Brand Name:");
                    if (newBrand) {
                      setBrands([...brands, { id: `BRD-${Date.now()}`, brandName: newBrand, tollFree: "", marking: "Standard", autoSendIssuesAfterHours: 0, centers: [], contacts: [] }]);
                    }
                  }}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold shadow hover:bg-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Brand
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {brands.map(brand => (
                  <div key={brand.id} className="border border-slate-200 rounded bg-slate-50 overflow-hidden">
                    <div className="bg-white p-3 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          {brand.brandName}
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${brand.marking.includes("Premium") ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"}`}>
                            {brand.marking}
                          </span>
                        </h4>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex gap-3">
                          <span>Toll-Free: {brand.tollFree || "Not Set"}</span>
                          <span>Auto-Forward SLA: {brand.autoSendIssuesAfterHours > 0 ? `${brand.autoSendIssuesAfterHours} Hours` : "Disabled"}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => {
                          const name = prompt("Center Name:");
                          if (name) {
                            const newCenter = { id: `SC-${Date.now()}`, name, address: "TBD", phone: "" };
                            setBrands(brands.map(b => b.id === brand.id ? { ...b, centers: [...b.centers, newCenter] } : b));
                          }
                        }} className="text-[10px] border border-blue-200 bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold">
                          + Center
                        </button>
                        <button onClick={() => {
                          const name = prompt("Contact Name:");
                          if (name) {
                            const newContact = { id: `C-${Date.now()}`, name, role: "Service Manager", phone: "", email: "" };
                            setBrands(brands.map(b => b.id === brand.id ? { ...b, contacts: [...b.contacts, newContact] } : b));
                          }
                        }} className="text-[10px] border border-orange-200 bg-orange-50 text-orange-700 px-2 py-1 rounded font-bold">
                          + Contact
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Centers */}
                      <div>
                        <h5 className="text-[10px] font-bold uppercase text-slate-400 mb-2 border-b border-slate-200 pb-1">Authorized Service Centers ({brand.centers.length})</h5>
                        {brand.centers.length === 0 ? <p className="text-xs text-slate-400 italic">No centers listed</p> : (
                          <div className="space-y-2">
                            {brand.centers.map(center => (
                              <div key={center.id} className="bg-white p-2 border border-slate-200 rounded shadow-sm relative group">
                                <p className="text-xs font-bold text-slate-800">{center.name}</p>
                                <p className="text-[10px] text-slate-500">{center.address}</p>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{center.phone || "No Phone"}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Contacts */}
                      <div>
                        <h5 className="text-[10px] font-bold uppercase text-slate-400 mb-2 border-b border-slate-200 pb-1">Distributors & Managers ({brand.contacts.length})</h5>
                        {brand.contacts.length === 0 ? <p className="text-xs text-slate-400 italic">No contacts listed</p> : (
                          <div className="space-y-2">
                            {brand.contacts.map(contact => (
                              <div key={contact.id} className="bg-white p-2 border border-slate-200 rounded shadow-sm relative group">
                                <p className="text-xs font-bold text-slate-800">
                                  {contact.name} <span className="font-normal text-[10px] text-orange-600 bg-orange-50 px-1 rounded ml-1">{contact.role}</span>
                                </p>
                                <p className="text-[10px] text-slate-500 flex justify-between mt-1">
                                  <span>{contact.phone || "No Phone"}</span>
                                  <span>{contact.email || "No Email"}</span>
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 16. CRM CUSTOMER DATABASE ==================== */}
          {currentScreen === "crm_database" && (
            <div id="screen-crm" className="bg-white border border-slate-200 rounded p-4 flex-1 flex flex-col overflow-hidden shadow-sm">
              <div className="border-b border-slate-200 pb-3 mb-4 flex justify-between items-end">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <Users className="w-4.5 h-4.5 text-purple-600" />
                    CRM Customer Database
                  </h3>
                  <p className="text-[10px] text-slate-400">View customer registered assets, warranty lifecycles, and claim history</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 overflow-y-auto pr-2 pb-6">
                {customerProfiles.map(cust => (
                  <div key={cust.id} className="border border-slate-200 rounded overflow-hidden flex flex-col">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 shrink-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-slate-900">{cust.fullName}</h4>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-1.5 leading-tight rounded">{cust.id}</span>
                      </div>
                      <div className="text-[10px] text-slate-600 flex flex-col gap-0.5 font-mono">
                        <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {cust.phone} {cust.altPhone && ` | Alt: ${cust.altPhone}`}</div>
                        <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {cust.email || "No Email"}</div>
                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {cust.address || "Address not provided"}</div>
                      </div>
                    </div>

                    <div className="p-3 flex-1 overflow-y-auto bg-white space-y-3">
                      <div className="text-[10px] font-black text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-0.5">Purchased Assets ({cust.assets.length})</div>
                      {cust.assets.map((asset, i) => (
                        <div key={i} className="border border-indigo-100 rounded bg-indigo-50/30 p-2 shadow-sm rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <h5 className="text-[11px] font-bold text-indigo-900">{asset.brand} {asset.productName}</h5>
                            <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded uppercase font-bold tracking-widest">{asset.model || "Unknown"}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-[9px] mt-2 border-t border-indigo-100 pt-1">
                            <div>
                                <span className="block text-slate-400 uppercase font-bold">Serial</span>
                                <span className="font-mono text-slate-700">{asset.serialNo || "N/A"}</span>
                            </div>
                            <div>
                                <span className="block text-slate-400 uppercase font-bold">Purchase Date</span>
                                <span className="font-mono text-slate-700">{asset.purchaseDate || "Unknown"}</span>
                            </div>
                            <div>
                                <span className="block text-slate-400 uppercase font-bold">Full Warranty</span>
                                <span className="font-medium text-slate-700">{asset.warrantyFull || "None"}</span>
                            </div>
                            <div>
                                <span className="block text-slate-400 uppercase font-bold">Parts Cover</span>
                                <span className="font-medium text-slate-700">{asset.warrantyParts || "None"}</span>
                            </div>
                            <div className="col-span-2 flex justify-between bg-white border border-indigo-100 rounded px-2 py-1 mt-1">
                                <div className="flex gap-1 items-center">
                                    <span className="text-slate-400 uppercase font-bold">Free Services:</span>
                                    <span className="font-mono text-indigo-700 font-bold">{asset.freeServicesUsed}/{asset.freeServicesTotal} used</span>
                                </div>
                                <span className="text-slate-400">|</span>
                                <span className="text-slate-500 font-medium">{asset.freeServicePeriod || "Standard"}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-[10px] font-black text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 mt-4 pb-0.5">Service Claim Records</div>
                      {cust.ticketHistory.length === 0 ? <p className="text-[10px] text-slate-400 italic">No tickets filed.</p> : (
                        <div className="flex flex-wrap gap-1">
                          {cust.ticketHistory.map((tid, i) => (
                            <span key={i} className="text-[9px] bg-slate-100 border border-slate-200 text-slate-600 px-1 py-0.5 rounded font-mono cursor-pointer hover:bg-slate-200" onClick={() => {
                                const ticket = tickets.find(t => t.id === tid);
                                if (ticket) {
                                    // Normally we would just switch context but here we prompt as we are isolated
                                    alert(`History Ticket Request:\n${ticket.id} - ${ticket.brand} ${ticket.productName}\nStatus: ${ticket.status}`);
                                } else {
                                    alert(`Ticket ${tid} no longer active.`);
                                }
                            }}>{tid}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ==================== ACTIVE MODALS (OVERLAYS) ==================== */}

      {/* 1. REGISTER BRAND COMPLAINT MODAL */}
      {activeModal === "register_complaint" && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-3 z-50 animate-fade-in font-sans text-xs">
          <div className="bg-white border text-xs rounded-lg shadow-2xl w-full max-w-sm overflow-hidden border-slate-300">
            <div className="bg-slate-905 bg-slate-900 p-3 text-white flex justify-between items-center text-xs">
              <h3 className="font-bold uppercase tracking-wider">Register brand authority complaint</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="bg-blue-50 text-blue-900 p-2 rounded">
                Ticket: <strong>{selectedTicket.id}</strong> | Brand: <strong>{selectedTicket.brand}</strong>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Brand service ticket reference ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SONY-DEL-9908"
                  value={brandTicketIdInput}
                  onChange={(e) => setBrandTicketIdInput(e.target.value)}
                  className="w-full p-2 border border-slate-300 bg-white rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Depot Components requested</label>
                <input
                  type="text"
                  placeholder="e.g. Main logic board, Brush component"
                  value={partsRequestedInput}
                  onChange={(e) => setPartsRequestedInput(e.target.value)}
                  className="w-full p-2 border border-slate-300 bg-white rounded outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 border hover:bg-slate-50 text-slate-700 rounded uppercase font-bold text-[10px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegisterComplaint}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded uppercase font-bold text-[10px] hover:bg-indigo-700"
                >
                  Confirm registration details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. NEED INVOICE PROOF MODAL */}
      {activeModal === "need_invoice" && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-3 z-50 font-sans text-xs">
          <div className="bg-white border rounded shadow-2xl w-full max-w-sm overflow-hidden text-xs border-slate-300">
            <div className="bg-red-900 p-3 text-white flex justify-between items-center">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Doubtful Invoice documentation lookup
              </span>
              <button onClick={() => setActiveModal(null)} className="text-slate-300 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="text-slate-650 leading-relaxed">
                Ticket <strong>{selectedTicket.id}</strong> requires proof of invoice to claim manufacturer warrant clearance. Currently, no invoice document was scanned.
              </div>

              <div className="border p-2 bg-slate-50 rounded">
                <span className="font-bold text-[10px] block uppercase text-slate-405">Action options:</span>
                <div className="space-y-2 mt-2">
                  <button
                    onClick={() => {
                      setTickets(prev => prev.map(t => t.id === selectedTicketId ? { ...t, invoiceStatus: 'Found' } : t));
                      setActiveModal(null);
                      alert("Invoice proof has been uploaded and resolved successfully.");
                    }}
                    className="w-full p-2 bg-slate-900 text-white font-bold text-xs uppercase rounded text-center hover:bg-slate-800"
                  >
                    1. Upload customer Duplicate invoice
                  </button>
                  <button
                    onClick={() => handleOverrideInvoice(selectedTicket.id)}
                    className="w-full p-2 bg-amber-500 text-slate-950 font-bold text-xs uppercase rounded text-center hover:bg-amber-600"
                  >
                    2. Override Warranty (Manager signature clearance)
                  </button>
                </div>
              </div>

              <div className="text-right pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1 text-[11px] border text-slate-600 rounded"
                >
                  Dismiss warning pane
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SERVICE FOLLOW-UP MODAL */}
      {activeModal === "service_follow_up" && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-3 z-50 font-sans text-xs">
          <div className="bg-white border rounded shadow-2xl w-full max-w-sm overflow-hidden text-xs border-slate-300">
            <div className="bg-slate-900 text-white p-3 flex justify-between items-center text-xs">
              <h3 className="font-bold uppercase tracking-wider">Log customer follow-up interaction</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="bg-slate-50 p-2 border rounded">
                Customer: <strong>{selectedTicket.customerName}</strong> | Call: <strong>{selectedTicket.phone}</strong>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Interaction outcome notes *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Record what the customer responded or agreed..."
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Next SLA follow-up state label</label>
                <select
                  value={followUpStatusValue}
                  onChange={(e) => setFollowUpStatusValue(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded bg-white"
                >
                  <option value="Wait: Approval">Wait: Brand Approval</option>
                  <option value="Wait: Cust">Wait: Customer pickup confirmation</option>
                  <option value="Completed">SLA Met & Completed</option>
                  <option value="Escalated">Escalated to Manager</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Next Action Date</label>
                  <input type="date" value={nextFollowUpDateValue} onChange={(e) => setNextFollowUpDateValue(e.target.value)} className="w-full p-2 border border-slate-300 rounded" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Next Action Time</label>
                  <input type="time" value={nextFollowUpTimeValue} onChange={(e) => setNextFollowUpTimeValue(e.target.value)} className="w-full p-2 border border-slate-300 rounded" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Customer Automations Dispatch</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setNotifyCustomerMethod("None")} className={`flex-1 py-1.5 px-2 border rounded text-center text-xs flex items-center justify-center gap-1 ${notifyCustomerMethod === "None" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 hover:bg-slate-50 border-slate-300"}`}>
                    None
                  </button>
                  <button type="button" onClick={() => setNotifyCustomerMethod("WhatsApp")} className={`flex-1 py-1.5 px-2 border rounded text-center text-[10px] uppercase font-bold flex items-center justify-center gap-1 ${notifyCustomerMethod === "WhatsApp" ? "bg-green-600 text-white border-green-600" : "bg-white text-green-700 hover:bg-green-50 border-green-300"}`}>
                    <Smartphone className="w-3.5 h-3.5" /> WhatsApp
                  </button>
                  <button type="button" onClick={() => setNotifyCustomerMethod("Email")} className={`flex-1 py-1.5 px-2 border rounded text-center text-[10px] uppercase font-bold flex items-center justify-center gap-1 ${notifyCustomerMethod === "Email" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-blue-700 hover:bg-blue-50 border-blue-300"}`}>
                    <Mail className="w-3.5 h-3.5" /> Email
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1 border hover:bg-slate-50 text-slate-700 rounded uppercase font-bold text-[10px]"
                >
                  Close panel
                </button>
                <button
                  onClick={handleUpdateFollowUp}
                  className="px-3 py-1 bg-blue-600 text-white rounded uppercase font-bold text-[10px] hover:bg-blue-700"
                >
                  Log outcome & Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. WAITING ON PART MODAL */}
      {activeModal === "waiting_on_part" && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-3 z-50 font-sans text-xs">
          <div className="bg-white border rounded shadow-2xl w-full max-w-sm overflow-hidden text-xs border-slate-300">
            <div className="bg-slate-900 text-white p-3 flex justify-between items-center text-xs">
              <h3 className="font-bold uppercase tracking-wider">Procurement logs: Spare Part ordered</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-450 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Expected arrival Date (ETA) *</label>
                <input
                  type="date"
                  required
                  value={expectedPartArrivalInput}
                  onChange={(e) => setExpectedPartArrivalInput(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Spare parts Supplier vendor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Prestige Southern Distributor"
                  value={vendorNameInput}
                  onChange={(e) => setVendorNameInput(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 border text-slate-700 rounded uppercase font-bold text-[10px] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetWaitingOnPart}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded uppercase font-bold text-[10px] hover:bg-slate-800"
                >
                  Mark Awaiting procurement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CLOSE TICKET RESOLUTION MODAL */}
      {activeModal === "close_ticket" && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-3 z-50 font-sans text-xs">
          <div className="bg-white border rounded shadow-2xl w-full max-w-sm overflow-hidden text-xs border-slate-300">
            <div className="bg-green-700 text-white p-3 flex justify-between items-center">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Final Service handover closure
              </span>
              <button onClick={() => setActiveModal(null)} className="text-white hover:opacity-80"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Final Resolution details & actions cleared *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Cleared carbon brushes, motor tested under load."
                  value={resolutionDetailsInput}
                  onChange={(e) => setResolutionDetailsInput(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Fees Collected (INR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 450"
                    value={chargeCollectedInput}
                    onChange={(e) => setChargeCollectedInput(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Manufacturer Part Code used</label>
                  <input
                    type="text"
                    placeholder="e.g. C-GEAR-778"
                    value={materialCodeInput}
                    onChange={(e) => setMaterialCodeInput(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 border hover:bg-slate-50 text-slate-700 rounded uppercase font-bold text-[10px]"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCloseTicket}
                  className="px-3 py-1.5 bg-green-600 text-white rounded uppercase font-bold text-[10px] hover:bg-green-700"
                >
                  Deliver Item & Close Token
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TICKET DETAIL DRAWER */}
      {activeModal === "ticket_detail_drawer" && selectedTicket && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setActiveModal(null)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[1px] z-40 transition-opacity"
          />
          
          {/* Right Drawer */}
          <div
            id="drawer-ticket-detail"
            className="fixed top-0 right-0 h-full w-[450px] max-w-[90vw] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right-full duration-300"
          >
            {/* Drawer Header */}
            <div className="bg-[#2563eb] text-white p-4 flex justify-between items-center shrink-0 shadow-sm relative z-10">
              <div>
                <h2 className="text-[10px] uppercase tracking-widest text-blue-200 font-bold mb-0.5">Lavanya Service Ticket</h2>
                <div className="text-xl font-black flex items-center gap-2 leading-none">
                  {selectedTicket.id}
                  {selectedTicket.isRepeat && (
                    <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full tracking-widest uppercase shadow-sm font-bold">
                      Repeat Fault
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-blue-700 rounded-full transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {/* Quick Action Strip */}
            <div className={`bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0 shadow-sm z-0 ${currentUser.role === 'Viewer' ? 'hidden' : ''}`}>
              
              {["Service Manager"].includes(currentUser.role) && (
                <button
                  onClick={() => {
                    setBrandTicketIdInput(selectedTicket.serialNo || "");
                    setActiveModal("register_complaint");
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] uppercase font-bold rounded hover:bg-slate-100 flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-colors"
                >
                  <Network className="w-3.5 h-3.5 text-indigo-500" />
                  Reg Brand
                </button>
              )}

              {["Service Manager", "Service Coordinator", "Helpdesk Agent"].includes(currentUser.role) && (
                <button
                  onClick={() => {
                    setFollowUpStatusValue(selectedTicket.followUpStatus);
                    setActiveModal("service_follow_up");
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] uppercase font-bold rounded hover:bg-slate-100 flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                  Log Call
                </button>
              )}

              {["Service Manager", "Service Coordinator"].includes(currentUser.role) && (
                <button
                  onClick={() => setActiveModal("waiting_on_part")}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] uppercase font-bold rounded hover:bg-slate-100 flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5 text-orange-500" />
                  Wait Part
                </button>
              )}

              {["Service Manager", "Service Coordinator"].includes(currentUser.role) && (
                <button
                  onClick={() => setActiveModal("need_invoice")}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] uppercase font-bold rounded hover:bg-slate-100 flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-colors"
                >
                  <FileImage className="w-3.5 h-3.5 text-red-500" />
                  Invoice
                </button>
              )}

              {(selectedTicket.type === "Store" && !selectedTicket.receiptNumber && ["Service Manager", "Service Coordinator", "Front Desk"].includes(currentUser.role)) && (
                <button
                  onClick={() => setActiveModal("create_receipt")}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] uppercase font-bold rounded hover:bg-slate-100 flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-pink-500" />
                  Receipt
                </button>
              )}

              {["Service Manager", "Service Coordinator"].includes(currentUser.role) && (
                <button
                  onClick={() => setActiveModal("ready_for_pickup")}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] uppercase font-bold rounded hover:bg-green-50 hover:border-green-200 hover:text-green-700 flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  Ready Mark
                </button>
              )}

              {["Service Manager", "Service Coordinator"].includes(currentUser.role) && (
                <button
                  onClick={() => setActiveModal("close_ticket")}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-800 text-white text-[10px] uppercase font-bold rounded hover:bg-slate-900 flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Close
                </button>
              )}
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              
              {/* Status Overview Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Current State</div>
                    <span className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                      selectedTicket.status === "Ready for Pickup" || selectedTicket.status === "Closed"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : selectedTicket.status === "Waiting on Part" || selectedTicket.status === "Waiting on Customer"
                        ? "bg-orange-100 text-orange-700 border-orange-200"
                        : selectedTicket.status === "Brand Registered" || selectedTicket.status === "Registration Pending"
                        ? "bg-purple-100 text-purple-700 border-purple-200"
                        : selectedTicket.status === "New" || selectedTicket.status === "In Progress"
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Follow-Up SLA</div>
                    <div className={`text-[13px] font-bold ${selectedTicket.followUpDate === "Overdue" ? "text-red-600" : "text-slate-800"}`}>
                      {selectedTicket.followUpDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Client Details</h3>
                  <button 
                    onClick={() => {
                      if (customerProfiles[selectedTicket.phone]) {
                        setSelectedCustomerPhone(selectedTicket.phone);
                        setActiveModal(null);
                        setCurrentScreen("crm_database");
                      } else {
                        alert("No CRM profile loaded.");
                      }
                    }}
                    className="text-[10px] font-bold text-[#2563eb] hover:underline"
                  >
                    View CRM &rarr;
                  </button>
                </div>
                <div className="p-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Primary Contact</div>
                    <div className="font-bold text-slate-800 text-[13px]">{selectedTicket.customerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{selectedTicket.phone}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Alt Contact</div>
                    <div className="font-medium text-slate-700 text-[13px]">{selectedTicket.altPhone || "Not provided"}</div>
                  </div>
                </div>
              </div>

              {/* Product Card */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
                  <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5" /> Product Information</h3>
                </div>
                <div className="p-3 grid grid-cols-2 gap-y-4 gap-x-3 text-sm">
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Brand / Model</div>
                    <div className="font-bold text-slate-800 text-[13px]">{selectedTicket.brand}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{selectedTicket.model || "Unknown Model"}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Product Category</div>
                    <div className="font-medium text-slate-800 text-[13px]">{selectedTicket.productName}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Warranty</div>
                    <div className={`font-bold text-[12px] uppercase ${selectedTicket.warrantyStatus === "Out of Warranty" ? "text-orange-600" : "text-green-600"}`}>
                      {selectedTicket.warrantyStatus}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Serial No.</div>
                    <div className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 inline-block px-1.5 py-0.5 rounded border border-slate-200 mt-0.5">{selectedTicket.serialNo || "NO_SERIAL"}</div>
                  </div>
                </div>
              </div>

              {/* Issue Description */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
                  <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Fault Description</h3>
                </div>
                <div className="p-3">
                  <p className="text-[13px] leading-relaxed font-medium text-slate-700 bg-red-50/50 p-3 border border-red-100 rounded">
                    {selectedTicket.issueDesc || selectedTicket.problemDescription || "No advanced description provided."}
                  </p>
                </div>
              </div>
              
              {/* Timeline (Mini version) */}
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 mb-3">Service Timeline Overview</h4>
                <div className="relative border-l-2 border-slate-200 pl-4 space-y-4 font-sans text-xs">
                  <div className="relative">
                    <span className="w-2.5 h-2.5 bg-orange-500 rounded-full absolute -left-[19.5px] top-1"></span>
                    <div className="font-bold text-slate-800 text-[12px]">Job Raised</div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">Agent: {selectedTicket.assignedAgent}</div>
                  </div>
                  {selectedTicket.status !== "New" && (
                    <div className="relative">
                      <span className="w-2.5 h-2.5 bg-[#2563eb] rounded-full absolute -left-[19.5px] top-1"></span>
                      <div className="font-bold text-slate-800 text-[12px]">Status Progression</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Current: {selectedTicket.status}</div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </>
      )}

      {/* FLOATING SLA WARNING ALERTS WIDGET (Interactable) */}
      <div id="floating-sla-reminders" className="fixed bottom-10 right-4 w-60 bg-white border border-slate-350 rounded shadow-2xl flex flex-col opacity-90 hover:opacity-100 transition-all z-40 pointer-events-auto">
        <div className="bg-slate-800 text-white px-2.5 py-1 text-[9px] font-black tracking-widest uppercase flex justify-between rounded-t">
          <span>Active SLA watch-list</span>
          <span className="bg-red-500 text-white px-1 rounded-full font-sans font-black text-[9px]">3 AT RISK</span>
        </div>
        <div className="p-2 text-[10px] flex flex-col gap-1.5 font-mono">
          <div
            className="flex justify-between items-center border-b border-slate-100 pb-1 cursor-pointer hover:bg-slate-50"
            onClick={() => { setSelectedTicketId("SRV-1011"); setActiveModal("ticket_detail_drawer"); }}
          >
            <span className="font-bold text-blue-600 underline">SRV-1011</span>
            <span className="text-red-500 font-bold">4h Breach (Hair Dryer)</span>
          </div>
          <div
            className="flex justify-between items-center border-b border-slate-100 pb-1 cursor-pointer hover:bg-slate-50"
            onClick={() => { setSelectedTicketId("SRV-1025"); setActiveModal("ticket_detail_drawer"); }}
          >
            <span className="font-bold text-blue-600 underline">SRV-1025</span>
            <span className="text-orange-500 font-bold">52m Left (Coffee Maker)</span>
          </div>
          <div
            className="flex justify-between items-center cursor-pointer hover:bg-slate-50"
            onClick={() => { setSelectedTicketId("SRV-0988"); setActiveModal("ticket_detail_drawer"); }}
          >
            <span className="font-bold text-slate-450 underline">SRV-0988</span>
            <span className="text-slate-450 italic">Awaiting Manager authorization</span>
          </div>
        </div>
      </div>

      {/* System Status footer layout from High-density model */}
      <footer id="system-status-footer" className="h-6 bg-slate-200 border-t border-slate-300 px-3 flex items-center justify-between text-[9px] text-slate-500 shrink-0 uppercase font-black tracking-wider font-sans">
        <div id="footer-data-sync" className="flex gap-4">
          <span>Terminal Status: <strong className="text-slate-800 font-black">Authorized Active</strong></span>
          <span className="hidden sm:inline">Active database: <strong className="text-slate-800">EMART_LIVE_MAIN_DB</strong></span>
          <span className="text-green-750 font-bold hidden md:inline">Synchronizer Latency: 4ms</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Sync Stable Connection secure
          </span>
          <span className="hidden sm:inline">Enterprise POS release v2.4.0</span>
        </div>
      </footer>

    </div>
  );
}
