# OurCity — AI-Powered Transparent Public Project & Budget Tracker

OurCity is an end-to-end transparency platform empowering citizens to track public infrastructure projects, inspect tender allocations, verify contractor performance histories, review independent news evidence, and interact with AI-driven budget audit match percentages.

---

## 🏛️ Platform Architecture: 4 Integrated Interfaces

### **Interface 1: Citizen Login & Interactive India Radar Map**
- **Split-Screen Layout**:
  - **Left**: Stylized interactive SVG vector map of India with real-time GPS radar telemetry.
  - **Right**: Glassmorphic authentication card supporting **Google SSO**, **Outlook SSO**, and standard Email/Password sign-in/sign-up.
- **Micro-Animations & Celebration**:
  - On login, a celebration animation verifies the citizen credentials with an animated checkmark and badge (`#CS-IND-8842`).
- **Metro City Selection & Vector Map Zoom**:
  - Select between 4 major Indian metropolises: **Delhi (NCR)**, **Mumbai**, **Kolkata**, and **Bengaluru**.
  - Selecting a city smoothly zooms the Indian map directly into that city's coordinates, highlighting local arterial metro grids and project pins while surrounding areas dim.
  - Clicking **"Get Started ➔"** navigates smoothly to Interface 2.

---

### **Interface 2: City Projects List**
- **City Portfolio Banner**:
  - Displays aggregate statistics for the selected city: Total Projects, Sanctioned Public Budget, Civic Transparency Index, and Verified Citizen Auditors.
- **4 Core Infrastructure Typologies**:
  - 🚇 **Tunnel Project** (e.g., Coastal Undersea Tunnels, Subaqueous Metro Tunnels)
  - 🌉 **Bridge / Flyover Project** (e.g., Cable-Stayed Marine Bridges, Elevated Signature Corridors)
  - 🌳 **Urban Eco-Park Project** (e.g., Wetland Flood Absorber Parks, Solar Lake Promenades)
  - 🛣️ **Smart Road Expressway** (e.g., Access-Controlled Expressways, Smart Ring Roads)
- **Filters & Project Cards**:
  - Filter by typology or health status (🟢 Healthy, 🟠 Watch, 🔴 Critical Flag).
  - Cards showcase physical progress bars, sanctioned budget, and AI Evidence Match score.
  - Clicking any card opens **Interface 3**.

---

### **Interface 3: Project Deep-Dive, Simulation, Budget & YouTube Comments**
- **Top Overview & Contractor Card**:
  - Executive project summary, sanction IDs, and key performance indicators.
  - Placed beside it: Prime Contractor scorecard with past public works, on-time delivery rate, and **"View Contractor Profile"** modal button.
- **Dynamic Scroll-Blur Effect**:
  - Scrolling down past the project overview applies an elegant glassmorphism blur (`backdrop-filter: blur(12px)`) and opacity fade, seamlessly drawing focus to the simulation preview.
- **Interactive Completion Simulation (Before vs. After Slider)**:
  - Drag or touch slider comparing active civil construction with photorealistic AI-rendered completion.
  - Displays specs: Commute time reduction, annual carbon offset, design speed, and lifespan.
- **Budget Allocation & Technical Specifications**:
  - Sanctioned budget vs Disbursed expenditure vs AI-projected final cost (EAC) and Cost Performance Index (CPI).
  - Detailed Bill of Quantities (BOQ) breakdown bars (Civil, TBM Boring, SCADA/Electrical, Safety, Contingency).
- **YouTube-Style Citizen Comment & Grievance Stream**:
  - Avatar-enabled comment box with active user attribution.
  - Interactive **👍 Upvote** and **👎 Downvote** buttons with live counters.
  - Nested replies and official municipal engineer responses.
  - **"Report Budget Irregularity / Complain"** whistleblower button.

---

### **Interface 4: Transparency, Independent Evidence & AI Budget Audit Hub**
- **Pillar 1: Tender Transparency Matrix**:
  - Full disclosure table of tender bids: competing companies, technical scores, quoted amounts (₹ Cr), variance vs government estimates, and winning L1 rationale.
- **Pillar 2: Contractor Track Record Dossier**:
  - Corporate incorporation history, lead project engineers, active national contracts, and list of completed public works with delivery milestones.
- **Pillar 3: Public Reporting & Whistleblower Docket**:
  - Citizen-filed grievances regarding ghost billing, substandard materials, or work stoppages, featuring live status tracking (Under Municipal Verification, Investigated).
- **Pillar 4: Independent Evidence & News Media Feeds**:
  - Investigative reports and audits from **NDTV**, **The Hindu**, **Times of India**, **The Indian Express**, and the **Comptroller & Auditor General (CAG)**.
- **Pillar 5: AI Budget Analysis & Evidence Match Index**:
  - Large radial **Budget Evidence Match percentage** (e.g., 92% for healthy projects, down to 28% for severe cost discrepancies).
  - Sub-metric breakdown:
    - Material Wholesale Cost Realism
    - Tender Bidding Competitiveness
    - Disbursement vs Physical Milestones
    - Media & Public Sentiment Alignment
  - Plain-language AI Auditor summary with empirical findings.

---

## 🚀 How to Run the Platform

### 1. Launch the 4-Interface Web Application
```bash
python server.py
```
Open your browser at: **[http://localhost:8000](http://localhost:8000)**

*(Alternatively, open `index.html` directly in any modern browser!)*

### 2. Optional: Run the Streamlit Analysis Dashboard
```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
streamlit run app.py
```
Opens the offline statistical Streamlit interface at **[http://localhost:8501](http://localhost:8501)**.