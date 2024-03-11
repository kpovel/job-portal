select vacancy_uuid,
       specialty,
       salary,
       duties,
       requirements,
       conditions,
       work_schedule,
       employment
from vacancy
where vacancy_uuid = :vacancy_uuid
  and employer_id = :employer_id;

update vacancy
set specialty            = :specialty,
    salary               = :salary,
    duties               = :duties,
    requirements         = :requirements,
    conditions           = :conditions,
    work_schedule        = :work_schedule,
    employment           = :employment,
    moderation_status_id = (select id from status_type where status = 'PENDING')
where vacancy_uuid = :vacancy_uuid;
