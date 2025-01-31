# Use the official AWS Lambda Node.js 18 base image
FROM public.ecr.aws/lambda/nodejs:18

WORKDIR ${LAMBDA_TASK_ROOT}

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

# Lambda function handler
CMD ["index.handler"]
