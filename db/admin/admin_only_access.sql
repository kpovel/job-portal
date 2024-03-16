select id
from user
where id = :user_id
  and user_type_id = (select id from user_type where type = 'ADMIN');