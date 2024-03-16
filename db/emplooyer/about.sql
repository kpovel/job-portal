select company_address, company_name
from user
         left join employer on user.id = employer.id
where user.id = :employer_id
  and user_type_id = (select id from user_type where type = 'EMPLOYER');

update Employer
set company_name    = :company_name,
    company_address = :company_address
where id = :employer_id;