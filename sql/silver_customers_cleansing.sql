-- ============================================================
-- Layer:   Silver
-- Script:  silver_customers_cleansing.sql
-- Purpose: Cleanse and standardize raw Bronze customer data.
--          Applies 10+ transformations: null handling, case
--          normalization, type casting, and duplicate flagging.
-- ============================================================

INSERT INTO silver.customers
SELECT
    customer_id,

    -- Trim whitespace and normalize case
    TRIM(UPPER(first_name))                             AS first_name,
    TRIM(UPPER(last_name))                              AS last_name,

    -- Replace nulls with a default value
    ISNULL(email, 'no_email@unknown.com')               AS email,

    -- Standardize date format to DATE type
    CAST(create_date AS DATE)                           AS create_date,

    -- Flag duplicates: rank records per email, most recent first
    ROW_NUMBER() OVER (
        PARTITION BY email
        ORDER BY create_date DESC
    )                                                   AS row_rank

FROM bronze.crm_customers
WHERE customer_id IS NOT NULL;  -- exclude rows with no primary key
