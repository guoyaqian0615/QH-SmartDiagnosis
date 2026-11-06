-- 将登录字段从 staffId 重命名为 email，兼容已有库
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'User' AND column_name = 'staffId'
  ) THEN
    ALTER TABLE "User" RENAME COLUMN "staffId" TO "email";
  END IF;
END $$;
