
# 🏁 Velocity Frontline

**Velocity Frontline** is a fast-paced, social-first, car racing mini-game built on **Farcaster Frames**. Compete in daily sprints, choose your vehicle, and race against your frens in time-based duels — all within a cast.

> _"Start your engines. Share your frame. Own the track."_



---

## 🕹️ Game Overview

- Choose a car. Tap to race. Get your time.
- Share your result as a cast and **challenge others** to beat your lap time.
- Every 24 hours, a new track is generated with unique difficulty.
- Daily winners are shown on the **Frontline Leaderboard**.
- XP and streaks fuel your rise from **Rookie** to **Legend**.

---

## 🏁 Key Features

| Feature | Description |
|--------|-------------|
| 🚦 Tap-to-Race | Players race by tapping at the right moment in a reflex-based minigame. |
| 🏎 Car Selection | Choose from multiple car types with slight stat differences (speed, handling). |
| 🕒 Daily Track | Each day offers a new procedurally generated course with increasing challenge. |
| 🏆 Leaderboard | See who has the fastest time each day. |
| 🔁 Duels via Casts | Challenge others by casting your time and letting them race the same track. |
| 🔥 XP + Titles | Players earn XP based on time, rank, and daily streaks. |

---



## 🛠️ Tech Stack

| Tech | Usage |
|------|-------|
| [Next.js](https://nextjs.org/) | Frontend framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe logic |
| [Tailwind CSS](https://tailwindcss.com/) | UI styling |
| [Farcaster Frames](https://docs.farcaster.xyz/) | Frame interaction |
| [Vercel](https://vercel.com/) | Hosting + OG rendering |
| [LocalStorage / Supabase] | Store scores, XP, car choices (optional backend) |

---

## 📂 Project Structure

```
velocity-frontline/
│
├── app/                  # Next.js App Router
│   └── frame/            # frame.html and OG metadata
├── components/           # CarSelect, RaceTrack, Leaderboard, etc.
├── lib/                  # Game logic (track gen, timing calc)
├── public/               # Car assets, screenshots
├── styles/               # Tailwind and global CSS
├── utils/                # XP/streak handling, car stats
└── README.md
```

---

## 🧪 Running Locally

```bash
# Clone the repo
git clone https://github.com/qasim-rokeeb/velocity-frontline.git
cd velocity-frontline

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Run locally
npm run dev

# Visit: http://localhost:3000
```



> Can also work fully frontend-only using Farcaster FIDs and LocalStorage.

---

## 🎮 Gameplay Mechanics

### 🎯 Tap-to-Race

- Players must **tap at the right time** as their car accelerates past checkpoints.
- Timing windows shrink as you approach the finish.
- Reaction speed determines your final time (in ms).

### 🚗 Car Stats

Each car has:
- **Speed** (affects acceleration bar speed)
- **Handling** (affects how tight your timing window is)
- **Grip** (affects chance of skidding randomly)


## 🧠 Gamification

- **Streaks**: Race daily to maintain streak bonuses.
- **Levels**: Rank up from "Rookie" → "Driver" → "Pro" → "Track Demon".
- **Social Duels**: Challenge others via cast and make the leaderboard a battleground.
- **Track of the Day**: Different difficulty modifiers (e.g. “Rainy Track”, “Night Mode”).

---


## 🎨 Design Philosophy

- Pixel-perfect UI for mobile + cast view.
- Fluid animations and smooth transitions to simulate racing dynamics.
- Car assets loaded from `/public/cars/` with SVG or PNG format.

---

## 🌐 Deployment

- Deployed on [Vercel](https://vercel.com/)
- OG metadata and `frame.html` configured for Farcaster support
- Real-time updates using serverless functions or polling every 5s (if leaderboard is dynamic)

---

## 🧠 Future Improvements

- Add **car NFTs** tied to wallets or FIDs
- **Multiplayer lobbies** inside casts
- **Modded tracks** and **community-designed levels**
- Real-time “ghost” racing against friends
- Smart contract XP tracking (if moving onchain)

---

## 📜 License

MIT License. Fork, remix, race 🏁

---

## 🤝 Contributing

Pull requests welcome!
Good first issues:
- Car balancing
- Streak logic refactor
- New track generator
- Animation polish

---

## 🧵 Credits

- Game Design: [@yourhandle](https://warpcast.com/thecodinggeek)
- Inspired by early 2D racers and Twitch reflex games
- Powered by the open social stack on [Farcaster](https://farcaster.xyz/)

---



## 🙋‍♂️ Support or Feedback

Send me a message on [Warpcast](https://warpcast.com/) or [Twitter](https://twitter.com/) — I’d love to hear how fast you are 🏎️💨
```
