select user_uuid,
       first_name,
       last_name,
       work_experience,
       skills,
       education,
       foreign_languages,
       interests,
       achievements,
       specialty,
       desired_salary,
       employment,
       updated_at
from Resume
         inner join user on user.id = resume.candidate_id
where moderation_status_id = (select id as moderation_status_id from status_type where status = 'ACCEPTED');