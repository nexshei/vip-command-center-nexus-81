-- Add 'resolved' and 'reviewed' to the request_status enum
ALTER TYPE request_status ADD VALUE 'resolved';
ALTER TYPE request_status ADD VALUE 'reviewed';