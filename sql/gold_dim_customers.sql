-- ============================================================
-- Layer:   Gold
-- Script:  gold_dim_customers.sql
-- Purpose: Build the Customer dimension table for the Star
--          Schema. Assigns a surrogate key to replace the
--          natural source key, enabling stable joins even
--          when source system IDs change over time.
-- ============================================================

-- Surrogate key replaces natural key as primary key.
-- Enables clean joins even when source system IDs change.
INSERT INTO gold.dim_customers (
    customer_key,    -- surrogate key (identity / sequence)
    customer_id,     -- natural key (from source system)
    first_name,
    last_name,
    email,
    create_date
)
SELECT
    ROW_NUMBER() OVER (ORDER BY customer_id)    AS customer_key,
    customer_id,
    first_name,
    last_name,
    email,
    create_date
FROM silver.customers
WHERE row_rank = 1;  -- deduplicated: keep the most recent record per email
