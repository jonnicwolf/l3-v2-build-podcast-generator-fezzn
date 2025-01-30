# Use the official Node.js image as a base
FROM public.ecr.aws/lambda/nodejs:18

# Copy package.json and install dependencies
COPY package.json ${LAMBDA_TASK_ROOT}
RUN npm install --production

COPY . ${LAMBDA_TASK_ROOT}

# Lambda function handler
CMD ["index.handler"]