explain select vacancy_uuid, specialty, status, salary, requirements, conditions
from vacancy
         inner join status_type on vacancy.moderation_status_id = status_type.id
where employer_id = :employer_id
order by publication_date desc, vacancy.id desc;
