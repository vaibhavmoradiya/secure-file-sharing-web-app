# Step 1: Use the official Node.js image for building the app
FROM node:16-alpine as build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if available) into the container
COPY ./frontend/package*.json ./

# Step 4: Install the dependencies (this step will cache the node_modules layer if unchanged)
RUN npm install

# Step 5: Copy the rest of the frontend code into the container
COPY ./frontend/src ./src
COPY ./frontend/public ./public

# Step 6: Expose the port that the React app will run on (default is 3000)
EXPOSE 3000

# Step 7: Start the React app using the development server
CMD ["npm", "start"]