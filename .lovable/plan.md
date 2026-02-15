

# Private Lending & Borrowing Dashboard
### Arcium-Inspired Frontend for Solana/Arcium Integration

---

## Design System — Arcium-Inspired Theme
- **Dark black background** with subtle dot-grid pattern matching Arcium's aesthetic
- **Purple/violet accent colors** (#7C3AED range) for primary actions, highlights, and glows
- **White typography** on dark surfaces with muted gray for secondary text
- **Subtle glow effects** on cards and interactive elements
- **Generated logo** inspired by Arcium's "A" mark, used as favicon and OG image

---

## Page 1: Landing / Connect Wallet
- Hero section with app name, tagline about private lending powered by Arcium
- "Connect Wallet" button (Phantom/Solflare UI — mock for now, designed for Solana wallet adapter integration later)
- Brief explainer cards: "Why Private Lending?" highlighting encrypted collateral, hidden health factors, confidential liquidations
- Privacy-first messaging throughout

## Page 2: Portfolio Dashboard (Home)
- **Net Worth Overview**: Total supplied, total borrowed, net APY earnings — displayed in large stat cards with purple accents
- **Health Factor Gauge**: Visual circular/bar indicator showing overall position health (color-coded green → yellow → red)
- **Privacy Shield Indicator**: Badge showing "🔒 Encrypted via Arcium" on sensitive data fields (collateral amounts, LTV ratios)
- **Recent Activity Feed**: Latest supply/borrow/repay transactions with timestamps
- **Earnings Chart**: Line/area chart showing yield earned over time (using Recharts)

## Page 3: Markets / Lending Pools
- **Table/card grid** of all available lending pools (SOL, USDC, mSOL, jitoSOL, etc.)
- Each pool shows: Asset icon, Supply APY, Borrow APY, Total Liquidity, Utilization Rate
- **Sort & filter** by APY, liquidity, asset type
- Click into a pool → opens supply/borrow modal
- **Privacy badge** on each pool indicating "Positions encrypted" via Arcium

## Page 4: Position Management
- **My Supplies tab**: List of supplied assets with amounts, APY earned, withdraw button
- **My Borrows tab**: List of borrowed assets with amounts, interest rate, repay button
- **Supply Modal**: Select asset → enter amount → preview health factor impact → confirm
- **Borrow Modal**: Select asset → enter amount → shows required collateral, LTV, health factor change → confirm
- **Withdraw/Repay Modals**: Similar flow with balance validation
- All modals show health factor impact in real-time as user adjusts amounts

## Page 5: Health & Liquidation Monitoring
- **Health Factor Dashboard**: Large visual gauge per position
- **Liquidation Threshold Alerts**: Warning banners when health factor approaches danger zone
- **Alert Settings**: Toggle notifications for health factor thresholds (e.g., alert at 1.5, 1.2, 1.0)
- **Liquidation History**: Table of past liquidation events (mock data)
- **Privacy callout**: "Your health factor is computed in encrypted state — invisible to liquidation bots"

---

## Sidebar Navigation
- Arcium-inspired logo at top
- Links: Dashboard, Markets, My Positions, Health Monitor
- Wallet connection status (connected address truncated)
- Collapsible sidebar with icon-only mini mode

## Mock Data Layer
- All data will use realistic mock/demo data (token prices, APYs, positions)
- Structured with TypeScript interfaces ready for Solana program integration
- Clear separation between mock data and UI so swapping to real contract calls is straightforward

## Logo & Branding Assets
- Generate an Arcium-inspired logo for the app using AI image generation
- Use as favicon and OG preview image

