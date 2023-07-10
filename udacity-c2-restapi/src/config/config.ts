export const config = {
  dev: {
    username: "postgres",
    password: "123456789",
    database: "udagram_dev",
    host: "udagram-dev.cffbnfsvuuva.us-east-1.rds.amazonaws.com",
    dialect: "postgres",
    aws_region: "us-east-1a",
    aws_profile: "default",
    aws_media_bucket: "udagram-ruttner-dev-kiendt",
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  jwt: {
    secret: " ",
  },
  prod: {
    username: "",
    password: "",
    database: "udagram_prod",
    host: "",
    dialect: "postgres",
  },
};
