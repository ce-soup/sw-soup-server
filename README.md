# sw soup server

### 0. yarn 설치

- 프로젝트의 패키지 관리에 필요한 `yarn`을 설치해요.
- 프로젝트에서는 `yarn berry` 버전을 사용하고 있어요.
- `pnp` 방식으로 패키지를 관리하고 있어요.

```shell
npm i -g yarn
yarn --version
```

### 1. env 설정

- 프로젝트 실행에 필요한 환경 변수를 설정해요.

```shell
cp env/.env.template env/.env
vi env/.env
```

### 2. docker-compose 실행

- `docker-compose` 명령어를 통해 PostgreSQL과 Redis, Minio 컨테이너를 실행해요.

```shell
docker-compose up -d
```

### 3. protobuf 변환

- `.proto`를 `.ts`로 변환해요.
- `.proto`: `proto/*.proto`
- `.ts`: `src/__codegen__/rpc.ts`

```shell
yarn gen:proto
```

### 4. 프로젝트 실행

- 프로젝트 실행에 필요한 인자를 넣어서 실행해요.

```shell
APP_PORT=${APP_PORT} yarn start:dev
```
