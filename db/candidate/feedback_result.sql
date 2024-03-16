insert into feedback_result (feedback_result_uuid, response_id, response, feedback_result_status_id)
values (:feedback_result_uuid, (select id from response where response_uuid = :response_uuid), :respose,
        (select id from status_type where status = :status));

