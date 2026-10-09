/**
 * OurCity - Master Data Store
 * Comprehensive dataset covering Delhi, Mumbai, Kolkata, Bengaluru
 * 4 Core Project Types per city: Tunnel, Bridge, Park, Road
 * Includes Tender Bids, Contractor History, Independent Media Reports, 
 * AI Budget Analysis & YouTube-Style Citizen Comments.
 */

const CIVIC_DATA = {
  cities: {
    mumbai: {
      id: "mumbai",
      name: "Mumbai",
      state: "Maharashtra",
      badge: "Financial Capital",
      tagline: "Coastal Metropolis & Urban Infrastructure Hub",
      coordinates: { x: 230, y: 460, scale: 3.8, cx: 230, cy: 460 },
      geo: { lat: 19.0760, lon: 72.8777 },
      stats: {
        totalProjects: 38,
        activeBudget: "₹74,250 Cr",
        transparencyScore: "86/100",
        citizenAuditors: "14,820"
      },
      projects: [
        {
          id: "MUM-TUN-01",
          type: "tunnel",
          typeLabel: "Undersea Tunnel",
          icon: "",
          title: "Mumbai Coastal Road Subsea & Malabar Hill Twin Tunnels",
          sanctionCode: "MCGM/ENG/2023-CR-904",
          status: "healthy",
          statusLabel: "Healthy · On Track",
          budget: {
            allocated: 12721, // in Crores
            spent: 10431,
            projectedFinal: 12850,
            overrunPct: 1.0,
            cpi: 0.99,
            spi: 0.98,
            progress: 86,
            plannedProgress: 88,
            breakdown: [
              { item: "Subsea Tunnel Boring & Segments", cost: 5340, pct: 42 },
              { item: "Ventilation & Saccardo Nozzles", cost: 1780, pct: 14 },
              { item: "Emergency Cross-Passages & Safety", cost: 1526, pct: 12 },
              { item: "Electrical, SCADA & Traffic Tech", cost: 2035, pct: 16 },
              { item: "Seawall Armour & Interchanges", cost: 1272, pct: 10 },
              { item: "Contingency & Supervision", cost: 768, pct: 6 }
            ]
          },
          contractor: {
            id: "LT-CIVIL",
            name: "Larsen & Toubro Heavy Civil Infrastructure",
            experienceYears: 42,
            completedGovtProjects: 148,
            onTimeMilestoneRate: "89%",
            rating: 4.7,
            leadEngineer: "Er. K. Venkataraman (FIE)",
            headquarters: "Mumbai, India",
            activeProjectsAcrossIndia: 14,
            integrityScore: "94/100",
            pastProjects: [
              { name: "Ahmedabad Metro Underground Phase 1", year: "2021", status: "Completed on time" },
              { name: "Delhi Metro Airport Express Tunnel Line", year: "2019", status: "Completed with +2% budget variance" },
              { name: "Chenab Bridge Substructure Package", year: "2022", status: "Completed with distinction" }
            ]
          },
          overview: "India's first subsea highway tunnel stretching 2.07 km between Marine Drive and Priyadarshini Park, descending up to 20m under the Arabian Sea bed. Featuring 12.19m diameter slurry tunnel boring machines and an automated fire suppression network.",
          simulation: {
            image: "assets/tunnel_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Photorealistic AI simulation of operational undersea twin-tube transit corridor with automated SCADA ventilation & LED guide lighting.",
            metrics: {
              commuteCut: "45 mins saved (Marine Drive ➔ Worli)",
              carbonReduction: "34,000 tonnes CO₂/yr",
              designSpeed: "80 km/h",
              longevity: "100+ years design life"
            }
          },
          tender: {
            tenderId: "MUM-TND-2022-094",
            issueDate: "14 Feb 2022",
            bidsOpened: "18 May 2022",
            govSanctionCost: 12500,
            finalAwardedCost: 12721,
            selectionMethod: "QCBS (Quality & Cost Based Selection)",
            bidders: [
              { company: "Larsen & Toubro Ltd", bidAmount: 12721, techScore: 96.5, status: "Selected (L1 Qualified)", variance: "+1.7% vs Govt Estimate" },
              { company: "Tata Projects - Daewoo JV", bidAmount: 13180, techScore: 92.0, status: "Outbid (L2)", variance: "+5.4%" },
              { company: "Afcons Infrastructure", bidAmount: 13650, techScore: 90.5, status: "Outbid (L3)", variance: "+9.2%" },
              { company: "HCC - Coastal Consortium", bidAmount: 14200, techScore: 84.0, status: "Technically Qualified (L4)", variance: "+13.6%" }
            ]
          },
          newsReports: [
            {
              outlet: "NDTV India",
              date: "12 Aug 2025",
              headline: "Mumbai Coastal Road Undersea Tunnel Passes Rigorous Monsoonal Seepage Tests with Zero Leakage",
              author: "Sanjay Singh (Infra Bureau)",
              excerpt: "Geotechnical sensors and ultrasonic flaw detectors installed by IIT Bombay confirmed pristine structural integrity of the bored ring liners beneath the Arabian seabed.",
              sentiment: "positive",
              url: "#"
            },
            {
              outlet: "The Hindu Special Investigation",
              date: "29 Nov 2025",
              headline: "Independent CAG Audit Reviews Material Procurement Billing for Marine Drive Reclamation Section",
              author: "Nisha Prabhu",
              excerpt: "State auditors praised transparent digital invoice tracking while recommending quarterly calibration of automated slurry pressure monitors.",
              sentiment: "neutral",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 92,
            verdict: "High Evidence Match — Official expenditure faithfully mirrors certified physical milestones and wholesale material benchmarks.",
            breakdown: {
              materialCostAlignment: 94,
              tenderCompetitiveness: 91,
              progressVsSpendMatch: 95,
              mediaSentimentScore: 88
            },
            keyNotes: [
              "Steel and high-density precast concrete procurement invoices match Mumbai regional wholesale indices within 1.4% variance.",
              "Independent satellite ground-penetrating radar verification correlates with 86% physical completion.",
              "Zero duplicate invoice signatures identified in SHA-256 ledger."
            ]
          },
          comments: [
            {
              id: "c1",
              user: "Aditya Deshmukh",
              role: "Local Commuter · Marine Drive",
              timeAgo: "2 days ago",
              likes: 42,
              dislikes: 1,
              text: "Drove through the opened pilot sector yesterday. The ventilation is whisper quiet and travel time dropped from 45 mins to barely 8 mins. Incredible work on the lighting!",
              replies: [
                {
                  user: "OurCity Verified Engineer",
                  timeAgo: "1 day ago",
                  text: "The Saccardo nozzle ventilation system keeps air quality under 25 PPM CO even during rush hour congestion."
                }
              ]
            },
            {
              id: "c2",
              user: "Pooja Varma",
              role: "Structural Architect",
              timeAgo: "5 days ago",
              likes: 29,
              dislikes: 0,
              text: "Checked the tender transparency dossier: Glad to see L&T was selected on 96.5 technical score. The acoustic soundproofing in the tunnel portal shows exceptional attention to detail.",
              replies: []
            }
          ]
        },
        {
          id: "MUM-BRG-02",
          type: "bridge",
          typeLabel: "Signature Sea Bridge",
          icon: "",
          title: "Atal Setu (MTHL) Coastal Connector & Cable-Stayed Elevated Deck",
          sanctionCode: "MMRDA/BRG/2023-MTHL-112",
          status: "healthy",
          statusLabel: "Healthy · On Track",
          budget: {
            allocated: 17840,
            spent: 16948,
            projectedFinal: 17990,
            overrunPct: 0.8,
            cpi: 0.98,
            spi: 0.99,
            progress: 94,
            plannedProgress: 95,
            breakdown: [
              { item: "Orthotropic Steel Deck (OSD) Spans", cost: 7490, pct: 42 },
              { item: "Deep Marine Bored Piling & Foundations", cost: 3925, pct: 22 },
              { item: "Stay Cables & High-Tensile Tower Steel", cost: 2676, pct: 15 },
              { item: "Noise Attenuation & Bird Sanctuary Barriers", cost: 1427, pct: 8 },
              { item: "Intelligent Transport System (ITS) & Toll Gates", cost: 1605, pct: 9 },
              { item: "Quality Assurance & Marine Surveillance", cost: 717, pct: 4 }
            ]
          },
          contractor: {
            id: "DAEWOO-TATA",
            name: "Daewoo E&C - Tata Projects Consortium",
            experienceYears: 38,
            completedGovtProjects: 96,
            onTimeMilestoneRate: "92%",
            rating: 4.8,
            leadEngineer: "Dr. Sang-Min Cho / Er. Harish Joshi",
            headquarters: "Seoul / Mumbai",
            activeProjectsAcrossIndia: 9,
            integrityScore: "96/100",
            pastProjects: [
              { name: "Durgam Cheruvu Cable-Stayed Bridge", year: "2020", status: "Delivered on schedule" },
              { name: "Dedicated Freight Corridor Package 301", year: "2022", status: "Zero safety incidents" }
            ]
          },
          overview: "A 21.8 km 6-lane sea viaduct connecting Sewri in South Mumbai to Chirle in Navi Mumbai across Thane Creek. Features pioneering Orthotropic Steel Decks (OSD) designed to protect migrating flamingo feeding grounds.",
          simulation: {
            image: "assets/bridge_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Futuristic night simulation of illuminated cable-stayed towers with dynamic LED lighting and intelligent bird-friendly acoustic baffles.",
            metrics: {
              commuteCut: "90 mins saved (Island City ➔ Navi Mumbai Airport)",
              vehicleCapacity: "68,000 passenger cars daily",
              designSpeed: "100 km/h",
              marineLifeIndex: "Protected flamingo sanctuary zone"
            }
          },
          tender: {
            tenderId: "MMRDA-TND-MTHL-PACKAGE-02",
            issueDate: "20 Jan 2021",
            bidsOpened: "15 Jul 2021",
            govSanctionCost: 17500,
            finalAwardedCost: 17840,
            selectionMethod: "International Competitive Bidding (ICB)",
            bidders: [
              { company: "Daewoo E&C - Tata Projects JV", bidAmount: 17840, techScore: 97.2, status: "Selected (L1)", variance: "+1.9%" },
              { company: "IHI Corporation - L&T JV", bidAmount: 18450, techScore: 96.0, status: "Outbid (L2)", variance: "+5.4%" },
              { company: "Strabag - Afcons Consortium", bidAmount: 19100, techScore: 89.4, status: "Outbid (L3)", variance: "+9.1%" }
            ]
          },
          newsReports: [
            {
              outlet: "The Indian Express",
              date: "14 Jan 2026",
              headline: "MMRDA Atal Setu Achieves 94% Completion with Revolutionary Noise Dampeners for Flamingo Sanctuary",
              author: "Chirag Mehta",
              excerpt: "Environmental groups gave written concurrence as acoustic attenuation barriers reduced high-speed vehicle roar to sub-55 decibels along the mudflats.",
              sentiment: "positive",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 91,
            verdict: "High Alignment — Financial disbursements strictly synchronise with satellite radar imagery and certified marine steel imports.",
            breakdown: {
              materialCostAlignment: 93,
              tenderCompetitiveness: 94,
              progressVsSpendMatch: 92,
              mediaSentimentScore: 86
            },
            keyNotes: [
              "OSD steel fabricated in Japan/Vietnam imported with certified bill-of-lading hashes.",
              "Independent acoustic noise sensors confirm compliance with National Green Tribunal orders."
            ]
          },
          comments: [
            {
              id: "c3",
              user: "Naveen Shirodkar",
              role: "Navi Mumbai Resident",
              timeAgo: "3 days ago",
              likes: 18,
              dislikes: 0,
              text: "This bridge is a lifeline. Previously took 2 hours through Mankhurd bottlenecks; now reachable in 20 minutes flat. Best infrastructure rupee spent.",
              replies: []
            }
          ]
        },
        {
          id: "MUM-PRK-03",
          type: "park",
          typeLabel: "Urban Wetland Eco-Park",
          icon: "",
          title: "Bandra-Kurla Complex Coastal Wetland & Mithi River Eco-Reserve",
          sanctionCode: "MCGM/PARK/2023-BKC-302",
          status: "critical",
          statusLabel: "Critical Discrepancy · Budget Under Review",
          budget: {
            allocated: 1850,
            spent: 1425,
            projectedFinal: 2490,
            overrunPct: 34.6,
            cpi: 0.55,
            spi: 0.52,
            progress: 42,
            plannedProgress: 82,
            breakdown: [
              { item: "Mangrove Dredging & Desilting", cost: 680, pct: 37 },
              { item: "Solar Walkways & Glass Promenade", cost: 420, pct: 23 },
              { item: "Native Flora Restoration & Nurseries", cost: 240, pct: 13 },
              { item: "Rainwater Filtration Weirs", cost: 290, pct: 16 },
              { item: "Administrative Kiosks & Lighting", cost: 220, pct: 11 }
            ]
          },
          contractor: {
            id: "GREENLEAF-INFRA",
            name: "GreenLeaf Infra & Urban Developers Pvt Ltd",
            experienceYears: 8,
            completedGovtProjects: 14,
            onTimeMilestoneRate: "46%",
            rating: 2.3,
            leadEngineer: "R. P. Saxena",
            headquarters: "Thane, India",
            activeProjectsAcrossIndia: 4,
            integrityScore: "42/100",
            pastProjects: [
              { name: "Thane Creek Promenade Upgrade", year: "2022", status: "Delayed by 180 days; liquidated damages levied" },
              { name: "Powai Lake Desilting Phase 2", year: "2023", status: "Incomplete; pending municipal inquiry" }
            ]
          },
          overview: "A 48-hectare urban ecological sponge park along the Mithi River designed to absorb monsoonal deluge, foster bird biodiversity, and provide open walking boardwalks for BKC office workers.",
          simulation: {
            image: "assets/park_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Architectural goal: Restored riparian wetlands, zero-emission solar amphitheatre, and illuminated timber walking paths.",
            metrics: {
              spongeCapacity: "4.2 Million cubic meters floodwater absorption",
              openGreenArea: "118 Acres restored",
              nativeSpecies: "42 Bird and 28 Mangrove varieties",
              auditStatus: " 77% funds spent for only 42% physical progress"
            }
          },
          tender: {
            tenderId: "MCGM-TND-BKC-PARK-08",
            issueDate: "10 Mar 2023",
            bidsOpened: "04 May 2023",
            govSanctionCost: 1400,
            finalAwardedCost: 1850,
            selectionMethod: "Single Lowest Tenderer (Re-tendered once)",
            bidders: [
              { company: "GreenLeaf Infra Pvt Ltd", bidAmount: 1850, techScore: 71.0, status: "Selected (L1 Single Bidder)", variance: "+32.1% above estimate" },
              { company: "Evergreen Civilworks", bidAmount: 1980, techScore: 68.0, status: "Disqualified (Failed Experience Matrix)", variance: "+41.4%" },
              { company: "Nirmaan Urban Eco", bidAmount: 1720, techScore: 88.0, status: "Disqualified (Technical Envelope Typo)", variance: "+22.8%" }
            ]
          },
          newsReports: [
            {
              outlet: "Times of India Investigative Cell",
              date: "18 Jan 2026",
              headline: "BKC Eco-Park Budget Balloons by ₹640 Cr as Desilting Invoices Raise Citizen Hackles",
              author: "Rohan Kamath",
              excerpt: "Satellite photogrammetry by environmental watchdogs reveals less than 40% of the Mithi River bank has been dredged despite bills showing 80% expenditure cleared by municipal engineers.",
              sentiment: "negative",
              url: "#"
            },
            {
              outlet: "The Hindu Special Investigation",
              date: "04 Feb 2026",
              headline: "Citizen RTI Exposes Duplicate Heavy Equipment Rental Slips in BKC Wetland Contract",
              author: "Meenakshi Sundaram",
              excerpt: "OurCity independent auditors identified multiple identical JCB excavator rental serials billed concurrently across two separate municipal wards by GreenLeaf Infra.",
              sentiment: "negative",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 41,
            verdict: "High Risk Discrepancy — Financial disbursements severely outpace documented physical progress with duplicate equipment invoices.",
            breakdown: {
              materialCostAlignment: 38,
              tenderCompetitiveness: 44,
              progressVsSpendMatch: 35,
              mediaSentimentScore: 47
            },
            keyNotes: [
              "Spend-to-Progress ratio is 1.83 (Warning threshold is > 1.25).",
              "Single-bid tender awarded at +32% above government schedule of rates (SoR).",
              "Independent drone scans show zero work done on Phase 3 retention weirs."
            ]
          },
          comments: [
            {
              id: "c4",
              user: "Farhan Merchant",
              role: "Environmental Activist · Mumbai March",
              timeAgo: "1 day ago",
              likes: 84,
              dislikes: 1,
              text: "We visited the BKC site on Sunday. There is practically no work happening! Only rusty barricades and stagnant dirty water. How has 77% of ₹1,850 Crores been disbursed? Demanding immediate ACB inquiry!",
              replies: [
                {
                  user: "Ananya Deshmukh",
                  timeAgo: "18 hours ago",
                  text: "Upvoted! We filed report #REP-MUM-884 through OurCity. Let's make sure the Municipal Commissioner answers."
                }
              ]
            },
            {
              id: "c5",
              user: "Kavita Rao",
              role: "Taxpayer & Urban Planner",
              timeAgo: "3 days ago",
              likes: 47,
              dislikes: 0,
              text: "Look at the tender bidder list: Nirmaan had an 88 technical score and lower bid, but was disqualified for a clerical reason. Classic procurement red flag.",
              replies: []
            }
          ]
        },
        {
          id: "MUM-ROD-04",
          type: "road",
          typeLabel: "Smart Urban Expressway",
          icon: "️",
          title: "Eastern Freeway Ghatkopar-Thane 8-Lane Elevated Arterial Corridor",
          sanctionCode: "MMRDA/ROD/2023-EF-501",
          status: "watch",
          statusLabel: "Watch · Milestone Slip Noted",
          budget: {
            allocated: 3620,
            spent: 2896,
            projectedFinal: 3890,
            overrunPct: 7.5,
            cpi: 0.88,
            spi: 0.84,
            progress: 68,
            plannedProgress: 79,
            breakdown: [
              { item: "Elevated Pier Caps & Girders", cost: 1629, pct: 45 },
              { item: "Smart Mastic Asphalt Paving", cost: 724, pct: 20 },
              { item: "Utility Relocation & Storm Drains", cost: 470, pct: 13 },
              { item: "Noise Barriers & LED High Masts", cost: 434, pct: 12 },
              { item: "AI Traffic Monitoring Sensors", cost: 363, pct: 10 }
            ]
          },
          contractor: {
            id: "APEX-INFRA",
            name: "Apex Infra Projects Ltd",
            experienceYears: 19,
            completedGovtProjects: 52,
            onTimeMilestoneRate: "69%",
            rating: 3.5,
            leadEngineer: "Er. Bhaskar Naik",
            headquarters: "Navi Mumbai, India",
            activeProjectsAcrossIndia: 6,
            integrityScore: "68/100",
            pastProjects: [
              { name: "Airoli-Katai Naka Freeway Segment 1", year: "2022", status: "Delayed by 75 days due to pipeline clearance" },
              { name: "Sion Panvel Expressway Resurfacing", year: "2021", status: "Completed with standard quality audit" }
            ]
          },
          overview: "An 8-lane grade-separated arterial expressway linking the existing Eastern Freeway directly to Thane and Navi Mumbai, incorporating rubberised noise baffles and smart induction loop traffic sensors.",
          simulation: {
            image: "assets/road_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Completed simulation of smooth noise-attenuated expressway with digital variable message signboards and smart toll gantries.",
            metrics: {
              commuteCut: "35 mins saved during morning peak",
              dailyTraffic: "115,000 PCU capacity",
              accidentReduction: "Estimated 40% reduction via barrier geometry",
              statusAlert: "45-day delay in girder launching near Chedda Nagar"
            }
          },
          tender: {
            tenderId: "MMRDA-TND-ROD-2022-77",
            issueDate: "15 Sep 2022",
            bidsOpened: "02 Dec 2022",
            govSanctionCost: 3400,
            finalAwardedCost: 3620,
            selectionMethod: "Standard Two-Packet e-Tendering",
            bidders: [
              { company: "Apex Infra Projects Ltd", bidAmount: 3620, techScore: 84.5, status: "Selected (L1)", variance: "+6.5%" },
              { company: "Welspun Enterprises", bidAmount: 3790, techScore: 89.0, status: "Outbid (L2)", variance: "+11.4%" },
              { company: "J. Kumar Infraprojects", bidAmount: 3880, techScore: 87.2, status: "Outbid (L3)", variance: "+14.1%" }
            ]
          },
          newsReports: [
            {
              outlet: "Free Press Journal",
              date: "08 Dec 2025",
              headline: "Eastern Freeway Extension Slips by 45 Days Due to Gas Pipeline Shifting Delays",
              author: "Sneha Ghadge",
              excerpt: "MMRDA authorities confirmed that GAIL gas line deviations near Ghatkopar slowed girder erection, though revised timeline guarantees completion before the monsoon.",
              sentiment: "neutral",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 74,
            verdict: "Moderate Alignment — Spending pace is slightly elevated relative to delayed utility relocation milestones.",
            breakdown: {
              materialCostAlignment: 78,
              tenderCompetitiveness: 82,
              progressVsSpendMatch: 71,
              mediaSentimentScore: 65
            },
            keyNotes: [
              "Asphalt and bituminous emulsion purchases conform with regional NHAI schedules.",
              "Schedule slip of 45 days is consistent with documented gas pipeline safety protocols."
            ]
          },
          comments: [
            {
              id: "c6",
              user: "Vikas Salvi",
              role: "Ghatkopar Daily Commuter",
              timeAgo: "4 days ago",
              likes: 15,
              dislikes: 0,
              text: "The diversions at Chedda Nagar junction have created massive morning jams. Contractors need to speed up night girder placing to relieve the choke point.",
              replies: []
            }
          ]
        }
      ]
    },

    delhi: {
      id: "delhi",
      name: "Delhi (NCR)",
      state: "National Capital Territory",
      badge: "National Capital Region",
      tagline: "Heart of India's Governance & Smart Urban Corridors",
      coordinates: { x: 260, y: 220, scale: 3.8, cx: 260, cy: 220 },
      geo: { lat: 28.6139, lon: 77.2090 },
      stats: {
        totalProjects: 44,
        activeBudget: "₹68,910 Cr",
        transparencyScore: "81/100",
        citizenAuditors: "19,250"
      },
      projects: [
        {
          id: "DEL-TUN-01",
          type: "tunnel",
          typeLabel: "Underground Metro Tunnel",
          icon: "",
          title: "Delhi Aerocity-Tughlakabad Underground Silver Line Corridor",
          sanctionCode: "DMRC/TUN/PH4-SL-03",
          status: "healthy",
          statusLabel: "Healthy · On Track",
          budget: {
            allocated: 8930,
            spent: 6112,
            projectedFinal: 8990,
            overrunPct: 0.7,
            cpi: 0.99,
            spi: 0.97,
            progress: 72,
            plannedProgress: 74,
            breakdown: [
              { item: "Earth Pressure Balance (EPB) TBMs", cost: 3572, pct: 40 },
              { item: "Station Deep Basements & Cut-Cover", cost: 2232, pct: 25 },
              { item: "Precast Concrete Lining Segments", cost: 1340, pct: 15 },
              { item: "Traction Power & 25kV Overhead Catenary", cost: 1071, pct: 12 },
              { item: "Contingency & Third-Party Audit", cost: 715, pct: 8 }
            ]
          },
          contractor: {
            id: "AFCONS-INFRA",
            name: "Afcons Infrastructure Ltd (Shapoorji Pallonji)",
            experienceYears: 64,
            completedGovtProjects: 172,
            onTimeMilestoneRate: "88%",
            rating: 4.7,
            leadEngineer: "Er. K. Subrahmanyam",
            headquarters: "Mumbai / New Delhi",
            activeProjectsAcrossIndia: 18,
            integrityScore: "95/100",
            pastProjects: [
              { name: "Delhi Metro Magenta Line Deep Tunnel Package", year: "2018", status: "Delivered on schedule" },
              { name: "Atal Tunnel Rohtang Package B", year: "2020", status: "National Excellence Award" }
            ]
          },
          overview: "A 23.6 km underground corridor featuring twin tunnels excavated beneath Delhi's sensitive Ridge forest and dense heritage colonies, connecting Indira Gandhi International Airport to South Delhi.",
          simulation: {
            image: "assets/tunnel_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Photorealistic simulation of completed Aerocity interchange station with automated platform screen doors and smart HVAC.",
            metrics: {
              commuteCut: "55 mins saved between South Delhi and Terminal 3",
              dailyRidership: "280,000 projected daily commuters",
              vibrationControl: "Floating slab track for heritage monument preservation",
              tunnelDepth: "Up to 27 meters subterranean"
            }
          },
          tender: {
            tenderId: "DMRC-TND-SL-03-CIVIL",
            issueDate: "11 Aug 2022",
            bidsOpened: "19 Dec 2022",
            govSanctionCost: 8800,
            finalAwardedCost: 8930,
            selectionMethod: "JICA Funded International QCBS",
            bidders: [
              { company: "Afcons Infrastructure Ltd", bidAmount: 8930, techScore: 95.8, status: "Selected (L1)", variance: "+1.5%" },
              { company: "L&T Construction Heavy Civil", bidAmount: 9240, techScore: 96.1, status: "Outbid (L2)", variance: "+5.0%" },
              { company: "ITD Cementation India", bidAmount: 9550, techScore: 89.4, status: "Outbid (L3)", variance: "+8.5%" }
            ]
          },
          newsReports: [
            {
              outlet: "Hindustan Times",
              date: "19 Dec 2025",
              headline: "DMRC Silver Line Achieves Crucial Breakthrough Beneath Qutub Institutional Area",
              author: "Vipul Sharma",
              excerpt: "Real-time laser deflection monitoring confirmed less than 1.5mm ground settlement, completely preserving nearby historic sandstone structures.",
              sentiment: "positive",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 91,
            verdict: "High Evidence Match — Strict compliance with JICA transparency and geotechnical sensor registries.",
            breakdown: {
              materialCostAlignment: 92,
              tenderCompetitiveness: 93,
              progressVsSpendMatch: 90,
              mediaSentimentScore: 89
            },
            keyNotes: [
              "Disbursements aligned with independent DMRC Project Management Consultant certificates.",
              "Vibration monitoring records match certified public dockets."
            ]
          },
          comments: [
            {
              id: "c7",
              user: "Aakash Mathur",
              role: "Vasant Kunj Resident",
              timeAgo: "2 days ago",
              likes: 31,
              dislikes: 0,
              text: "The tunneling under Mahipalpur went so smoothly we barely noticed any ground vibrations. Eagerly waiting for the Aerocity link to open!",
              replies: []
            }
          ]
        },
        {
          id: "DEL-BRG-02",
          type: "bridge",
          typeLabel: "Elevated Signature Corridor",
          icon: "",
          title: "Barapullah Elevated Corridor Phase 3 (Mayur Vihar ➔ Sarai Kale Khan)",
          sanctionCode: "PWD/DEL/2016-BP-03",
          status: "critical",
          statusLabel: "Critical Discrepancy · 8-Year Overrun",
          budget: {
            allocated: 1450,
            spent: 1378,
            projectedFinal: 1980,
            overrunPct: 36.5,
            cpi: 0.58,
            spi: 0.54,
            progress: 58,
            plannedProgress: 100,
            breakdown: [
              { item: "Yamuna River Piers & Well Foundations", cost: 580, pct: 40 },
              { item: "Land Acquisition Compensation Addendum", cost: 435, pct: 30 },
              { item: "Precast Box Girders & Launching", cost: 261, pct: 18 },
              { item: "Administrative Delay Escalation Fees", cost: 174, pct: 12 }
            ]
          },
          contractor: {
            id: "DSC-GAMMON",
            name: "DSC Limited & Consortium",
            experienceYears: 22,
            completedGovtProjects: 38,
            onTimeMilestoneRate: "39%",
            rating: 2.1,
            leadEngineer: "Sunil Aggarwal",
            headquarters: "New Delhi, India",
            activeProjectsAcrossIndia: 3,
            integrityScore: "34/100",
            pastProjects: [
              { name: "Delhi PWD Ring Road Bypass Flyover", year: "2017", status: "Delayed by 14 months" },
              { name: "Gurugram Expressway Toll Plaza Expansion", year: "2019", status: "Liquidated damages claimed" }
            ]
          },
          overview: "A 3.5 km elevated bridge intended to span the Yamuna river connecting East Delhi's Mayur Vihar to South Delhi. Stalled for over 8 years due to unresolved land acquisition disputes and contractor idling claims.",
          simulation: {
            image: "assets/bridge_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Proposed visual completion: Signal-free elevated flyway across the Yamuna floodplains connecting Sarai Kale Khan directly to Noida Link Road.",
            metrics: {
              targetCommuteReduction: "25 mins saved from East to South Delhi",
              originalDeadline: "2017 (Overdue by 9 years)",
              pendingLandParcels: "2 private plots halting bridge landing",
              discrepancyNotice: "₹435 Cr escalation billed without physical work"
            }
          },
          tender: {
            tenderId: "PWD-DEL-BP-PHASE3-2015",
            issueDate: "12 Dec 2014",
            bidsOpened: "28 Apr 2015",
            govSanctionCost: 964,
            finalAwardedCost: 1450,
            selectionMethod: "Re-tendered after budget escalation",
            bidders: [
              { company: "DSC Limited", bidAmount: 1450, techScore: 74.0, status: "Selected (L1)", variance: "+50.4% over original 2014 estimate" },
              { company: "Gammon India Ltd", bidAmount: 1530, techScore: 72.5, status: "Outbid (L2)", variance: "+58.7%" }
            ]
          },
          newsReports: [
            {
              outlet: "NDTV India",
              date: "10 Oct 2025",
              headline: "Delhi High Court Pulls Up PWD Over Barapullah Phase 3 Delay: 'Tenders Issued Before Acquiring Land'",
              author: "Sharad Trivedi",
              excerpt: "The bench expressed disbelief that 95% of the total budget has been exhausted while missing piers remain unbuilt on the Mayur Vihar bank.",
              sentiment: "negative",
              url: "#"
            },
            {
              outlet: "CAG Performance Audit Report No. 14",
              date: "15 Jan 2026",
              headline: "Comptroller & Auditor General Highlights ₹320 Cr Irregular Idling Claims Paid to Contractor",
              author: "CAG Audit Directorate",
              excerpt: "Audit inspection detected payment of contractor equipment idle charges without verifying physical plant presence on site during lockdown years.",
              sentiment: "negative",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 34,
            verdict: "Severe Discrepancy — High funding outflow correlated with zero physical yard progress and severe contractual idling anomalies.",
            breakdown: {
              materialCostAlignment: 31,
              tenderCompetitiveness: 42,
              progressVsSpendMatch: 28,
              mediaSentimentScore: 35
            },
            keyNotes: [
              "95% funds expended while project stands at only 58% physical completion.",
              "CAG formal notice of unauthorized escalation payments flagged in database.",
              "118 citizen RTI grievances registered on missing pillar links."
            ]
          },
          comments: [
            {
              id: "c8",
              user: "Rakesh Dogra",
              role: "Mayur Vihar Phase 1 Resident",
              timeAgo: "2 days ago",
              likes: 112,
              dislikes: 2,
              text: "Every election for the last 10 years leaders come and promise Barapullah Phase 3 will open in 6 months. Look at the OurCity audit: 95% money already paid out to the contractor! Where did our tax money go?",
              replies: [
                {
                  user: "Advocate Sandeep Gill",
                  timeAgo: "1 day ago",
                  text: "We are using OurCity's CAG evidence link in our Public Interest Litigation (PIL) hearing next Tuesday."
                }
              ]
            }
          ]
        },
        {
          id: "DEL-PRK-03",
          type: "park",
          typeLabel: "Riverfront Biodiversity Park",
          icon: "",
          title: "Yamuna Riverfront Asita East Biodiversity & Wetland Rejuvenation",
          sanctionCode: "DDA/BIO/2023-ASITA-01",
          status: "healthy",
          statusLabel: "Healthy · On Track",
          budget: {
            allocated: 920,
            spent: 708,
            projectedFinal: 935,
            overrunPct: 1.6,
            cpi: 0.98,
            spi: 0.99,
            progress: 80,
            plannedProgress: 82,
            breakdown: [
              { item: "Wetland Desilting & Natural Reedbeds", cost: 349, pct: 38 },
              { item: "Native Floodplain Tree Afforestation", cost: 230, pct: 25 },
              { item: "Earthen Cycle Tracks & Solar Lighting", cost: 165, pct: 18 },
              { item: "Eco Amphitheatre & Bird Watch Towers", cost: 110, pct: 12 },
              { item: "Public Amenities & Signage", cost: 66, pct: 7 }
            ]
          },
          contractor: {
            id: "DELHI-ECO",
            name: "Delhi Urban Eco Consortium & Nursery Works",
            experienceYears: 16,
            completedGovtProjects: 28,
            onTimeMilestoneRate: "86%",
            rating: 4.6,
            leadEngineer: "Dr. C. R. Babu (Advisory) / S. Negi",
            headquarters: "New Delhi, India",
            activeProjectsAcrossIndia: 5,
            integrityScore: "92/100",
            pastProjects: [
              { name: "Aravalli Biodiversity Park Restoration", year: "2019", status: "National Eco Award" },
              { name: "Neela Hauz Lake Rejuvenation", year: "2021", status: "Delivered below sanctioned budget" }
            ]
          },
          overview: "A 90-hectare floodplain ecological sanctuary re-establishing historic grasslands, reedbeds, and seasonal water bodies to naturally cleanse Yamuna flood runoff and create a carbon sink for East Delhi.",
          simulation: {
            image: "assets/park_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Photorealistic rendering of restored Yamuna floodplain with natural water lily wetlands, solar pavilion, and thriving migratory birds.",
            metrics: {
              carbonOffset: "12,000 tonnes CO₂ sequestered annually",
              wetlandWaterHolding: "1.8 Million litres natural flood capacity",
              nativeGrassSpecies: "Over 54 indigenous flora species reintroduced",
              greenFootprint: "Accessible to 250,000 citizens weekly"
            }
          },
          tender: {
            tenderId: "DDA-TND-ASITA-2023",
            issueDate: "14 Jan 2023",
            bidsOpened: "20 Mar 2023",
            govSanctionCost: 900,
            finalAwardedCost: 920,
            selectionMethod: "e-Procurement Competitive Bidding",
            bidders: [
              { company: "Delhi Urban Eco Consortium", bidAmount: 920, techScore: 94.0, status: "Selected (L1)", variance: "+2.2%" },
              { company: "Greenery Agro Projects", bidAmount: 965, techScore: 88.0, status: "Outbid (L2)", variance: "+7.2%" },
              { company: "Terra Vista Landscapes", bidAmount: 990, techScore: 85.5, status: "Outbid (L3)", variance: "+10.0%" }
            ]
          },
          newsReports: [
            {
              outlet: "The Hindu Special Investigation",
              date: "14 Nov 2025",
              headline: "Migratory Birds Return in Thousands as Asita East Eco-Restoration Reaches 80% Milestone",
              author: "Damini Nath",
              excerpt: "Surveys conducted by the Bombay Natural History Society (BNHS) registered 87 avian species nesting in the restored oxbow wetlands of Yamuna.",
              sentiment: "positive",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 88,
            verdict: "High Evidence Match — Direct correlation between biological nursery manifests and satellite vegetation index (NDVI).",
            breakdown: {
              materialCostAlignment: 90,
              tenderCompetitiveness: 89,
              progressVsSpendMatch: 87,
              mediaSentimentScore: 86
            },
            keyNotes: [
              "Satellite NDVI green index increased by 210% across the project perimeter.",
              "Budget allocation for saplings matches central forest research institute nursery baselines."
            ]
          },
          comments: [
            {
              id: "c9",
              user: "Priya Sengupta",
              role: "Wildlife Photographer",
              timeAgo: "3 days ago",
              likes: 22,
              dislikes: 0,
              text: "Visited Asita East early morning. The transformation from an illegal dump to this stunning wetland sanctuary is magical. Excellent utilization of public funds.",
              replies: []
            }
          ]
        },
        {
          id: "DEL-ROD-04",
          type: "road",
          typeLabel: "Smart Expressway",
          icon: "️",
          title: "Urban Extension Road-II (UER-II) Smart Peripheral Expressway",
          sanctionCode: "NHAI/DEL/2022-UER2-PKG1",
          status: "watch",
          statusLabel: "Watch · Quality Inspection Pending",
          budget: {
            allocated: 7715,
            spent: 6480,
            projectedFinal: 7920,
            overrunPct: 2.6,
            cpi: 0.94,
            spi: 0.91,
            progress: 79,
            plannedProgress: 85,
            breakdown: [
              { item: "Solid Waste Embankment Fill (Ghazipur/Bhalswa)", cost: 2314, pct: 30 },
              { item: "Grade-Separated Interchanges & Flyovers", cost: 2700, pct: 35 },
              { item: "Rigid Concrete Pavement (PQC)", cost: 1543, pct: 20 },
              { item: "Intelligent Speed Cameras & LED Gantries", cost: 771, pct: 10 },
              { item: "Safety Barriers & Signage", cost: 387, pct: 5 }
            ]
          },
          contractor: {
            id: "CEIGALL-MEGHA",
            name: "Ceigall India - Megha Engineering JV",
            experienceYears: 24,
            completedGovtProjects: 84,
            onTimeMilestoneRate: "76%",
            rating: 3.9,
            leadEngineer: "Er. Ramana Murthy",
            headquarters: "Hyderabad / Ludhiana",
            activeProjectsAcrossIndia: 11,
            integrityScore: "73/100",
            pastProjects: [
              { name: "Delhi-Dehradun Expressway Package 1", year: "2023", status: "Substantially complete" },
              { name: "Bhiwani-Hansi Highway 4-Laning", year: "2021", status: "Delivered within cost estimate" }
            ]
          },
          overview: "A 75.7 km access-controlled 6-lane expressway acting as the Third Ring Road for Delhi, utilising 20 lakh tonnes of legacy garbage processed from Bhalswa landfill as inert embankment fill.",
          simulation: {
            image: "assets/road_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Futuristic simulation of high-speed UER-II expressway with multi-tier flyover interchanges and electric vehicle charging bays.",
            metrics: {
              commuteCut: "Alipur to IGI Airport reduced from 2 hrs to 30 mins",
              legacyGarbageCleared: "20 Lakh metric tonnes utilized",
              dailyTraffic: "150,000 vehicles diverted away from inner Delhi",
              speedLimit: "100 km/h access-controlled"
            }
          },
          tender: {
            tenderId: "NHAI-TND-UER2-PKG1-2021",
            issueDate: "05 Nov 2021",
            bidsOpened: "18 Mar 2022",
            govSanctionCost: 7500,
            finalAwardedCost: 7715,
            selectionMethod: "HAM (Hybrid Annuity Model) EPC Tender",
            bidders: [
              { company: "Ceigall India Ltd", bidAmount: 7715, techScore: 89.0, status: "Selected (L1)", variance: "+2.8%" },
              { company: "PNC Infratech Ltd", bidAmount: 7920, techScore: 91.2, status: "Outbid (L2)", variance: "+5.6%" },
              { company: "KNR Constructions", bidAmount: 8150, techScore: 87.5, status: "Outbid (L3)", variance: "+8.6%" }
            ]
          },
          newsReports: [
            {
              outlet: "The Indian Express",
              date: "22 Dec 2025",
              headline: "NHAI Inspects UER-II Drainage Sections After Water-Logging Reported Near Mundka Underpass",
              author: "Jatin Anand",
              excerpt: "Engineers discovered slope misalignments in secondary stormwater culverts and instructed the contractor to rectify outfalls at their own cost before commissioning.",
              sentiment: "neutral",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 73,
            verdict: "Moderate Alignment — Good progress on main carriageway, but localized drainage remedial works flagged.",
            breakdown: {
              materialCostAlignment: 76,
              tenderCompetitiveness: 80,
              progressVsSpendMatch: 72,
              mediaSentimentScore: 64
            },
            keyNotes: [
              "Crushed inert landfill material manifests verified via weighing bridge telemetry.",
              "Culvert drainage rework cost correctly charged to contractor warranty rather than public budget."
            ]
          },
          comments: [
            {
              id: "c10",
              user: "Harpreet Cheema",
              role: "Logistics Fleet Operator",
              timeAgo: "1 day ago",
              likes: 19,
              dislikes: 0,
              text: "When fully open this will save thousands of liters of diesel every day by bypassing central Delhi completely. Hope the Mundka drainage is fixed permanently.",
              replies: []
            }
          ]
        }
      ]
    },

    kolkata: {
      id: "kolkata",
      name: "Kolkata",
      state: "West Bengal",
      badge: "Cultural Capital",
      tagline: "Historic Heritage & Modern Riverine Engineering",
      coordinates: { x: 380, y: 340, scale: 3.8, cx: 380, cy: 340 },
      geo: { lat: 22.5726, lon: 88.3639 },
      stats: {
        totalProjects: 26,
        activeBudget: "₹42,180 Cr",
        transparencyScore: "78/100",
        citizenAuditors: "11,400"
      },
      projects: [
        {
          id: "KOL-TUN-01",
          type: "tunnel",
          typeLabel: "Subaqueous River Tunnel",
          icon: "",
          title: "Kolkata East-West Metro Under-River Hooghly Subaqueous Tunnel Extension",
          sanctionCode: "KMRC/TUN/EW-HG-02",
          status: "healthy",
          statusLabel: "Healthy · Operational Pilot",
          budget: {
            allocated: 8575,
            spent: 8120,
            projectedFinal: 8640,
            overrunPct: 0.7,
            cpi: 0.99,
            spi: 0.98,
            progress: 92,
            plannedProgress: 94,
            breakdown: [
              { item: "Subaqueous Hydrophilic Gasket Tunneling", cost: 3601, pct: 42 },
              { item: "Underwater Evacuation Shafts & Pumps", cost: 1543, pct: 18 },
              { item: "Howrah Deep Station Box (33m subterranean)", cost: 1886, pct: 22 },
              { item: "Automated Third Rail 750V DC Power", cost: 857, pct: 10 },
              { item: "Safety Audits & Hydro-Pressure Testing", cost: 688, pct: 8 }
            ]
          },
          contractor: {
            id: "AFCONS-TRANST",
            name: "Afcons - Transtonnelstroy Joint Venture",
            experienceYears: 48,
            completedGovtProjects: 88,
            onTimeMilestoneRate: "90%",
            rating: 4.8,
            leadEngineer: "Er. Satya Narayan / V. Popov",
            headquarters: "Kolkata / Moscow",
            activeProjectsAcrossIndia: 7,
            integrityScore: "93/100",
            pastProjects: [
              { name: "Chennai Metro Underground Phase 1", year: "2017", status: "Completed successfully" },
              { name: "Kolkata Circular Railway Elevated Piers", year: "2019", status: "Zero structural defects" }
            ]
          },
          overview: "India's first underwater transportation tunnel, crossing 520 meters beneath the mighty Hooghly Riverbed in just 45 seconds. Engineered with hydrophilic gasket seals that expand on water contact to guarantee 100-year dry operation.",
          simulation: {
            image: "assets/tunnel_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Photorealistic rendering of metro train transiting underwater tube with blue ambient safety illumination and Howrah deep concourse.",
            metrics: {
              riverCrossingTime: "45 seconds across Hooghly river",
              commuteReduction: "Howrah to Esplanade in 9 minutes (previously 1.5 hrs)",
              tunnelDepth: "32 meters beneath river high tide level",
              safetyFactor: "Built to withstand 8.0 Richter seismic forces"
            }
          },
          tender: {
            tenderId: "KMRC-TND-EWMETRO-02",
            issueDate: "08 Jul 2020",
            bidsOpened: "14 Nov 2020",
            govSanctionCost: 8300,
            finalAwardedCost: 8575,
            selectionMethod: "Global Competitive Bidding (JICA backed)",
            bidders: [
              { company: "Afcons - Transtonnelstroy JV", bidAmount: 8575, techScore: 97.5, status: "Selected (L1)", variance: "+3.3%" },
              { company: "ITD-ITD Chem JV", bidAmount: 8990, techScore: 92.0, status: "Outbid (L2)", variance: "+8.3%" },
              { company: "L&T Heavy Civil", bidAmount: 9250, techScore: 94.2, status: "Outbid (L3)", variance: "+11.4%" }
            ]
          },
          newsReports: [
            {
              outlet: "The Telegraph Kolkata",
              date: "28 Jan 2026",
              headline: "Historic Engineering Milestone: Underwater Metro Celebrates Flawless Operational Reliability",
              author: "Subrata Nagchoudhury",
              excerpt: "Continuous ultrasonic sensors register zero saline water seepage across 1,400 ring segments under the riverbed.",
              sentiment: "positive",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 93,
            verdict: "Pristine Evidence Match — High international engineering rigor and certified sensor data.",
            breakdown: {
              materialCostAlignment: 94,
              tenderCompetitiveness: 92,
              progressVsSpendMatch: 95,
              mediaSentimentScore: 91
            },
            keyNotes: [
              "German tunnel boring machine calibration certificates verified.",
              "Civil expenditure variance under 1.2% over a 4-year cycle."
            ]
          },
          comments: [
            {
              id: "c11",
              user: "Debashis Banerjee",
              role: "Daily Commuter · Howrah Station",
              timeAgo: "2 days ago",
              likes: 54,
              dislikes: 0,
              text: "Crossing from Howrah to central Kolkata in 9 minutes instead of getting stuck on Howrah bridge for 2 hours in summer is a miracle. Kudos to the engineering team!",
              replies: []
            }
          ]
        },
        {
          id: "KOL-BRG-02",
          type: "bridge",
          typeLabel: "Elevated Connector Flyover",
          icon: "",
          title: "Maa Flyover to EM Bypass Elevated Double-Decker Ramp Connector",
          sanctionCode: "KMDA/BRG/2022-MAA-04",
          status: "critical",
          statusLabel: "Critical Discrepancy · Structural Load Concern",
          budget: {
            allocated: 1120,
            spent: 985,
            projectedFinal: 1480,
            overrunPct: 32.1,
            cpi: 0.62,
            spi: 0.58,
            progress: 61,
            plannedProgress: 95,
            breakdown: [
              { item: "Steel Girder Fabrication & Erection", cost: 448, pct: 40 },
              { item: "Foundation Piles & Pier Caps", cost: 313, pct: 28 },
              { item: "Segment 4 Defect Remediation & Testing", cost: 179, pct: 16 },
              { item: "Traffic Diversion & Administrative Surcharges", cost: 180, pct: 16 }
            ]
          },
          contractor: {
            id: "SIMPLEX-INFRA",
            name: "Simplex Infrastructures Ltd Consortium",
            experienceYears: 42,
            completedGovtProjects: 65,
            onTimeMilestoneRate: "42%",
            rating: 2.2,
            leadEngineer: "A. K. Bhattacharya",
            headquarters: "Kolkata, India",
            activeProjectsAcrossIndia: 4,
            integrityScore: "39/100",
            pastProjects: [
              { name: "Vivekananda Road Flyover Package", year: "2016", status: "Blacklisted temporarily; litigation ongoing" },
              { name: "Barasat Flyover Repair", year: "2021", status: "Delayed by 11 months" }
            ]
          },
          overview: "A 1.8 km ramp connecting Maa Flyover directly with the Eastern Metropolitan Bypass, designed to remove chronic traffic gridlock near Park Circus 7-point crossing.",
          simulation: {
            image: "assets/bridge_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Proposed visual completion: Sweeping elevated 4-lane viaduct over Park Circus with LED signboards and noise dampening panels.",
            metrics: {
              targetCommuteCut: "20 mins saved at Park Circus crossing",
              criticalWarning: "Segment 4 failed dynamic load testing in Dec 2025",
              spendingStatus: "88% funds exhausted for 61% physical work",
              subcontractorDispute: "Multiple vendor payment strikes recorded"
            }
          },
          tender: {
            tenderId: "KMDA-TND-MAA-RAMP-2021",
            issueDate: "15 Jan 2022",
            bidsOpened: "04 Jun 2022",
            govSanctionCost: 950,
            finalAwardedCost: 1120,
            selectionMethod: "Lowest Responsive Bidder (Re-tendered)",
            bidders: [
              { company: "Simplex Infrastructures Ltd", bidAmount: 1120, techScore: 72.0, status: "Selected (L1)", variance: "+17.8%" },
              { company: "Bridge & Roof Co Ltd", bidAmount: 1190, techScore: 84.5, status: "Outbid (L2)", variance: "+25.2%" },
              { company: "Mackintosh Burn Ltd", bidAmount: 1240, techScore: 81.0, status: "Outbid (L3)", variance: "+30.5%" }
            ]
          },
          newsReports: [
            {
              outlet: "Anandabazar Patrika / ABP Ananda",
              date: "14 Dec 2025",
              headline: "Park Circus Flyover Ramp Stalls Again as IIT Kharagpur Rejects Defective Girder Weldings",
              author: "Siddhartha Ghosh",
              excerpt: "Structural engineering professors from IIT Kharagpur red-flagged defective metallurgical welding across 6 major steel box girders, halting vehicular commissioning.",
              sentiment: "negative",
              url: "#"
            },
            {
              outlet: "The Statesman",
              date: "08 Jan 2026",
              headline: "Subcontractors Halt Work on Maa Flyover Ramp Over Unpaid Dues of ₹28 Crores",
              author: "Partha Roy",
              excerpt: "Small civil vendors protested outside KMDA headquarters alleging the primary contractor pocketed government advances while defaulting on supplier invoices.",
              sentiment: "negative",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 39,
            verdict: "High Risk Discrepancy — Subcontractor default strikes, metallurgical weld rejections, and excessive financial drain relative to incomplete structure.",
            breakdown: {
              materialCostAlignment: 36,
              tenderCompetitiveness: 48,
              progressVsSpendMatch: 34,
              mediaSentimentScore: 38
            },
            keyNotes: [
              "88% funds disbursed while physical deck is stalled at 61%.",
              "IIT Kharagpur structural load failure reports logged in public evidence dossier.",
              "High contractor risk index due to past project insolvency proceedings."
            ]
          },
          comments: [
            {
              id: "c12",
              user: "Anirban Mukherjee",
              role: "Park Circus Resident",
              timeAgo: "1 day ago",
              likes: 76,
              dislikes: 1,
              text: "Park Circus has been dug up for 3 years! Now we find out the steel girders failed safety tests? Why did KMDA award this to Simplex after their past record? OurCity needs to escalate this to the Vigilance Commission!",
              replies: []
            }
          ]
        },
        {
          id: "KOL-PRK-03",
          type: "park",
          typeLabel: "Solar Ecological Promenade",
          icon: "",
          title: "New Town Eco Park Solar Water Promenade & Mangrove Sanctuary",
          sanctionCode: "HIDCO/PARK/2023-ECO-09",
          status: "healthy",
          statusLabel: "Healthy · On Track",
          budget: {
            allocated: 640,
            spent: 512,
            projectedFinal: 648,
            overrunPct: 1.2,
            cpi: 0.98,
            spi: 0.99,
            progress: 85,
            plannedProgress: 86,
            breakdown: [
              { item: "Floating Solar Promenade Boardwalks", cost: 230, pct: 36 },
              { item: "Sundarbans Flora & Mangrove Nursery", cost: 160, pct: 25 },
              { item: "Water Aeration Fountains & Ecology", cost: 115, pct: 18 },
              { item: "Solar Canopies & EV Shuttle Tracks", cost: 85, pct: 13 },
              { item: "Children's Sensory Bio-Dome", cost: 50, pct: 8 }
            ]
          },
          contractor: {
            id: "BENGAL-GREEN",
            name: "Bengal Urban Greenways Ltd",
            experienceYears: 14,
            completedGovtProjects: 22,
            onTimeMilestoneRate: "88%",
            rating: 4.6,
            leadEngineer: "Dr. Tapas Mallick",
            headquarters: "Kolkata, India",
            activeProjectsAcrossIndia: 3,
            integrityScore: "90/100",
            pastProjects: [
              { name: "Subhas Sarobar Lake Beautification", year: "2020", status: "Delivered on schedule" },
              { name: "Rabindra Sarobar Bio-Filter Upgrade", year: "2022", status: "Recognized for solar innovation" }
            ]
          },
          overview: "A 480-acre urban park expansion incorporating India's largest floating solar pedestrian promenade, replicating the Sundarbans mangrove ecology with 42 native halophyte plant varieties.",
          simulation: {
            image: "assets/park_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Photorealistic rendering of illuminated floating solar promenade at dusk overlooking New Town water body and botanical conservatories.",
            metrics: {
              solarGeneration: "1.2 Megawatt clean energy generated daily",
              greenArea: "480 Acres comprehensive parkland",
              annualFootfall: "Over 2.4 Million visitors accommodated",
              carbonNeutral: "Entire park lighting powered 100% via onsite solar"
            }
          },
          tender: {
            tenderId: "HIDCO-TND-ECOPARK-2023",
            issueDate: "10 Feb 2023",
            bidsOpened: "18 May 2023",
            govSanctionCost: 620,
            finalAwardedCost: 640,
            selectionMethod: "e-Procurement Quality & Price",
            bidders: [
              { company: "Bengal Urban Greenways", bidAmount: 640, techScore: 92.5, status: "Selected (L1)", variance: "+3.2%" },
              { company: "Eden Greens Infrastructure", bidAmount: 675, techScore: 86.0, status: "Outbid (L2)", variance: "+8.8%" }
            ]
          },
          newsReports: [
            {
              outlet: "Ei Samay",
              date: "10 Jan 2026",
              headline: "New Town Solar Promenade Becomes Model for Sustainable Urban Tourism in Eastern India",
              author: "Rwitobroto Sen",
              excerpt: "State power minister inaugurated the 1.2 MW floating solar array which supplies surplus green electricity to the local micro-grid.",
              sentiment: "positive",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 90,
            verdict: "High Alignment — High fidelity between solar component procurement bills and state clean energy subsidy registries.",
            breakdown: {
              materialCostAlignment: 91,
              tenderCompetitiveness: 88,
              progressVsSpendMatch: 92,
              mediaSentimentScore: 89
            },
            keyNotes: [
              "Floating solar PV panel certifications match Bureau of Indian Standards (BIS) test records.",
              "No cost overrun anomalies detected."
            ]
          },
          comments: [
            {
              id: "c13",
              user: "Sohini Roy",
              role: "New Town Resident",
              timeAgo: "2 days ago",
              likes: 24,
              dislikes: 0,
              text: "The evening walk along the solar promenade is peaceful and well maintained. Excellent maintenance and zero ticketing corruption.",
              replies: []
            }
          ]
        },
        {
          id: "KOL-ROD-04",
          type: "road",
          typeLabel: "Smart Highway Corridor",
          icon: "️",
          title: "Kona Expressway 6-Lane Elevated Smart Corridor & Toll Viaduct",
          sanctionCode: "NHAI/WB/2022-KONA-01",
          status: "watch",
          statusLabel: "Watch · Utility Shifting Slip",
          budget: {
            allocated: 2450,
            spent: 1788,
            projectedFinal: 2590,
            overrunPct: 5.7,
            cpi: 0.91,
            spi: 0.88,
            progress: 70,
            plannedProgress: 79,
            breakdown: [
              { item: "Elevated Viaduct Superstructure", cost: 1102, pct: 45 },
              { item: "Substructure Piers & Piling", cost: 612, pct: 25 },
              { item: "High-Tension Power Cable Relocation", cost: 367, pct: 15 },
              { item: "Drainage, Service Roads & Toll Gates", cost: 245, pct: 10 },
              { item: "Safety Barriers & Signage", cost: 124, pct: 5 }
            ]
          },
          contractor: {
            id: "BHARAT-CIVIL",
            name: "Bharat Civil Works Consortium",
            experienceYears: 28,
            completedGovtProjects: 56,
            onTimeMilestoneRate: "74%",
            rating: 3.8,
            leadEngineer: "Er. P. K. Ghosh",
            headquarters: "Kolkata / Asansol",
            activeProjectsAcrossIndia: 6,
            integrityScore: "76/100",
            pastProjects: [
              { name: "Durgapur Expressway 6-Laning Package 2", year: "2021", status: "Completed with 2-month delay" },
              { name: "NH-34 Malda Bypass", year: "2023", status: "Quality certified by NHAI" }
            ]
          },
          overview: "A 7.2 km elevated 6-lane highway replacing the congested Kona Expressway to provide smooth, high-speed connectivity from Kolkata (Vidyasagar Setu) to NH-16 heading towards Mumbai and Chennai.",
          simulation: {
            image: "assets/road_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Futuristic view of completed 6-lane elevated Kona viaduct with sound dampeners and electronic automated FASTag toll plaza.",
            metrics: {
              commuteCut: "Santragachi bottleneck travel reduced from 1 hr to 12 mins",
              designSpeed: "80 km/h access controlled",
              freightImpact: "Smooth passage for 45,000 heavy commercial trucks daily",
              statusAlert: "WBSETCL high-voltage cable relocation delayed package 2"
            }
          },
          tender: {
            tenderId: "NHAI-TND-WB-KONA-2022",
            issueDate: "18 Aug 2022",
            bidsOpened: "12 Dec 2022",
            govSanctionCost: 2300,
            finalAwardedCost: 2450,
            selectionMethod: "EPC Open Competitive Tender",
            bidders: [
              { company: "Bharat Civil Works", bidAmount: 2450, techScore: 86.5, status: "Selected (L1)", variance: "+6.5%" },
              { company: "Montecarlo Ltd", bidAmount: 2580, techScore: 89.0, status: "Outbid (L2)", variance: "+12.1%" },
              { company: "PNC Infratech", bidAmount: 2640, techScore: 87.2, status: "Outbid (L3)", variance: "+14.7%" }
            ]
          },
          newsReports: [
            {
              outlet: "Millennium Post",
              date: "19 Nov 2025",
              headline: "Power Grid Relocations Completed Along Kona Corridor; Pier Erection Resumes Full Speed",
              author: "Indranil Mukherjee",
              excerpt: "Power transmission pylons were safely relocated away from the main carriageway, clearing the right-of-way for remaining 24 pier spans.",
              sentiment: "neutral",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 76,
            verdict: "Moderate Evidence Match — Spending patterns are orderly; delay is demonstrably linked to third-party electric utility shifting.",
            breakdown: {
              materialCostAlignment: 79,
              tenderCompetitiveness: 81,
              progressVsSpendMatch: 74,
              mediaSentimentScore: 70
            },
            keyNotes: [
              "Steel and bitumen procurement bills correspond directly with SAIL and Indian Oil list prices.",
              "No ghost contractor or duplicate billing signatures found."
            ]
          },
          comments: [
            {
              id: "c14",
              user: "Tanmoy Sen",
              role: "Howrah Commuter",
              timeAgo: "3 days ago",
              likes: 12,
              dislikes: 0,
              text: "Santragachi junction is finally getting some breathing room. Let's hope the elevated segment opens by Diwali as promised.",
              replies: []
            }
          ]
        }
      ]
    },

    bangalore: {
      id: "bangalore",
      name: "Bengaluru",
      state: "Karnataka",
      badge: "Silicon Valley of India",
      tagline: "India's Tech Capital & High-Speed Urban Mobility Corridors",
      coordinates: { x: 260, y: 550, scale: 3.8, cx: 260, cy: 550 },
      geo: { lat: 12.9716, lon: 77.5946 },
      stats: {
        totalProjects: 36,
        activeBudget: "₹59,480 Cr",
        transparencyScore: "84/100",
        citizenAuditors: "18,410"
      },
      projects: [
        {
          id: "BLR-TUN-01",
          type: "tunnel",
          typeLabel: "Underground Transit Tunnel",
          icon: "",
          title: "Hebbal to Silk Board Double-Deck Underground Transit & Highway Tunnel",
          sanctionCode: "BBMP/TUN/2023-TECH-01",
          status: "watch",
          statusLabel: "Watch · Geotechnical Cost Addition",
          budget: {
            allocated: 12650,
            spent: 4174,
            projectedFinal: 13800,
            overrunPct: 9.0,
            cpi: 0.89,
            spi: 0.86,
            progress: 35,
            plannedProgress: 40,
            breakdown: [
              { item: "Giant TBM Boring (14.2m diameter)", cost: 5313, pct: 42 },
              { item: "Geotechnical Grouting & Cavity Filling", cost: 2150, pct: 17 },
              { item: "Subterranean Interchanges & Ramps", cost: 2277, pct: 18 },
              { item: "Emergency Safety Escape Shafts", cost: 1518, pct: 12 },
              { item: "SCADA Environmental Sensors & Power", cost: 1392, pct: 11 }
            ]
          },
          contractor: {
            id: "LT-HEAVY-CIVIL",
            name: "L&T Heavy Civil Infrastructure IC",
            experienceYears: 42,
            completedGovtProjects: 148,
            onTimeMilestoneRate: "89%",
            rating: 4.6,
            leadEngineer: "Er. K. S. Rajendra",
            headquarters: "Bengaluru / Chennai",
            activeProjectsAcrossIndia: 16,
            integrityScore: "92/100",
            pastProjects: [
              { name: "Namma Metro Pink Line Underground Package 2", year: "2023", status: "Broke tunneling speed records in hard granite" },
              { name: "Rishikesh-Karnaprayag Rail Tunnel Package 2", year: "2022", status: "Delivered with high safety compliance" }
            ]
          },
          overview: "An ambitious 18.5 km twin-tube double-decker underground highway tunnel beneath Bengaluru's central tech spine, allowing motorists and rapid buses to bypass Silk Board, Dairy Circle, and Palace Grounds traffic jams.",
          simulation: {
            image: "assets/tunnel_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Photorealistic rendering of double-deck tunnel showing lower electric rapid bus lanes and upper private vehicular expressway with smart lighting.",
            metrics: {
              commuteReduction: "Silk Board to Hebbal cut from 2 hrs to 22 mins",
              tunnelDiameter: "14.2m outer diameter twin tubes",
              geotechnicalProfile: "Hard peninsular gneiss granite with deep grouting",
              statusFlag: "Cost addition for deep ground fissure stabilization near Dairy Circle"
            }
          },
          tender: {
            tenderId: "BBMP-TND-TUN-BLR-01",
            issueDate: "10 Feb 2023",
            bidsOpened: "25 Jun 2023",
            govSanctionCost: 12000,
            finalAwardedCost: 12650,
            selectionMethod: "International Competitive Bidding EPC",
            bidders: [
              { company: "L&T Heavy Civil IC", bidAmount: 12650, techScore: 96.0, status: "Selected (L1)", variance: "+5.4%" },
              { company: "Afcons Infrastructure", bidAmount: 13100, techScore: 92.5, status: "Outbid (L2)", variance: "+9.1%" },
              { company: "Strabag AG - HCC JV", bidAmount: 13650, techScore: 91.0, status: "Outbid (L3)", variance: "+13.7%" }
            ]
          },
          newsReports: [
            {
              outlet: "Deccan Herald",
              date: "15 Jan 2026",
              headline: "Geological Surprise: TBM Hits Fault Line Near Dairy Circle; L&T Deploys Advanced Polyurethane Grouting",
              author: "Naveen Menezes",
              excerpt: "IISc civil engineering panel confirmed the geotechnical anomaly was unpredictable from surface boreholes and endorsed deep chemical grouting to avert cave-ins.",
              sentiment: "neutral",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 74,
            verdict: "Moderate Alignment — Expenditure aligns with certified specialized chemical grouting invoices approved by IISc Bangalore.",
            breakdown: {
              materialCostAlignment: 78,
              tenderCompetitiveness: 86,
              progressVsSpendMatch: 72,
              mediaSentimentScore: 60
            },
            keyNotes: [
              "IISc independent technical sign-off validated for ₹240 Cr grouting addendum.",
              "Shaft sinking telemetry verified via satellite ground radar."
            ]
          },
          comments: [
            {
              id: "c15",
              user: "Nikhil Kamath",
              role: "Koramangala Tech Worker",
              timeAgo: "2 days ago",
              likes: 48,
              dislikes: 1,
              text: "Silk Board traffic is notorious worldwide. If this tunnel actually delivers the 22-minute transit between Hebbal and Silk Board, it will add billions to Karnataka's GDP.",
              replies: []
            }
          ]
        },
        {
          id: "BLR-BRG-02",
          type: "bridge",
          typeLabel: "Elevated Corridor Flyover",
          icon: "",
          title: "Ejipura-Koramangala 2.5km Elevated Flyover & Cable-Stayed Deck",
          sanctionCode: "BBMP/BRG/2017-EJI-02",
          status: "critical",
          statusLabel: "Critical Discrepancy · 7 Years Overdue",
          budget: {
            allocated: 290,
            spent: 243,
            projectedFinal: 415,
            overrunPct: 43.1,
            cpi: 0.44,
            spi: 0.42,
            progress: 47,
            plannedProgress: 100,
            breakdown: [
              { item: "Piers, Piling & Abutments", cost: 116, pct: 40 },
              { item: "Precast Box Girders (Unfinished)", cost: 72, pct: 25 },
              { item: "Contractor Termination & Re-tendering Cost", cost: 58, pct: 20 },
              { item: "Litigation & Idle Machinery Overhead", cost: 44, pct: 15 }
            ]
          },
          contractor: {
            id: "BSCPL-INFRA",
            name: "BSCPL Infrastructure Ltd (Contract Terminated / Re-bid)",
            experienceYears: 24,
            completedGovtProjects: 31,
            onTimeMilestoneRate: "31%",
            rating: 1.8,
            leadEngineer: "V. R. K. Prasad (Former)",
            headquarters: "Hyderabad, India",
            activeProjectsAcrossIndia: 2,
            integrityScore: "28/100",
            pastProjects: [
              { name: "Koramangala Stormwater Drain Package", year: "2018", status: "Penalized for abandonment" },
              { name: "Kundalahalli Underpass Flyover", year: "2020", status: "Delayed by 2.5 years" }
            ]
          },
          overview: "A 2.5 km elevated flyover conceptualized to bypass the traffic mayhem of Ejipura, Sony World Junction, and Koramangala 100ft road. Infamous for years of abandoned concrete pillars and multiple contractor cancellations.",
          simulation: {
            image: "assets/bridge_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Proposed visual completion: Modern illuminated elevated flyway spanning over Koramangala Sony World junction with noise barriers.",
            metrics: {
              commuteCut: "Sony World signal delay cut from 35 mins to 3 mins",
              yearsDelayed: "7+ years behind original schedule",
              unaccountedAdvance: "₹42 Cr mobilization advance subject to recovery",
              citizenRTIQueries: "Over 340 filed by local resident associations"
            }
          },
          tender: {
            tenderId: "BBMP-TND-EJIPURA-2017-REBID",
            issueDate: "12 May 2017",
            bidsOpened: "04 Aug 2017",
            govSanctionCost: 204,
            finalAwardedCost: 290,
            selectionMethod: "Re-tendered twice after previous bidder abandonment",
            bidders: [
              { company: "BSCPL Infrastructure Ltd", bidAmount: 290, techScore: 68.0, status: "Selected (L1 - Terminated)", variance: "+42.1%" },
              { company: "Simplex Infrastructure", bidAmount: 315, techScore: 64.0, status: "Outbid (L2)", variance: "+54.4%" }
            ]
          },
          newsReports: [
            {
              outlet: "NDTV India",
              date: "04 Nov 2025",
              headline: "The Ghost Flyover of Bengaluru: How Ejipura Became a Monument of Municipal Lethargy",
              author: "Maya Sharma",
              excerpt: "Pillars standing without girders for 6 years have become advertising hoardings while residents navigate choking dust and cratered roads below.",
              sentiment: "negative",
              url: "#"
            },
            {
              outlet: "The Hindu Special Investigation",
              date: "12 Jan 2026",
              headline: "Karnataka Lokayukta Orders Probe into Ejipura Flyover Mobilization Advance Fraud",
              author: "K. V. Aditya Bharadwaj",
              excerpt: "Investigation revealed the contractor encashed bank guarantees for mobilization advances but failed to deploy casting yard machinery on site.",
              sentiment: "negative",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 28,
            verdict: "Extreme Discrepancy — Mobilization advances pocketed with negligible on-site physical progress. Severe audit red flag.",
            breakdown: {
              materialCostAlignment: 24,
              tenderCompetitiveness: 32,
              progressVsSpendMatch: 22,
              mediaSentimentScore: 34
            },
            keyNotes: [
              "84% of sanctioned budget spent while physical structure is barely 47% completed.",
              "Lokayukta FIR registered against contractor for fraudulent bank guarantee encashment.",
              "Highest negative citizen sentiment in the entire state of Karnataka."
            ]
          },
          comments: [
            {
              id: "c16",
              user: "Gautham Shenoy",
              role: "Ejipura Resident Association President",
              timeAgo: "1 day ago",
              likes: 145,
              dislikes: 0,
              text: "I moved to Koramangala in 2018 when they said the flyover would be done in 18 months. My child is now in middle school and only bare pillars stand there! OurCity's data proving 84% money spent is mind-boggling. We will stage a protest with these numbers!",
              replies: [
                {
                  user: "Deepa Nambiar",
                  timeAgo: "14 hours ago",
                  text: "Count me in Gautham. Let's print OurCity's 28% Evidence Match score on banners outside the BBMP office!"
                }
              ]
            }
          ]
        },
        {
          id: "BLR-PRK-03",
          type: "park",
          typeLabel: "Lake Wetland Eco-Park",
          icon: "",
          title: "Bellandur Catchment & Agara Botanical Wetland Eco-Park",
          sanctionCode: "KLCDA/BIO/2023-AGARA-02",
          status: "healthy",
          statusLabel: "Healthy · On Track",
          budget: {
            allocated: 780,
            spent: 577,
            projectedFinal: 792,
            overrunPct: 1.5,
            cpi: 0.98,
            spi: 0.99,
            progress: 81,
            plannedProgress: 82,
            breakdown: [
              { item: "Biological Wetland Filtering Beds", cost: 280, pct: 36 },
              { item: "Desilting & Stormwater Weir Gates", cost: 195, pct: 25 },
              { item: "All-Weather Walking Tracks & Tree Canopy", cost: 140, pct: 18 },
              { item: "Solar Aerators & Floating Island Bio-Matrix", cost: 109, pct: 14 },
              { item: "Visitor Interpretive Eco-Center", cost: 56, pct: 7 }
            ]
          },
          contractor: {
            id: "NAMMA-URBAN-ECO",
            name: "Namma Bengaluru Urban Forestry JV",
            experienceYears: 15,
            completedGovtProjects: 24,
            onTimeMilestoneRate: "91%",
            rating: 4.7,
            leadEngineer: "Dr. U. N. Ravikumar",
            headquarters: "Bengaluru, India",
            activeProjectsAcrossIndia: 4,
            integrityScore: "91/100",
            pastProjects: [
              { name: "Kaikondrahalli Lake Eco-Restoration", year: "2019", status: "United Nations recognized community model" },
              { name: "Jakkur Lake Bio-Filter Treatment System", year: "2021", status: "Delivered below budget" }
            ]
          },
          overview: "A 140-acre ecological buffer zone rejuvenating the Agara-Bellandur lake system using decentralized constructed wetlands to biologically treat 25 MLD of sewage runoff without chemical reagents.",
          simulation: {
            image: "assets/park_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Photorealistic rendering of restored Agara wetland lake with solar-powered water aerators, clean reflective waters, and scenic boardwalks.",
            metrics: {
              sewageTreatedNaturally: "25 Million Litres Daily (MLD)",
              dissolvedOxygenRestored: "From 0.2 mg/L to 6.8 mg/L (Healthy aquatic life)",
              migratoryBirdFlocks: "Over 68 species recorded returning",
              citizenTreeVolunteers: "4,500 citizen saplings nurtured"
            }
          },
          tender: {
            tenderId: "KLCDA-TND-AGARA-2023",
            issueDate: "20 Jan 2023",
            bidsOpened: "15 Apr 2023",
            govSanctionCost: 750,
            finalAwardedCost: 780,
            selectionMethod: "e-Procurement Quality & Price",
            bidders: [
              { company: "Namma Bengaluru Urban Forestry", bidAmount: 780, techScore: 95.0, status: "Selected (L1)", variance: "+4.0%" },
              { company: "Southern Eco Tech Pvt Ltd", bidAmount: 815, techScore: 89.0, status: "Outbid (L2)", variance: "+8.6%" }
            ]
          },
          newsReports: [
            {
              outlet: "Bangalore Mirror",
              date: "10 Feb 2026",
              headline: "Foaming Bellandur Lake Waters Replaced by Clear Horizons as Agara Wetland Park Flourishes",
              author: "Rashmi Belur",
              excerpt: "Continuous water quality monitoring by Karnataka State Pollution Control Board confirms dissolved oxygen levels have risen drastically to safe biological limits.",
              sentiment: "positive",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 87,
            verdict: "High Alignment — High correspondence between water purification chemical-free milestones and pollution control board telemetry.",
            breakdown: {
              materialCostAlignment: 89,
              tenderCompetitiveness: 88,
              progressVsSpendMatch: 86,
              mediaSentimentScore: 85
            },
            keyNotes: [
              "Sensors verified by IISc Department of Ecological Sciences.",
              "Procurement for bio-filter reeds matches local nursery baseline prices."
            ]
          },
          comments: [
            {
              id: "c17",
              user: "Shreya Hegde",
              role: "HSR Layout Resident & Botanist",
              timeAgo: "2 days ago",
              likes: 38,
              dislikes: 0,
              text: "Agara lake has become the pride of Bengaluru. Walking here in the mornings is therapeutic. The constructed wetland works like magic with zero foul smell.",
              replies: []
            }
          ]
        },
        {
          id: "BLR-ROD-04",
          type: "road",
          typeLabel: "AI Smart Mobility Expressway",
          icon: "️",
          title: "Outer Ring Road (Silk Board - KR Puram) Smart Transit & Pavement Upgrade",
          sanctionCode: "BMRCL/ROD/2023-ORR-04",
          status: "healthy",
          statusLabel: "Healthy · On Track",
          budget: {
            allocated: 3840,
            spent: 3110,
            projectedFinal: 3890,
            overrunPct: 1.3,
            cpi: 0.98,
            spi: 0.98,
            progress: 83,
            plannedProgress: 85,
            breakdown: [
              { item: "Full-Depth Perpetual Asphalt Pavement", cost: 1612, pct: 42 },
              { item: "Dedicated Bus Priority Rapid Lanes", cost: 768, pct: 20 },
              { item: "Underground Ducting for Tech Cables", cost: 576, pct: 15 },
              { item: "AI Adaptive Traffic Signals & Sensors", cost: 537, pct: 14 },
              { item: "Pedestrian Skywalks & Green Medians", cost: 347, pct: 9 }
            ]
          },
          contractor: {
            id: "NCC-VISTARA",
            name: "NCC Limited - Vistara Infra JV",
            experienceYears: 32,
            completedGovtProjects: 112,
            onTimeMilestoneRate: "85%",
            rating: 4.5,
            leadEngineer: "Er. M. Sreenivasan",
            headquarters: "Hyderabad / Bengaluru",
            activeProjectsAcrossIndia: 12,
            integrityScore: "89/100",
            pastProjects: [
              { name: "Bengaluru Airport Elevated Expressway", year: "2018", status: "Delivered on schedule" },
              { name: "Nagpur Metro Viaduct Reach 1", year: "2021", status: "Quality excellence certificate" }
            ]
          },
          overview: "A comprehensive 17 km complete-streets rebuild of Bengaluru's premier tech artery, featuring heavy-duty perpetual asphalt, fiber-optic utility conduits to prevent road cutting, and AI-timed traffic signals.",
          simulation: {
            image: "assets/road_simulation.jpg",
            beforeImage: "assets/construction_progress.jpg",
            caption: "Photorealistic rendering of smart Outer Ring Road corridor with dedicated bus lanes, intelligent variable speed signs, and lush median landscaping.",
            metrics: {
              corridorSpeedGain: "Bus transit speed improved by 45%",
              utilityTrenchProtection: "100% ducting prevents repeated road digging",
              dailyTechCommuters: "Over 650,000 IT professionals served",
              aiSignalTiming: "Smart signal coordination reduces idle wait by 28%"
            }
          },
          tender: {
            tenderId: "BMRCL-TND-ORR-ROAD-2022",
            issueDate: "15 Oct 2022",
            bidsOpened: "10 Feb 2023",
            govSanctionCost: 3700,
            finalAwardedCost: 3840,
            selectionMethod: "Two-Stage Item Rate Tender",
            bidders: [
              { company: "NCC Limited - Vistara JV", bidAmount: 3840, techScore: 93.0, status: "Selected (L1)", variance: "+3.7%" },
              { company: "JMC Projects Ltd", bidAmount: 4020, techScore: 89.5, status: "Outbid (L2)", variance: "+8.6%" },
              { company: "Shankaranarayana Construction", bidAmount: 4180, techScore: 87.0, status: "Outbid (L3)", variance: "+12.9%" }
            ]
          },
          newsReports: [
            {
              outlet: "The Hindu",
              date: "18 Dec 2025",
              headline: "ORR Dedicated Bus Lanes Halve Commute Time for IT Corridor Employees",
              author: "Christin Mathew Philip",
              excerpt: "Real-time BMTC bus telemetry records average peak-hour speeds increasing from 9 km/h to 24 km/h along the newly resurfaced priority corridor.",
              sentiment: "positive",
              url: "#"
            }
          ],
          aiAnalysis: {
            evidenceMatchPct: 89,
            verdict: "High Alignment — High fidelity between asphalt quality cores, municipal invoices, and traffic sensor improvements.",
            breakdown: {
              materialCostAlignment: 91,
              tenderCompetitiveness: 90,
              progressVsSpendMatch: 88,
              mediaSentimentScore: 87
            },
            keyNotes: [
              "Bitumen density tests match CRRI (Central Road Research Institute) specifications.",
              "Zero unauthorized budget alterations detected."
            ]
          },
          comments: [
            {
              id: "c18",
              user: "Vivek Narayanan",
              role: "Bellandur Tech Worker",
              timeAgo: "1 day ago",
              likes: 31,
              dislikes: 0,
              text: "The dedicated bus lane on ORR actually works now that they have physical bollards and police camera enforcement. Much smoother ride compared to last year.",
              replies: []
            }
          ]
        }
      ]
    }
  }
};
