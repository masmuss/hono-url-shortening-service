Clone this repository
```shell
git clone https://github.com/masmuss/hono-url-shortening-service.git

cd hono-url-shortening-service
```

To install dependencies:
```sh
bun install
```

Setup postgres database
```shell
mv .env.example .env

vim .env

DATABASE_URL=<your_database_connection_string>
```

To run:
```sh
bun run dev
```

To test
```shell
bun test
```

open http://localhost:3000

[project inspiration url](https://roadmap.sh/projects/url-shortening-service)
