select user.user_uuid,
       type,
       first_name,
       last_name,
       phone_number,
       email,
       linkedin_link,
       github_link,
       login
from user
join user_type ut on ut.id = user.user_type_id
where user.id = :userId;

insert into user (user_uuid, user_type_id, login, password)
values ('1', 1, 'Pavlo', 'a$$word');
