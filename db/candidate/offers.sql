select id
from candidate
where id = :candidate_id;

select r.response_uuid,
       r.response_date,
       cover_letter,
       v.vacancy_uuid,
       v.specialty,
       fr.response,
       st.status,
       ut.type
from response as r
         left join feedback_result fr on fr.response_id = r.id
         inner join vacancy v on v.id = r.vacancy_id
         inner join user_type ut on r.response_by_user_type_id = ut.id
         left join status_type st on fr.feedback_result_status_id = st.id
where candidate_id = :candidate_id
order by r.response_date desc;
