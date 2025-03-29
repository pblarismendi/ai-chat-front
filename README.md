# AI Chat Frontend

A modern Vue.js application that provides an interactive chat interface with AI capabilities.

## Features

- User authentication (login/register)
- AI chat interface
- Responsive design for both desktop and mobile devices
- Support for message history

## Technologies

- Vue 3
- Vite
- TypeScript
- Tailwind CSS

## Project Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
VITE_API_BASE_URL=http://your-api-url:port/api
```

## Project Structure

- `src/components/` - Reusable Vue components
- `src/views/` - App views (Home, Chat, Login, Register, About)
- `src/services/` - API and authentication services
- `src/types/` - TypeScript type definitions
- `src/router/` - Vue Router configuration

## API Connection

The application connects to a backend API for chat functionality and user authentication. Make sure your API is running and accessible from the devices you want to use.

## Mobile Access

To access the application from mobile devices on the same network:

1. Update the `.env` file with your local IP address
2. Ensure your API is configured to accept cross-origin requests

## License

MIT

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
