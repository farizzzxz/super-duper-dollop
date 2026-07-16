FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY server.js ./
COPY owner.html ./
COPY donor.html ./
COPY overlay.html ./
COPY owner.js ./
COPY donor.js ./
COPY styles.css ./
COPY qris.svg ./
COPY donations.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
