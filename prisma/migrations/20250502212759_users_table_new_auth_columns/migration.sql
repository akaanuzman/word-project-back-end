-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_login" TIMESTAMP(6),
ADD COLUMN     "reset_token" VARCHAR(100),
ADD COLUMN     "reset_token_expiration" TIMESTAMP(6);
