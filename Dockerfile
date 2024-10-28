FROM node:20-alpine AS appbuild
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY ./.env ./
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
COPY ./tsconfig.build.json ./tsconfig.build.json
RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json ./
COPY ./.env ./
RUN npm install
COPY --from=appbuild /usr/src/app/dist ./dist

CMD npm run start:prod