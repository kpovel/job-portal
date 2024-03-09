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

