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
where moderation_status_id != (select id from status_type where status = 'ACCEPTED');