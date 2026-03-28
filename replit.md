# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a QC Community Help & Support web application built with React + Vite + Firebase.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (api-server)
- **Frontend**: React + Vite + Tailwind CSS
- **Database**: Firebase Firestore (real-time)
- **Auth**: Firebase Authentication (Email/Password + Google + Facebook)
- **Storage**: Firebase Storage (image uploads)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── community-app/      # QC Community React + Vite app (main app)
│       ├── src/
│       │   ├── lib/firebase.ts        # Firebase init
│       │   ├── contexts/AuthContext   # Auth state, login/register/logout
│       │   ├── contexts/ThemeContext  # Light/dark mode
│       │   ├── hooks/usePosts.ts      # Posts + comments (real-time)
│       │   ├── hooks/useChat.ts       # Direct messaging (real-time)
│       │   ├── hooks/useHelpRequests  # Help requests (real-time)
│       │   ├── hooks/useNotifications # Notifications (real-time)
│       │   ├── pages/                 # Home, Login, Register, Messages, GetHelp, GiveHelp, Resources, Profile
│       │   └── components/           # Navbar, HeroSection, PostCard, CommunityFeed, etc.
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
└── scripts/                # Utility scripts
```

## Firebase Collections (Firestore)

- **users**: uid, name, email, avatar, location, createdAt
- **posts**: postId, uid, authorName, authorAvatar, content, imageURL, category, likes[], commentCount, createdAt
- **comments**: commentId, postId, uid, authorName, authorAvatar, content, createdAt
- **helpRequests**: requestId, uid, authorName, authorAvatar, title, description, category, location, status, createdAt
- **chats**: chatId, participants[], lastMessage, lastMessageTime
  - subcollection **messages**: id, uid, content, timestamp
- **notifications**: id, uid, type, title, body, read, createdAt

## Firebase Rules
- Only authenticated users can read/write
- Users can edit/delete their own posts/comments
- Chats are private between participants
- Help requests editable only by owner

## App Features

1. **Authentication**: Email/Password + Google + Facebook OAuth
2. **Community Posts**: Create, like, comment, filter by category
3. **Real-Time Chat**: Direct messaging with typing indicator
4. **Help Requests**: Submit, track status (Pending/In Progress/Completed)
5. **Dashboard**: Hero, Quick Actions, Category Browser, Community Feed, Updates, Active Volunteers
6. **Notifications**: Real-time bell notifications
7. **Profile**: Edit name/location, view posts and requests
8. **Light/Dark Mode**: System preference + manual toggle

## Environment Variables

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_DATABASE_URL`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
