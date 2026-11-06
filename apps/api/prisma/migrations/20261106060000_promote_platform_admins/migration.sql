UPDATE "User"
SET "role" = 'ADMIN', "updatedAt" = CURRENT_TIMESTAMP
WHERE lower(trim("email")) IN (
  'bhaavatech@gmail.com',
  'rajeswar342@gmail.com',
  'rajeswarbhandaru@gmail.com'
)
AND "role" <> 'ADMIN';
