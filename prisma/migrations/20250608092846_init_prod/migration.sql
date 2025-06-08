-- DropForeignKey
ALTER TABLE "Pair" DROP CONSTRAINT "Pair_chatId_fkey";

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
