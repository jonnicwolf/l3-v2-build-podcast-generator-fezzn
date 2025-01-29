# Use the official Node.js image as a base
FROM public.ecr.aws/lambda/nodejs:18

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build

CMD ['index.handler']