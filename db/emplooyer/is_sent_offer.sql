with candidate_id AS (select candidate.id
                      from candidate
                               inner join user u on u.id = candidate.id
                      where u.user_uuid = :candidate_uuid)

select count(*)
from response
where candidate_id = (select id from candidate_id)
  and employer_id = :employer_id
  and response_by_user_type_id = (select id as response_by_user_type_id from user_type where type = 'EMPLOYER');