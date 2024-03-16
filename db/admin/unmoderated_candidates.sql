select user.user_uuid,
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
from resume
         inner join user on user.id = resume.candidate_id
where moderation_status_id != (select id from status_type where status = 'ACCEPTED');