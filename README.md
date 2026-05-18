# PHOTORA NFT Platform (POLYCC Creative Ecosystem)

PHOTORA is a Malaysian digital photography and NFT marketplace for the POLYCC creative ecosystem. It focuses on original photography, creator verification, digital ownership, licensing, marketplace sales and future blockchain minting.

Live target: https://photora.polyccconvocationhub.com

## Current Production Scope

- Public landing page with database-backed hero slider
- Explore marketplace with search, category browsing and featured collections
- Real-photo submission policy for DSLR and mobilegraphy
- User, admin and super admin login system
- Creator upload and listing workflow
- Photo authenticity code verification
- Shopping cart with MYR pricing
- Service fee: 6% from sales
- Listing fee: RM2 per marketplace listing
- ToyyibPay checkout integration
- Admin/super admin dashboard for users, photos, orders, sales and content
- News publishing for admin and super admin only

## Product Vision

PHOTORA aims to become:

> Malaysia Trusted Photography & NFT Creative Ecosystem

The platform combines photography, mobilegraphy, blockchain ownership, NFT minting, digital licensing, creator economy and POLYCC creative innovation.

## Roadmap

### Phase 1: MVP Platform

- Landing page
- Hero slider
- Search photos
- Category browsing
- Featured creators
- Responsive mobile UI
- Creator registration
- Viewer accounts
- Admin dashboard
- Upload photo metadata: title, description, camera, location and keywords
- Watermark and authenticity workflow

### Phase 2: Marketplace

- Buy and download photo
- Licensing request
- Download protection
- Creator royalties
- FPX / ToyyibPay / Billplz / Stripe support
- Sales dashboard and split payment reporting

### Phase 3: NFT Integration

- Polygon, Base or Ethereum support
- MetaMask and WalletConnect
- ERC-721 or ERC-1155 minting
- Royalty support
- Ownership verification
- IPFS metadata storage via Pinata or NFT.storage

### Phase 4: Crypto Economy

- ETH, MATIC, USDT and USDC support
- Creator wallet dashboard
- NFT sales history
- Smart contract royalties
- On-chain ownership

## Recommended Future Stack

The current production site runs on a Node.js backend with MySQL on cPanel. For a larger rebuild, the recommended stack is:

- Next.js 15
- React
- TailwindCSS
- Framer Motion
- Supabase or PostgreSQL
- NextAuth or Clerk
- Cloudinary or AWS S3
- Thirdweb, Ethers.js, Wagmi and RainbowKit
- Vercel, Cloudflare Pages or Railway

## Database Modules

Current database coverage includes:

- users
- photos
- orders
- news_posts
- hero_slides
- platform_settings
- nfts (roadmap-ready)
- transactions (roadmap-ready)

## Roles

- User: browse, cart, buy, upload photo, update own listing price and wallet
- Admin: approve photos, manage news, view orders and sales dashboard
- Super admin: full access to users, roles, admin tools, content and marketplace analytics

## Malaysia Compliance Note

NFT marketplace and crypto payment features may fall under Malaysian digital asset regulation. Start with showcase, creator verification, fiat checkout and licensing first. Enable crypto transactions after legal review against Securities Commission Malaysia digital asset guidelines.

