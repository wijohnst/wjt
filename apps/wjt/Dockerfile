# Use a Node.js base image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

RUN addgroup --system wjt && adduser --system --ingroup wjt wjt

# Install curl
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install net-tools
RUN apt-get update && apt-get install -y curl net-tools && rm -rf /var/lib/apt/lists/*


COPY dist/apps/wjt wjt

RUN ls -la

RUN chown -R wjt:wjt .

# Expose the port your app listens on
EXPOSE 4200

RUN npm --prefix wjt --omit=dev -f install

# Start the application
CMD ["node", "wjt"] 