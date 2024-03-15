select id
from response
where candidate_id = :candidate_id
  and vacancy_id = (select id from vacancy where vacancy_uuid = :vacancy_uuid)
  and response_by_user_type_id = (select id from user_type where type = 'CANDIDATE')
limit 1;

select status
from resume
         inner join status_type st on resume.moderation_status_id = st.id
where candidate_id = :candidate_id;

insert into response (response_uuid, vacancy_id, candidate_id, employer_id, cover_letter,
                      response_by_user_type_id)
values (:response_uuid,
        (select id from vacancy where vacancy_uuid = :vacancy_uuid),
        :candidate_id,
        (select employer.id
         from employer
                  inner join user on employer.id = user.id
         where user_uuid = :employer_uuid),
        :cover_letter,
        (select id from user_type where type = 'CANDIDATE'));
