-- name: AddReceipt :exec
INSERT INTO receipts (
    id,
    haul_id,
    currency,
    date,
    item_count,
    store,
    summary,
    total,
    total_savings
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

-- name: AddReceiptItem :exec
INSERT INTO receipt_items (
    id,
    receipt_id,
    idx,
    brand,
    category,
    discount,
    is_food,
    name,
    price,
    quantity,
    unit
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- name: GetReciptByHaulID :one
SELECT * FROM receipts WHERE haul_id = ? LIMIT 1;

-- name: ListReciptItemsByRecieptID :many
SELECT * FROM receipt_items WHERE receipt_id = ? ORDER BY idx ASC;
