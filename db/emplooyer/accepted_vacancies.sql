select vacancy_uuid, specialty
from vacancy
where employer_id = :employer_id
  and moderation_status_id = (select id as moderation_status_id from status_type where status = 'ACCEPTED');
