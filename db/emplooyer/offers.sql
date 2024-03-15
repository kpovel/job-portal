select id
from employer
where id = :employer_id;

select r.response_uuid,
       r.response_date,
       r.cover_letter,
       fr.response,
       status,
       user_uuid,
       u.first_name,
       u.last_name,
       type as responseBy
from response as r
         left join feedback_result fr on fr.response_id = r.id
         left join user u on u.id = r.candidate_id
         inner join user_type ut on r.response_by_user_type_id = ut.id
         left join status_type st on fr.feedback_result_status_id = st.id
where employer_id = :employer_id;
