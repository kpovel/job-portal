-- Candidate transaction 
insert into user (user_uuid, login, password, user_type_id)
values (:user_uuid, :login, :password, :user_type_id);

insert into Candidate (id)
select id from User where user_uuid = :user_uuid;

insert into Resume (candidate_id, resume_uuid, moderation_status_id)
values ((select id as candidate_id from User where user_uuid = :user_uuid), :resume_uuid, :moderation_status_id);

select id
from User
where user_uuid = :user_uuid;

-- Employer transaction

insert into User (user_uuid, login, password, user_type_id)
values (:user_uuid, :login, :password, :user_type_id);

insert into Employer (id)
select id from User where user_uuid = :user_uuid;
