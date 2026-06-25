-- =============================================================
-- 007 — profiles 를 Supabase Auth(auth.users)에서 분리 (커스텀 세션 채택, PR1 후속)
--
-- 원래 profiles.id 는 auth.users(id) 를 참조(FK)하고 기본값이 없었다.
-- 멤버 인증을 Supabase Auth 대신 커스텀 세션(hk_member)으로 구현하면서
-- 앱(Prisma)이 profile 을 직접 생성하므로, auth.users FK 를 제거하고
-- 자체 uuid 기본값을 부여한다. (RLS 는 Prisma 가 postgres 롤로 우회하므로 변경 불필요.)
--
-- 안전: 제약 이름이 환경마다 다를 수 있어 동적으로 찾아 제거한다.
-- =============================================================

DO $$
DECLARE c text;
BEGIN
  SELECT con.conname INTO c
  FROM pg_constraint con
  JOIN pg_attribute att
    ON att.attrelid = con.conrelid AND att.attnum = ANY (con.conkey)
  WHERE con.conrelid = 'profiles'::regclass
    AND con.contype = 'f'
    AND att.attname = 'id';
  IF c IS NOT NULL THEN
    EXECUTE format('ALTER TABLE profiles DROP CONSTRAINT %I', c);
    RAISE NOTICE 'dropped constraint %', c;
  END IF;
END $$;

ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
