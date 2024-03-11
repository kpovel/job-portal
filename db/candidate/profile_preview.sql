select user_uuid
from resume
         inner join user on user.id = main.resume.candidate_id
where moderation_status_id = (select id as moderation_status_id from status_type where status = 'ACCEPTED');

select user_uuid,
       first_name,
       last_name,
       phone_number,
       email,
       linkedin_link,
       github_link,
       specialty,
       work_experience,
       skills,
       education,
       foreign_languages,
       interests,
       achievements,
       desired_salary,
       employment,
       status
from user
         inner join resume on user.id = resume.candidate_id
         inner join status_type on status_type.id = resume.moderation_status_id
where user_uuid = :user_uuid;
