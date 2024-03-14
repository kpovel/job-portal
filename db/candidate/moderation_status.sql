select status
from resume
         inner join status_type st on resume.moderation_status_id = st.id
where resume.candidate_id = :candidate_id;


update resume
set moderation_status_id = (select id from status_type where status = :moderation_status)
where candidate_id = (select id from user where user_uuid = :candidate_uuid);
