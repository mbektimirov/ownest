FROM node:9.10.1

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
