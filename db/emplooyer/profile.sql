select user.id,      -- ??
       user_type_id, -- ??
       first_name,
       last_name,
       phone_number,
       email,
       linkedin_link
from user
         left join employer on user.id = employer.id
where user.id = :employer_id
  and user.user_type_id = (select id from user_type where type = 'EMPLOYER');

select first_name,
       last_name,
       phone_number,
       email,
       linkedin_link
from user
         left join employer on user.id = employer.id
where user.id = :employer_id
and user.user_type_id = (select id from user_type where type = 'EMPLOYER');

select * from user where user_type_id = (select id from user_type where type = 'EMPLOYER');
