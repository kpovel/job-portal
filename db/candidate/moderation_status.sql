select status
from resume
inner join status_type st on resume.moderation_status_id = st.id
where resume.candidate_id = :candidate_id;

select * from resume;