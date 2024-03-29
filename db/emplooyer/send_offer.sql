select id
from response
where employer_id = :employer_id
  and candidate_id = (select id from user where user_uuid = :candidate_uuid)
  and response_by_user_type_id = (select id as response_by_user_type_id from user_type where type = 'EMPLOYER');

insert into response (response_uuid, candidate_id, employer_id, vacancy_id, cover_letter, response_by_user_type_id)
values (:response_uuid,
        (select id from user where user_uuid = :candidate_uuid),
        :employer_id,
        (select id from vacancy where vacancy_uuid = :vacancy_id),
        :cover_letter,
        (select id from user_type where type = 'EMPLOYER'));
