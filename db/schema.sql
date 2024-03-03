create table Candidate (
    candidateId varchar(191) not null,
    unique key Candidate_candidateId_key (candidateId)
);

create table Employer (
    employerId     varchar(191) not null,
    companyName    varchar(191),
    companyAddress varchar(191) default null,
    unique key Employer_employerId_key (employerId)
);

create table FeedbackResult (
    responseId       varchar(191)                 not null,
    response         mediumtext                   not null,
    responseDate     datetime                     not null default current_timestamp,
    feedbackResultId varchar(191)                 not null,
    responseResult   enum ('ACCEPTED','REJECTED') NOT NULL,
    primary key (feedbackResultId),
    unique key FeedbackResult_responseId_key (responseId)
);

create table Questionnaire (
    questionnaireId   varchar(191) primary key,
    questionnaireType enum ('RESUME','VACANCY') not null,
    candidateId       varchar(191),
    employerId        varchar(191),
    unique key Questionnaire_candidateId_key (candidateId),
    key Questionnaire_employerId_idx (employerId)
);

create table Response (
    resumeId     varchar(191) primary key,
    vacancyId    varchar(191)                  not null,
    candidateId  varchar(191)                  not null,
    employerId   varchar(191)                  not null,
    coverLetter  mediumtext                    not null,
    responseDate datetime                      not null default current_timestamp,
    responseId   varchar(191)                  not null,
    responseBy   enum ('CANDIDATE','EMPLOYER') not null,
    key Response_candidateId_idx (candidateId),
    key Response_employerId_idx (employerId),
    key Response_vacancyId_idx (vacancyId)
);

create table Resume (
    questionnaireId  varchar(191)                           not null,
    moderationStatus enum ('PENDING','ACCEPTED','REJECTED') not null default 'PENDING',
    workExperience   varchar(191),
    skills           varchar(191),
    education        varchar(191),
    foreignLanguages varchar(191),
    interests        varchar(191),
    achievements     varchar(191),
    specialty        varchar(191),
    desiredSalary    varchar(191),
    employment       varchar(191),
    updatedAt        datetime                               not null default (now()) on update current_timestamp,
    candidateId      varchar(191)                           not null,
    unique key Resume_questionnaireId_key (questionnaireId),
    unique key Resume_candidateId_key (candidateId)
);

create table User (
    id           varchar(191) primary key,
    userType     enum ('CANDIDATE','EMPLOYER','ADMIN') not null,
    lastName     varchar(191),
    firstName    varchar(191),
    middleName   varchar(191),
    age          varchar(191),
    phoneNumber  varchar(191),
    email        varchar(191),
    linkedinLink varchar(191),
    githubLink   varchar(191),
    telegramLink varchar(191),
    login        varchar(191)                          not null,
    password     varchar(191)                          not null,
    unique key User_login_key (login),
    unique key User_email_key (email)
);

create table Vacancy (
    questionnaireId   varchar(191)                           not null,
    specialty         varchar(191)                           not null,
    salary            varchar(191),
    duties            varchar(191),
    requirements      mediumtext,
    conditions        mediumtext,
    workSchedule      mediumtext,
    employment        varchar(191),
    dateOfPublication datetime                               not null default current_timestamp,
    employerId        varchar(191)                           not null,
    moderationStatus  enum ('PENDING','ACCEPTED','REJECTED') not null default 'PENDING',
    unique key Vacancy_questionnaireId_key (questionnaireId),
    key Vacancy_employerId_idx (employerId)
);

