select user.id
from user
         inner join user_type on user_type.id = user.user_type_id
where user.id = :employer_id
  and user_type_id = (select id from user_type where type = 'EMPLOYER');

insert into Vacancy (vacancy_uuid,
                     employer_id,
                     specialty,
                     salary,
                     duties,
                     requirements,
                     conditions,
                     work_schedule,
                     employment,
                     moderation_status_id)
values (:vacancy_uuid,
        :employer_id,
        :specialty,
        :salary,
        :duties,
        :requirements,
        :conditions,
        :work_schedule,
        :employment,
        (select id from status_type where status = 'PENDING'));
