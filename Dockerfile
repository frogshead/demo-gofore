FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json pnpm-lock.yaml* ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the rest of the source files
COPY . .

# Run tests by default
CMD ["npx", "playwright", "test"]
