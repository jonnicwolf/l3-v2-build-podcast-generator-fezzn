# Use the official AWS Lambda Node.js 18 base image
FROM public.ecr.aws/lambda/nodejs:20

WORKDIR /app

COPY ./lambda .

RUN npm install --production

# Lambda function handler
CMD ["index.handler"]