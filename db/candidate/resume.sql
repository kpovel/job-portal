update Resume
set work_experience   = :work_experience,
    skills            = :skills,
    education         = :education,
    foreign_languages = :foreign_languages,
    interests         = :interests,
    achievements      = :achievements,
    specialty         = :specialty,
    desired_salary    = :desired_salary,
    employment        = :employment
where candidate_id = :candidate_id;
