# CoBuild - Community Construction Platform

CoBuild is a platform that connects project owners, volunteer workers, and suppliers to transform neighborhoods through collaborative construction projects.

## Features

- **Project Management**: Create and manage construction projects
- **Task Tracking**: Break down projects into tasks and track progress
- **Job Posts**: Create job posts and manage applications
- **Real-time Messaging**: Communication between project stakeholders
- **Interactive Map**: Find projects near you
- **Role-based Access**: Different interfaces for workers, project owners, suppliers, and admins

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher

## Installation

1. Clone the repository:
```bash
git clone https://github.com/tahacmv/cobuild_front.git
cd cobuild
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_API_URL=http://localhost:8080
```

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable components
│   ├── Admin/     # Admin-specific components
│   ├── Layout/    # Layout components
│   ├── Project/   # Project-related components
│   └── ui/        # Generic UI components
├── pages/         # Page components
│   ├── Admin/     # Admin pages
│   ├── Dashboard/ # Dashboard pages
│   ├── Messages/  # Messaging pages
│   └── Project/   # Project pages
├── services/      # API service functions
├── store/         # State management
├── types/         # TypeScript type definitions
└── main.tsx       # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand (State Management)
- Leaflet (Maps)
- Recharts (Charts)
- Lucide React (Icons)
- Sonner (Toasts)

## Authentication

The application uses JWT-based authentication. After login, the token is stored in localStorage and automatically included in API requests.

## Role-based Access

The platform supports four user roles:

- **Admin**: Platform management and moderation
- **Project Owner (Porteur de Projet)**: Create and manage projects
- **Worker (Travailleur)**: Browse and apply to projects
- **Supplier (Fournisseur)**: Provide materials and supplies

Each role has a dedicated interface and permissions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request