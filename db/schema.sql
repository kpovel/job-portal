create table User (
    id            int unsigned primary key auto_increment,
    user_uuid     char(36)                              not null,
    user_type     enum ('CANDIDATE','EMPLOYER','ADMIN') not null,
    login         varchar(191) unique                   not null,
    password      varchar(191)                          not null,

    last_name     varchar(191),
    first_name    varchar(191),
    age           varchar(191),
    phone_number  varchar(191),
    email         varchar(191) unique,
    linkedin_link varchar(191),
    github_link   varchar(191)
);

create table Candidate (
    candidate_id int unsigned primary key
);

create table Resume (
    id                int unsigned primary key auto_increment,
    resume_uuid       char(36)                               not null,
    candidate_id      int unsigned                           not null,

    moderation_status enum ('PENDING','ACCEPTED','REJECTED') not null default 'PENDING',
    work_experience   varchar(191),
    skills            varchar(191),
    education         varchar(191),
    foreign_languages varchar(191),
    interests         varchar(191),
    achievements      varchar(191),
    specialty         varchar(191),
    desired_salary    varchar(191),
    employment        varchar(191),
    updated_at        datetime                               not null default now() on update current_timestamp
);

create table Employer (
    employer_id     int unsigned primary key,
    company_name    varchar(191),
    company_address varchar(191)
);

create table Vacancy (
    id                int unsigned primary key auto_increment,
    vacancy_uuid      char(36)                               not null,
    employer_id       int unsigned                           not null,

    specialty         varchar(191)                           not null,
    salary            varchar(191),
    duties            varchar(191),
    requirements      text,
    conditions        text,
    workSchedule      text,
    employment        varchar(191),
    dateOfPublication datetime                               not null default current_timestamp,
    moderationStatus  enum ('PENDING','ACCEPTED','REJECTED') not null default 'PENDING'
);

create table Response (
    id            int unsigned primary key auto_increment,
    response_uuid char(36)                      not null,

    candidate_id  int unsigned                  not null,
    employer_id   int unsigned                  not null,
    vacancy_id    int unsigned                  not null,
    response_by   enum ('CANDIDATE','EMPLOYER') not null,

    cover_letter  text                          not null,
    response_date datetime                      not null default current_timestamp
);


create table FeedbackResult (
    id                   int unsigned primary key auto_increment,
    feedback_result_uuid char(36) unique              not null,
    response_id          int unsigned                 not null,

    response             text                         not null,
    responseDate         datetime                     not null default current_timestamp,
    responseResult       enum ('ACCEPTED','REJECTED') not null
);
