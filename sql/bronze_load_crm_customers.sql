-- ============================================================
-- Layer:   Bronze
-- Script:  bronze_load_crm_customers.sql
-- Purpose: Full-refresh load of raw CRM customer records into
--          the Bronze layer. No transformations are applied;
--          data is stored exactly as received from the source.
-- ============================================================

CREATE OR ALTER PROCEDURE bronze.load_crm_customers
AS
BEGIN
    -- Truncate and reload (full refresh pattern)
    TRUNCATE TABLE bronze.crm_customers;

    INSERT INTO bronze.crm_customers (
        customer_id,
        first_name,
        last_name,
        email,
        create_date,
        source_system
    )
    SELECT
        id,
        fname,
        lname,
        email_addr,
        created_at,
        'CRM'
    FROM source.raw_customers;

    -- Log row count for monitoring
    PRINT 'Bronze load complete: '
          + CAST(@@ROWCOUNT AS VARCHAR) + ' rows';
END;
