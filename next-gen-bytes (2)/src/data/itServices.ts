import { ServiceItem, Industry, WhyChooseReason, AMCFeature, ProjectExample, ClientReview } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'server-setup',
    title: 'Windows Server Setup',
    subtitle: 'Server Deployment & Active Directory',
    description: 'Establish a secure, central system to manage users, files, and resources. Ideal for growing businesses needing local server security and domain control.',
    features: [
      'Windows Server installation',
      'Active Directory configuration',
      'User management',
      'File sharing',
      'Remote access',
      'Server maintenance',
      'Domain setup',
      'Backup configuration'
    ],
    icon: 'Server'
  },
  {
    id: 'it-consultation',
    title: 'IT Infrastructure Consultation',
    subtitle: 'Technology Strategy & Security Planning',
    description: 'Get expert strategic advice before purchasing or upgrading hardware. We audit, review, and map out your digital infrastructure roadmap.',
    features: [
      'Office IT planning',
      'Network design',
      'System upgrades',
      'Hardware recommendations',
      'Security planning',
      'IT troubleshooting',
      'Technology audits'
    ],
    icon: 'LayoutGrid'
  },
  {
    id: 'networking',
    title: 'Internet Structure Design & Networking',
    subtitle: 'Structured Cabling, WAN/LAN & Wi-Fi',
    description: 'Ensure rock-solid internet speed and secure local connectivity. We arrange robust structured cabling, rack management, and unified Wi-Fi.',
    features: [
      'LAN setup',
      'WAN setup',
      'Wi-Fi coverage planning',
      'Router configuration',
      'Switch installation',
      'Structured cabling',
      'Rack setup',
      'Patch panel management',
      'Fiber connectivity planning'
    ],
    icon: 'Network'
  },
  {
    id: 'supply',
    title: 'Computer & Equipment Supply',
    subtitle: 'Hardware, Accessories & Procurement',
    description: 'Procure reliable desktops, laptops, routers, and essential office hardware from leading brands. Includes secure configuration and installation.',
    features: [
      'Desktop computers',
      'Laptops',
      'Printers',
      'UPS',
      'Routers',
      'Switches',
      'Hard drives',
      'SSDs',
      'Network accessories',
      'Office IT equipment'
    ],
    icon: 'Cpu'
  },
  {
    id: 'cctv',
    title: 'CCTV Installation',
    subtitle: 'IP, NVR & Remote CCTV Surveillance',
    description: 'Keep your properties monitored 24/7. We mount high-definition camera arrays and set up reliable local recorders with remote viewing on mobile apps.',
    features: [
      'CCTV camera installation',
      'IP camera setup',
      'DVR installation',
      'NVR installation',
      'Remote mobile viewing',
      'Camera maintenance',
      'Recording setup',
      'Surveillance upgrades',
      'Security monitoring setup'
    ],
    icon: 'Eye'
  },
  {
    id: 'backup-security',
    title: 'Data Backup & Security Solutions',
    subtitle: 'NAS storage, Antivirus & Threat Protection',
    description: 'Secure sensitive corporate files against hardware failure or ransomware threat. We deploy backup storage systems and enforce strict access levels.',
    features: [
      'Automatic backup setup',
      'NAS storage',
      'Cloud backup',
      'Data recovery support',
      'System security',
      'Access control',
      'Antivirus deployment',
      'Business data protection'
    ],
    icon: 'ShieldAlert'
  }
];

export const INDUSTRIES_DATA: Industry[] = [
  { name: 'Offices', description: 'Domain controls, structured cabling, Wi-Fi coverage, and secure file sharing.', icon: 'Building2' },
  { name: 'Shops & Retail', description: 'Reliable security CCTV cameras, checkout computer terminals, and customer Wi-Fi.', icon: 'ShoppingBag' },
  { name: 'Builders & Construction', description: 'Temporary dual-WAN internet, mobile DVR security, and blueprint printing equipment.', icon: 'Hammer' },
  { name: 'Schools', description: 'Network protection firewall setup, central learning servers, and computer labs setup.', icon: 'GraduationCap' },
  { name: 'Warehouses', description: 'Long-range IP camera surveillance, heavy-duty network brackets, and handheld scanners Wi-Fi.', icon: 'Database' },
  { name: 'Factories', description: 'Rugged structured cabling, extreme environments CCTV, and central command terminal nodes.', icon: 'Factory' },
  { name: 'Clinics', description: 'Hyper-secure healthcare server structure, silent backup drives, and visitor check-in setup.', icon: 'Heater' }, // let's map healer or stethoscope as stethoscope isn't standard, we'll use heart-pulse or activity, let's map icon strings carefully.
  { name: 'Homes', description: 'Intelligent security system, unified household Wi-Fi routing, and private study hardware setup.', icon: 'Home' },
  { name: 'Small Businesses', description: 'Professional file server, clean local storage NAS, and scalable cost-effective IT.', icon: 'TrendingUp' },
  { name: 'Corporate Clients', description: 'Active Directory forest, redundant failover backup structures, and network rack setup.', icon: 'Briefcase' }
];

export const WHY_CHOOSE_DATA: WhyChooseReason[] = [
  { title: 'Experienced IT Support Team', description: 'Our certified engineers bring years of experience handling server configurations, CCTV integration, and structured copper/fiber cabling.' },
  { title: 'Fast Response Times', description: 'Our team is prompt to assist you in resolving critical network failures, camera offline issues, or domain outages rapidly.' },
  { title: 'Affordable & Transparent Pricing', description: 'Professional enterprise-quality technology solutions tailored to scale with your budget. No hidden fees or unexpected costs.' },
  { title: 'Professional Installation', description: 'Neat racks, clean cable management, precise camera layouts, and logical server architectures are our golden standards.' },
  { title: 'Reliable After-Sales Support', description: 'We don’t just install and leave. We maintain open communication and provide quick guides and remote checking to help you succeed.' },
  { title: 'Customized Solutions', description: 'We analyze your layout first. Whether a clinic, a warehouse, or a residential villa, we optimize the network and camera angles just for you.' },
  { title: 'Security-Focused Services', description: 'From firewall configuration to encrypted network routers and camera storage passwords—your security is built-in from the ground up.' },
  { title: 'Long-Term Maintenance Support', description: 'We propose simple ongoing maintenance routines and preventative check-ins so your hardware works without disruption.' }
];

export const AMC_FEATURES: AMCFeature[] = [
  { title: 'Monthly IT Support Visits', description: 'Regular scheduled onsite check-ups to review networks, clean up temp storage, and run routine system hardware checks.', icon: 'CalendarDays' },
  { title: 'Preventive Maintenance', description: 'Clean physical hardware parts, evaluate UPS power outputs, check storage logs, and catch system decay before it triggers sudden downtime.', icon: 'Wrench' },
  { title: 'Network Troubleshooting', description: 'Fix IP conflicts, optimize Wi-Fi signal drop-offs, inspect cabling faults, and clear slow routing issues on switches.', icon: 'Network' },
  { title: 'CCTV Surveillance Audits', description: 'Verify uninterrupted continuous records storage, clean dust off camera lenses, calibrate motion alerts, and resolve remote app stream lags.', icon: 'Eye' },
  { title: 'Windows Server Monitoring', description: 'Examine disk partition space, Active Directory synchronization logs, core user logins, and verify status indicators.', icon: 'Server' },
  { title: 'Hardware Health Checking', description: 'Identify bad hard drive sectors on servers, check processor temperature spikes, analyze UPS battery capacity, and test router switches.', icon: 'Activity' },
  { title: 'Critical Software Updates', description: 'Install secure OS patches, update antivirus definitions on all client ports, and cycle equipment firmware security.', icon: 'RefreshCw' },
  { title: 'Priority Emergency Support', description: 'In the event of a total network crash or major camera failure, AMC clients receive immediate on-site priority response.', icon: 'AlertTriangle' }
];

export const PORTFOLIO_PROJECTS: ProjectExample[] = [
  {
    id: 'proj-1',
    title: 'Gigabit Network & Structured Cabling for Corporate Office',
    category: 'Networking',
    client: 'Apex Builders Headquarters',
    location: 'Karachi, PK',
    badge: 'Completed',
    description: 'Designed and implemented full-scale structured cabling across three office floors, mounting patch panels, central server rack, and seamless Wi-Fi roaming nodes.',
    scope: ['80+ Cat6 physical cable drops', 'Central 22U network rack with patch panel alignment', 'Managed 24-Port gigabit switches configuration', 'Enterprise Wi-Fi 6 access points with virtual controller']
  },
  {
    id: 'proj-2',
    title: 'Unified IP CCTV Camera Deployment for Logistics Warehouse',
    category: 'CCTV Installation',
    client: 'TransLogs Warehousing Ltd',
    location: 'Karachi, PK',
    badge: 'Completed',
    description: 'Installed 32 ultra-HD security cameras targeting internal inventory aisles, packaging zones, and high-security loading docks with reliable local NVR storage.',
    scope: ['32x Outdoor/Indoor IP CCTV Sony sensor units', '32-Channel NVR recorder setup with 20TB local storage', 'Dynamic optical fiber cabling to bridge span sectors', 'Remote surveillance setup on client mobile devices']
  },
  {
    id: 'proj-3',
    title: 'Windows Domain Server & Central File Sharing Active Directory',
    category: 'Windows Server Setup',
    client: 'Beacon Crest International School',
    location: 'Islamabad, PK',
    badge: 'Completed',
    description: 'Installed Windows Server on a physical machine, configured secure domain services, user profiles, shared network drives for teacher curriculum, and automated offline data backup.',
    scope: ['Windows Server Active Directory Domain Services (AD DS)', 'Role-based network user configuration for 50+ computers', 'Unified private file server directory with access rights', 'Dual daily local NAS schedule backup with health mail alert']
  },
  {
    id: 'proj-4',
    title: 'AMC Support & Security Upgrades for Multi-branch Clinic',
    category: 'AMC Support',
    client: 'CareFirst Premium Clinics Group',
    location: 'Karachi, PK',
    badge: 'Maintenance',
    description: 'Ongoing technical support contract covering network firewalls, remote secure server access, immediate router troubleshooting, and CCTV upkeep.',
    scope: ['Sub-second failover standby dual WAN internet config', 'Ongoing bi-monthly preventive hardware diagnostic checkups', 'Prompt onsite network repair standby service SLA within 2 hours', 'Consistent security updates and automated antivirus reports']
  }
];

export const TESTIMONIALS_DATA: ClientReview[] = [
  {
    id: 't-1',
    name: 'Muhammad Shakil',
    company: 'NextGen Retail Outlets',
    industry: 'Shops & Retail',
    review: 'Our shop CCTV system went down due to a power surge. Next Gen Bytes came on short notice, replaced the DVR, and reconfigured remote app viewing. Amazing after-sales support!',
    rating: 5
  },
  {
    id: 't-2',
    name: 'Engr. Haris Ahmed',
    company: 'Prime Builders & Construction',
    industry: 'Builders & Construction',
    review: 'Cabling an active building project is tricky. They designed a reliable structured rack setup that withstands dust. Clean routing, fast response, very professional.',
    rating: 5
  },
  {
    id: 't-3',
    name: 'Zahra Fatima',
    company: 'Horizon Co-working Hub',
    industry: 'Offices',
    review: 'We had constant Wi-Fi disconnects with 100+ visitors. Next Gen Bytes installed a smart router load balancer and expanded our access points. Our internet is solid now!',
    rating: 5
  }
];
