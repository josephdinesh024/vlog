-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "like" INTEGER NOT NULL DEFAULT 0,
    "unlike" INTEGER NOT NULL DEFAULT 0,
    "share" INTEGER NOT NULL DEFAULT 0,
    "user_id" INTEGER,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Command" (
    "id" TEXT NOT NULL,
    "text" TEXT,
    "feedback_id" TEXT,

    CONSTRAINT "Command_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reply" (
    "id" TEXT NOT NULL,
    "text" TEXT,
    "reply_id" TEXT,
    "command_id" TEXT,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_post_id_key" ON "Feedback"("post_id");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_feedback_id_fkey" FOREIGN KEY ("feedback_id") REFERENCES "Feedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "Reply"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_command_id_fkey" FOREIGN KEY ("command_id") REFERENCES "Command"("id") ON DELETE SET NULL ON UPDATE CASCADE;
