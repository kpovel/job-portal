-- Candidate transaction 

insert into User (user_uuid, login, password, user_type)
values (:user_uuid, :login, :password, 'CANDIDATE');

insert into Candidate (candidate_id)
select id as candidate_id
from User
where user_uuid = :user_uuid;

insert into Resume (candidate_id, resume_uuid)
values ((select id as candidate_id from User where user_uuid = :user_uuid), :resume_uuid);

select id
from User
where user_uuid = :user_uuid;

-- Employer transaction

insert into User (user_uuid, login, password, user_type) values (:user_uuid, :login, :password, 'EMPLOYER');

insert into Employer (employer_id) select id as employer_id from User where user_uuid = :user_uuid;

-- Admin transaction

insert into User (user_uuid, login, password, user_type) values (:user_uuid, :login, :password, 'ADMIN');