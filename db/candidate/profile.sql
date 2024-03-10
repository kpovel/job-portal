select first_name,
       last_name,
       phone_number,
       email,
       linkedin_link,
       github_link,
       work_experience,
       skills,
       education,
       foreign_languages,
       interests,
       achievements,
       specialty,
       desired_salary,
       employment
from user
         inner join resume on resume.candidate_id = user.id
where user.id = :candidate_id
  and user_type_id = (select id from user_type where type = 'CANDIDATE');
