-- list of vacancies
select vacancy_uuid,
       specialty,
       salary,
       duties,
       requirements,
       conditions,
       work_schedule,
       employment,
       publication_date
from vacancy
where moderation_status_id = (select id from status_type where status = 'ACCEPTED');

with accepted_moderation_id as (select id
                                from status_type
                                where status = 'ACCEPTED')
insert
into vacancy (vacancy_uuid, employer_id, specialty, moderation_status_id)
values ('61ab176f-fe1c-4282-af35-6588095cb19b', 1, 'Front-end developer', (select id from accepted_moderation_id));

-- vacancy preview

select user_uuid,
       v.vacancy_uuid,
       v.specialty,
       v.salary,
       v.duties,
       v.requirements,
       v.conditions,
       v.work_schedule,
       v.employment,
       v.publication_date,
       status,
       company_name,
       company_address,
       phone_number,
       email,
       linkedin_link
from vacancy v
         inner join employer on employer.id = v.employer_id
         inner join user on user.id = v.employer_id
         inner join status_type on v.moderation_status_id = status_type.id
where v.vacancy_uuid = :vacancy_uuid;