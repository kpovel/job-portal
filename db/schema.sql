create table user_type (
    id   integer primary key autoincrement,
    type text unique not null
);

create table status_type (
    id     integer primary key autoincrement,
    status text unique not null
);

create table user (
    id            integer primary key autoincrement,
    user_uuid     text    not null,
    user_type_id  integer not null,

    login         text    not null unique,
    password      text    not null,

    last_name     text,
    first_name    text,
    age           tinyint unique,
    phone_number  text,
    email         text unique,
    linkedin_link text,
    github_link   text,

    foreign key (user_type_id) references user_type (id)
);

create table candidate (
    id integer primary key,

    foreign key (id) references user (id)
);

create table resume (
    id                   integer primary key autoincrement,
    resume_uuid          text    not null,
    candidate_id         integer not null,

    moderation_status_id integer not null,
    work_experience      text,
    skills               text,
    education            text,
    foreign_languages    text,
    interests            text,
    achievements         text,
    specialty            text,
    desired_salary       text,
    employment           text,
    updated_at           timestamp default current_timestamp,

    foreign key (moderation_status_id) references status_type (id)
);


create table employer (
    id              integer primary key,
    company_name    text,
    company_address text,

    foreign key (id) references user (id)
);

create table vacancy (
    id                   integer primary key autoincrement,
    vacancy_uuid         text         not null,
    employer_id          int unsigned not null,

    specialty            text         not null,
    salary               text,
    duties               text,
    requirements         text,
    conditions           text,
    work_schedule        text,
    employment           text,
    publication_date     timestamp    not null default current_timestamp,
    moderation_status_id integer      not null,

    foreign key (moderation_status_id) references status_type (id)
);

-- split this column
create table response (
    id                       integer primary key autoincrement,
    response_uuid            text      not null,

    candidate_id             integer   not null,
    employer_id              integer   not null,
    vacancy_id               integer   not null,
    response_by_user_type_id integer   not null,

    cover_letter             text      not null,
    response_date            timestamp not null default current_timestamp,

    foreign key (candidate_id) references candidate (id),
    foreign key (employer_id) references employer (id),
    foreign key (vacancy_id) references vacancy (id)
);

create table feedback_result (
    id                        integer primary key autoincrement,
    feedback_result_uuid      text unique not null,
    response_id               integer     not null,

    response                  text        not null,
    response_date             timestamp   not null default current_timestamp,
    feedback_result_status_id integer     not null,

    foreign key (response_id) references response (id),
    foreign key (feedback_result_status_id) references status_type (id)
);