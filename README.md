# OVERKILL - Battle Royale Decision Maker

A battle royale-style decision-making app where your choices fight each other in an arena with AI-powered arguments and judges!

## Features

- **Retro Pixel Art Design**: 8-bit RPG aesthetic with Pokemon-inspired battle UI
- **Real-time Arena**: Watch your choices move around and encounter each other
- **Turn-based Combat**: AI-powered arguments with judge voting
- **Multiple Judges**: Choose from funny, sarcastic, nerd, or serious judge personalities
- **WebSocket Integration**: Real-time updates from the backend
- **Smooth Animations**: Framer Motion-powered transitions and effects

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling with custom pixel art theme
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Router** - Routing
- **WebSocket** - Real-time communication

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend server running at `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

## How to Use

1. **Setup Screen**:
   - Enter a background/context for your decision
   - Add at least 2 choices with descriptions
   - Select one or more judge personalities
   - Click "START BATTLE!"

2. **Arena Screen**:
   - Watch your choices spawn and move around the arena
   - When two choices collide, they enter combat
   - View real-time HP bars and stats

3. **Battle Screen**:
   - Pokemon-style turn-based combat
   - Each turn shows arguments from both sides
   - Judges vote and deal damage
   - Battle continues until one choice is knocked out

4. **Victory Screen**:
   - See the ultimate winner
   - View final rankings
   - Check out highlight reel of best arguments
   - Start a new game

## Project Structure

```
src/
├── components/          # React components
│   ├── setup/          # Game setup screens
│   ├── arena/          # Battle arena components
│   ├── battle/         # Turn-based combat UI
│   ├── results/        # Victory and rankings
│   └── common/         # Reusable pixel art components
├── hooks/              # Custom React hooks
├── store/              # Zustand state management
├── services/           # API and WebSocket services
├── utils/              # Utility functions
└── assets/             # Fonts, sprites, sounds
```

## Backend Integration

The frontend expects the backend to provide:

### REST API
- `POST /api/game/create` - Create a new game session
- `POST /api/game/{sessionId}/start` - Start the game
- `GET /api/game/{sessionId}/state` - Get game state

### WebSocket Events
- `game:started` - Game initialization
- `agent:moved` - Agent position updates
- `encounter:started` - Battle initiated
- `battle:turn` - Turn results with arguments and votes
- `battle:damage` - HP damage
- `battle:ended` - Battle conclusion
- `agent:eliminated` - Agent knocked out
- `game:finished` - Winner declared

## Development

### Available Scripts

- `npm run dev` - Start dev server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Configure in `vite.config.ts`:
- Backend API URL (default: `http://localhost:8000`)
- WebSocket URL (default: `ws://localhost:8000`)

## Styling

Custom pixel art theme defined in `tailwind.config.js`:

### Colors
- `pixel-dark` - Dark background
- `pixel-blue` - Primary blue
- `pixel-red` - Danger/combat
- `pixel-yellow` - Highlights
- `pixel-green` - Success/HP

### Components
- Pixel borders with box shadows
- Retro text shadows
- CRT screen effect (scanlines)
- Pokemon-style dialog boxes
- Classic RPG HP bars
- 8-bit animations

## Future Enhancements

- Sound effects and music
- Custom sprites for agents
- Replay system
- Save/load games
- Mobile optimization
- More judge personalities
- Custom arena themes

## License

MIT

## Credits

Built with Claude Code for the Overkill decision-making battle royale!
