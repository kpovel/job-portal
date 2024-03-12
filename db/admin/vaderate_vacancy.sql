-- is user admin
select id
from user
where id = :admin_id
  and user_type_id = (select id as user_type_id from user_type where type = 'ADMIN');

update vacancy
set moderation_status_id =
            (select id from status_type where status = :moderation_status)
where vacancy_uuid = :vacancy_uuid;
